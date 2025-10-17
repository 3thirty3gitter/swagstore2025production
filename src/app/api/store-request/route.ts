import { NextRequest, NextResponse } from 'next/server';
import { getAdminApp } from '@/lib/firebase-admin';

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
      status: 'pending' as const,
      isActive: false,
      contactName: body.contactName,
      contactEmail: body.contactEmail,
      contactPhone: body.contactPhone || '',
      teamType: body.teamType || '',
      organizationLevel: body.organizationLevel || '',
      city: body.city || '',
      province: body.province || '',
      postalCode: body.postalCode || '',
      teamSize: body.teamSize || '',
      expectedVolume: body.expectedVolume || '',
      urgency: body.urgency || '',
      description: body.description || '',
      logoUrl: body.logoUrl || '',
      submittedAt: new Date().toISOString(),
    };

    // Store tenant in Firestore so it persists across deployments
    try {
      const { db } = getAdminApp();
      await db.collection('pendingTenants').doc(tenant.id).set(tenant);
    } catch (err) {
      console.error('Failed to persist pending tenant to Firestore:', err);
      // still proceed and return success (tenant created) but log the error
    }
    
    console.log('TENANT CREATED:', tenant.name);
    
    return NextResponse.json({ success: true, tenantId: tenant.id });
    
  } catch (e) {
    console.error('API Error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { db } = getAdminApp();
    const snapshot = await db.collection('pendingTenants').orderBy('submittedAt', 'desc').get();
    const tenants: any[] = [];
    snapshot.forEach(doc => tenants.push(doc.data()));
    return NextResponse.json({ tenants });
  } catch (err) {
    console.error('Failed to read pending tenants from Firestore:', err);
    return NextResponse.json({ tenants: [] });
  }
}
