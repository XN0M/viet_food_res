import { readFile,writeFile,mkdir,stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const manifest=JSON.parse(await readFile('data/menu/source-manifest.json','utf8'));
const output='public/menu/dolny-stal';
await mkdir(output,{recursive:true});
const urls=[...new Set([...manifest.items.flatMap(x=>x.imageUrls),...manifest.woltImageCatalog.flatMap(x=>x.imageUrls)])];
const assets=[];let cursor=0;
async function download(sourceUrl){
 const url=new URL(sourceUrl);
 if(!['vietfood.sk','imageproxy.wolt.com'].includes(url.hostname)||url.protocol!=='https:')throw new Error(`Unexpected image host: ${sourceUrl}`);
 const filename=createHash('sha256').update(sourceUrl).digest('hex').slice(0,24)+'.webp';
 const localPath=`/menu/dolny-stal/${filename}`;
 try{const bytes=await readFile(`public${localPath}`);const info=await sharp(bytes).metadata();assets.push({sourceUrl,localPath,width:info.width,height:info.height,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});return;}catch{}
 for(let attempt=0;attempt<3;attempt++){
  try{
   const response=await fetch(sourceUrl,{signal:AbortSignal.timeout(25000)});
   if(!response.ok||!response.headers.get('content-type')?.startsWith('image/'))throw new Error(`Image HTTP ${response.status}`);
   const input=Buffer.from(await response.arrayBuffer());
   if(input.length>25000000)throw new Error('Image exceeds size limit');
   const {data,info}=await sharp(input,{limitInputPixels:40000000}).rotate().resize({width:1280,height:1280,fit:'inside',withoutEnlargement:true}).webp({quality:85}).toBuffer({resolveWithObject:true});
   await writeFile(`public${localPath}`,data);
   assets.push({sourceUrl,localPath,width:info.width,height:info.height,bytes:data.length,sha256:createHash('sha256').update(data).digest('hex'),sourceSha256:createHash('sha256').update(input).digest('hex')});
   return;
  }catch(error){if(attempt===2){assets.push({sourceUrl,error:String(error)});console.error('Failed',sourceUrl,String(error));}}
 }
}
await Promise.all(Array.from({length:4},async()=>{while(cursor<urls.length){const index=cursor++;await download(urls[index]);if((index+1)%25===0)console.log(`Images ${index+1}/${urls.length}`);}}));
assets.sort((a,b)=>a.sourceUrl.localeCompare(b.sourceUrl));
const paths=new Map(assets.filter(x=>x.localPath).map(x=>[x.sourceUrl,x.localPath]));
const items=manifest.items.map(source=>({...source.item,image:source.imageUrls.map(url=>paths.get(url)).find(Boolean)??'/food-placeholder.svg'}));
await writeFile('data/menu/image-assets.json',JSON.stringify({branchKey:manifest.branchKey,address:manifest.address,createdAt:new Date().toISOString(),assets},null,2));
await writeFile('data/menu/dolny-stal.json',JSON.stringify(items,null,2));
console.log(JSON.stringify({downloaded:assets.filter(x=>x.localPath).length,failed:assets.filter(x=>x.error).length,totalBytes:assets.reduce((sum,x)=>sum+(x.bytes??0),0),menuPhotos:items.filter(x=>x.image!=='/food-placeholder.svg').length,placeholders:items.filter(x=>x.image==='/food-placeholder.svg').map(x=>x.name)},null,2));
if(assets.some(x=>x.error))process.exitCode=1;
