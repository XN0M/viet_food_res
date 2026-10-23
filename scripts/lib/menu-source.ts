import { load } from 'cheerio';

export const BRANCH_KEY='br_64a07613';
export const BRANCH_ADDRESS='Pri jazere 1, 930 10 Dolný Štál';
export type ImportedItem={id:string;name:string;description:string;category:string;priceCents:number;portion:string;allergens:string[];image:string;sort:number;active:boolean;available:boolean;options:{id:string;name:string;required:boolean;choices:{id:string;name:string;priceCents:number}[]}[]};
export type SourceItem={item:ImportedItem;sourceId:string;sourceUrl:string;sourceName:string;categorySlug:string;categoryRaw:string;imageUrls:string[];priceBasis:string;review:string[]};
export function normalizedName(value:string){return value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/^(?:s\s*)?\d+[.)]?\s*/,'').replace(/\([^)]*\)/g,'').replace(/\b\d+(?:[.,]\d+)?\s*(?:ks|g|ml|l)\b/g,'').replace(/[^a-z0-9]+/g,' ').trim();}
export function parseOfficialMenu(html:string,sourceUrl:string):{items:SourceItem[];excluded:{id:string;name:string;reason:string}[]}{
 const $=load(html);const match=html.match(/var\s+mcnBranch\s*=\s*(\{[\s\S]*?\});/);
 if(!match)throw new Error('Branch configuration missing');
 const cfg=JSON.parse(match[1]);
 if(!String(cfg.branches?.[BRANCH_KEY]).includes(BRANCH_ADDRESS))throw new Error('Branch identity mismatch');
 const hidden=new Set<string>(cfg.hidden_cats?.[BRANCH_KEY]??[]);
 for(const cat of [...hidden])for(const child of cfg.cat_children?.[cat]??[])hidden.add(child);
 const items:SourceItem[]=[];const excluded:{id:string;name:string;reason:string}[]=[];
 $('.js-menu-section').each((_,section)=>{
  const categorySlug=$(section).attr('data-section-cat')??'';
  const categoryRaw=$(section).find('h2').first().text().replace(/\s+/g,' ').trim();
  const category=categoryRaw.replace(/\s*\([^)]*\)/g,'').replace(/\b\d+\s*(?:ml|g)\b/gi,'').replace(/(?:\d+\*\s*,?\s*)+/g,'').trim();
  $(section).find('.js-product-card').each((_,element)=>{
   const el=$(element);const sourceId=el.attr('data-id')??'';const sourceName=el.attr('data-name')??el.find('.p-denne-list_name').text();
   const name=sourceName.replace(/\s+/g,' ').trim();
   if(!/^\d+$/.test(sourceId)||!name)throw new Error('Missing product identity');
   const prices=JSON.parse(el.attr('data-branch-prices')||'{}');
   const adjustments=JSON.parse(el.attr('data-branch-cat-adjs')||'{}');
   const explicit=Object.hasOwn(prices,BRANCH_KEY);
   const price=(explicit?Number(prices[BRANCH_KEY]):Number(el.attr('data-base-price'))+Number(adjustments[BRANCH_KEY]??0))+Number(cfg.global_adj??0)+Number(cfg.branch_adjs?.[BRANCH_KEY]??0);
   const cats=(el.attr('data-cat-slugs')??categorySlug).split(',');
   if(hidden.has(categorySlug)||cats.some(c=>hidden.has(c))||(explicit&&Number(prices[BRANCH_KEY])===0)){
    excluded.push({id:sourceId,name,reason:'Not offered in Dolný Štál according to branch rules'});return;
   }
   if(!Number.isFinite(price)||price<=0){excluded.push({id:sourceId,name,reason:'Missing or zero source price'});return;}
   const description=el.find('.p-denne-list_desc').text().replace(/\s+/g,' ').trim();
   const portion=(name+' '+description+' '+categoryRaw).match(/\b\d+(?:[.,]\d+)?\s*(?:ml|g|ks|l)\b/i)?.[0]??'';
   const codes=[...new Set(categoryRaw.match(/\d+\*/g)??[])];
   const allergens=codes.length?[`Údaj pôvodného menu: ${codes.join(', ')}. Význam a úplnosť alergénov musí potvrdiť prevádzka.`]:['Údaj o alergénoch ešte musí potvrdiť prevádzka.'];
   const choices=JSON.parse(el.attr('data-options')||'[]');
   if(!Array.isArray(choices)||choices.some(c=>typeof c!=='string'))throw new Error('Unsupported option format');
   const alcoholic=['pivo','vino-02l'].includes(categorySlug);
   items.push({sourceId,sourceUrl,sourceName:name,categorySlug,categoryRaw,imageUrls:el.find('img').map((_,img)=>$(img).attr('src')??'').get().filter(Boolean),priceBasis:explicit?'explicit branch price':'base price + branch/category adjustments, per branch.js',review:['Price, recipe, portion and allergens require restaurant review',...(alcoholic?['Alcohol retained as inactive draft; age checks are outside this release']:[])],item:{id:`vf-${sourceId}`,name,description,category,priceCents:Math.round(price*100),portion,allergens,image:'/food-placeholder.svg',sort:items.length,active:!alcoholic,available:!alcoholic,options:choices.length?[{id:'side',name:'Príloha',required:true,choices:choices.map((name,index)=>({id:`side-${index+1}`,name,priceCents:0}))}]:[]}});
  });
 });
 if(!items.length)throw new Error('No menu extracted');
 if(new Set(items.map(x=>x.sourceId)).size!==items.length)throw new Error('Duplicate source product IDs');
 return {items,excluded};
}
export function parseWoltMenu(html:string){
 const $=load(html);
 if(!$('h1').first().text().includes('VietFood Dolný Štál'))throw new Error('Wolt branch identity mismatch');
 const text=$('script[type="application/json"]').filter((_,el)=>$(el).text().length>100000).first().text();
 const state=JSON.parse(text);
 const data=state.queries.map((q:{state:{data:unknown}})=>q.state.data).find((d:{items?:unknown[];categories?:unknown[]})=>Array.isArray(d?.items)&&Array.isArray(d?.categories));
 if(!data)throw new Error('Wolt menu payload missing');
 const categories=new Map<string,string>();
 for(const cat of data.categories)for(const id of cat.item_ids??[])categories.set(id,cat.name);
 return data.items.map((item:{id:string;name:string;description:string;price:number;alcohol_permille:number;images:{url:string}[]})=>({id:item.id,name:item.name,description:item.description,priceCents:item.price,category:categories.get(item.id)??'',alcoholic:item.alcohol_permille>0,imageUrls:item.images.map(i=>i.url)}));
}
