'use client';
import {createContext,useCallback,useContext,useEffect,useRef,useState,type ReactNode} from 'react';
import {api} from '@/lib/client';
import {readCart,unitPrice,type CartLine,type MenuData,type MenuItem} from '@/lib/menu-presentation';

type Shop = {data:MenuData|null;error:string;loading:boolean;refresh:()=>void;cart:CartLine[];count:number;total:number;save:(lines:CartLine[])=>void;add:(item:MenuItem,choices?:Record<string,string>,quantity?:number)=>void;selected:MenuItem|null;setSelected:(item:MenuItem|null)=>void;cartOpen:boolean;setCartOpen:(open:boolean)=>void;toast:string;menuHref:string;rememberMenu:(href:string)=>void};
const ShopContext=createContext<Shop|null>(null);
export function useShop(){const value=useContext(ShopContext);if(!value)throw new Error('Shop provider missing');return value;}
export function ShopProvider({children}:{children:ReactNode}){
 const [data,setData]=useState<MenuData|null>(null),[error,setError]=useState(''),[loading,setLoading]=useState(true);
 const [cart,setCart]=useState<CartLine[]>([]),[selected,setSelected]=useState<MenuItem|null>(null),[cartOpen,setCartOpen]=useState(false),[toast,setToast]=useState(''),[menuHref,setMenuHref]=useState('/menu');
 const cartRef=useRef<CartLine[]>([]),requestRef=useRef(0);
 const save=useCallback((lines:CartLine[])=>{cartRef.current=lines;setCart(lines);try{localStorage.setItem('vf_cart',JSON.stringify(lines));}catch{/* Cart remains usable in memory when storage is unavailable. */}},[]);
 const refresh=useCallback(()=>{const request=++requestRef.current;setLoading(true);setError('');api<MenuData>('menu').then(menu=>{if(request!==requestRef.current)return;setData(menu);const ids=new Set(menu.items.map(i=>i.id));save(cartRef.current.filter(line=>ids.has(line.id)));}).catch(e=>{if(request===requestRef.current)setError(e.message);}).finally(()=>{if(request===requestRef.current)setLoading(false);});},[save]);
 useEffect(()=>{try{const saved=readCart(localStorage.getItem('vf_cart'));cartRef.current=saved;setCart(saved);const href=sessionStorage.getItem('vf_menu_return');if(href?.startsWith('/menu?')||href==='/menu')setMenuHref(href);}catch{}refresh();const update=()=>refresh();window.addEventListener('online',update);window.addEventListener('focus',update);return()=>{requestRef.current++;window.removeEventListener('online',update);window.removeEventListener('focus',update);};},[refresh]);
 useEffect(()=>{if(!toast)return;const timer=setTimeout(()=>setToast(''),2600);return()=>clearTimeout(timer);},[toast]);
 const rememberMenu=useCallback((href:string)=>{setMenuHref(href);try{sessionStorage.setItem('vf_menu_return',href);}catch{}},[]);
 const add=(item:MenuItem,choices:Record<string,string>={},quantity=1)=>{
  const live=data?.items.find(i=>i.id===item.id);if(!live?.available){setToast('Toto jedlo už nie je dostupné.');return;}
  if(live.options.some(g=>(g.required&&!choices[g.id])||(choices[g.id]&&!g.choices.some(c=>c.id===choices[g.id])))){setSelected(live);return;}
  const index=cartRef.current.findIndex(l=>l.id===item.id&&Object.keys(l.choices).length===Object.keys(choices).length&&Object.entries(choices).every(([k,v])=>l.choices[k]===v));
  const next=[...cartRef.current];const before=index>=0?next[index].quantity:0;const amount=Math.min(30,before+quantity);
  if(amount===before){setToast('Najviac 30 porcií jedného výberu.');return;}
  if(index>=0)next[index]={...next[index],quantity:amount};else next.push({id:item.id,quantity:amount,choices:{...choices}});
  save(next);setSelected(null);setToast(`Pridané do košíka · ${live.name}`);
 };
 const count=cart.reduce((sum,line)=>sum+line.quantity,0);
 const total=cart.reduce((sum,line)=>{const item=data?.items.find(i=>i.id===line.id);return sum+(item?unitPrice(item,line.choices)*line.quantity:0);},0);
 return <ShopContext.Provider value={{data,error,loading,refresh,cart,count,total,save,add,selected,setSelected,cartOpen,setCartOpen,toast,menuHref,rememberMenu}}>{children}</ShopContext.Provider>;
}
