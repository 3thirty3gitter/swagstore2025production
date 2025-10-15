import { NextRequest, NextResponse } from 'next/server'
import { getRedis, TENANT_KEY, APPROVED_TENANTS_KEY } from '@/lib/redis'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tenantId, ...updatedData } = body

    if (!tenantId) {
      return NextResponse.json({ success: false, error: 'Missing tenantId' }, { status: 400 })
    }

    const redis = getRedis()
    const pendingRaw = await redis.lrange(TENANT_KEY, 0, -1)
    const pending = pendingRaw
      .map((item: any) => (typeof item === 'string' ? JSON.parse(item) : item))
      .filter(Boolean)

    const original = pending.find((t: any) => t.id === tenantId)
    if (!original) {
      return NextResponse.json({ success: false, error: 'Tenant not found' }, { status: 404 })
    }

    const now = new Date().toISOString()
    const storeName = updatedData.storeName || original.storeName || original.name || ''
    const rawSub = updatedData.subdomain || original.subdomain || storeName
    const subdomain = rawSub ? rawSub.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim() : ''

    const normalized = {
      id: original.id,
      storeName,
      subdomain,
      status: 'active',
      isActive: true,
      contact: {
        name: updatedData.contactName || original.contactName || original.contact?.name || '',
        email: updatedData.contactEmail || original.contactEmail || original.contact?.email || '',
        phone: updatedData.contactPhone ?? original.contactPhone ?? original.contact?.phone ?? '',
      },
      org: {
        teamType: updatedData.teamType || original.teamType || (original.org && original.org.teamType) || '',
        city: updatedData.city || original.city || (original.org && original.org.city) || '',
        province: updatedData.province || original.province || (original.org && original.org.province) || '',
        teamSize: updatedData.teamSize || original.teamSize || (original.org && original.org.teamSize) || '',
      },
      commerce: {
        expectedVolume: updatedData.expectedVolume || original.expectedVolume || (original.commerce && original.commerce.expectedVolume) || '',
        urgency: updatedData.urgency || original.urgency || (original.commerce && original.commerce.urgency) || '',
      },
      assets: {
        logoUrl: updatedData.logoUrl !== undefined ? updatedData.logoUrl : (original.assets?.logoUrl || original.logoUrl || ''),
      },
      meta: {
        submittedAt: original.meta?.submittedAt || original.submittedAt || now,
        approvedAt: now,
        createdAt: original.meta?.createdAt || original.createdAt || now,
        updatedAt: now,
      },
    }

    const pushed = await redis.lpush(APPROVED_TENANTS_KEY, JSON.stringify(normalized))
    if (!pushed || pushed <= 0) {
      console.error('LPUSH failed for approved tenants', pushed)
      return NextResponse.json({ success: false, error: 'Failed to write approved tenant' }, { status: 500 })
    }

    const remaining = pending.filter((t: any) => t.id !== tenantId).map((t: any) => JSON.stringify(t))
    await redis.del(TENANT_KEY)
    if (remaining.length > 0) {
      await redis.rpush(TENANT_KEY, ...remaining)
    }

    console.log('TENANT APPROVED:', normalized.storeName)
    return NextResponse.json({ success: true, tenant: normalized })
  } catch (e: any) {
    console.error('Approve error:', e)
    return NextResponse.json({ success: false, error: e?.message || 'Server error' }, { status: 500 })
  }
}
