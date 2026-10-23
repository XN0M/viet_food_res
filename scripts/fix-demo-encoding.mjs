import pg from 'pg';
const client=new pg.Client({connectionString:'postgresql://vietfood:local_only_password@127.0.0.1:5438/postgres'});await client.connect();
for(const name of ['vietfood','vietfood_test']){
 const result=await client.query('SELECT pg_encoding_to_char(encoding) AS encoding FROM pg_database WHERE datname=$1',[name]);
 if(result.rows[0]?.encoding==='UTF8')continue;
 if(result.rowCount){const preserved=name+'_encoding_backup_'+Date.now();await client.query(`ALTER DATABASE ${name} RENAME TO ${preserved}`);console.log(`Preserved old ${name} under ${preserved}.`);}
 await client.query(`CREATE DATABASE ${name} TEMPLATE template0 ENCODING 'UTF8' LC_COLLATE 'C' LC_CTYPE 'C'`);
}
await client.end();console.log('Demo/test databases now use UTF8.');
