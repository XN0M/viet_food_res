import type { Metadata } from 'next';
import './globals.css';
import './customer.css';
import {CustomerRoot} from '@/components/customer/CustomerShell';
export const metadata:Metadata={title:'VietFood · Dolný Štál',description:'Vietnamská kuchyňa v Dolnom Štále. Objednajte si na vyzdvihnutie alebo dovoz.',robots:process.env.APP_ENV==='live'?{index:true,follow:true}:{index:false,follow:false}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="sk"><body><CustomerRoot>{children}</CustomerRoot></body></html>}
