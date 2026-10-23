import nodemailer from 'nodemailer';
import { db } from './db';
import { enqueue, expireLocked, lockOrder, settings } from './orders';
import { localTime, money } from './domain';
export async function schedule(now=new Date()){
  const pending=await db.order.findMany({where:{status:'PENDING'},select:{id:true}});
  for(const {id} of pending)await db.$transaction(async tx=>{
    const order=await expireLocked(tx,await lockOrder(tx,id),now);if(order.status!=='PENDING')return;
    const age=now.getTime()-order.createdAt.getTime();
    if(age>=30*60000)await enqueue(tx,id,'REMINDER30');
    else if(age>=5*60000)await enqueue(tx,id,'REMINDER5');
  });
  await db.workerHealth.upsert({where:{id:1},create:{id:1,lastSeen:now},update:{lastSeen:now}});
}
export async function dispatch(){
  const now=new Date();
  const candidates=await db.outbox.findMany({where:{OR:[{status:'PENDING',nextAttemptAt:{lte:now}},{status:'SENDING',lockedUntil:{lt:now}}]},take:20,orderBy:{createdAt:'asc'}});
  const config=await settings();
  const transporter=nodemailer.createTransport({host:process.env.SMTP_HOST??'127.0.0.1',port:Number(process.env.SMTP_PORT??1028),secure:process.env.SMTP_SECURE==='true',auth:process.env.SMTP_USER?{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}:undefined,connectionTimeout:10000,socketTimeout:20000});
  for(const candidate of candidates){
    const claim=await db.outbox.updateMany({where:{id:candidate.id,OR:[{status:'PENDING',nextAttemptAt:{lte:now}},{status:'SENDING',lockedUntil:{lt:now}}]},data:{status:'SENDING',lockedUntil:new Date(Date.now()+60000),attempts:{increment:1}}});
    if(!claim.count)continue;
    const order=await db.order.findUniqueOrThrow({where:{id:candidate.orderId}});
    const stale=(candidate.kind.startsWith('REMINDER')&&(order.status!=='PENDING'||order.expiresAt<=new Date()))||(candidate.kind==='REMINDER5'&&Date.now()-order.createdAt.getTime()>=30*60000)||(candidate.kind==='NEW'&&order.status!=='PENDING');
    if(stale){await db.outbox.update({where:{id:candidate.id},data:{status:'SKIPPED',lockedUntil:null}});continue;}
    try{
      const labels:Record<string,string>={NEW:'Nová objednávka',REMINDER5:'Objednávka čaká 5 minút',REMINDER30:'Posledné upozornenie — 30 minút',EXPIRED:'Platnosť objednávky vypršala',CANCELLED:'Objednávka bola zrušená'};
      const items=order.items as {name:string;quantity:number;totalCents:number;choices:{name:string}[]}[];
      const address=order.address as Record<string,string>|null;
      const total=order.subtotalCents+order.packagingCents+(order.deliveryCents??0);
      const text=[`${labels[candidate.kind]} #${order.number}`,`Zákazník: ${order.customerName}`,`Telefón: ${order.phone}`,`Typ: ${order.fulfillment==='PICKUP'?'Osobný odber':'Doručenie'}`,order.pickupAt?`Vyzdvihnutie: ${localTime(order.pickupAt)}`:'Čas doručenia: dohodnúť telefonicky',address?`Adresa: ${address.street} ${address.house}, ${address.postal} ${address.city}`:'',...items.map(i=>`${i.quantity}× ${i.name} ${i.choices.map(c=>c.name).join(', ')} — ${money(i.totalCents)}`),`Balenie: ${money(order.packagingCents)}`,`Doprava: ${order.deliveryCents===null?'DOHODNÚŤ TELEFONICKY':money(order.deliveryCents)}`,`${order.deliveryCents===null?'Medzisúčet bez dopravy':'Celkom'}: ${money(total)}`,`Poznámka: ${order.note}`,`Správa objednávok: ${process.env.APP_URL}/admin`, 'Potvrdenie vykonajte v administrácii až po telefonáte.'].filter(Boolean).join('\n');
      await transporter.sendMail({from:process.env.SMTP_FROM,to:candidate.kind==='NEW'?config.orderEmail:config.managerEmail,subject:`${process.env.APP_ENV==='live'?'':'[TEST] '}${labels[candidate.kind]} #${order.number}`,text,messageId:`<${candidate.id}@vietfood-notifications>`});
      await db.outbox.update({where:{id:candidate.id},data:{status:'SENT',sentAt:new Date(),lockedUntil:null,lastError:null}});
    }catch{
      // Do not put SMTP credentials, message content or customer details in logs.
      const attempts=candidate.attempts+1;
      await db.outbox.update({where:{id:candidate.id},data:{status:attempts>=5?'FAILED':'PENDING',lockedUntil:null,lastError:'SMTP delivery failed',nextAttemptAt:new Date(Date.now()+Math.min(3600,30*2**attempts)*1000)}});
    }
  }
}
