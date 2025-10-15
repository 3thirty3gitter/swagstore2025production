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

    console.log('TENANT OBJECT:', JSON.stringify(tenant, null, 2))
    console.log('REDIS KEY:', TENANT_KEY)
    
    const redis = getRedis()
    console.log('Redis client created')
    
    const result = await redis.lpush(TENANT_KEY, JSON.stringify(tenant))
    console.log('LPUSH RESULT:', result)
    
    // Verify it was stored
    const verification = await redis.lrange(TENANT_KEY, 0, 0)
    console.log('VERIFICATION (first item):', verification)
    
    console.log('TENANT CREATED:', tenant.name)
    
    return NextResponse.json({ success: true, tenantId: tenant.id })
    
  } catch (e: any) {
    console.error('API POST Error:', e)
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    console.log('GET: Starting fetch from Redis')
    console.log('GET: REDIS KEY:', TENANT_KEY)
    
    const redis = getRedis()
    console.log('GET: Redis client created')
    
    const tenantStrings = await redis.lrange(TENANT_KEY, 0, -1)
    console.log('GET: Raw tenant strings from Redis:', tenantStrings)
    console.log('GET: Number of items:', tenantStrings.length)
    
    const tenants = tenantStrings.map((str: any) => {
      console.log('GET: Parsing:', str)
      return JSON.parse(str as string)
    })
    
    console.log('GET: Parsed tenants:', tenants)
    console.log('GET: Returning', tenants.length, 'tenants')
    
    return NextResponse.json({ tenants })
  } catch (e) {
    console.error('GET: Redis fetch error:', e)
    return NextResponse.json({ tenants: [] })
  }
}
