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
    
    const pendingRaw = await redis.lrange(TENANT_KEY, 0, -1)
    const pending = pendingRaw
      .map((item: any) => (typeof item === 'string' ? JSON.parse(item) : item))
      .filter(Boolean)

    const original = pending.find((t: any) => t.id === tenantId)
    if (!original) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }

    const now = new Date().toISOString()
    const approvedTenant = {
      ...original,
      ...updatedData,
      name: updatedData.storeName || original.storeName || original.name,
      storeName: updatedData.storeName || original.storeName || original.name,
      subdomain: updatedData.subdomain || original.subdomain,
      contactName: updatedData.contactName || original.contactName,
      contactEmail: updatedData.contactEmail || original.contactEmail,
      contactPhone: updatedData.contactPhone ?? original.contactPhone ?? '',
      status: 'active',
      isActive: true,
      approvedAt: now,
      createdAt: original.createdAt || now,
    }

    await redis.lpush(APPROVED_TENANTS_KEY, JSON.stringify(approvedTenant))

    const remaining = pending.filter((t: any) => t.id !== tenantId)
    await redis.del(TENANT_KEY)
    if (remaining.length > 0) {
      await redis.lpush(TENANT_KEY, ...remaining.map((t: any) => JSON.stringify(t)))
    }

    console.log('TENANT APPROVED:', approvedTenant.storeName)

    return NextResponse.json({ success: true, tenant: approvedTenant })
  } catch (e: any) {
    console.error('Approve error:', e)
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 })
  }
}
