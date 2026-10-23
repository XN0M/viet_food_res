import 'dotenv/config';
import { spawnSync } from 'node:child_process';
const url=new URL(process.env.DATABASE_URL);url.pathname='/vietfood_test';
const env={...process.env,DATABASE_URL:url.toString(),RUN_DB_TESTS:'1',APP_ENV:'demo',SESSION_SECRET:process.env.SESSION_SECRET||'integration-only-secret-32-characters-long'};
for(const args of [['node_modules/prisma/build/index.js','migrate','deploy'],['node_modules/vitest/vitest.mjs','run','tests/orders.test.ts']]){const result=spawnSync(process.execPath,args,{env,stdio:'inherit'});if(result.status!==0)process.exit(result.status??1);}
