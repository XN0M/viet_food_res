// Loopback-only full-data snapshot and restore verification for the local demo.
import pg from 'pg';
import { readFileSync,writeFileSync,mkdirSync } from 'node:fs';
const base='postgresql://vietfood:local_only_password@127.0.0.1:5438/';
// Prisma timestamps are UTC values stored without a SQL timezone; retain their raw form.
pg.types.setTypeParser(1114,value=>value);
const tables=['Settings','MenuItem','User','Session','Order','OrderEvent','Outbox','Audit','RateLimit','WorkerHealth'];
const jsonField=(table,column)=>(table==='MenuItem'&&column==='options')||(table==='Order'&&['address','items'].includes(column));
const source=new pg.Client({connectionString:base+'vietfood'});await source.connect();await source.query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');
const snapshot={};for(const table of tables)snapshot[table]=(await source.query(`SELECT * FROM "${table}"`)).rows;
await source.query('COMMIT');await source.end();mkdirSync('backups',{recursive:true});
const snapshotPath='backups/demo-snapshot-'+Date.now()+'.json';writeFileSync(snapshotPath,JSON.stringify(snapshot,null,2));
const name='vietfood_restore_check_'+Date.now();const control=new pg.Client({connectionString:base+'postgres'});await control.connect();await control.query(`CREATE DATABASE ${name} TEMPLATE template0 ENCODING 'UTF8' LC_COLLATE 'C' LC_CTYPE 'C'`);await control.end();
const restored=new pg.Client({connectionString:base+name});await restored.connect();await restored.query(readFileSync('prisma/migrations/20261012000000_initial/migration.sql','utf8'));
await restored.query('BEGIN');for(const table of tables)for(const row of snapshot[table]){const columns=Object.keys(row);const placeholders=columns.map((column,index)=>`$${index+1}${jsonField(table,column)?'::jsonb':''}`).join(',');await restored.query(`INSERT INTO "${table}" (${columns.map(c=>'"'+c+'"').join(',')}) VALUES (${placeholders})`,columns.map(c=>jsonField(table,c)&&row[c]!==null?JSON.stringify(row[c]):row[c]));}
await restored.query(`SELECT setval(pg_get_serial_sequence('"Order"','number'), COALESCE((SELECT MAX(number) FROM "Order"),1), EXISTS(SELECT 1 FROM "Order"))`);await restored.query('COMMIT');
function canonical(value){if(Array.isArray(value))return value.map(canonical);if(value&&typeof value==='object')return Object.fromEntries(Object.keys(value).sort().map(key=>[key,canonical(value[key])]));return value;}
for(const table of tables){const rows=(await restored.query(`SELECT * FROM "${table}"`)).rows;const normalize=v=>JSON.stringify(canonical(v));const originals=snapshot[table].map(normalize).sort();const copies=rows.map(normalize).sort();if(JSON.stringify(originals)!==JSON.stringify(copies))throw new Error('Restore mismatch: '+table);}
await restored.end();console.log(`Restore verified for ${tables.length} tables; ${snapshot.Order.length} orders. Snapshot: ${snapshotPath}. Restored database ${name} retained for inspection.`);
