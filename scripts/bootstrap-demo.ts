import 'dotenv/config';
import {execFileSync} from 'node:child_process';
import {db} from '../src/lib/db';

async function main(){
 if(process.env.APP_ENV!=='demo')throw new Error('Demo bootstrap requires APP_ENV=demo.');
 const npm=process.platform==='win32'?'npm.cmd':'npm';
 const run=(...args:string[])=>execFileSync(npm,['run',...args],{stdio:'inherit',shell:process.platform==='win32'});
 const itemCount=await db.menuItem.count();
 const newInstall=itemCount===0;
 if(itemCount===0){
  run('menu:import','--','data/menu/dolny-stal.json');
  console.log('Dolný Štál demo menu imported.');
 }else if(itemCount<170){throw new Error(`Incomplete menu (${itemCount} items); inspect before continuing.`)}
 if(await db.menuImage.count()===0){run('menu:images:import')}
 const settings=await db.settings.findUniqueOrThrow({where:{id:1}});
 if(newInstall&&settings.packagingMode==='UNCONFIRMED')await db.settings.update({where:{id:1},data:{packagingMode:'NONE',packagingCents:0,contentApproved:false}});
 if(await db.user.count()===0){
  if(process.env.ADMIN_EMAIL&&process.env.ADMIN_PASSWORD){run('user:create')}
  else console.log('No admin account yet. Supply ADMIN_EMAIL and ADMIN_PASSWORD, then rerun demo:bootstrap.');
 }
 console.log('Demo bootstrap complete; no live restaurant settings were approved.');
}
main().catch(error=>{console.error(error);process.exitCode=1}).finally(()=>db.$disconnect());
