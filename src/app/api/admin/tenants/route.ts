import { NextResponse } from 'next/server';
import { getRedis, TENANT_KEY, APPROVED_TENANTS_KEY } from '@/lib/redis';

export async function GET() {
  try {
    const redis = getRedis();
    const approvedRaw = await redis.lrange(APPROVED_TENANTS_KEY, 0, -1);
    const approved = approvedRaw.map((r: string) => {
      try { return JSON.parse(r); } catch { return null; }
    }).filter(Boolean);

    if (approved.length > 0) {
      return NextResponse.json(approved);
    }

    // fallback to pending
    const pendingRaw = await redis.lrange(TENANT_KEY, 0, -1);
    const pending = pendingRaw.map((r: string) => {
      try { return JSON.parse(r); } catch { return null; }
    }).filter(Boolean);
    return NextResponse.json(pending);
  } catch (e: any) {
    console.error('Error fetching tenants', e);
    return NextResponse.json([], { status: 500 });
  }
}
