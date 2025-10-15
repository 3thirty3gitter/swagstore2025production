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
    const storeName = updatedData.storeName || original.storeName || original.name
    const subdomain = (updatedData.subdomain || original.subdomain || storeName || '')
      .toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim()

    const normalized = {
      id: original.id,
      storeName,
      subdomain,
      status: 'active',
      isActive: true,
      contact: {
        name: updatedData.contactName || original.contactName || '',
        email: updatedData.contactEmail || original.contactEmail || '',
        phone: updatedData.contactPhone ?? original.contactPhone ?? '',
      },
      org: {
        teamType: updatedData.teamType || original.teamType || '',
        city: updatedData.city || original.city || '',
        province: updatedData.province || original.province || '',
        teamSize: updatedData.teamSize || original.teamSize || '',
      },
      commerce: {
        expectedVolume: updatedData.expectedVolume || original.expectedVolume || '',
        urgency: updatedData.urgency || original.urgency || '',
      },
      assets: {
        logoUrl: updatedData.logoUrl || original.logoUrl || '',
      },
      meta: {
        submittedAt: original.submittedAt || now,
        approvedAt: now,
        createdAt: original.createdAt || now,
        updatedAt: now,
      },
    }

    await redis.lpush(APPROVED_TENANTS_KEY, JSON.stringify(normalized))

    const remaining = pending.filter((t: any) => t.id !== tenantId)
    await redis.del(TENANT_KEY)
    if (remaining.length > 0) {
      await redis.lpush(TENANT_KEY, ...remaining.map((t: any) => JSON.stringify(t)))
    }

    console.log('TENANT APPROVED:', normalized.storeName)

    return NextResponse.json({ success: true, tenant: normalized })
  } catch (e: any) {
    console.error('Approve error:', e)
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 })
  }
}
