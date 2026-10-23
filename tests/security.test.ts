import {afterEach,describe,expect,it} from 'vitest';
import {clientIp} from '../src/lib/security';

const original=process.env.TRUST_PROXY;
afterEach(()=>{if(original===undefined)delete process.env.TRUST_PROXY;else process.env.TRUST_PROXY=original});

describe('client IP used for rate limiting',()=>{
 it('uses one local bucket without trusted proxy mode',()=>{
  process.env.TRUST_PROXY='false';
  expect(clientIp({headers:new Headers({'cf-connecting-ip':'203.0.113.7'})})).toBe('local');
 });
 it('uses the Render edge IP and ignores a forged forwarded chain',()=>{
  process.env.TRUST_PROXY='render';
  expect(clientIp({headers:new Headers({'cf-connecting-ip':'203.0.113.7','x-forwarded-for':'198.51.100.9, 203.0.113.7'})})).toBe('203.0.113.7');
 });
});
