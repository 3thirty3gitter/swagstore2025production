import { NextResponse } from 'next/server'
import { getRedis } from '@/lib/redis'

export const dynamic = 'force-dynamic'

const APPROVED_TENANTS_KEY = 'approved_tenants'

export async function GET() {
  try {
    const redis = getRedis()
    const tenantStrings = await redis.lrange(APPROVED_TENANTS_KEY, 0, -1)
    
    const tenants = tenantStrings.map((item: any) => {
      if (typeof item === 'string') {
        return JSON.parse(item)
      } else if (typeof item === 'object' && item !== null) {
        return item
      } else {
        return null
      }
    }).filter(Boolean)
    
    tenants.sort((a, b) => new Date(b.approvedAt || b.createdAt).getTime() - new Date(a.approvedAt || a.createdAt).getTime())
    
    return NextResponse.json({ tenants })
  } catch (e) {
    console.error('Failed to fetch approved tenants:', e)
    return NextResponse.json({ tenants: [] })
  }
}
