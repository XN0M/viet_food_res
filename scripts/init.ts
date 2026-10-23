import 'dotenv/config';
import { db } from '../src/lib/db';
async function main(){await db.settings.upsert({where:{id:1},create:{id:1},update:{}});console.log('Settings initialized. Complete setup before live ordering.');}main().finally(()=>db.$disconnect());
