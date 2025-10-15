import { NextRequest, NextResponse } from 'next/server'
import { getRedis, TENANT_KEY } from '@/lib/redis'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tenantId } = body
    
    if (!tenantId) {
      return NextResponse.json({ error: 'Missing tenant ID' }, { status: 400 })
    }

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
    
    const remainingTenants = tenants.filter((t: any) => t.id !== tenantId)
    
    if (remainingTenants.length === tenants.length) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }
    
    await redis.del(TENANT_KEY)
    if (remainingTenants.length > 0) {
      const tenantStringsToAdd = remainingTenants.map(t => JSON.stringify(t))
      await redis.lpush(TENANT_KEY, ...tenantStringsToAdd)
    }
    
    console.log('TENANT REJECTED:', tenantId)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Tenant rejected successfully'
    })
    
  } catch (e: any) {
    console.error('Failed to reject tenant:', e)
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 })
  }
}
