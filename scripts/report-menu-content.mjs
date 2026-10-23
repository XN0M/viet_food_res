import {readFile,writeFile} from 'node:fs/promises';
const menu=JSON.parse(await readFile(new URL('../data/menu/dolny-stal.json',import.meta.url),'utf8')).filter(i=>i.active);
const pending=menu.map(item=>({item,issues:[!item.description.trim()&&'Thiếu mô tả',!item.image.startsWith('/menu/dolny-stal/')&&'Thiếu ảnh',!item.portion.trim()&&'Chưa ghi khẩu phần',item.allergens.some(a=>/potvrdi|pôvodného menu/i.test(a))&&'Cần quán duyệt dị ứng']})).filter(row=>row.issues.some(Boolean));
const quote=value=>'"'+String(value).replaceAll('"','""')+'"';
const csv=[['ID','Tên món','Danh mục','Khẩu phần hiện có','Nội dung cần duyệt'],...pending.map(({item,issues})=>[item.id,item.name,item.category,item.portion,issues.filter(Boolean).join('; ')])].map(row=>row.map(quote).join(',')).join('\r\n');
await writeFile(new URL('../docs/MENU_CONTENT_REVIEW.csv',import.meta.url),'\ufeff'+csv+'\r\n');
console.log(JSON.stringify({active:menu.length,missingDescription:menu.filter(i=>!i.description.trim()).length,missingPhoto:menu.filter(i=>!i.image.startsWith('/menu/dolny-stal/')).length,reviewRows:pending.length}));
