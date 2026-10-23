import 'dotenv/config';
import { db } from '../src/lib/db';
import { passwordHash } from '../src/lib/security';
async function main(){
 const email=process.env.ADMIN_EMAIL?.toLowerCase();const password=process.env.ADMIN_PASSWORD;
 if(!email||!password||password.length<12)throw new Error('Provide ADMIN_EMAIL and ADMIN_PASSWORD (12+ characters) via environment.');
 await db.user.create({data:{email,name:'Správca',role:'OWNER',passwordHash:passwordHash(password)}});console.log('Owner account created.');
}main().finally(()=>db.$disconnect());
