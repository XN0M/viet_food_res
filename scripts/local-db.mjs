import EmbeddedPostgres from 'embedded-postgres';
import { existsSync, mkdirSync } from 'node:fs';
import pg from 'pg';
const root=new URL('../.local/postgres',import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1');
mkdirSync(new URL('../.local/',import.meta.url),{recursive:true});
const database=new EmbeddedPostgres({databaseDir:root,user:'vietfood',password:'local_only_password',port:5438,persistent:true,authMethod:'scram-sha-256',initdbFlags:['--encoding=UTF8','--locale=C'],postgresFlags:['-h','127.0.0.1'],onLog:()=>{},onError:m=>console.error(String(m).slice(0,300))});
if(!existsSync(root+'/PG_VERSION'))await database.initialise();
await database.start();
const client=new pg.Client({connectionString:'postgresql://vietfood:local_only_password@127.0.0.1:5438/postgres'});await client.connect();
for(const name of ['vietfood','vietfood_test']){const r=await client.query('SELECT 1 FROM pg_database WHERE datname=$1',[name]);if(!r.rowCount)await client.query(`CREATE DATABASE ${name} TEMPLATE template0 ENCODING 'UTF8' LC_COLLATE 'C' LC_CTYPE 'C'`);}
await client.end();console.log('Development PostgreSQL ready on 127.0.0.1:5438 (vietfood + vietfood_test).');
const keep=setInterval(()=>{},60000);let stopping=false;async function stop(){if(stopping)return;stopping=true;clearInterval(keep);await database.stop();process.exit(0)}process.on('SIGINT',stop);process.on('SIGTERM',stop);
