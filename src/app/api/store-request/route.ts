import { NextRequest, NextResponse } from 'next/server';
import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  if (!body.teamName || !body.contactName || !body.contactEmail) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const slug = body.teamName.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim();
  
  const tenant = {
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
    logoUrl: body.logoUrl || '',
    submittedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  await admin.firestore().collection('tenants').add(tenant);
  
  return NextResponse.json({ success: true });
}
