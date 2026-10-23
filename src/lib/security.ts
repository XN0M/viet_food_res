import { createHash, createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { db } from './db';
import type { NextRequest } from 'next/server';
export class HttpError extends Error {constructor(public status:number,message:string){super(message)}}
export const hash=(v:string)=>createHash('sha256').update(v).digest('hex');
export const randomToken=()=>randomBytes(32).toString('hex');
export function secret(){const s=process.env.SESSION_SECRET;if(!s||s.length<32)throw new Error('SESSION_SECRET must contain at least 32 characters');return s;}
export function orderToken(key:string){return createHmac('sha256',secret()).update('order:'+key).digest('hex');}
export function signQuote(value:unknown){return createHmac('sha256',secret()).update('quote:'+JSON.stringify(value)).digest('hex');}
export function passwordHash(password:string){const salt=randomBytes(16).toString('hex');return salt+':'+scryptSync(password,salt,64).toString('hex');}
export function verifyPassword(password:string,stored:string){try{const [salt,key]=stored.split(':');const expected=Buffer.from(key,'hex');const actual=scryptSync(password,salt,64);return expected.length===actual.length&&timingSafeEqual(expected,actual);}catch{return false;}}
export function assertOrigin(request:NextRequest){
  const expected=new URL(process.env.APP_URL??'http://localhost:3000').origin;
  if(request.headers.get('origin')!==expected)throw new HttpError(403,'Neplatný pôvod požiadavky.');
  if(!request.headers.get('content-type')?.includes('application/json'))throw new HttpError(415,'Očakáva sa JSON.');
}
export async function body(request:NextRequest){
  if(Number(request.headers.get('content-length'))>32000)throw new HttpError(413,'Požiadavka je príliš veľká.');
  const raw=await request.text();if(raw.length>32000)throw new HttpError(413,'Požiadavka je príliš veľká.');
  try{return JSON.parse(raw);}catch{throw new HttpError(400,'Neplatné údaje.');}
}
export async function staff(request:NextRequest,roles?:string[]){
  const token=request.cookies.get('vf_session')?.value;
  const session=token?await db.session.findUnique({where:{hash:hash(token)},include:{user:true}}):null;
  if(!session||session.expiresAt<new Date()||!session.user.active)throw new HttpError(401,'Prihláste sa.');
  if(roles&&!roles.includes(session.user.role))throw new HttpError(403,'Na túto zmenu nemáte oprávnenie.');
  return session.user;
}
export function clientIp(request:Pick<NextRequest,'headers'>){
  return process.env.TRUST_PROXY==='render'?request.headers.get('cf-connecting-ip')?.trim()||'unknown':'local';
}
export async function rateLimit(request:NextRequest,kind:string,limit:number,minutes=10){
  const ip=clientIp(request);
  const key=hash(kind+':'+ip); const now=new Date();const reset=new Date(now.getTime()+minutes*60000);
  const rows=await db.$queryRaw<{count:number}[]>`INSERT INTO "RateLimit" ("key","count","resetAt") VALUES (${key},1,${reset}) ON CONFLICT ("key") DO UPDATE SET "count"=CASE WHEN "RateLimit"."resetAt"<${now} THEN 1 ELSE "RateLimit"."count"+1 END, "resetAt"=CASE WHEN "RateLimit"."resetAt"<${now} THEN ${reset} ELSE "RateLimit"."resetAt" END RETURNING "count"`;
  if(rows[0].count>limit)throw new HttpError(429,'Príliš veľa pokusov. Skúste to neskôr.');
}
