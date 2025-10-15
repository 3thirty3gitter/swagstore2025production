import { NextRequest, NextResponse } from 'next/server';
import { getRedis, APPROVED_TENANTS_KEY } from '@/lib/redis';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('x-debug-token');
    if (!process.env.DEBUG_API_TOKEN || token !== process.env.DEBUG_API_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const redis = getRedis();
    const raw = await redis.lrange(APPROVED_TENANTS_KEY, 0, -1);
    const parsed = raw.map((r: string) => {
      try { return JSON.parse(r); } catch { return r; }
    });
    return NextResponse.json({ ok: true, items: parsed });
  } catch (e: any) {
    console.error('Debug approved tenants error', e);
    return NextResponse.json({ ok: false, error: e.message || 'unknown' }, { status: 500 });
  }
}
