import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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
    const formData = await request.json();
    
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

    // Add to tenants collection as pending (server-side with admin privileges)
    const docRef = await addDoc(collection(db, 'tenants'), pendingTenant);
    
    // Also keep the original store-requests collection for backwards compatibility
    await addDoc(collection(db, 'store-requests'), {
      ...formData,
      submittedAt: new Date(),
      status: 'converted-to-tenant',
      tenantId: docRef.id
    });

    return NextResponse.json({
      success: true,
      tenantId: docRef.id,
      storeUrl: `${subdomain}.swagstore.ca`
    });

  } catch (error) {
    console.error('Server error submitting store request:', error);
    
    return NextResponse.json(
      { error: 'Failed to submit store request' },
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
