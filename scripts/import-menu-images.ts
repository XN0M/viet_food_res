import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { db } from '../src/lib/db';
import type { SourceItem } from './lib/menu-source';
async function main(){
 const manifest=JSON.parse(await readFile('data/menu/source-manifest.json','utf8'));
 const catalog=JSON.parse(await readFile('data/menu/image-assets.json','utf8'));
 if(manifest.branchKey!=='br_64a07613'||catalog.branchKey!==manifest.branchKey)throw new Error('Branch mismatch');
 const assets=catalog.assets as {sourceUrl:string;localPath:string;sha256:string;width:number;height:number;bytes:number;error?:string}[];
 if(assets.some(a=>a.error||!a.localPath.startsWith('/menu/dolny-stal/')||!/^\/[a-z0-9/.-]+$/.test(a.localPath)))throw new Error('Incomplete or invalid image catalog');
 for(const asset of assets){const bytes=await readFile(`public${asset.localPath}`);if(createHash('sha256').update(bytes).digest('hex')!==asset.sha256)throw new Error(`Image checksum mismatch: ${asset.localPath}`);}
 await db.$transaction(async tx=>{
  for(const asset of assets){
   const matches=(manifest.items as SourceItem[]).filter(x=>x.imageUrls.includes(asset.sourceUrl));
   const wolts=manifest.woltImageCatalog.filter((x:{imageUrls:string[]})=>x.imageUrls.includes(asset.sourceUrl));
   const data={branchKey:manifest.branchKey,sourceUrl:asset.sourceUrl,localPath:asset.localPath,sha256:asset.sha256,width:asset.width,height:asset.height,bytes:asset.bytes,menuItemIds:matches.map(x=>x.item.id),sourceItems:[...matches.map(x=>({provider:'vietfood',name:x.sourceName,productId:x.sourceId,pageUrl:x.sourceUrl})),...wolts.map((x:{id:string;name:string;category:string})=>({provider:'wolt',name:x.name,productId:x.id,category:x.category,pageUrl:manifest.sourceUrls.find((u:string)=>u.includes('wolt.com'))}))],reviewPending:true};
   await tx.menuImage.upsert({where:{sourceUrl:asset.sourceUrl},create:{id:createHash('sha256').update(asset.sourceUrl).digest('hex'),...data},update:data});
  }
  await tx.audit.create({data:{actor:'technical-import',action:'MENU_IMAGES_IMPORT',detail:JSON.stringify({branchKey:manifest.branchKey,count:assets.length})}});
 },{timeout:30000});
 console.log(JSON.stringify({imageRecords:await db.menuImage.count({where:{branchKey:manifest.branchKey}}),menuItems:await db.menuItem.count({where:{active:true}}),contentApproved:(await db.settings.findUniqueOrThrow({where:{id:1}})).contentApproved}));
}
main().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>db.$disconnect());
