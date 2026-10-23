const grid=document.getElementById('dish-grid');
const dialog=document.getElementById('dish-dialog');
let opener;
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
let motionRequested=true;
const runningMotion=new Set();
const revealTargets=new Set();
const motionAllowed=()=>motionRequested&&!reducedMotion.matches;
function animate(element,keyframes,options){
 if(!motionAllowed()||typeof element.animate!=='function')return null;
 const animation=element.animate(keyframes,options);runningMotion.add(animation);
 animation.finished.catch(()=>{}).finally(()=>runningMotion.delete(animation));return animation;
}
function enter(element){
 if(element.dataset.motionEntered)return;
 element.dataset.motionEntered='true';
 animate(element,[{opacity:.2,transform:'translateY(18px)'},{opacity:1,transform:'translateY(0)'}],{duration:620,delay:Number(element.dataset.motionDelay??0),easing:'cubic-bezier(.22,1,.36,1)'});
}
const revealObserver='IntersectionObserver' in window?new IntersectionObserver(entries=>{
 for(const entry of entries)if(entry.isIntersecting){enter(entry.target);revealObserver.unobserve(entry.target);}
},{threshold:.12}):null;
function reveal(element,delay=0){
 element.dataset.motionDelay=String(delay);revealTargets.add(element);
 if(revealObserver)revealObserver.observe(element);else enter(element);
}
function updateMotion(){
 const allowed=motionAllowed();document.documentElement.classList.toggle('motion-off',!allowed);
 const toggle=document.getElementById('motion-toggle');toggle.setAttribute('aria-pressed',String(allowed));toggle.disabled=reducedMotion.matches;
 toggle.textContent=reducedMotion.matches?'Pohyb: obmedzený':allowed?'Pohyb: zapnutý':'Pohyb: vypnutý';
 document.getElementById('motion-replay').disabled=!allowed;
 if(!allowed){for(const animation of runningMotion)animation.cancel();runningMotion.clear();}
}
document.getElementById('motion-toggle').addEventListener('click',()=>{motionRequested=!motionRequested;updateMotion();});
document.getElementById('motion-replay').addEventListener('click',()=>{
 for(const target of revealTargets){delete target.dataset.motionEntered;if(revealObserver){revealObserver.unobserve(target);revealObserver.observe(target);}else enter(target);}
});
reducedMotion.addEventListener('change',updateMotion);
updateMotion();
const money=value=>new Intl.NumberFormat('sk-SK',{style:'currency',currency:'EUR'}).format(value/100);
const element=(tag,className,text)=>{const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node;};
function showDish(item,button){
 opener=button;const content=document.getElementById('dialog-content');content.replaceChildren();
 const image=element('img');image.src=item.image;image.alt=item.name;content.append(image);
 const heading=element('h2','',item.name);heading.id='dialog-title';content.append(heading,element('p','',`${money(item.priceCents)}${item.portion?' · '+item.portion:''}`));
 if(item.description)content.append(element('p','',item.description));
 content.append(element('small','',item.allergens.join(' ')));
 const link=element('a','button-primary','Prejsť na objednávanie ↗');link.href='http://localhost:3000/#menu';content.append(link,element('small','','Ukážka vzhľadu detailu. Objednávky sa v tomto návrhu neodosielajú.'));
 dialog.showModal();
 animate(dialog,[{opacity:.45,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:250,easing:'ease-out'});
}
function render(category='all'){
 for(const card of grid.children){revealObserver?.unobserve(card);revealTargets.delete(card);}
 grid.replaceChildren();
 let index=0;
 for(const item of window.previewMenu.filter(item=>category==='all'||item.group===category)){
  const card=element('article','dish');const button=element('button','dish-image');button.type='button';button.setAttribute('aria-label',`Detail: ${item.name}`);
  const image=element('img');image.src=item.image;image.alt=item.name;image.loading='lazy';image.width=380;image.height=280;
  const arrow=element('span','','↗');arrow.setAttribute('aria-hidden','true');button.append(image,arrow);button.addEventListener('click',()=>showDish(item,button));
  const heading=element('div','dish-heading');heading.append(element('h3','',item.name),element('span','dish-price',money(item.priceCents)));
  const meta=element('div','dish-meta');meta.append(element('span','',item.label),element('span','',item.portion));
  card.append(button,heading,meta,element('p','dish-description',item.caption));grid.append(card);
  reveal(card,(index++%3)*75);
 }
}
document.querySelectorAll('[data-category]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-category]').forEach(other=>other.setAttribute('aria-pressed',String(other===button)));render(button.dataset.category);}));
let photoRevision=0,currentPhoto='sushi',photoAnimation;
document.querySelectorAll('[data-photo]').forEach(button=>button.addEventListener('click',async()=>{
 const revision=++photoRevision;photoAnimation?.cancel();
 const target=button.dataset.photo;if(target===currentPhoto)return;
 const pho=target==='pho';const source=pho?'/menu/dolny-stal/ae46052a238e9b5e65d82f6b.webp':'/menu/dolny-stal/d3a99c0a9ecbaa6d44890ed7.webp';
 const ready=new Image();ready.src=source;
 try{await ready.decode();}catch{return;}
 if(revision!==photoRevision)return;
 const image=document.getElementById('hero-image');
 photoAnimation=animate(image,[{opacity:1},{opacity:0}],{duration:140,easing:'ease-out',fill:'forwards'});
 if(photoAnimation)await photoAnimation.finished.catch(()=>{});
 if(revision!==photoRevision)return;
 image.src=source;image.classList.toggle('pho',pho);image.alt=pho?'Phở Bò z menu VietFood':'Mori Set z menu VietFood';
 document.getElementById('hero-name').textContent=pho?'Phở Bò':'Mori Set';document.getElementById('hero-type').textContent=pho?'VIETNAMSKÁ KUCHYŇA':'SUSHI COLLECTION';
 currentPhoto=target;photoAnimation?.cancel();
 photoAnimation=animate(image,[{opacity:0,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:330,easing:'ease-out'});
 document.querySelectorAll('[data-photo]').forEach(other=>other.setAttribute('aria-pressed',String(other===button)));
}));
document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>opener?.focus());dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});
render();
Array.from(document.querySelector('.hero-copy').children).forEach((element,index)=>reveal(element,index*65));
reveal(document.querySelector('.hero-photo'),160);
document.querySelectorAll('.service-line>div,.section-top,.story-photo,.story-copy,.visit>div').forEach(element=>reveal(element));
