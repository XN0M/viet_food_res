'use client';
import {useEffect} from 'react';
export function useDialog(open:boolean,close:()=>void){
 useEffect(()=>{
  if(!open)return;const previous=document.activeElement as HTMLElement|null;const dialog=document.querySelector<HTMLElement>('[role="dialog"]');if(!dialog)return;
  const controls=()=>Array.from(dialog.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input, select, textarea, [tabindex="0"]')).filter(e=>e.offsetParent!==null);
  controls()[0]?.focus();const before=document.body.style.overflow;document.body.style.overflow='hidden';
  const key=(e:KeyboardEvent)=>{if(e.key==='Escape'){e.preventDefault();close()}if(e.key==='Tab'){const list=controls();const first=list[0],last=list.at(-1);if(!list.length){e.preventDefault();return;}if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}};
  document.addEventListener('keydown',key);return()=>{document.removeEventListener('keydown',key);document.body.style.overflow=before;previous?.focus()};
 },[open]);
}
