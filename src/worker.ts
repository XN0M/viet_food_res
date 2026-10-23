import 'dotenv/config';
import { schedule, dispatch } from './lib/notifications';
import { db } from './lib/db';
let stopped=false;process.on('SIGTERM',()=>{stopped=true});process.on('SIGINT',()=>{stopped=true});
async function main(){while(!stopped){try{await schedule();await dispatch();await db.session.deleteMany({where:{expiresAt:{lt:new Date()}}});await db.rateLimit.deleteMany({where:{resetAt:{lt:new Date()}}});}catch{console.error('Worker cycle failed. Check database/SMTP health.');}await new Promise(r=>setTimeout(r,15000));}await db.$disconnect();}
main().catch(()=>process.exit(1));
