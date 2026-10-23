import type { Hours, OptionGroup } from './domain';

export type MenuItem = {id:string; name:string; description:string; category:string; portion:string; allergens:string[]; priceCents:number; image:string; available:boolean; options:OptionGroup[]; sort?:number};
export type CartLine = {id:string; quantity:number; choices:Record<string,string>};
export type MenuData = {items:MenuItem[]; settings:Hours & {restaurantName:string; address:string; phone:string; packagingMode:string; packagingCents:number; packagingApplies:string; businessInfo:string; termsText:string; privacyText:string}; open:boolean; ready:boolean; demo:boolean; slots:string[]; serverTime:string};
export const groups = [
 {id:'predjedla', name:'Predjedlá & polievky', categories:['PREDJEDLÁ','PREDJEDLO POLIEVKA']},
 {id:'pho-rezance', name:'Phở & rezance', categories:['PHỞ','Bún trộn | s Varerými ryžovými rezancami','Pad Thai','UDON']},
 {id:'hlavne', name:'Hlavné jedlá', categories:['KARI','RESTOVANÉ','CHRUMKAVÉ','RIZOTO','AZIJSKÉ ŠPECIALITY NA HORÚCEJ PANVICI']},
 {id:'bento-bowls', name:'Bento & bowls', categories:['BENTO MENU','POKE BOWL','UDON POKE BOWL']},
 {id:'sushi', name:'Sushi', categories:['MAKI SUSHI 8ks','TEMPURA SUSHI 8ks','SPECIAL ROLL 8ks','NIGIRI SUSHI 4ks','SASHIMI 4ks','SETY SUSHI','MIX SET MENU']},
 {id:'dezerty', name:'Dezerty', categories:['DEZERTY']},
 {id:'napoje', name:'Nápoje', categories:['DOMÁCE LIMONÁDY','NEALKOHOLICKÉ NÁPOJ','ČAPOVANÉ NÁPOJ','KÁVA','Čaj']},
];
export const featuredIds = ['vf-84','vf-4003','vf-105','vf-85','vf-245','vf-109'];
// Only presentation photography changes; all sale information comes from the API.
export const selectedPhotos:Record<string,string> = {
 'vf-4003':'/menu/dolny-stal/d3a99c0a9ecbaa6d44890ed7.webp',
 'vf-245':'/menu/dolny-stal/f1c3dc791abd1103c6a38354.webp',
};
export const realPhoto = (item:MenuItem) => {
 const image=selectedPhotos[item.id]??item.image;
 return image?.startsWith('/menu/dolny-stal/') ? image : null;
};
export const normalize = (text:string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[đĐ]/g,'d').toLowerCase().replace(/\s+/g,' ').trim();
export function groupFor(category:string){return groups.find(g=>g.categories.includes(category))?.id??'hlavne';}
export function selectMenu(items:MenuItem[],group:string,category:string,query:string){
 const words=normalize(query).split(' ').filter(Boolean);
 return items.filter(item=>words.length ? words.every(word=>normalize(`${item.name} ${item.description} ${item.category}`).includes(word)) : groupFor(item.category)===group&&(!category||item.category===category));
}
export function unitPrice(item:MenuItem,choices:Record<string,string>){return item.priceCents+item.options.reduce((sum,g)=>sum+(g.choices.find(c=>c.id===choices[g.id])?.priceCents??0),0);}
export function readCart(value:string|null):CartLine[]{
 try{const data:unknown=JSON.parse(value??'[]');if(!Array.isArray(data))return [];
 return data.filter((line):line is CartLine=>!!line&&typeof line.id==='string'&&Number.isInteger(line.quantity)&&line.quantity>0&&line.quantity<=30&&line.choices&&typeof line.choices==='object'&&!Array.isArray(line.choices)&&Object.values(line.choices).every(v=>typeof v==='string'));
 }catch{return [];}
}
export function openingText(settings:MenuData['settings']){
 const days=['Ne','Po','Ut','St','Št','Pi','So'];
 const open=[1,2,3,4,5,6,0].filter(day=>!settings.closedDays.includes(day));
 const label=open.join(',')==='1,2,3,4,5,6'?'Po–So':open.map(d=>days[d]).join(', ');
 return open.length?`${label} · ${String(settings.openingHour).padStart(2,'0')}:00–${String(settings.closingHour).padStart(2,'0')}:00`:'Momentálne zatvorené';
}
