import {test,expect} from '@playwright/test';
import {mkdirSync} from 'node:fs';
import {normalize} from '../src/lib/menu-presentation';

test('homepage has six real dishes, photography and no horizontal overflow',async({page},info)=>{
 await page.goto('/');await expect(page.locator('.vf-gemini-card')).toHaveCount(6);
 await expect(page.locator('.vf-gemini-hero-image .vf-photo img')).toBeVisible();
 await expect.poll(()=>page.locator('.vf-gemini-hero-image .vf-photo img').evaluate((img:HTMLImageElement)=>img.complete&&img.naturalWidth>0)).toBe(true);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
 await expect(page.locator('.vf-gemini-hero-add')).toBeVisible();
 mkdirSync('.local/previews',{recursive:true});await page.screenshot({path:`.local/previews/redesign-home-${info.project.name}.png`,fullPage:true,animations:'disabled'});await page.screenshot({path:`.local/previews/redesign-home-hero-${info.project.name}.png`,animations:'disabled'});
});
test('options and cart survive checkout and preserve menu query',async({page})=>{
 const menu=await(await page.request.get('/api/menu')).json();const item=menu.items.find((i:any)=>i.available&&i.options.length&&i.options[0].choices.length>1);
 await page.goto('/menu?group=napoje');await page.getByRole('searchbox',{name:'Hľadať jedlo'}).fill(normalize(item.name));
 await page.getByRole('button',{name:`Pridať ${item.name}`,exact:true}).click();
 const choice=item.options[0].choices[1];await page.getByRole('radio',{name:choice.name,exact:false}).check();await page.getByRole('button',{name:/Pridať do košíka/}).click();
 await expect(page.getByRole('status').filter({hasText:'Pridané'})).toBeVisible();await page.reload();
 await page.getByRole('button',{name:'Košík, 1 položiek',exact:true}).click();await expect(page.getByRole('dialog')).toContainText(choice.name);
 await page.getByRole('dialog').getByRole('link',{name:'Pokračovať k objednávke'}).click();await expect(page.getByRole('heading',{name:'Vaša objednávka',exact:true})).toBeVisible();
 await expect(page.locator('.summary-item')).toContainText(choice.name);await page.getByRole('button',{name:'Doručenie',exact:true}).click();await expect(page.getByLabel('Ulica',{exact:true})).toBeVisible();await expect(page.getByLabel('Spôsob platby')).not.toContainText('Kartou');
 await page.getByRole('link',{name:'Upraviť košík'}).click();await expect(page.getByRole('searchbox')).toHaveValue(normalize(item.name));expect(new URL(page.url()).searchParams.get('group')).toBe('napoje');
});
test('menu pagination, global search and clear keep browsing compact',async({page},info)=>{
 await page.goto('/menu?group=sushi');await expect(page.locator('.vf-menu-item')).toHaveCount(12);
 const first=await page.locator('.vf-menu-item').first().getAttribute('data-item-id');await page.getByRole('button',{name:'Ďalšia strana',exact:true}).click();await expect(page).toHaveURL(/page=2/);expect(await page.locator('.vf-menu-item').first().getAttribute('data-item-id')).not.toBe(first);
 await page.getByRole('searchbox').fill('pho');await expect(page.getByText('Výsledky v celom menu')).toBeVisible();await expect(page.locator('.vf-menu-item')).toHaveCount(6);await expect(page.getByRole('searchbox')).toBeFocused();
 await page.getByRole('button',{name:'Vymazať hľadanie'}).click();await expect(page.locator('.vf-groups button[aria-pressed=true]')).toHaveText(/Sushi/);await expect(page.locator('.vf-menu-item')).toHaveCount(12);
 await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.screenshot({path:`.local/previews/redesign-menu-${info.project.name}.png`,fullPage:true,animations:'disabled'});await page.screenshot({path:`.local/previews/redesign-menu-overview-${info.project.name}.png`,animations:'disabled'});
 await page.locator('.vf-menu-item .vf-row-detail').first().click();await expect(page.getByRole('dialog')).toContainText('Alergény');await page.screenshot({path:`.local/previews/redesign-detail-${info.project.name}.png`,animations:'disabled'});
 await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).toHaveCount(0);await expect(page.locator('.vf-menu-item .vf-row-detail').first()).toBeFocused();
});
test('menu filters scroll away and mobile group selection keeps all groups reachable',async({page})=>{
 await page.setViewportSize({width:390,height:900});
 await page.goto('/menu?group=pho-rezance');
 const groupSelect=page.getByRole('combobox',{name:'Skupina jedál'});
 await expect(groupSelect).toBeVisible();
 await groupSelect.selectOption('sushi');
 await expect(page).toHaveURL(/group=sushi/);
 await expect(page.locator('.vf-menu-item')).toHaveCount(12);
 await expect(page.locator('.vf-menu-tools')).toHaveCSS('position','static');
 await page.evaluate(()=>window.scrollTo(0,800));
 await expect.poll(()=>page.locator('.vf-menu-tools').evaluate(el=>el.getBoundingClientRect().bottom)).toBeLessThan(0);
 await page.setViewportSize({width:1280,height:900});
 await page.evaluate(()=>window.scrollTo(0,0));
 await expect(groupSelect).toBeHidden();
 await page.locator('.vf-groups button').filter({hasText:'Nápoje'}).click();
 await expect(page).toHaveURL(/group=napoje/);
 expect(await page.locator('.vf-groups').evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);
});
test('unpictured dishes remain findable and image failure keeps item orderable',async({page})=>{
 const menu=await(await page.request.get('/api/menu')).json();const missing=menu.items.find((i:any)=>!i.image.startsWith('/menu/'));
 await page.goto('/menu?q='+encodeURIComponent(missing.name));await expect(page.locator('.vf-menu-item')).toHaveCount(1);await expect(page.locator('.vf-menu-item img')).toHaveCount(0);
 await page.route('**/_next/image?**',r=>r.abort());await page.getByRole('searchbox').fill('pho');await expect(page.locator('.vf-menu-item')).toHaveCount(6);await expect(page.locator('.vf-menu-item img')).toHaveCount(0);
 await page.locator('.vf-row-detail').first().click();await expect(page.getByRole('dialog')).toContainText('Alergény');
});
test('missing menu request can retry and sold out dish cannot be added',async({page})=>{
 let fail=true;await page.route('**/api/menu',async route=>{if(fail)return route.fulfill({status:503,json:{error:'Menu dočasne nedostupné'}});const response=await route.fetch();const data=await response.json();data.items.find((i:any)=>i.category==='PHỞ').available=false;await route.fulfill({response,json:data});});
 await page.goto('/menu');await expect(page.locator('.vf-error')).toContainText('Menu dočasne nedostupné');fail=false;await page.getByRole('button',{name:'Skúsiť znova'}).click();await expect(page.locator('.vf-sold-out')).toHaveCount(1);await expect(page.locator('.vf-sold-out .vf-add')).toBeDisabled();
});
test('responsive widths and reduced motion keep controls usable',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/menu');await expect(page.locator('.vf-menu-item')).toHaveCount(12);
 for(const width of [360,390,768,1280,1440]){await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect(await page.locator('.vf-menu-item .vf-add').first().evaluate(el=>el.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);expect(await page.locator('.vf-search').evaluate(el=>getComputedStyle(el).display)).toBe('flex');expect(await page.getByRole('searchbox').evaluate(el=>getComputedStyle(el).borderTopWidth)).toBe('0px');}
 await page.locator('.vf-row-detail').first().click();expect(await page.getByRole('dialog').evaluate(el=>getComputedStyle(el).animationName)).toBe('none');await page.keyboard.press('Escape');
 await page.goto('/');await expect(page.locator('.vf-gemini-card')).toHaveCount(6);for(const width of [360,390,768,1280,1440]){await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
});
test('legacy menu links, empty search, legal links and admin isolation',async({page})=>{
 await page.goto('/#menu');await expect(page).toHaveURL(/\/menu/);await page.getByRole('searchbox').fill('zzzz-no-such-dish');await expect(page.getByRole('heading',{name:'Nenašli sme túto chuť.'})).toBeVisible();await page.getByRole('button',{name:'Zrušiť filtre'}).click();await expect(page.locator('.vf-menu-item')).toHaveCount(12);
 await page.goto('/informacie#podmienky');await expect(page.getByRole('heading',{name:'Obchodné podmienky',exact:true})).toBeVisible();await page.goto('/admin');await expect(page.getByRole('heading',{name:'Vitajte späť.'})).toBeVisible();await expect(page.locator('.vf-public')).toHaveCount(0);expect((await page.request.get('/api/admin/orders')).status()).toBe(401);
});

