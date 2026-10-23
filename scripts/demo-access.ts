import 'dotenv/config';
import { randomBytes } from 'node:crypto';
import { mkdir,writeFile } from 'node:fs/promises';
import { db } from '../src/lib/db';
import { passwordHash } from '../src/lib/security';
async function main(){
 if(process.env.APP_ENV==='live')throw new Error('Demo accounts cannot be created in live mode.');
 const accounts=[];for(const role of ['OWNER','MANAGER','STAFF']){const email=role.toLowerCase()+'@vietfood.test';const password=randomBytes(18).toString('base64url');await db.user.upsert({where:{email},create:{email,passwordHash:passwordHash(password),name:role==='OWNER'?'Technický správca':role==='MANAGER'?'Vedúci':'Personál',role},update:{passwordHash:passwordHash(password),active:true}});accounts.push({email,password,role});}
 await mkdir('.local',{recursive:true});await writeFile('.local/demo-access.json',JSON.stringify(accounts,null,2));console.log('Random demo credentials saved in ignored .local/demo-access.json; never use these accounts in live mode.');
}main().finally(()=>db.$disconnect());
