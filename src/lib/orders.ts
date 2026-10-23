import { db } from './db';
import { Prisma, type Order, type Settings } from '@prisma/client';
import { deliveryFee, distanceKm, expiration, isOpen, nextStatus, packagingFee, pickupSlots, priceLines } from './domain';
import { geocode } from './geocoding';
import { hash, HttpError, orderToken, signQuote } from './security';
import { orderInput } from './schemas';
import type { z } from 'zod';
type Tx=Prisma.TransactionClient;
export const demo=()=>process.env.APP_ENV!=='live';
export async function settings(){return db.settings.findUniqueOrThrow({where:{id:1}});}
export function liveReady(s:Settings){return s.contentApproved&&s.packagingMode!=='UNCONFIRMED'&&s.latitude!==null&&s.longitude!==null&&!!s.phone&&!!s.businessInfo&&!!s.termsText&&!!s.privacyText&&!s.orderEmail.endsWith('.test')&&!s.managerEmail.endsWith('.test');}
export async function enqueue(tx:Tx,orderId:string,kind:string){
  await tx.outbox.upsert({where:{key:`${orderId}:${kind}`},create:{orderId,kind,key:`${orderId}:${kind}`},update:{}});
}
export async function event(tx:Tx,orderId:string,action:string,actor:string,detail=''){
  await tx.orderEvent.create({data:{orderId,action,actor,detail}});
}
export async function lockOrder(tx:Tx,id:string){await tx.$queryRaw`SELECT "id" FROM "Order" WHERE "id"=${id} FOR UPDATE`;return tx.order.findUniqueOrThrow({where:{id}});}
export async function expireLocked(tx:Tx,order:Order,now=new Date()){
  if(order.status==='PENDING'&&order.expiresAt<=now){
    const updated=await tx.order.update({where:{id:order.id},data:{status:'EXPIRED',version:{increment:1}}});
    await event(tx,order.id,'EXPIRED','system');await enqueue(tx,order.id,'EXPIRED');return updated;
  }return order;
}
export async function expireOrder(id:string,now=new Date()){return db.$transaction(async tx=>expireLocked(tx,await lockOrder(tx,id),now));}
export async function calculate(input:z.infer<typeof orderInput>,s:Settings){
  const menu=await db.menuItem.findMany({where:{active:true,id:{in:input.lines.map(l=>l.id)}}});
  let items;try{items=priceLines(menu,input.lines);}catch(e){throw new HttpError(409,(e as Error).message);}
  const subtotalCents=items.reduce((sum,l)=>sum+l.totalCents,0);
  const packaging=packagingFee(s.packagingMode,s.packagingCents,s.packagingApplies,input.fulfillment,items.reduce((sum,l)=>sum+l.quantity,0));
  let distance:number|null=null;let deliveryCents:number|null=input.fulfillment==='PICKUP'?0:null;
  let quoteReason:string|null=null;
  if(input.fulfillment==='DELIVERY'){
    const location=input.address?await geocode(input.address):null;
    if(location&&s.latitude!==null&&s.longitude!==null){distance=distanceKm({lat:s.latitude,lng:s.longitude},location);deliveryCents=deliveryFee(distance);}
    if(deliveryCents===null)quoteReason=distance!==null?'OUTSIDE_8KM':'ADDRESS_REVIEW';
  }
  const result={items,subtotalCents,packagingCents:packaging,deliveryCents,distanceKm:distance,quoteReason};
  return {...result,quoteSignature:signQuote({items,subtotalCents,packagingCents:packaging,deliveryCents,quoteReason,settingsVersion:s.updatedAt.toISOString()})};
}
export async function createOrder(input:z.infer<typeof orderInput>){
  const requestHash=hash(JSON.stringify(input));const token=orderToken(input.idempotencyKey);
  const existing=await db.order.findUnique({where:{idempotencyKey:input.idempotencyKey}});
  if(existing){if(existing.requestHash!==requestHash)throw new HttpError(409,'Tento pokus už bol použitý pre inú objednávku.');return {token,number:existing.number};}
  const initial=await settings();const quote=await calculate(input,initial);
  if(!input.quoteSignature||input.quoteSignature!==quote.quoteSignature)throw new HttpError(409,'Cena alebo podmienky sa zmenili. Skontrolujte cenu znovu.');
  if(quote.packagingCents===null)throw new HttpError(503,'Objednávanie zatiaľ nie je spustené. Kontaktujte reštauráciu.');
  try{return await db.$transaction(async tx=>{
    // Serialize against availability and settings changes; prices are checked again in this transaction.
    await tx.$queryRaw`SELECT "id" FROM "Settings" WHERE "id"=1 FOR SHARE`;
    const s=await tx.settings.findUniqueOrThrow({where:{id:1}});const now=new Date();
    if(s.updatedAt.getTime()!==initial.updatedAt.getTime())throw new HttpError(409,'Podmienky sa zmenili. Skontrolujte objednávku znovu.');
    if(!demo()&&!liveReady(s))throw new HttpError(503,'Objednávanie ešte nie je spustené.');
    if(!isOpen(now,s))throw new HttpError(409,'Momentálne neprijímame objednávky. Skúste počas otváracích hodín.');
    if(input.fulfillment==='PICKUP'&&!pickupSlots(now,s).includes(input.pickupAt!))throw new HttpError(409,'Čas vyzdvihnutia už nie je dostupný. Vyberte nový čas.');
    await tx.$queryRaw`SELECT "id" FROM "MenuItem" WHERE "id" IN (${Prisma.join(input.lines.map(l=>l.id))}) FOR SHARE`;
    const menu=await tx.menuItem.findMany({where:{active:true,id:{in:input.lines.map(l=>l.id)}}});
    let checked;try{checked=priceLines(menu,input.lines);}catch(e){throw new HttpError(409,(e as Error).message);}
    if(JSON.stringify(checked)!==JSON.stringify(quote.items))throw new HttpError(409,'Menu sa zmenilo. Skontrolujte ceny.');
    const pickupAt=input.fulfillment==='PICKUP'?new Date(input.pickupAt!):null;
    const order=await tx.order.create({data:{tokenHash:hash(token),idempotencyKey:input.idempotencyKey,requestHash,
      customerName:input.customerName,phone:input.phone.replace(/[ ()-]/g,''),address:input.fulfillment==='DELIVERY'?input.address:undefined,
      fulfillment:input.fulfillment,paymentMethod:input.paymentMethod,pickupAt,note:input.note,
      subtotalCents:quote.subtotalCents,packagingCents:quote.packagingCents!,deliveryCents:quote.deliveryCents,distanceKm:quote.distanceKm,quoteReason:quote.quoteReason,
      items:quote.items,createdAt:now,expiresAt:expiration(now,pickupAt)}});
    await event(tx,order.id,'CREATED','customer','Podmienky prijaté; čaká na telefonické potvrdenie.');await enqueue(tx,order.id,'NEW');
    return {token,number:order.number};
  });}catch(e){
    if(e instanceof Prisma.PrismaClientKnownRequestError&&e.code==='P2002'){
      const prior=await db.order.findUnique({where:{idempotencyKey:input.idempotencyKey}});
      if(prior?.requestHash===requestHash)return {token,number:prior.number};
      throw new HttpError(409,'Opakovaná požiadavka sa nezhoduje.');
    }throw e;
  }
}
export async function publicOrder(token:string){
  if(!/^[a-f0-9]{64}$/.test(token))throw new HttpError(404,'Objednávka sa nenašla.');
  const order=await db.order.findUnique({where:{tokenHash:hash(token)}});if(!order)throw new HttpError(404,'Objednávka sa nenašla.');
  const fresh=await expireOrder(order.id);
  return {number:fresh.number,status:fresh.status,fulfillment:fresh.fulfillment,paymentMethod:fresh.paymentMethod,paid:fresh.paid,pickupAt:fresh.pickupAt,eta:fresh.eta,items:fresh.items,subtotalCents:fresh.subtotalCents,packagingCents:fresh.packagingCents,deliveryCents:fresh.deliveryCents,createdAt:fresh.createdAt,expiresAt:fresh.expiresAt};
}
export async function cancelPublic(token:string){
  const found=await db.order.findUnique({where:{tokenHash:hash(token)}});if(!found)throw new HttpError(404,'Objednávka sa nenašla.');
  const result=await db.$transaction(async tx=>{
    const order=await expireLocked(tx,await lockOrder(tx,found.id));
    if(order.status!=='PENDING')return false;
    await tx.order.update({where:{id:order.id},data:{status:'CANCELLED',version:{increment:1}}});
    await event(tx,order.id,'CANCELLED','customer');await enqueue(tx,order.id,'CANCELLED');return true;
  });if(!result)throw new HttpError(409,'Objednávku už nie je možné zrušiť online.');
}
export async function actOnOrder(id:string,actor:{id:string;role:string},data:{action:string;detail?:string;status?:string;eta?:string;deliveryCents?:number;feeAgreed?:boolean;contacted?:boolean}){
  const result=await db.$transaction(async tx=>{
    const order=await expireLocked(tx,await lockOrder(tx,id));let update:Prisma.OrderUpdateInput={version:{increment:1}};
    const final=['CANCELLED','REJECTED','EXPIRED','COMPLETED'].includes(order.status);
    if(data.action==='CALL'){
      if(final)return 'Objednávka už bola ukončená.';
      if(!data.detail)return 'Zadajte výsledok hovoru.';
    }else if(data.action==='CONFIRM'){
      if(order.status!=='PENDING')return 'Objednávka už nečaká na potvrdenie.';
      if(!data.contacted)return 'Najprv potvrďte telefonický kontakt so zákazníkom.';
      if(order.deliveryCents===null){
        if(data.deliveryCents===undefined||!data.feeAgreed)return 'Zadajte dopravu a potvrďte súhlas zákazníka s celkovou sumou.';
        update.deliveryCents=data.deliveryCents;update.feeAgreed=true;
      }
      if(order.fulfillment==='DELIVERY'&&!data.eta)return 'Zadajte dohodnutý čas doručenia.';
      if(data.eta&&new Date(data.eta)<=new Date())return 'Očakávaný čas musí byť v budúcnosti.';
      update.status='CONFIRMED';update.eta=data.eta?new Date(data.eta):order.pickupAt;
    }else if(data.action==='REJECT'){
      if(order.status!=='PENDING'||!data.detail)return 'Odmietnuť možno iba čakajúcu objednávku s dôvodom.';update.status='REJECTED';
    }else if(data.action==='PROGRESS'){
      if(!data.status||!nextStatus(order.status,data.status,order.fulfillment))return 'Neplatná zmena stavu.';update.status=data.status;
    }else if(data.action==='PAID'){
      if(['PENDING','CANCELLED','REJECTED','EXPIRED'].includes(order.status))return 'Platbu nemožno označiť v tomto stave.';update.paid=true;
    }else if(data.action==='CANCEL'){
      if(!['MANAGER','OWNER'].includes(actor.role))return 'Zrušenie vykonáva vedúci.';
      if(final||!data.detail||!data.contacted)return 'Zadajte dôvod a potvrďte kontakt so zákazníkom.';update.status='CANCELLED';
    }else return 'Neznáma akcia.';
    await tx.order.update({where:{id},data:update});await event(tx,id,data.action,actor.id,data.detail??data.status??'');
    if(data.action==='CANCEL')await enqueue(tx,id,'CANCELLED');return null;
  });if(result)throw new HttpError(409,result);
}
