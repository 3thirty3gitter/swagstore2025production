import { NextResponse } from 'next/server'
import { getRedis, APPROVED_TENANTS_KEY, TENANT_KEY as PENDING_TENANTS_KEY } from '@/lib/redis'

export const dynamic = 'force-dynamic'

function flatten(tenant: any) {
  if (!tenant) return null

  // Handle both nested canonical schema and flat legacy schema
  return {
    id: tenant.id,
    storeName: tenant.storeName || tenant.name || '',
    subdomain: tenant.subdomain || tenant.slug || '',
    status: tenant.status || 'active',
    isActive: tenant.isActive ?? (tenant.status === 'active'),
    contactName: tenant.contact?.name || tenant.contactName || '',
    contactEmail: tenant.contact?.email || tenant.contactEmail || '',
    contactPhone: tenant.contact?.phone || tenant.contactPhone || '',
    teamType: tenant.org?.teamType || tenant.teamType || '',
    city: tenant.org?.city || tenant.city || '',
    province: tenant.org?.province || tenant.province || '',
    teamSize: tenant.org?.teamSize || tenant.teamSize || '',
    expectedVolume: tenant.commerce?.expectedVolume || tenant.expectedVolume || '',
    urgency: tenant.commerce?.urgency || tenant.urgency || '',
    logoUrl: tenant.assets?.logoUrl || tenant.logoUrl || '',
    submittedAt: tenant.meta?.submittedAt || tenant.submittedAt || '',
    approvedAt: tenant.meta?.approvedAt || tenant.approvedAt || '',
    createdAt: tenant.meta?.createdAt || tenant.createdAt || '',
    updatedAt: tenant.meta?.updatedAt || tenant.updatedAt || '',
  }
}

function parseRawList(raw: any[]) {
  return raw
    .map((item: any) => {
      if (typeof item === 'string') {
        try {
          return JSON.parse(item)
        } catch (err) {
          return null
        }
      } else if (typeof item === 'object' && item !== null) {
        return item
      }
      return null
    })
    .filter(Boolean)
}

export async function GET() {
  try {
    const redis = getRedis()

    // Read approved list first
  const approvedRaw = await redis.lrange(APPROVED_TENANTS_KEY, 0, -1)
    let approved = parseRawList(approvedRaw)

    // If approved list is empty, try to fall back to pending list and include any items that look approved
    if ((!approved || approved.length === 0)) {
  const pendingRaw = await redis.lrange(PENDING_TENANTS_KEY, 0, -1)
  const pending = parseRawList(pendingRaw)
      // Treat any pending item with status 'active' or isActive true as approved fallback
      approved = pending.filter((t: any) => (t?.status === 'active' || t?.isActive === true))
    }

    // Sort newest approved first by approvedAt/createdAt fallback
    approved.sort((a: any, b: any) => {
      const aDate = new Date(a?.meta?.approvedAt || a?.approvedAt || a?.meta?.createdAt || a?.createdAt || 0).getTime()
      const bDate = new Date(b?.meta?.approvedAt || b?.approvedAt || b?.meta?.createdAt || b?.createdAt || 0).getTime()
      return bDate - aDate
    })

    const tenants = approved.map(flatten).filter(Boolean)

    return NextResponse.json({ tenants })
  } catch (e) {
    console.error('Tenants read error:', e)
    return NextResponse.json({ tenants: [] })
  }
}
