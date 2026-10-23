import { formatInTimeZone, fromZonedTime } from 'date-fns-tz';
import { addDays } from 'date-fns';
export const ZONE = 'Europe/Bratislava';
export type Hours = {openingHour:number; closingHour:number; closedDays:number[]; paused:boolean};
export const defaults: Hours = {openingHour:8, closingHour:18, closedDays:[0], paused:false};
export const money = (cents:number) => new Intl.NumberFormat('sk-SK',{style:'currency',currency:'EUR'}).format(cents/100);
export const localTime = (date:string|Date) => formatInTimeZone(new Date(date),ZONE,'dd.MM.yyyy HH:mm');
export function isOpen(now:Date, config:Hours=defaults){
  const day=Number(formatInTimeZone(now,ZONE,'i'))%7;
  const minutes=Number(formatInTimeZone(now,ZONE,'H'))*60+Number(formatInTimeZone(now,ZONE,'m'));
  return !config.paused && !config.closedDays.includes(day) && minutes>=config.openingHour*60 && minutes<config.closingHour*60;
}
export function pickupSlots(now:Date, config:Hours=defaults):string[]{
  const today=formatInTimeZone(now,ZONE,'yyyy-MM-dd'); const result:string[]=[];
  for(let d=0;d<=2;d++){
    const date=addDays(new Date(today+'T12:00:00Z'),d).toISOString().slice(0,10);
    const noon=fromZonedTime(date+'T12:00:00',ZONE);
    if(config.closedDays.includes(Number(formatInTimeZone(noon,ZONE,'i'))%7))continue;
    for(let m=config.openingHour*60;m<=config.closingHour*60;m+=15){
      const at=fromZonedTime(`${date}T${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')}:00`,ZONE);
      if(at.getTime()>=now.getTime()+30*60000)result.push(at.toISOString());
    }
  } return result;
}
export function expiration(now:Date,pickupAt?:Date|null){return new Date(Math.min(now.getTime()+35*60000,pickupAt?.getTime()??Infinity));}
export function distanceKm(a:{lat:number;lng:number},b:{lat:number;lng:number}){
  const rad=(v:number)=>v*Math.PI/180;
  const h=Math.sin(rad(b.lat-a.lat)/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(rad(b.lng-a.lng)/2)**2;
  return 6371*2*Math.atan2(Math.sqrt(h),Math.sqrt(1-h));
}
export function deliveryFee(distance:number|null){return distance===null||distance>8?null:distance<=5?0:300;}
export type OptionGroup={id:string;name:string;required:boolean;choices:{id:string;name:string;priceCents:number}[]};
export function priceLines(menu:{id:string;name:string;priceCents:number;available:boolean;options:unknown}[],lines:{id:string;quantity:number;choices:Record<string,string>}[]){
  return lines.map(line=>{
    const item=menu.find(m=>m.id===line.id); if(!item||!item.available)throw new Error('Niektoré jedlo už nie je dostupné. Upravte košík.');
    const groups=item.options as OptionGroup[]; let unit=item.priceCents;
    const selected:{name:string;priceCents:number}[]=[];
    for(const key of Object.keys(line.choices))if(!groups.some(g=>g.id===key))throw new Error('Neplatná príloha.');
    for(const group of groups){
      const id=line.choices[group.id]; const choice=group.choices.find(c=>c.id===id);
      if((group.required&&!choice)||(id&&!choice))throw new Error('Vyberte povinnú prílohu.');
      if(choice){unit+=choice.priceCents;selected.push({name:choice.name,priceCents:choice.priceCents});}
    }
    return {id:item.id,name:item.name,quantity:line.quantity,unitCents:unit,choices:selected,totalCents:unit*line.quantity};
  });
}
export function packagingFee(mode:string,cents:number,applies:string,fulfillment:string,quantity:number){
  if(mode==='UNCONFIRMED')return null;
  if(applies!=='BOTH'&&applies!==fulfillment)return 0;
  return mode==='PER_ITEM'?cents*quantity:mode==='PER_ORDER'?cents:0;
}
export const statusLabels:Record<string,string>={PENDING:'Čaká na potvrdenie',CONFIRMED:'Potvrdená',PREPARING:'Pripravujeme',READY:'Pripravená na vyzdvihnutie',DELIVERING:'Na ceste',COMPLETED:'Dokončená',CANCELLED:'Zrušená',REJECTED:'Odmietnutá',EXPIRED:'Platnosť vypršala'};
export function nextStatus(current:string,next:string,fulfillment:string){
  const transitions:Record<string,string[]>={CONFIRMED:['PREPARING'],PREPARING:[fulfillment==='PICKUP'?'READY':'DELIVERING'],READY:['COMPLETED'],DELIVERING:['COMPLETED']};
  return transitions[current]?.includes(next)??false;
}
