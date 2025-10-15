import { NextRequest, NextResponse } from 'next/server'
import { getRedis, TENANT_KEY } from '@/lib/redis'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const tenantId = params.id
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
    
    const tenant = tenants.find((t: any) => t.id === tenantId)
    
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }
    
    return NextResponse.json({ tenant })
  } catch (e) {
    console.error('Failed to fetch tenant details:', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
