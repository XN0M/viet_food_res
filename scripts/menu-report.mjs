import { readFile,writeFile } from 'node:fs/promises';
const manifest=JSON.parse(await readFile('data/menu/source-manifest.json','utf8'));
const items=JSON.parse(await readFile('data/menu/dolny-stal.json','utf8'));
const csvValue=value=>'"'+String(value??'').replaceAll('"','""')+'"';
const rows=[['ID','Tên món','Nhóm','Giá website EUR','Hiển thị bản thử','Ảnh local','Nguồn món','Nguồn giá','Cần duyệt']];
for(const item of items){const source=manifest.items.find(x=>x.item.id===item.id);rows.push([item.id,item.name,item.category,(item.priceCents/100).toFixed(2),item.active?'Có':'Lưu trữ',item.image,source.sourceUrl,source.priceBasis,source.review.join(' | ')]);}
await writeFile('data/menu/review.csv','\uFEFF'+rows.map(row=>row.map(csvValue).join(',')).join('\r\n'));
console.log({reviewRows:items.length});
