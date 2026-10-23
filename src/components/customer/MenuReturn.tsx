'use client';
import Link from 'next/link';
import type {ReactNode} from 'react';
import {useShop} from './ShopContext';
export function MenuReturn({children,className='vf-text-link'}:{children:ReactNode;className?:string}){const {menuHref}=useShop();return <Link className={className} href={menuHref}>{children}</Link>;}
