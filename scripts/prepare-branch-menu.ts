import { readFile,writeFile,mkdir } from 'node:fs/promises';
import { parseOfficialMenu,parseWoltMenu,normalizedName,BRANCH_KEY,BRANCH_ADDRESS } from './lib/menu-source';
const woltUrl='https://wolt.com/en/svk/dunajska-streda/restaurant/viet-food-dolny-stal';
async function main(){
const wolt=parseWoltMenu(await readFile('.local/menu-source/wolt.html','utf8'));
const sources=await Promise.all(['hlavne-menu','sushi-menu','napoje-menu'].map(async path=>parseOfficialMenu(await readFile(`.local/menu-source/${path}.html`,'utf8'),`https://vietfood.sk/${path}`)));
const items=sources.flatMap(x=>x.items);
for(const [index,source]of items.entries()){
 source.item.sort=index;
 const matches=wolt.filter((w:{name:string})=>normalizedName(w.name)===normalizedName(source.sourceName));
 if(matches.length===1){
  const match=matches[0];
  if(match.priceCents!==source.item.priceCents)source.review.push(`Wolt price ${match.priceCents} cents differs from website ${source.item.priceCents} cents`);
  if(!source.imageUrls.length&&match.imageUrls.length){source.imageUrls=match.imageUrls;source.review.push(`Supplementary photo matched by normalized name to Wolt item ${match.id}`);}
 }
}
await mkdir('data/menu',{recursive:true});
await writeFile('data/menu/source-manifest.json',JSON.stringify({branchKey:BRANCH_KEY,address:BRANCH_ADDRESS,capturedAt:new Date().toISOString(),sourceUrls:[...new Set(items.map(x=>x.sourceUrl)),woltUrl],items,excluded:sources.flatMap(x=>x.excluded),woltImageCatalog:wolt,notes:['Main menu HTML branch label is cached as Trnava even with the Dolný Štál cookie. Filtering and pricing use the explicit public mcnBranch/branch.js rules for br_64a07613, never the rendered Trnava price.','Daily menus are not activated: the website uses changing day-specific content. Raw daily snapshot retained locally.','Zero extra charges on side choices follow the source data-options strings; restaurant must verify before launch.','No allergen number is interpreted as an ingredient or allergen-free claim.']},null,2));
await writeFile('data/menu/dolny-stal.json',JSON.stringify(items.map(x=>x.item),null,2));
console.log(JSON.stringify({items:items.length,active:items.filter(x=>x.item.active).length,photos:items.filter(x=>x.imageUrls.length).length,missing:items.filter(x=>!x.imageUrls.length).map(x=>({id:x.sourceId,name:x.sourceName})),excluded:sources.flatMap(x=>x.excluded)},null,2));
}
main().catch(e=>{console.error(e);process.exitCode=1;});
