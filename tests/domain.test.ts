import { describe,it,expect } from 'vitest';
import { deliveryFee,distanceKm,expiration,isOpen,pickupSlots,priceLines,nextStatus,packagingFee } from '../src/lib/domain';
describe('Slovakia service hours and pickup',()=>{
 it('opens at 08:00 and stops at 18:00, local time',()=>{
  expect(isOpen(new Date('2026-10-12T05:59:59Z'))).toBe(false);expect(isOpen(new Date('2026-10-12T06:00:00Z'))).toBe(true);
  expect(isOpen(new Date('2026-10-12T16:00:00Z'))).toBe(false);expect(isOpen(new Date('2026-10-11T10:00:00Z'))).toBe(false);
 });
 it('offers 15-minute slots after 30 minutes and only today + 2 calendar days',()=>{
  const slots=pickupSlots(new Date('2026-10-12T08:01:00Z'));
  expect(slots[0]).toBe('2026-10-12T08:45:00.000Z');expect(slots.at(-1)).toBe('2026-10-14T16:00:00.000Z');
 });
 it('excludes Sunday without extending horizon and honors last pickup',()=>{
  const slots=pickupSlots(new Date('2026-10-10T15:30:00Z'));
  expect(slots[0]).toBe('2026-10-10T16:00:00.000Z');expect(slots.some(s=>s.startsWith('2026-10-11'))).toBe(false);
  expect(slots.at(-1)).toBe('2026-10-12T16:00:00.000Z');
 });
 it('handles daylight saving across the pickup horizon',()=>{
  const slots=pickupSlots(new Date('2026-10-24T10:00:00Z'));expect(slots.at(-1)).toBe('2026-10-26T17:00:00.000Z');
 });
 it('expires at 35 minutes or the earlier pickup',()=>{
  const now=new Date('2026-10-12T10:00:00Z');expect(expiration(now).toISOString()).toBe('2026-10-12T10:35:00.000Z');
  expect(expiration(now,new Date('2026-10-12T10:30:00Z')).toISOString()).toBe('2026-10-12T10:30:00.000Z');
 });
});
describe('pricing and status',()=>{
 it('does not round the 5/8 km boundaries',()=>{expect(deliveryFee(5)).toBe(0);expect(deliveryFee(5.00001)).toBe(300);expect(deliveryFee(8)).toBe(300);expect(deliveryFee(8.00001)).toBeNull();expect(deliveryFee(null)).toBeNull();});
 it('uses straight-line distance',()=>{expect(distanceKm({lat:0,lng:0},{lat:0,lng:1})).toBeCloseTo(111.195,2)});
 it('keeps unconfirmed packaging distinct from zero and counts portions',()=>{expect(packagingFee('UNCONFIRMED',0,'BOTH','PICKUP',2)).toBeNull();expect(packagingFee('PER_ITEM',50,'BOTH','PICKUP',3)).toBe(150);expect(packagingFee('PER_ORDER',50,'DELIVERY','PICKUP',3)).toBe(0)});
 const menu=[{id:'a',name:'Kura',priceCents:800,available:true,options:[{id:'side',name:'Side',required:true,choices:[{id:'rice',name:'Rice',priceCents:100}]}]}];
 it('prices only server-side choices and rejects unavailable/invalid choices',()=>{
  expect(priceLines(menu,[{id:'a',quantity:2,choices:{side:'rice'}}])[0].totalCents).toBe(1800);
  expect(()=>priceLines(menu,[{id:'a',quantity:1,choices:{side:'free'}}])).toThrow();
  expect(()=>priceLines([{...menu[0],available:false}],[{id:'a',quantity:1,choices:{side:'rice'}}])).toThrow();
 });
 it('keeps pickup and delivery progress separate',()=>{expect(nextStatus('PREPARING','DELIVERING','PICKUP')).toBe(false);expect(nextStatus('PREPARING','READY','PICKUP')).toBe(true);expect(nextStatus('PENDING','COMPLETED','DELIVERY')).toBe(false)});
});
