import {test,expect} from '@playwright/test';
import {readFileSync,existsSync,mkdirSync} from 'node:fs';
const accessPath='.local/demo-access.json';
const accounts=existsSync(accessPath)?JSON.parse(readFileSync(accessPath,'utf8')):[];
test('staff permissions and manager availability dashboard',async({page},info)=>{
 test.skip(accounts.length===0,'Create local demo accounts first.');
 const staff=accounts.find((a:any)=>a.role==='STAFF');await page.goto('/admin');
 await page.getByLabel('E-mail',{exact:true}).fill(staff.email);await page.getByLabel('Heslo',{exact:true}).fill(staff.password);await page.getByRole('button',{name:'Prihlásiť sa'}).click();
 await expect(page.getByRole('heading',{name:'Objednávky',exact:true})).toBeVisible();
 expect((await page.request.get('/api/admin/settings')).status()).toBe(403);
 await expect(page.getByRole('button',{name:'Dostupnosť jedál'})).toHaveCount(0);
 mkdirSync('.local/previews',{recursive:true});await page.screenshot({path:`.local/previews/admin-${info.project.name}.png`,fullPage:true});
 await page.getByRole('button',{name:'Odhlásiť'}).focus();await page.keyboard.press('Enter');
 const manager=accounts.find((a:any)=>a.role==='MANAGER');await page.getByLabel('E-mail',{exact:true}).fill(manager.email);await page.getByLabel('Heslo',{exact:true}).fill(manager.password);await page.getByRole('button',{name:'Prihlásiť sa'}).click();await page.getByRole('button',{name:'Dostupnosť jedál'}).click();
 await expect(page.getByRole('heading',{name:'Dostupnosť jedál',exact:true})).toBeVisible();await expect(page.getByRole('button',{name:'Označiť ako vypredané'}).first()).toBeVisible();
});
test('real delivery request, staff telephone quote and customer tracking',async({page},info)=>{
 test.skip(accounts.length===0,'Create local demo accounts first.');
 const meta=await (await page.request.get('/api/menu')).json();test.skip(!meta.open,'Restaurant closed; service-hour behavior covered by database tests.');
 const dish=meta.items.find((i:any)=>i.available&&!i.options.length);expect(dish).toBeTruthy();await page.goto('/menu?q='+encodeURIComponent(dish.name));await page.getByRole('button',{name:`Pridať ${dish.name}`,exact:true}).click();await page.getByRole('button',{name:'Košík, 1 položiek',exact:true}).click();await page.getByRole('dialog').getByRole('link',{name:'Pokračovať k objednávke'}).click();await page.getByRole('button',{name:'Doručenie',exact:true}).click();
 await page.getByLabel('Ulica',{exact:true}).fill('Testovacia');await page.getByLabel('Číslo domu').fill('1');await page.getByLabel('Obec / mesto').fill('Dolný Štál');await page.getByLabel('PSČ').fill('930 10');await page.getByLabel('Meno a priezvisko').fill('Test browser '+info.project.name);await page.getByLabel('Telefón',{exact:false}).fill('+421900000000');await page.getByRole('checkbox').check();
 await page.getByRole('button',{name:'Skontrolovať cenu a objednávku'}).click();await expect(page.getByText('Medzisúčet nezahŕňa dopravu.')).toBeVisible();await page.getByRole('button',{name:'Odoslať žiadosť o objednávku'}).click();await expect(page).toHaveURL(/\/objednavka\/[a-f0-9]{64}/);const trackingUrl=page.url();const token=trackingUrl.split('/').at(-1)!;const order=await (await page.request.get('/api/orders/'+token)).json();expect(order.status).toBe('PENDING');
 const staff=accounts.find((a:any)=>a.role==='STAFF');await page.goto('/admin');await page.getByLabel('E-mail',{exact:true}).fill(staff.email);await page.getByLabel('Heslo',{exact:true}).fill(staff.password);await page.getByRole('button',{name:'Prihlásiť sa'}).click();await page.getByRole('button').filter({hasText:`#${order.number} · Test browser`}).click();
 await page.getByLabel('Zákazníka sme telefonicky kontaktovali').check();await page.getByLabel('Dohodnutá doprava (€)').fill('4');await page.getByLabel('Zákazník súhlasí s dopravou a konečnou sumou').check();
 const later=new Date(Date.now()+3600000);const local=new Date(later.getTime()-later.getTimezoneOffset()*60000).toISOString().slice(0,16);await page.getByLabel('Dohodnutý čas doručenia').fill(local);await page.getByRole('button',{name:'Potvrdiť objednávku',exact:true}).click();await expect(page.getByRole('dialog')).toContainText('Potvrdená');
 await page.goto(trackingUrl);await expect(page.getByText('Potvrdená',{exact:true})).toBeVisible();await expect(page.getByRole('button',{name:'Zrušiť čakajúcu objednávku'})).toHaveCount(0);await page.screenshot({path:`.local/previews/tracking-${info.project.name}.png`,fullPage:true});
});
test('pickup request can be cancelled while pending',async({page})=>{
 const meta=await (await page.request.get('/api/menu')).json();test.skip(!meta.open||!meta.slots.length,'No currently valid pickup slot.');
 const dish=meta.items.find((i:any)=>i.available&&!i.options.length);expect(dish).toBeTruthy();await page.goto('/menu?q='+encodeURIComponent(dish.name));await page.getByRole('button',{name:`Pridať ${dish.name}`,exact:true}).click();await page.getByRole('button',{name:'Košík, 1 položiek',exact:true}).click();await page.getByRole('dialog').getByRole('link',{name:'Pokračovať k objednávke'}).click();
 await page.getByLabel('Čas vyzdvihnutia',{exact:false}).selectOption(meta.slots[0]);await page.getByLabel('Meno a priezvisko').fill('Test pickup');await page.getByLabel('Telefón',{exact:false}).fill('+421900000000');await page.getByRole('checkbox').check();await page.getByRole('button',{name:'Skontrolovať cenu a objednávku'}).click();await page.getByRole('button',{name:'Objednať s povinnosťou platby'}).click();await expect(page).toHaveURL(/\/objednavka\/[a-f0-9]{64}/);await page.getByRole('button',{name:'Zrušiť čakajúcu objednávku'}).click();await page.getByRole('button',{name:'Áno, zrušiť',exact:true}).click();await expect(page.getByText('Zrušená',{exact:true})).toBeVisible();
});

