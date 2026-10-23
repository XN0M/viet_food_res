import { z } from 'zod';
export const orderInput=z.object({
  customerName:z.string().trim().min(2).max(100),phone:z.string().trim().regex(/^\+?[0-9 ()-]{7,22}$/),
  fulfillment:z.enum(['PICKUP','DELIVERY']),paymentMethod:z.enum(['CASH','CARD']),
  pickupAt:z.string().datetime().optional(),
  address:z.object({street:z.string().trim().min(2).max(100),house:z.string().trim().min(1).max(20),city:z.string().trim().min(2).max(100),postal:z.string().trim().regex(/^\d{3}\s?\d{2}$/)}).optional(),
  note:z.string().trim().max(500).default(''),
  lines:z.array(z.object({id:z.string().max(100),quantity:z.number().int().min(1).max(30),choices:z.record(z.string().max(100)).default({})})).min(1).max(40),
  idempotencyKey:z.string().uuid(),termsAccepted:z.literal(true),quoteSignature:z.string().length(64).optional()
}).superRefine((v,c)=>{
  if(v.fulfillment==='PICKUP'&&!v.pickupAt)c.addIssue({code:'custom',message:'Vyberte čas vyzdvihnutia.'});
  if(v.fulfillment==='DELIVERY'&&(!v.address||v.paymentMethod!=='CASH'))c.addIssue({code:'custom',message:'Pri doručení vyplňte adresu a zvoľte hotovosť.'});
});
export const settingsInput=z.object({
  restaurantName:z.string().trim().min(2).max(100),address:z.string().trim().min(5).max(200),phone:z.string().max(30),
  latitude:z.number().min(-90).max(90).nullable(),longitude:z.number().min(-180).max(180).nullable(),
  paused:z.boolean(),openingHour:z.number().int().min(0).max(22),closingHour:z.number().int().min(1).max(23),
  closedDays:z.array(z.number().int().min(0).max(6)).max(7),
  packagingMode:z.enum(['UNCONFIRMED','NONE','PER_ORDER','PER_ITEM']),packagingCents:z.number().int().min(0).max(10000),packagingApplies:z.enum(['BOTH','PICKUP','DELIVERY']),
  orderEmail:z.string().email().max(200),managerEmail:z.string().email().max(200),
  contentApproved:z.boolean(),businessInfo:z.string().max(3000),termsText:z.string().max(8000),privacyText:z.string().max(8000),retentionDays:z.number().int().min(7).max(3650)
}).refine(v=>v.closingHour>v.openingHour,'Nesprávne otváracie hodiny.');
