import { NextRequest, NextResponse } from 'next/server'
import { getRedis, TENANT_KEY } from '@/lib/redis'

export const dynamic = 'force-dynamic'

// GET /api/admin/tenants/pending -> list of pending tenants (same as store-request GET)
export async function GET() {
  try {
    const redis = getRedis()
    const items = await redis.lrange(TENANT_KEY, 0, -1)
    const tenants = items.map((it: any) => (typeof it === 'string' ? JSON.parse(it) : it))
    return NextResponse.json({ tenants })
  } catch (e) {
    console.error('admin pending GET error', e)
    return NextResponse.json({ tenants: [] })
  }
}
