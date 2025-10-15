import { NextResponse } from 'next/server'
import { getRedis, APPROVED_TENANTS_KEY, TENANT_KEY } from '@/lib/redis'

export const dynamic = 'force-dynamic'

function flatten(tenant: any) {
  if (!tenant) return null
  
  // Handle both nested canonical schema and flat legacy schema
  return {
    id: tenant.id,
    storeName: tenant.storeName,
    subdomain: tenant.subdomain,
    status: tenant.status,
    isActive: tenant.isActive,
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

export async function GET() {
  try {
    const redis = getRedis()
    const raw = await redis.lrange(APPROVED_TENANTS_KEY, 0, -1)
    
    console.log('Raw approved tenants from Redis:', raw.length, 'items')

    const canonical = raw
      .map((item: any) => {
        let parsed
        if (typeof item === 'string') {
          parsed = JSON.parse(item)
        } else if (typeof item === 'object' && item !== null) {
          parsed = item
        } else {
          return null
        }
        console.log('Parsed tenant:', parsed.storeName, parsed.id)
        return parsed
      })
      .filter(Boolean)

    // Sort newest approved first
    canonical.sort((a: any, b: any) => {
      const aDate = new Date(a?.meta?.approvedAt || a?.approvedAt || a?.meta?.createdAt || a?.createdAt || 0).getTime()
      const bDate = new Date(b?.meta?.approvedAt || b?.approvedAt || b?.meta?.createdAt || b?.createdAt || 0).getTime()
      return bDate - aDate
    })

    const tenants = canonical.map(flatten).filter(Boolean)
    
    console.log('Flattened tenants for UI:', tenants.length, 'items')
    console.log('First tenant sample:', tenants[0])

    return NextResponse.json({ tenants })
  } catch (e) {
    console.error('Tenants read error:', e)
    return NextResponse.json({ tenants: [] })
  }
}
