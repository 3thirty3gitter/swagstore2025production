import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.teamName || !body.contactName || !body.contactEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const slug = body.teamName.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim();
    const tenantId = `tenant_${Date.now()}`;
    
    const tenant = {
      id: tenantId,
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
    };

    // Store in Vercel KV
    await kv.set(`pending:${tenantId}`, tenant);
    await kv.lpush('pending_tenants', tenantId);
    
    return NextResponse.json({ success: true, tenantId });
    
  } catch (e) {
    console.error('API Error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const pendingIds = await kv.lrange('pending_tenants', 0, -1);
    const tenants = [];
    
    for (const id of pendingIds) {
      const tenant = await kv.get(`pending:${id}`);
      if (tenant) tenants.push(tenant);
    }
    
    return NextResponse.json({ tenants });
  } catch (e) {
    return NextResponse.json({ tenants: [] });
  }
}
