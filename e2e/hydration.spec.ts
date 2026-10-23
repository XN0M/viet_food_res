import {test,expect} from '@playwright/test';
import {mkdirSync} from 'node:fs';

test('clean browser hydrates public pages and admin without HTML mismatches',async({page},info)=>{
 const errors:string[]=[];
 page.on('pageerror',error=>errors.push(error.message));
 page.on('console',message=>{if(message.type()==='error'&&/hydrat|didn't match|cannot be a descendant|cannot contain a nested/i.test(message.text()))errors.push(message.text());});
 const response=await page.request.get('/menu?group=hlavne');
 expect(response.ok()).toBe(true);
 // These attributes in the reported screenshot are not part of the server HTML.
 expect(await response.text()).not.toMatch(/bis_skin_checked|bis_register|__processed_[\w-]+/);
 await page.goto('/');await expect(page.locator('.vf-gemini-card')).toHaveCount(6);
 await page.goto('/objednavka');await expect(page.getByRole('heading',{name:'Vaša objednávka',exact:true})).toBeVisible();
 await page.goto('/informacie');await expect(page.getByRole('heading',{name:'Informácie a kontakt',exact:true})).toBeVisible();
 await page.goto('/admin');await expect(page.getByRole('heading',{name:'Vitajte späť.',exact:true})).toBeVisible();
 await page.goto('/menu?group=hlavne');await expect(page.getByRole('searchbox',{name:'Hľadať jedlo'})).toBeEnabled();await expect(page.locator('.vf-menu-item')).toHaveCount(12);
 await expect(page.locator('.vf-groups button[aria-pressed=true]')).toContainText('Hlavné jedlá');
 expect(await page.locator('[bis_skin_checked],[bis_register]').count()).toBe(0);
 expect(errors).toEqual([]);
 mkdirSync('.local/previews',{recursive:true});
 await page.screenshot({path:`.local/previews/hydration-clean-${info.project.name}.png`,animations:'disabled'});
});

