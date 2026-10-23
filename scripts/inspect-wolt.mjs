import { readFile, writeFile } from 'node:fs/promises';
import { load } from 'cheerio';
const $=load(await readFile('.local/menu-source/wolt.html','utf8'));
const script=$('script[type="application/json"]').filter((_,el)=>$(el).text().length>100000).first();
const state=JSON.parse(script.text());
console.log('root',Object.keys(state));
const matches=[];
function visit(value,path=''){
 if(!value||typeof value!=='object')return;
 if(!Array.isArray(value)&&value.name&&('price' in value||'baseprice' in value||'image' in value))matches.push({path,keys:Object.keys(value),value});
 for(const [key,child]of Object.entries(value))visit(child,`${path}.${key}`);
}
visit(state);
console.log('matches',matches.length);console.log(JSON.stringify(matches.slice(0,3),null,2).slice(0,9000));
await writeFile('.local/menu-source/wolt-objects.json',JSON.stringify(matches,null,2));
