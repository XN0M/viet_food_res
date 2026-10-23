import { readFile,writeFile } from 'node:fs/promises';
const menu=JSON.parse(await readFile('data/menu/dolny-stal.json','utf8'));
const directions=[
 {id:'vf-84',name:'Phở Bò',group:'pho',label:'VIETNAMSKÁ KUCHYŇA',caption:'Polievka s hovädzím mäsom a ryžovými rezancami.'},
 {id:'vf-4003',name:'Mori Set',image:'/menu/dolny-stal/d3a99c0a9ecbaa6d44890ed7.webp',group:'sushi',label:'SUSHI COLLECTION',caption:'Výber sushi z našej ponuky.'},
 {id:'vf-105',name:'Osaka Bento',portion:'500 g',group:'bento',label:'BENTO MENU',caption:'Bento pre chvíľu, keď chcete ochutnať viac.'},
 {id:'vf-85',name:'Phở Gà',group:'pho',label:'VIETNAMSKÁ KUCHYŇA',caption:'Polievka s kuracím mäsom a ryžovými rezancami.'},
 {id:'vf-245',name:'Vegan Set Maki',image:'/menu/dolny-stal/f1c3dc791abd1103c6a38354.webp',group:'sushi',label:'SUSHI COLLECTION',caption:'Maki set z ponuky VietFood.'},
 {id:'vf-109',name:'Special Bento',portion:'500 g',group:'bento',label:'BENTO MENU',caption:'Jedlo, ktoré spája viac chutí na jednom mieste.'}
];
const items=directions.map(direction=>{const item=menu.find(item=>item.id===direction.id);if(!item)throw new Error(`Missing menu item ${direction.id}`);return {...item,...direction};});
await writeFile('public/design-preview/menu.js','window.previewMenu = '+JSON.stringify(items).replaceAll('<','\\u003c')+';\n');
console.log('Prepared 6 real menu items for the design preview.');
