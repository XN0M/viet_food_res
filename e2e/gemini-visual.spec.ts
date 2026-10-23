import {test,expect} from '@playwright/test';
import {mkdirSync} from 'node:fs';

test('Gemini customer flow keeps cart and checkout usable',async({page},info)=>{
 await page.goto('/menu?group=predjedla');
 await expect(page.locator('.vf-menu-item')).toHaveCount(12);
 await page.locator('.vf-menu-item .vf-add').first().click();
 await page.getByRole('button',{name:/Košík, 1 položiek/}).click();
 await expect(page.getByRole('dialog',{name:'Váš košík'})).toBeVisible();
 mkdirSync('.local/previews',{recursive:true});
 await page.screenshot({path:`.local/previews/gemini-cart-${info.project.name}.png`,animations:'disabled'});
 await page.getByRole('dialog',{name:'Váš košík'}).getByRole('link',{name:'Pokračovať k objednávke'}).click();
 await expect(page.getByRole('heading',{name:'Vaša objednávka',exact:true})).toBeVisible();
 await expect(page.getByRole('button',{name:'Doručenie',exact:true})).toBeVisible();
 await page.screenshot({path:`.local/previews/gemini-checkout-${info.project.name}.png`,animations:'disabled'});
});
