import { NextRequest, NextResponse } from 'next/server';
import { getAdminApp } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    const { db } = getAdminApp();
    const tenantsSnapshot = await db.collection('tenants').get();
    
    const tenants = tenantsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ tenants }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching tenants:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch tenants' },
      { status: 500 }
    );
  }
}
