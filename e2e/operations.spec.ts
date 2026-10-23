import {test,expect} from '@playwright/test';
import {existsSync,readFileSync,mkdirSync} from 'node:fs';
import {money} from '../src/lib/domain';
const accounts=existsSync('.local/demo-access.json')?JSON.parse(readFileSync('.local/demo-access.json','utf8')):[];

test('cart quantities, separate lines, remove and reload work together',async({page},info)=>{
 const menu=await(await page.request.get('/api/menu')).json();const [first,second]=menu.items.filter((i:any)=>i.available&&!i.options.length);
 await page.goto('/menu?q='+encodeURIComponent(first.name));const add=page.getByRole('button',{name:`Pridať ${first.name}`,exact:true});await add.click();await add.click();
 await page.goto('/menu?q='+encodeURIComponent(second.name));await page.getByRole('button',{name:`Pridať ${second.name}`,exact:true}).click();
 await page.getByRole('button',{name:'Košík, 3 položiek',exact:true}).click();const dialog=page.getByRole('dialog');const line=dialog.locator('.vf-cart-line').filter({hasText:first.name});
 await line.getByRole('button',{name:`Zvýšiť množstvo ${first.name}`,exact:true}).click();await expect(page.getByRole('button',{name:'Košík, 4 položiek',exact:true})).toHaveCount(1);
 await line.getByRole('button',{name:`Znížiť množstvo ${first.name}`,exact:true}).click();await dialog.getByRole('button',{name:`Odstrániť ${second.name}`,exact:true}).click();
 await expect(dialog.locator('.vf-cart-total strong')).toHaveText(money(first.priceCents*2));await expect(dialog.locator('.vf-cart-line')).toHaveCount(1);
 mkdirSync('.local/previews',{recursive:true});await page.screenshot({path:`.local/previews/test-cart-${info.project.name}.png`,animations:'disabled'});
 await page.keyboard.press('Escape');await page.reload();await page.getByRole('button',{name:'Košík, 2 položiek',exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:`Odstrániť ${first.name}`,exact:true}).click();
 await expect(page.getByRole('dialog')).toContainText('Niečo dobré na začiatok?');await expect(page.getByRole('button',{name:'Košík, 0 položiek',exact:true})).toHaveCount(1);
});

for(const fulfillment of ['PICKUP','DELIVERY'] as const){
 test(`${fulfillment}: email, phone contact, preparation, completion and payment`,async({page},info)=>{
  test.setTimeout(90000);
  const staff=accounts.find((a:any)=>a.role==='STAFF');test.skip(!staff,'Local demo staff account required.');
  const menu=await(await page.request.get('/api/menu')).json();test.skip(!menu.open||!menu.slots.length,'Restaurant currently closed.');
  const dish=menu.items.find((i:any)=>i.available&&!i.options.length);const name=`Test lifecycle ${fulfillment} ${info.project.name} ${Date.now()}`;
  await page.goto('/menu?q='+encodeURIComponent(dish.name));await page.getByRole('button',{name:`Pridať ${dish.name}`,exact:true}).click();await page.getByRole('button',{name:'Košík, 1 položiek',exact:true}).click();await page.getByRole('dialog').getByRole('link',{name:'Pokračovať k objednávke'}).click();
  if(fulfillment==='DELIVERY'){
   await page.getByRole('button',{name:'Doručenie',exact:true}).click();await page.getByLabel('Ulica',{exact:true}).fill('Testovacia');await page.getByLabel('Číslo domu').fill('1');await page.getByLabel('Obec / mesto').fill('Dolný Štál');await page.getByLabel('PSČ').fill('930 10');
  }else await page.getByLabel('Čas vyzdvihnutia').selectOption(menu.slots[0]);
  await page.getByLabel('Meno a priezvisko').fill(name);await page.getByLabel('Telefón',{exact:false}).fill('+421900000000');await page.getByRole('checkbox').check();
  await page.getByRole('button',{name:'Skontrolovať cenu a objednávku'}).click();await page.getByRole('button',{name:fulfillment==='DELIVERY'?'Odoslať žiadosť o objednávku':'Objednať s povinnosťou platby',exact:true}).click();
  await expect(page).toHaveURL(/\/objednavka\/[a-f0-9]{64}/);const tracking=page.url();const token=tracking.split('/').at(-1)!;const order=await(await page.request.get('/api/orders/'+token)).json();expect(order.status).toBe('PENDING');
  await expect.poll(async()=>{const inbox=await(await page.request.get('http://127.0.0.1:8028/')).json();return inbox.messages.some((m:{raw:string})=>{const text=m.raw.replace(/=\r?\n/g,'');return text.includes(name)&&text.includes(`#${order.number}`);});},{timeout:30000,intervals:[500,1000,2000]}).toBe(true);
  await page.goto('/admin');await page.getByLabel('E-mail',{exact:true}).fill(staff.email);await page.getByLabel('Heslo',{exact:true}).fill(staff.password);await page.getByRole('button',{name:'Prihlásiť sa'}).click();await page.getByRole('button').filter({hasText:`#${order.number} · ${name}`}).click();
  const dialog=page.getByRole('dialog');await dialog.getByRole('button',{name:'Potvrdiť objednávku',exact:true}).click();await expect(dialog.getByRole('alert')).toContainText('Najprv potvrďte telefonický kontakt');
  await dialog.getByLabel('Výsledok hovoru / dôvod').fill('Test: zákazník zatiaľ nedvíha.');await dialog.getByRole('button',{name:'Zapísať hovor bez potvrdenia'}).click();await expect(dialog.locator('.status')).toHaveText('Čaká na potvrdenie');
  await dialog.getByLabel('Zákazníka sme telefonicky kontaktovali').check();
  if(fulfillment==='DELIVERY'){
   await dialog.getByLabel('Dohodnutá doprava (€)').fill('4');await dialog.getByLabel('Zákazník súhlasí s dopravou a konečnou sumou').check();const later=new Date(Date.now()+3600000);const local=new Date(later.getTime()-later.getTimezoneOffset()*60000).toISOString().slice(0,16);await dialog.getByLabel('Dohodnutý čas doručenia').fill(local);
  }
  await dialog.getByRole('button',{name:'Potvrdiť objednávku',exact:true}).click();await expect(dialog.locator('.status')).toHaveText('Potvrdená');
  expect((await page.request.post('/api/orders/'+token+'/cancel',{data:{}})).status()).toBe(403);
  expect((await page.request.post('/api/orders/'+token+'/cancel',{data:{},headers:{origin:new URL(tracking).origin}})).status()).toBe(409);
  await dialog.getByRole('button',{name:'Začať prípravu',exact:true}).click();await expect(dialog.locator('.status')).toHaveText('Pripravujeme');
  await dialog.getByRole('button',{name:fulfillment==='PICKUP'?'Pripravené na odber':'Odovzdané na rozvoz',exact:true}).click();await expect(dialog.locator('.status')).toHaveText(fulfillment==='PICKUP'?'Pripravená na vyzdvihnutie':'Na ceste');
  await dialog.getByRole('button',{name:'Dokončiť objednávku',exact:true}).click();await expect(dialog.locator('.status')).toHaveText('Dokončená');await dialog.getByRole('button',{name:'Označiť prijatú platbu',exact:true}).click();await expect(dialog.getByRole('button',{name:'Označiť prijatú platbu'})).toHaveCount(0);
  const final=await(await page.request.get('/api/orders/'+token)).json();expect(final.status).toBe('COMPLETED');expect(final.paid).toBe(true);expect(final.deliveryCents).toBe(fulfillment==='PICKUP'?0:400);
  await page.goto(tracking);await expect(page.getByText('Dokončená',{exact:true})).toBeVisible();await expect(page.getByText(/Zaplatené/)).toBeVisible();
  mkdirSync('.local/previews',{recursive:true});await page.screenshot({path:`.local/previews/test-completed-${fulfillment.toLowerCase()}-${info.project.name}.png`,fullPage:true,animations:'disabled'});
 });
}
