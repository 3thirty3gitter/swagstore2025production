import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.teamName || !body.contactName || !body.contactEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const slug = body.teamName.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim();
    
    // Store in simple format for now - will add KV later
    const tenant = {
      id: `tenant_${Date.now()}`,
      name: body.teamName,
      storeName: body.teamName,
      slug,
      subdomain: slug,
      status: 'pending',
      contactName: body.contactName,
      contactEmail: body.contactEmail,
      contactPhone: body.contactPhone || '',
      teamType: body.teamType || '',
      city: body.city || '',
      province: body.province || '',
      logoUrl: body.logoUrl || '',
      submittedAt: new Date().toISOString(),
    };

    // Log for now
    console.log('TENANT CREATED:', JSON.stringify(tenant, null, 2));
    
    return NextResponse.json({ success: true, tenantId: tenant.id });
    
  } catch (e) {
    console.error('API Error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
