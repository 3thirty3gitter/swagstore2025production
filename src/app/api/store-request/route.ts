import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory storage (will persist during server lifecycle)
let pendingTenants: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.teamName || !body.contactName || !body.contactEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const slug = body.teamName.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim();
    
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
    };

    // Store tenant
    pendingTenants.push(tenant);
    
    console.log('TENANT CREATED:', tenant.name);
    
    return NextResponse.json({ success: true, tenantId: tenant.id });
    
  } catch (e) {
    console.error('API Error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ tenants: pendingTenants });
}
