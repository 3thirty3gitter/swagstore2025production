import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

function generateSlug(teamName: string): string {
  return teamName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

let db: ReturnType<typeof getFirestore> | null = null;

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
  const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  db = getFirestore(app);
  return db;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();

    // Validate required fields
    if (!formData.teamName || !formData.contactName || !formData.contactEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const slug = generateSlug(formData.teamName);

    const pendingTenant = {
      name: formData.teamName,
      storeName: formData.teamName,
      slug,
      subdomain: slug,
      status: 'pending',
      isActive: false,

      // Contact
      contactName: formData.contactName,
      contactEmail: formData.contactEmail,
      contactPhone: formData.contactPhone || '',

      // Team
      teamType: formData.teamType || '',
      organizationLevel: formData.organizationLevel || '',

      // Location
      city: formData.city || '',
      province: formData.province || '',
      postalCode: formData.postalCode || '',

      // Details
      teamSize: formData.teamSize || '',
      expectedVolume: formData.expectedVolume || '',
      urgency: formData.urgency || '',
      description: formData.description || '',

      // Assets
      logoUrl: formData.logoUrl || '',

      submittedAt: new Date(),
      createdAt: new Date(),
    };

    const db = getDb();

    // Create tenant doc
    const ref = await addDoc(collection(db, 'tenants'), pendingTenant);

    // Optional: also log raw request
    await addDoc(collection(db, 'store-requests'), { ...formData, tenantId: ref.id, submittedAt: new Date(), status: 'pending' });

    return NextResponse.json({ success: true, tenantId: ref.id, subdomain: `${slug}.swagstore.ca` });
  } catch (error) {
    console.error('store-request error', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Store request API is working' });
}
