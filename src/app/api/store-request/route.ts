import { NextRequest, NextResponse } from 'next/server'
import { getRedis, TENANT_KEY } from '@/lib/redis'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!body.teamName || !body.contactName || !body.contactEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const slug = body.teamName.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim()
    
    const tenant = {
      id: `tenant_${Date.now()}`,
      name: body.teamName,
      storeName: body.teamName,
      slug,
      subdomain: slug,
      status: 'pending',
      isActive: false,
      contactName: body.contactName,
      contactEmail: body.contactEmail,
      contactPhone: body.contactPhone || '',
      teamType: body.teamType || '',
      city: body.city || '',
      province: body.province || '',
      teamSize: body.teamSize || '',
      expectedVolume: body.expectedVolume || '',
      urgency: body.urgency || '',
      description: body.description || '',
      logoUrl: body.logoUrl || '',
      submittedAt: new Date().toISOString(),
    }

    const redis = getRedis()
    await redis.lpush(TENANT_KEY, JSON.stringify(tenant))
    
    console.log('TENANT CREATED:', tenant.name)
    
    return NextResponse.json({ success: true, tenantId: tenant.id })
    
  } catch (e: any) {
    console.error('API POST Error:', e)
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const redis = getRedis()
    const tenantStrings = await redis.lrange(TENANT_KEY, 0, -1)
    
    const tenants = tenantStrings.map((item: any) => {
      // Handle both string and already-parsed object cases
      if (typeof item === 'string') {
        return JSON.parse(item)
      } else if (typeof item === 'object' && item !== null) {
        return item
      } else {
        console.error('Unexpected item type:', typeof item, item)
        return null
      }
    }).filter(Boolean) // Remove any null entries
    
    return NextResponse.json({ tenants })
  } catch (e) {
    console.error('GET: Redis fetch error:', e)
    return NextResponse.json({ tenants: [] })
  }
}
