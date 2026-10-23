import {describe,it,expect} from 'vitest';
import source from '../data/menu/dolny-stal.json';
import {groups,groupFor,normalize,selectMenu,readCart,unitPrice,realPhoto,type MenuItem} from '../src/lib/menu-presentation';
const menu=source.filter(i=>i.active) as MenuItem[];
describe('compact menu presentation',()=>{
 it('covers all source categories exactly once without dropping unpictured dishes',()=>{
  const categories=[...new Set(menu.map(i=>i.category))];expect(categories).toHaveLength(27);
  for(const category of categories)expect(groups.filter(g=>g.categories.includes(category))).toHaveLength(1);
  const all=groups.flatMap(g=>selectMenu(menu,g.id,'',''));expect(new Set(all.map(i=>i.id)).size).toBe(menu.length);
  expect(all.filter(i=>!realPhoto(i)).length).toBeGreaterThan(0);
 });
 it('searches the whole menu without accents even while another group is selected',()=>{
  expect(normalize('PHỞ BÒ ĐẬU')).toBe('pho bo dau');
  expect(selectMenu(menu,'napoje','','pho')).toEqual(menu.filter(i=>normalize(`${i.name} ${i.description} ${i.category}`).includes('pho')));
  const missing=menu.find(i=>!realPhoto(i))!;expect(selectMenu(menu,'sushi','',missing.name).some(i=>i.id===missing.id)).toBe(true);
 });
 it('keeps subcategories scoped and avoids treating placeholders as dish photos',()=>{
  const category=groups[4].categories[0];expect(selectMenu(menu,'sushi',category,'').every(i=>i.category===category)).toBe(true);
  expect(groupFor(category)).toBe('sushi');expect(realPhoto({...menu[0],id:'unknown',image:'/food-bowl.svg'})).toBeNull();
 });
 it('preserves existing cart format and counts configured option prices',()=>{
  const item={...menu[0],options:[{id:'side',name:'Príloha',required:true,choices:[{id:'rice',name:'Ryža',priceCents:150}]}]};
  expect(unitPrice(item,{side:'rice'})).toBe(item.priceCents+150);
  const line={id:menu[0].id,quantity:2,choices:{}};expect(readCart(JSON.stringify([line,{id:'x',quantity:-1,choices:{}},null]))).toEqual([line]);expect(readCart('broken')).toEqual([]);
 });
});
