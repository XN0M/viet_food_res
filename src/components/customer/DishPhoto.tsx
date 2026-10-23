'use client';
import Image from 'next/image';
import {useState} from 'react';
import {realPhoto,type MenuItem} from '@/lib/menu-presentation';
export function DishPhoto({item,className='',hero=false}:{item:MenuItem;className?:string;hero?:boolean}){
 const src=realPhoto(item);const [broken,setBroken]=useState<string|null>(null);
 if(!src||broken===src)return null;
 return <span className={`vf-photo ${className}`}><Image src={src} alt={item.name} fill sizes={hero?'(max-width: 700px) 90vw, 50vw':className==='vf-thumb'?'88px':'(max-width: 700px) 80vw, 360px'} loading={hero?'eager':'lazy'} onError={()=>setBroken(src)}/></span>;
}
