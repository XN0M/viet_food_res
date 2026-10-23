import 'dotenv/config';
import { readFile,writeFile,mkdir,stat } from 'node:fs/promises';
import { resolve,sep } from 'node:path';
import { z } from 'zod';
import { db } from '../src/lib/db';
const choice=z.object({id:z.string().min(1),name:z.string().min(1),priceCents:z.number().int().min(0)});
const schema=z.array(z.object({id:z.string().regex(/^[a-z0-9-]+$/),name:z.string().min(1),description:z.string(),category:z.string().min(1),priceCents:z.number().int().min(0),portion:z.string(),allergens:z.array(z.string()),image:z.string().regex(/^\/[a-zA-Z0-9/_.-]+$/),sort:z.number().int().default(0),active:z.boolean().default(true),available:z.boolean().default(true),options:z.array(z.object({id:z.string().min(1),name:z.string().min(1),required:z.boolean(),choices:z.array(choice).min(1)})).default([])}).refine(item=>item.active||!item.available,'Archived items must be unavailable')).min(1);
async function main(){
 const path=process.argv[2];if(!path)throw new Error('Usage: npm run menu:import -- menu.json');
 const items=schema.parse(JSON.parse(await readFile(path,'utf8')));
 if(new Set(items.map(i=>i.id)).size!==items.length)throw new Error('Duplicate item IDs');
 const root=resolve('public')+sep;
 for(const item of items){
  const image=resolve('public','.'+item.image);
  if(!image.startsWith(root)||(await stat(image)).isFile()===false)throw new Error(`Invalid image file: ${item.image}`);
  if(new Set(item.options.map(g=>g.id)).size!==item.options.length||item.options.some(g=>new Set(g.choices.map(c=>c.id)).size!==g.choices.length))throw new Error(`Duplicate option IDs: ${item.id}`);
 }
 await mkdir('.local/menu-backups',{recursive:true});
 const backup=`.local/menu-backups/menu-${new Date().toISOString().replace(/[:.]/g,'-')}.json`;
 await writeFile(backup,JSON.stringify(await db.menuItem.findMany(),null,2));
 await db.$transaction(async tx=>{
  await tx.settings.update({where:{id:1},data:{contentApproved:false}});
  await tx.menuItem.updateMany({data:{active:false,available:false}});
  for(const item of items)await tx.menuItem.upsert({where:{id:item.id},create:item,update:item});
  await tx.audit.create({data:{actor:'technical-import',action:'MENU_IMPORT',detail:JSON.stringify({count:items.length,active:items.filter(x=>x.active).length,source:path,backup})}});
 },{timeout:30000});
 console.log(JSON.stringify({imported:items.length,active:items.filter(x=>x.active).length,backup,contentApproved:false}));
}
main().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>db.$disconnect());
