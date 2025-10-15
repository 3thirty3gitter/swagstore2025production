import { NextResponse } from 'next/server'
import { getRedis, TENANT_KEY } from '@/lib/redis'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const redis = getRedis()
    const tenantStrings = await redis.lrange(TENANT_KEY, 0, -1)
    
    const tenants = tenantStrings.map((item: any) => {
      if (typeof item === 'string') {
        return JSON.parse(item)
      } else if (typeof item === 'object' && item !== null) {
        return item
      } else {
        return null
      }
    }).filter(Boolean)
    
    return NextResponse.json({ tenants })
  } catch (e) {
    console.error('Admin API: Failed to fetch tenants:', e)
    return NextResponse.json({ tenants: [] })
  }
}
