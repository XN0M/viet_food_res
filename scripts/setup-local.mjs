import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
mkdirSync('.local',{recursive:true});
if(!existsSync('.env')){
  const source=readFileSync('.env.example','utf8').replace('replace-with-at-least-32-random-characters',randomBytes(32).toString('hex'));
  writeFileSync('.env',source);console.log('Local .env created with a random session secret.');
}else console.log('Existing .env preserved.');
