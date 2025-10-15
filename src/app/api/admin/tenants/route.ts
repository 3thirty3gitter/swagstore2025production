import { NextResponse } from 'next/server'
import { getRedis } from '@/lib/redis'

export const dynamic = 'force-dynamic'

const APPROVED_TENANTS_KEY = 'approved_tenants'

function flatten(tenant: any) {
  if (!tenant) return null
  return {
    id: tenant.id,
    storeName: tenant.storeName,
    subdomain: tenant.subdomain,
    status: tenant.status,
    isActive: tenant.isActive,
    contactName: tenant.contact?.name || '',
    contactEmail: tenant.contact?.email || '',
    contactPhone: tenant.contact?.phone || '',
    teamType: tenant.org?.teamType || '',
    city: tenant.org?.city || '',
    province: tenant.org?.province || '',
    teamSize: tenant.org?.teamSize || '',
    expectedVolume: tenant.commerce?.expectedVolume || '',
    urgency: tenant.commerce?.urgency || '',
    logoUrl: tenant.assets?.logoUrl || '',
    submittedAt: tenant.meta?.submittedAt || '',
    approvedAt: tenant.meta?.approvedAt || '',
    createdAt: tenant.meta?.createdAt || '',
    updatedAt: tenant.meta?.updatedAt || '',
  }
}

export async function GET() {
  try {
    const redis = getRedis()
    const raw = await redis.lrange(APPROVED_TENANTS_KEY, 0, -1)

    const canonical = raw
      .map((item: any) => (typeof item === 'string' ? JSON.parse(item) : item))
      .filter(Boolean)

    canonical.sort((a: any, b: any) => new Date(b?.meta?.approvedAt || b?.meta?.createdAt || 0).getTime() - new Date(a?.meta?.approvedAt || a?.meta?.createdAt || 0).getTime())

    const tenants = canonical.map(flatten).filter(Boolean)

    return NextResponse.json({ tenants })
  } catch (e) {
    console.error('Tenants read error:', e)
    return NextResponse.json({ tenants: [] })
  }
}
