import { NextRequest, NextResponse } from 'next/server';
import { getRedis, TENANT_KEY, APPROVED_TENANTS_KEY } from '@/lib/redis';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenantId, ...updated } = body;

    if (!tenantId || typeof tenantId !== 'string') {
      return NextResponse.json({ success: false, error: 'tenantId required' }, { status: 400 });
    }

    const redis = getRedis();
    const raw = await redis.lrange(TENANT_KEY, 0, -1);
    const parsed = raw.map((r: string) => {
      try { return JSON.parse(r); } catch { return null; }
    }).filter(Boolean);

    const original = parsed.find((t: any) => t.id === tenantId);
    if (!original) {
      return NextResponse.json({ success: false, error: 'tenant not found' }, { status: 404 });
    }

    const normalized = {
      ...original,
      ...updated,
      approvedAt: new Date().toISOString(),
      // prefer explicit logoUrl provided by admin (including empty string) so we don't persist base64
      assets: {
        ...(original.assets || {}),
        logoUrl: updated?.logoUrl !== undefined ? updated.logoUrl : original?.assets?.logoUrl || '',
      },
    };

    const pushed = await redis.lpush(APPROVED_TENANTS_KEY, JSON.stringify(normalized));
    if (!pushed || pushed <= 0) {
      console.error('LPUSH failed for approved tenants', pushed);
      return NextResponse.json({ success: false, error: 'failed to write approved tenant' }, { status: 500 });
    }

    // rewrite pending list without the approved tenant
    try {
      const remaining = parsed.filter((t: any) => t.id !== tenantId).map((t: any) => JSON.stringify(t));
      // start fresh: delete key and re-add remaining in same order
      await redis.del(TENANT_KEY);
      if (remaining.length > 0) {
        await redis.rpush(TENANT_KEY, ...remaining);
      }
    } catch (e) {
      console.error('Failed to rewrite pending tenants', e);
      // Not fatal — approved tenant exists; continue
    }

    return NextResponse.json({ success: true, id: tenantId });
  } catch (e: any) {
    console.error('Approve tenant error', e);
    return NextResponse.json({ success: false, error: e.message || 'unknown error' }, { status: 500 });
  }
}
