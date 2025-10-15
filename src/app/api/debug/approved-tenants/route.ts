import { NextResponse } from 'next/server'
import { getRedis } from '@/lib/redis'

// Protected debug route to LRANGE the 'approved_tenants' list and return JSON.
// Protect with DEBUG_API_TOKEN env var passed in header 'x-debug-token'.

export async function GET(request: Request) {
  const token = process.env.DEBUG_API_TOKEN
  const header = request.headers.get('x-debug-token')
  if (!token || header !== token) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  try {
    const redis = getRedis()
    // LRANGE approved_tenants 0 -1
    const raw = await (redis.lrange as any)('approved_tenants', 0, -1)
    // raw may be an array of strings or null
    const parsed = Array.isArray(raw)
      ? raw.map((s: string) => {
          try {
            return JSON.parse(s)
          } catch (e) {
            return s
          }
        })
      : []

    return NextResponse.json({ tenants: parsed })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 })
  }
}
