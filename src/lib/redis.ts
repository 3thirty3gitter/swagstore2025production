import { Redis } from '@upstash/redis';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  var __UPSTASH_REDIS_CLIENT__: any;
}

export const TENANT_KEY = 'pending_tenants';
export const APPROVED_TENANTS_KEY = 'approved_tenants';

export function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    throw new Error('Missing Upstash Redis environment variables');
  }

  if (!global.__UPSTASH_REDIS_CLIENT__) {
    global.__UPSTASH_REDIS_CLIENT__ = new Redis({ url, token });
  }
  return global.__UPSTASH_REDIS_CLIENT__ as Redis;
}
