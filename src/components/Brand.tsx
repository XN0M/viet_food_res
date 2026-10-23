import { Soup } from 'lucide-react';
export function Brand({dark=false}:{dark?:boolean}){return <a href="/" className={`brand ${dark?'brand-dark':''}`} aria-label="VietFood – domov"><span className="brand-icon"><Soup size={29}/></span><span>VietFood<small>DOLNÝ ŠTÁL</small></span></a>}
