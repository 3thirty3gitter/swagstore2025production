import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, getFirestore } from 'firebase/firestore';
import { initializeApp, getApps, cert } from 'firebase/app';

// Server-side Firebase initialization
let app;
let db;

try {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  db = getFirestore(app);
} catch (error) {
  console.error('Firebase initialization error:', error);
}

// Generate slug from team name
function generateSlug(teamName: string): string {
  return teamName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

export async function POST(request: NextRequest) {
  try {
    console.log('API endpoint called');
    
    if (!db) {
      console.error('Firebase not initialized');
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    const formData = await request.json();
    console.log('Form data received:', formData);
    
    // Validate required fields
    if (!formData.teamName || !formData.contactName || !formData.contactEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate slug and subdomain
    const slug = generateSlug(formData.teamName);
    const subdomain = slug;

    // Create pending tenant with all form data
    const pendingTenant = {
      name: formData.teamName,
      slug: slug,
      subdomain: subdomain,
      storeName: formData.teamName,
      status: 'pending',
      isActive: false,
      
      // Contact information
      contactName: formData.contactName,
      contactEmail: formData.contactEmail,
      contactPhone: formData.contactPhone || '',
      
      // Team information
      teamType: formData.teamType || '',
      organizationLevel: formData.organizationLevel || '',
      
      // Location
      city: formData.city || '',
      province: formData.province || '',
      postalCode: formData.postalCode || '',
      
      // Store details
      teamSize: formData.teamSize || '',
      expectedVolume: formData.expectedVolume || '',
      urgency: formData.urgency || '',
      description: formData.description || '',
      
      // Logo
      logoUrl: formData.logoUrl || '',
      
      // Timestamps
      submittedAt: new Date(),
      createdAt: new Date(),
    };

    console.log('Creating tenant document...');

    // Add to tenants collection as pending (server-side with admin privileges)
    const docRef = await addDoc(collection(db, 'tenants'), pendingTenant);
    console.log('Tenant created with ID:', docRef.id);
    
    // Also keep the original store-requests collection for backwards compatibility
    await addDoc(collection(db, 'store-requests'), {
      ...formData,
      submittedAt: new Date(),
      status: 'converted-to-tenant',
      tenantId: docRef.id
    });

    console.log('Store request backup created');

    return NextResponse.json({
      success: true,
      tenantId: docRef.id,
      storeUrl: `${subdomain}.swagstore.ca`
    });

  } catch (error) {
    console.error('Server error submitting store request:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to submit store request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Allow CORS for the form
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
