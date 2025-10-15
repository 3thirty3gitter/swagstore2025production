import { NextRequest, NextResponse } from 'next/server'
import { getRedis, TENANT_KEY } from '@/lib/redis'

export const dynamic = 'force-dynamic'

const APPROVED_TENANTS_KEY = 'approved_tenants'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tenantId, ...updatedData } = body
    
    if (!tenantId || !updatedData.storeName || !updatedData.contactEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
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
    
    const tenant = tenants.find((t: any) => t.id === tenantId)
    
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }
    
    const approvedTenant = {
      ...tenant,
      ...updatedData,
      status: 'approved',
      isActive: true,
      approvedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    }
    
    await redis.lpush(APPROVED_TENANTS_KEY, JSON.stringify(approvedTenant))
    
    const remainingTenants = tenants.filter((t: any) => t.id !== tenantId)
    
    await redis.del(TENANT_KEY)
    if (remainingTenants.length > 0) {
      const tenantStringsToAdd = remainingTenants.map(t => JSON.stringify(t))
      await redis.lpush(TENANT_KEY, ...tenantStringsToAdd)
    }
    
    console.log('TENANT APPROVED:', approvedTenant.storeName)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Tenant approved successfully',
      tenant: approvedTenant
    })
    
  } catch (e: any) {
    console.error('Failed to approve tenant:', e)
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 })
  }
}
