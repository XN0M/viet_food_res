import { readFile } from 'node:fs/promises';
import { load } from 'cheerio';
for (const path of ['hlavne-menu', 'sushi-menu', 'napoje-menu', 'denne-menu']) {
 const $ = load(await readFile(`.local/menu-source/${path}.html`, 'utf8'));
 console.log(path, 'sections', $('.js-menu-section').map((_,el)=>$(el).find('h2').first().text().trim()).get());
 console.log('sample', $('.js-product-card').first().html());
 console.log('issues', $('.js-product-card').map((_,el)=>{
  const prices=JSON.parse($(el).attr('data-branch-prices')||'{}');
  const price=prices.br_64a07613??Number($(el).attr('data-base-price'));
  return price<=1?{name:$(el).attr('data-name'),price}:null;
 }).get());
}
const $ = load(await readFile('.local/menu-source/wolt.html', 'utf8'));
console.log('wolt scripts', $('script').map((_,el)=>({id:$(el).attr('id'),type:$(el).attr('type'),length:$(el).text().length})).get().filter(x=>x.length>1000));
console.log('wolt sample', $('img').slice(2,5).map((_,el)=>$(el).parent().parent().parent().html().slice(0,1800)).get());
