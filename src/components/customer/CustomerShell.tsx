'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useEffect,useState,type ReactNode} from 'react';
import {ArrowUpRight,MapPin,Menu as MenuIcon,Phone,ShoppingBag,X} from 'lucide-react';
import {ShopProvider,useShop} from './ShopContext';
import {Cart} from './Cart';
import {DishDialog} from './DishDialog';
import {useDialog} from '../useDialog';
import {openingText} from '@/lib/menu-presentation';
import {money} from '@/lib/domain';
export function CustomerRoot({children}:{children:ReactNode}){
 const pathname=usePathname();
 if(pathname.startsWith('/admin'))return children;
 return <ShopProvider><CustomerShell>{children}</CustomerShell></ShopProvider>;
}
function CustomerShell({children}:{children:ReactNode}){
 const pathname=usePathname();const {data,cartOpen,setCartOpen,setSelected,count,total,toast,menuHref}=useShop();
 useDialog(cartOpen,()=>setCartOpen(false));
 useEffect(()=>{setCartOpen(false);setSelected(null);},[pathname,setCartOpen,setSelected]);
 const [mobileOpen,setMobileOpen]=useState(false);
 useEffect(()=>setMobileOpen(false),[pathname]);
 const checkout=pathname==='/objednavka';
 return <div className="vf-public"><a className="vf-skip" href="#main-content">Preskočiť na obsah</a><div className="vf-gemini-topbar"><div className="vf-wrap"><span><MapPin size={14}/>{data?.settings.address??"Pri jazere 1, Dolný Štál"}</span><span className="vf-gemini-top-hours">{data&&openingText(data.settings)}</span>{data?.settings.phone&&<a href={`tel:${data.settings.phone}`}><Phone size={14}/>{data.settings.phone}</a>}</div></div><header className="vf-header"><div className="vf-wrap vf-header-inner"><Link className="vf-brand" href="/" aria-label="VietFood – domov"><span className="vf-brand-symbol">♨</span><span className="vf-brand-words">VietFood<small>REŠTAURÁCIA · DOLNÝ ŠTÁL</small></span></Link><nav aria-label="Hlavná navigácia"><Link href="/menu" aria-current={pathname==='/menu'?'page':undefined}>Menu</Link><Link className="vf-nav-extra" href="/#story">O VietFood</Link><Link className="vf-nav-extra" href="/informacie">Kontakt</Link></nav><Link className="vf-header-order" href="/menu">Objednať jedlo</Link><button className="vf-header-cart" aria-label={`Košík, ${count} položiek`} onClick={()=>setCartOpen(true)}><ShoppingBag size={19}/><span>Košík</span><b>{count}</b></button><button className="vf-mobile-nav-button" aria-label="Otvoriť menu" aria-expanded={mobileOpen} onClick={()=>setMobileOpen(!mobileOpen)}><MenuIcon size={22}/></button></div>{mobileOpen&&<nav className="vf-mobile-nav" aria-label="Mobilná navigácia"><Link href="/menu">Jedálny lístok</Link><Link href="/#story">O nás</Link><Link href="/informacie">Kontakt</Link></nav>}</header>{data?.demo&&<div className="vf-demo">Testovacia prevádzka · Menu, ceny a alergény čakajú na schválenie. Nejde o skutočnú objednávku.</div>}<div id="main-content" tabIndex={-1}>{children}</div><footer className="vf-footer"><div className="vf-wrap vf-footer-inner"><div><Link href="/" className="vf-brand">VietFood<span>.</span><small>DOLNÝ ŠTÁL</small></Link><p>Vietnamská kuchyňa & sushi.</p></div><div><span className="vf-eyebrow">NAVŠTÍVTE NÁS</span><p>{data?.settings.address??'Pri jazere 1, Dolný Štál'}</p>{data&&<p>{openingText(data.settings)}</p>}{data?.settings.phone&&<a href={`tel:${data.settings.phone}`}>{data.settings.phone}</a>}</div><div className="vf-footer-links"><Link href="/informacie">Kontakt a doručenie</Link><Link href="/informacie#podmienky">Obchodné podmienky</Link><Link href="/informacie#sukromie">Ochrana súkromia</Link></div></div><div className="vf-wrap vf-footer-bottom"><small>© {new Date().getFullYear()} VietFood Dolný Štál</small><Link href="/admin">Vstup pre personál ↗</Link></div></footer>{count>0&&!cartOpen&&!checkout&&<button className={`vf-mobile-cart ${pathname==='/menu'?'vf-on-menu':''}`} onClick={()=>setCartOpen(true)}><ShoppingBag size={19}/><span>Zobraziť košík ({count})</span><strong>{money(total)}</strong></button>}{cartOpen&&<div className="vf-overlay" onClick={()=>setCartOpen(false)}><aside className="vf-sheet" role="dialog" aria-modal="true" aria-label="Váš košík" onClick={e=>e.stopPropagation()}><div className="vf-sheet-top"><Link href={menuHref} onClick={()=>setCartOpen(false)} className="vf-text-link">Späť na menu <ArrowUpRight size={15}/></Link><button className="vf-icon" aria-label="Zavrieť košík" onClick={()=>setCartOpen(false)}><X/></button></div><Cart/></aside></div>}<DishDialog/>{toast&&<div className="vf-toast" role="status" key={toast}>{toast}</div>}</div>;
}

