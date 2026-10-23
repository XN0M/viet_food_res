'use client';
import {useEffect,useState} from 'react';
import {Minus,Plus,X} from 'lucide-react';
import {useShop} from './ShopContext';
import {DishPhoto} from './DishPhoto';
import {useDialog} from '../useDialog';
import {money} from '@/lib/domain';
import {unitPrice} from '@/lib/menu-presentation';
export function DishDialog(){
 const {selected,setSelected,data,add}=useShop();const [choices,setChoices]=useState<Record<string,string>>({}),[quantity,setQuantity]=useState(1);
 useEffect(()=>{setChoices({});setQuantity(1);},[selected?.id]);
 useDialog(!!selected,()=>setSelected(null));if(!selected)return null;
 const item=data?.items.find(i=>i.id===selected.id)??selected;
 const incomplete=item.options.some(g=>g.required&&!choices[g.id]);
 return <div className="vf-overlay" onClick={()=>setSelected(null)}><section className="vf-sheet vf-dish-sheet" role="dialog" aria-modal="true" aria-labelledby="vf-dish-title" onClick={e=>e.stopPropagation()}><div className="vf-sheet-top"><span className="vf-eyebrow">DETAIL JEDLA</span><button className="vf-icon" aria-label="Zavrieť detail" onClick={()=>setSelected(null)}><X/></button></div><div className="vf-dish-details"><DishPhoto item={item} className="vf-detail-photo"/><p className="vf-eyebrow">{item.category}</p><h2 id="vf-dish-title">{item.name}</h2><div className="vf-detail-meta"><strong>{money(item.priceCents)}</strong>{item.portion&&<span>{item.portion}</span>}</div>{item.description&&<p className="vf-description">{item.description}</p>}<div className="vf-allergens"><h3>Alergény</h3><p>{item.allergens.length?item.allergens.join(' · '):'Informácie o alergénoch vám poskytne obsluha.'}</p></div>{item.options.map(g=><fieldset className="vf-option-group" key={g.id}><legend>{g.name} {g.required&&<span>· povinný výber</span>}</legend>{!g.required&&<label><input type="radio" name={g.id} checked={!choices[g.id]} onChange={()=>setChoices(old=>{const next={...old};delete next[g.id];return next;})}/>Bez výberu</label>}{g.choices.map(c=><label key={c.id}><input type="radio" name={g.id} checked={choices[g.id]===c.id} onChange={()=>setChoices({...choices,[g.id]:c.id})}/><span>{c.name}</span><small>{c.priceCents?`+ ${money(c.priceCents)}`:'V cene'}</small></label>)}</fieldset>)}</div><div className="vf-detail-actions"><div className="vf-quantity"><button aria-label="Znížiť počet porcií" disabled={quantity<=1} onClick={()=>setQuantity(q=>q-1)}><Minus size={16}/></button><span>{quantity}</span><button aria-label="Zvýšiť počet porcií" disabled={quantity>=30} onClick={()=>setQuantity(q=>q+1)}><Plus size={16}/></button></div><button className="vf-button" disabled={!item.available||incomplete} onClick={()=>add(item,choices,quantity)}>{item.available?'Pridať do košíka':'Vypredané'} <span>{money(unitPrice(item,choices)*quantity)}</span></button>{incomplete&&<small>Najprv vyberte povinnú prílohu.</small>}</div></section></div>;
}
