import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve,extname,sep } from 'node:path';
const root=resolve('public');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.webp':'image/webp','.svg':'image/svg+xml','.png':'image/png'};
createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://localhost:3001');let path=decodeURIComponent(url.pathname);if(path==='/')path='/design-preview/index.html';
  const file=resolve(root,'.'+path);if(!file.startsWith(root+sep))throw new Error('Outside public');
  const data=await readFile(file);res.writeHead(200,{'Content-Type':types[extname(file)]??'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; frame-ancestors 'none'; base-uri 'none'"});res.end(data);
 }catch{res.writeHead(404,{'Content-Type':'text/plain'});res.end('Not found');}
}).listen(3001,'127.0.0.1',()=>console.log('Design preview: http://localhost:3001/'));
