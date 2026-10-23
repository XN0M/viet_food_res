import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { db } from '../src/lib/db';
async function main(){
 const expected=JSON.parse(await readFile('data/menu/dolny-stal.json','utf8'));
 const url=process.env.APP_URL??'http://localhost:3000';
 const menu=await(await fetch(`${url}/api/menu`)).json();
 if(menu.items.length!==expected.filter((x:{active:boolean})=>x.active).length)throw new Error('Public menu count mismatch');
 if(menu.items.some((x:{id:string})=>!x.id.startsWith('vf-')))throw new Error('Demo or unrelated branch item is visible');
 const records=await db.menuImage.findMany({where:{branchKey:'br_64a07613'}});
 if(records.length!==258)throw new Error('Image record count mismatch');
 let cursor=0;let verified=0;
 await Promise.all(Array.from({length:6},async()=>{
  while(cursor<records.length){const image=records[cursor++];const response=await fetch(url+image.localPath,{method:'HEAD'});if(response.status!==200||!response.headers.get('content-type')?.startsWith('image/webp'))throw new Error(`Image unreachable: ${image.localPath}`);verified++;}
 }));
 if((await db.settings.findUniqueOrThrow({where:{id:1}})).contentApproved)throw new Error('Restaurant review gate was unexpectedly enabled');
 console.log(JSON.stringify({publicMenuItems:menu.items.length,imagesHTTP200:verified,menuImageRows:records.length,contentApproved:false}));
}
main().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>db.$disconnect());
