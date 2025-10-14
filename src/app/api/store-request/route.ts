import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// Initialize Firebase once
let db: any = null;

function getDb() {
  if (db) return db;
  
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  db = getFirestore(app);
  return db;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.teamName || !body.contactName || !body.contactEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const slug = body.teamName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();

    // Create pending tenant in Firestore
    const tenantData = {
      name: body.teamName,
      storeName: body.teamName,
      slug: slug,
      subdomain: slug,
      status: 'pending',
      isActive: false,
      
      // Contact info
      contactName: body.contactName,
      contactEmail: body.contactEmail,
      contactPhone: body.contactPhone || '',
      
      // Team details
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
      
      // Timestamps
      submittedAt: new Date(),
      createdAt: new Date(),
    };

    const db = getDb();
    const tenantRef = await addDoc(collection(db, 'tenants'), tenantData);
    
    // Also log to store-requests for backup
    await addDoc(collection(db, 'store-requests'), {
      ...body,
      tenantId: tenantRef.id,
      submittedAt: new Date(),
      status: 'pending'
    });

    console.log('✅ Pending tenant created:', tenantRef.id);

    return NextResponse.json({
      success: true,
      message: 'Request received successfully',
      tenantId: tenantRef.id,
      subdomain: `${slug}.swagstore.ca`,
    });
  } catch (err) {
    console.error('❌ API Error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Store request API working', timestamp: new Date().toISOString() });
}
