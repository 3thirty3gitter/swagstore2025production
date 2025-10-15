import { NextRequest, NextResponse } from 'next/server'
import { getRedis, TENANT_KEY, APPROVED_TENANTS_KEY } from '@/lib/redis'

export const dynamic = 'force-dynamic'

// Use shared key from lib/redis; keep local const for backward compatibility

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
        // If the client explicitly sends logoUrl (even empty string), respect that
        // so we don't accidentally inherit a base64 blob from the original pending
        // submission. Use updatedData.logoUrl when it's !== undefined, otherwise
        // fall back to the original value.
        logoUrl: (updatedData.logoUrl !== undefined)
          ? updatedData.logoUrl
          : (original.logoUrl || ''),
      },
      meta: {
        submittedAt: original.submittedAt || now,
        approvedAt: now,
        createdAt: original.createdAt || now,
        updatedAt: now,
      },
    }

    // Push to approved list and ensure write succeeded
    const pushResult = await redis.lpush(APPROVED_TENANTS_KEY, JSON.stringify(normalized))
    if (!pushResult || Number(pushResult) <= 0) {
      console.error('Approve: LPUSH to approved_tenants returned unexpected result', pushResult)
      return NextResponse.json({ error: 'Failed to persist approved tenant' }, { status: 500 })
    }

    // Safely rewrite pending list without mutating the in-memory objects
    const remaining = pending.filter((t: any) => t.id !== tenantId)
    try {
      await redis.del(TENANT_KEY)
      if (remaining.length > 0) {
        await redis.lpush(TENANT_KEY, ...remaining.map((t: any) => JSON.stringify(t)))
      }
    } catch (err) {
      // Log but don't fail the approval (we already persisted approved tenant)
      console.error('Approve: failed to rewrite pending list', err)
    }

    console.log('TENANT APPROVED:', normalized.storeName, 'id=', normalized.id)

    return NextResponse.json({ success: true, tenant: normalized })
  } catch (e: any) {
    console.error('Approve error:', e)
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 })
  }
}
