import { describe,it,expect } from 'vitest';
import { parseOfficialMenu,normalizedName } from '../scripts/lib/menu-source';
const config={branches:{br_64a07613:'Pobočka 2: Pri jazere 1, 930 10 Dolný Štál'},hidden_cats:{br_64a07613:['kids']},cat_children:{},global_adj:0,branch_adjs:{br_64a07613:0}};
const card=(id:string,prices:string,extra='')=>`<div class="js-product-card" data-id="${id}" data-name="${id}. Phở Bò" data-base-price="8" data-branch-prices='${prices}' ${extra}><img src="https://vietfood.sk/photo.png"/></div>`;
const html=(cards:string,category='pho')=>`<script>var mcnBranch = ${JSON.stringify(config)};</script><section class="js-menu-section" data-section-cat="${category}"><h2>PHỞ (900ml) 3*, 5*</h2>${cards}</section>`;
describe('branch menu extraction',()=>{
 it('uses target branch price rather than cached Trnava rendered price',()=>{
  const menu=parseOfficialMenu(html(card('1','{"br_c8389fed":9,"br_64a07613":7.5}')),'source');
  expect(menu.items[0].item.priceCents).toBe(750);
 });
 it('follows original fallback/category adjustment when branch price is absent',()=>{
  const menu=parseOfficialMenu(html(card('1','{"br_c8389fed":9}',`data-branch-cat-adjs='{"br_64a07613":0.5}'`)),'source');
  expect(menu.items[0].item.priceCents).toBe(850);
 });
 it('excludes hidden branch categories and explicitly unavailable products',()=>{
  expect(parseOfficialMenu(html(card('1','{}')+card('2','{"br_64a07613":0}')),'source').items.map(x=>x.sourceId)).toEqual(['1']);
  const result=parseOfficialMenu(html(card('1','{}'))+html(card('2','{}'),'kids'),'source');
  expect(result.excluded.some(x=>x.id==='2')).toBe(true);
 });
 it('preserves source codes without claiming allergy-free or interpreting their meaning',()=>{
  const item=parseOfficialMenu(html(card('1','{}')),'source').items[0].item;
  expect(item.allergens[0]).toContain('3*, 5*');expect(item.allergens[0]).toContain('potvrdiť');expect(item.portion).toBe('900ml');
 });
 it('imports source side choices and rejects branch identity mismatch',()=>{
  const item=parseOfficialMenu(html(card('1','{}',`data-options='["s Ryžou","s Hranolkami"]'`)),'source').items[0].item;
  expect(item.options[0].choices.map(c=>c.name)).toEqual(['s Ryžou','s Hranolkami']);
  expect(()=>parseOfficialMenu(html(card('1','{}')).replace('Pri jazere 1','Wrong address'),'source')).toThrow('identity');
 });
 it('normalizes catalogue names but preserves meat identity',()=>{
  expect(normalizedName('S1. Avokado Maki (Avokádo) 8ks')).toBe(normalizedName('Avokado Maki'));
  expect(normalizedName('Phở Bò')).not.toBe(normalizedName('Phở Gà'));
 });
});
