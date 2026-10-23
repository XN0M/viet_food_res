import 'dotenv/config';
import { db } from '../src/lib/db';
const items=[
 {id:'pho-bo',name:'Phở Bò',description:'Voňavý hovädzí vývar, ryžové rezance, jemné hovädzie mäso a čerstvé bylinky.',category:'Polievky',priceCents:850,portion:'900 ml',allergens:['Ryby','Sója'],image:'/food-bowl.svg',options:[]},
 {id:'pho-ga',name:'Phở Gà',description:'Tradičný kurací vývar s ryžovými rezancami, koriandrom a jarnou cibuľkou.',category:'Polievky',priceCents:790,portion:'900 ml',allergens:['Ryby'],image:'/food-bowl.svg',options:[]},
 {id:'bun-bo',name:'Bún Bò Nam Bộ',description:'Ryžové rezance s restovaným hovädzím, chrumkavou zeleninou a arašidmi.',category:'Hlavné jedlá',priceCents:890,portion:'450 g',allergens:['Arašidy','Ryby','Sója'],image:'/food-noodles.svg',options:[]},
 {id:'crispy-chicken',name:'Chrumkavé kura',description:'Dozlatista chrumkavé kuracie kúsky so zeleninou a prílohou podľa vášho výberu.',category:'Hlavné jedlá',priceCents:850,portion:'350 g',allergens:['Lepok','Vajcia','Sója'],image:'/food-noodles.svg',options:[{id:'side',name:'Príloha',required:true,choices:[{id:'rice',name:'Jazmínová ryža',priceCents:0},{id:'noodles',name:'Restované rezance',priceCents:100}]}]},
 {id:'summer-rolls',name:'Letné závitky',description:'Ľahké ryžové závitky s krevetami, zeleninou a domácou omáčkou.',category:'Predjedlá',priceCents:450,portion:'2 ks',allergens:['Kôrovce','Arašidy'],image:'/food-rolls.svg',options:[]},
 {id:'spring-rolls',name:'Jarné závitky',description:'Chrumkavé závitky plnené zeleninou. Malý začiatok veľkej chuti.',category:'Predjedlá',priceCents:390,portion:'2 ks',allergens:['Lepok','Sója'],image:'/food-rolls.svg',options:[]},
 {id:'tofu',name:'Tofu so zeleninou',description:'Restované tofu, sezónna zelenina a jemná sójová omáčka s jazmínovou ryžou.',category:'Hlavné jedlá',priceCents:790,portion:'400 g',allergens:['Sója','Lepok'],image:'/food-noodles.svg',options:[]},
 {id:'tea',name:'Domáci ľadový čaj',description:'Osviežujúci čaj s citrusmi. Pripravený u nás, každý deň.',category:'Nápoje',priceCents:290,portion:'400 ml',allergens:[],image:'/food-tea.svg',options:[]}
];
async function main(){
 if(process.env.APP_ENV==='live')throw new Error('Demo seed is prohibited in live mode. Use menu:import with approved data.');
 await db.settings.upsert({where:{id:1},create:{id:1,packagingMode:'NONE',contentApproved:false},update:{}});
 for(const [sort,item] of items.entries())await db.menuItem.upsert({where:{id:item.id},create:{...item,sort},update:{}});
 console.log('Demo menu created. All prices, portions and allergens are illustrative; live ordering remains gated.');
}main().finally(()=>db.$disconnect());
