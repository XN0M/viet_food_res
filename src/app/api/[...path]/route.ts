import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { db } from '@/lib/db';
import { assertOrigin, body, hash, HttpError, passwordHash, randomToken, rateLimit, staff, verifyPassword } from '@/lib/security';
import { actOnOrder, calculate, cancelPublic, createOrder, demo, expireOrder, liveReady, publicOrder, settings } from '@/lib/orders';
import { isOpen, pickupSlots } from '@/lib/domain';
import { orderInput, settingsInput } from '@/lib/schemas';
import { fromZonedTime } from 'date-fns-tz';
import { addDays } from 'date-fns';
export const runtime='nodejs';export const dynamic='force-dynamic';
const json=(data:unknown,status=200)=>NextResponse.json(data,{status,headers:{'Cache-Control':'no-store'}});
async function handle(req:NextRequest){
  try{
    const path=req.nextUrl.pathname.replace(/^\/api\//,'');const method=req.method;
    if(method!=='GET')assertOrigin(req);
    if(path==='health'){
      await db.$queryRaw`SELECT 1`;const worker=await db.workerHealth.findUnique({where:{id:1}});
      return json({database:true,worker:!!worker&&Date.now()-worker.lastSeen.getTime()<90000});
    }
    if(path==='menu'&&method==='GET'){
      const s=await settings();const ready=demo()||liveReady(s);
      return json({items:await db.menuItem.findMany({where:{active:true},orderBy:{sort:'asc'}}),settings:{restaurantName:s.restaurantName,address:s.address,phone:s.phone,openingHour:s.openingHour,closingHour:s.closingHour,closedDays:s.closedDays,paused:s.paused,packagingMode:s.packagingMode,packagingCents:s.packagingCents,packagingApplies:s.packagingApplies,businessInfo:s.businessInfo,termsText:s.termsText,privacyText:s.privacyText},open:isOpen(new Date(),s)&&ready,ready,demo:demo(),slots:pickupSlots(new Date(),s),serverTime:new Date()});
    }
    if(path==='quote'&&method==='POST'){
      await rateLimit(req,'quote',100);const input=orderInput.parse(await body(req));const s=await settings();return json(await calculate(input,s));
    }
    if(path==='orders'&&method==='POST'){
      await rateLimit(req,'order',30);const input=orderInput.parse(await body(req));return json(await createOrder(input),201);
    }
    const publicMatch=path.match(/^orders\/([a-f0-9]{64})(\/cancel)?$/);
    if(publicMatch){await rateLimit(req,'tracking',600);if(method==='GET'&&!publicMatch[2])return json(await publicOrder(publicMatch[1]));if(method==='POST'&&publicMatch[2]){await cancelPublic(publicMatch[1]);return json({ok:true});}}
    if(path==='auth/login'&&method==='POST'){
      await rateLimit(req,'login',10);const input=z.object({email:z.string().email(),password:z.string().max(200)}).parse(await body(req));
      const user=await db.user.findUnique({where:{email:input.email.toLowerCase()}});
      if(!demo()&&user?.email.endsWith('@vietfood.test'))throw new HttpError(401,'Testovací účet nie je povolený v ostrej prevádzke.');
      if(!user?.active||!verifyPassword(input.password,user.passwordHash))throw new HttpError(401,'Nesprávny e-mail alebo heslo.');
      const token=randomToken();await db.session.create({data:{hash:hash(token),userId:user.id,expiresAt:new Date(Date.now()+12*3600000)}});
      const res=json({id:user.id,name:user.name,role:user.role});res.cookies.set('vf_session',token,{httpOnly:true,secure:new URL(process.env.APP_URL??'http://localhost:3000').protocol==='https:',sameSite:'strict',path:'/',maxAge:43200});return res;
    }
    if(path==='auth/logout'&&method==='POST'){
      const token=req.cookies.get('vf_session')?.value;if(token)await db.session.deleteMany({where:{hash:hash(token)}});
      const res=json({ok:true});res.cookies.set('vf_session','',{httpOnly:true,path:'/',maxAge:0});return res;
    }
    if(path==='auth/me'){const u=await staff(req);return json({id:u.id,name:u.name,role:u.role});}
    if(path==='auth/password'&&method==='POST'){
      const user=await staff(req);await rateLimit(req,'password',10);
      const input=z.object({currentPassword:z.string().max(200),newPassword:z.string().min(12).max(128)}).parse(await body(req));
      if(!verifyPassword(input.currentPassword,user.passwordHash))throw new HttpError(400,'Pôvodné heslo nie je správne.');
      await db.$transaction(async tx=>{await tx.user.update({where:{id:user.id},data:{passwordHash:passwordHash(input.newPassword)}});await tx.session.deleteMany({where:{userId:user.id}})});
      const res=json({ok:true});res.cookies.set('vf_session','',{httpOnly:true,path:'/',maxAge:0});return res;
    }
    if(path.startsWith('admin/')){
      const user=await staff(req);
      if(path==='admin/orders'&&method==='GET'){
        const pending=await db.order.findMany({where:{status:'PENDING',expiresAt:{lte:new Date()}},select:{id:true}});for(const p of pending)await expireOrder(p.id);
        const date=req.nextUrl.searchParams.get('date');const state=req.nextUrl.searchParams.get('status');
        const validStates=['PENDING','CONFIRMED','PREPARING','READY','DELIVERING','COMPLETED','CANCELLED','REJECTED','EXPIRED'];
        if(state&&!validStates.includes(state))throw new HttpError(400,'Neplatný stav.');
        const dateFilter=date&&/^\d{4}-\d{2}-\d{2}$/.test(date)?{pickupAt:{gte:fromZonedTime(date+'T00:00:00','Europe/Bratislava'),lt:fromZonedTime(addDays(new Date(date+'T12:00:00Z'),1).toISOString().slice(0,10)+'T00:00:00','Europe/Bratislava')}}:{};
        const orders=await db.order.findMany({where:{...(state?{status:state}:{}),...dateFilter},orderBy:{createdAt:'desc'},take:200,select:{id:true,number:true,customerName:true,phone:true,fulfillment:true,status:true,paid:true,createdAt:true,pickupAt:true,expiresAt:true,subtotalCents:true,packagingCents:true,deliveryCents:true}});
        return json({orders,worker:await db.workerHealth.findUnique({where:{id:1}}),failedEmails:await db.outbox.count({where:{status:'FAILED'}})});
      }
      const orderMatch=path.match(/^admin\/orders\/([a-z0-9]+)$/);
      if(orderMatch){
        if(method==='GET'){
          await expireOrder(orderMatch[1]);const order=await db.order.findUniqueOrThrow({where:{id:orderMatch[1]},include:{events:{orderBy:{createdAt:'asc'}},messages:{select:{id:true,kind:true,status:true,attempts:true,lastError:true,sentAt:true}}}});
          const {tokenHash,idempotencyKey,requestHash,...safe}=order;void tokenHash;void idempotencyKey;void requestHash;return json(safe);
        }
        if(method==='POST'){
          const input=z.object({action:z.enum(['CALL','CONFIRM','REJECT','PROGRESS','PAID','CANCEL']),detail:z.string().trim().max(500).optional(),status:z.string().max(30).optional(),eta:z.string().datetime().optional(),deliveryCents:z.number().int().min(0).max(100000).optional(),feeAgreed:z.boolean().optional(),contacted:z.boolean().optional()}).parse(await body(req));
          await actOnOrder(orderMatch[1],user,input);return json({ok:true});
        }
      }
      if(path==='admin/settings'){
        await staff(req,['OWNER','MANAGER']);if(method==='GET')return json(await settings());
        if(method==='PUT'){
          const input=settingsInput.parse(await body(req));
          if(input.contentApproved&&(!input.phone||!input.businessInfo||!input.termsText||!input.privacyText||input.latitude===null||input.longitude===null||input.packagingMode==='UNCONFIRMED'))throw new HttpError(400,'Pred schválením vyplňte údaje prevádzky, polohu, balenie a právne texty.');
          await db.$transaction(async tx=>{await tx.settings.update({where:{id:1},data:input});await tx.audit.create({data:{actor:user.id,action:'SETTINGS',detail:'Prevádzkové nastavenia zmenené'}})});return json({ok:true});
        }
      }
      if(path==='admin/menu'&&method==='PUT'){
        await staff(req,['OWNER','MANAGER']);const input=z.object({id:z.string(),available:z.boolean()}).parse(await body(req));
        await db.$transaction(async tx=>{await tx.menuItem.update({where:{id:input.id,active:true},data:{available:input.available}});await tx.audit.create({data:{actor:user.id,action:'AVAILABILITY',detail:JSON.stringify(input)}})});return json({ok:true});
      }
      if(path==='admin/users'){
        await staff(req,['OWNER']);
        if(method==='GET')return json(await db.user.findMany({select:{id:true,email:true,name:true,role:true,active:true}}));
        if(method==='POST'){
          const input=z.object({email:z.string().email(),name:z.string().min(2).max(80),password:z.string().min(12).max(128),role:z.enum(['STAFF','MANAGER','OWNER'])}).parse(await body(req));
          await db.user.create({data:{email:input.email.toLowerCase(),name:input.name,role:input.role,passwordHash:passwordHash(input.password)}});return json({ok:true});
        }
        if(method==='PUT'){
          const input=z.object({id:z.string(),active:z.boolean(),role:z.enum(['STAFF','MANAGER','OWNER'])}).parse(await body(req));
          if(input.id===user.id)throw new HttpError(400,'Vlastný účet tu nemožno zmeniť.');
          await db.$transaction(async tx=>{await tx.user.update({where:{id:input.id},data:{active:input.active,role:input.role}});await tx.session.deleteMany({where:{userId:input.id}});await tx.audit.create({data:{actor:user.id,action:'USER_UPDATE',detail:input.id}})});return json({ok:true});
        }
      }
    }
    throw new HttpError(404,'Nenájdené.');
  }catch(e){
    if(e instanceof HttpError)return json({error:e.message},e.status);
    if(e instanceof ZodError)return json({error:'Skontrolujte vyplnené údaje.',fields:e.flatten()},400);
    console.error('API failure',e instanceof Error?e.name:'unknown');return json({error:'Služba je dočasne nedostupná. Skúste to znovu.'},500);
  }
}
export {handle as GET,handle as POST,handle as PUT};
