import { Redis } from '@upstash/redis'

export const TENANT_KEY = 'pending_tenants'

function assertEnv() {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) {
    throw new Error('Upstash Redis environment variables are missing')
  }
  return { url, token }
}

let client: Redis | null = null

export function getRedis(): Redis {
  if (client) return client
  const { url, token } = assertEnv()
  client = new Redis({ url, token })
  return client
}
