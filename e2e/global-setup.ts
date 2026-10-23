import 'dotenv/config';
import { db } from '../src/lib/db';
import { hash } from '../src/lib/security';
export default async function setup(){
 const url=new URL(process.env.DATABASE_URL??'postgresql://invalid/invalid');
 if(process.env.APP_ENV!=='demo'||!['127.0.0.1','localhost'].includes(url.hostname)||url.pathname!=='/vietfood')throw new Error('Browser tests only run against the local demo.');
 // Independent test runs start with an empty login counter; production rate limiting stays unchanged.
 await db.rateLimit.deleteMany({where:{key:hash('login:local')}});await db.$disconnect();
}
