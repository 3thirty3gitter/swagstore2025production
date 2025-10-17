import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

// Initialize Firebase Admin
function getAdminApp() {
  if (getApps().length === 0) {
    return initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }
  return getApps()[0];
}

const adminDb = getFirestore(getAdminApp());

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();

    console.log('Creating order:', {
      tenantSlug: orderData.tenantSlug,
      total: orderData.total,
      itemCount: orderData.items?.length,
    });

    // Add server timestamp
    const orderWithTimestamp = {
      ...orderData,
      createdAt: FieldValue.serverTimestamp(),
    };

    // Create order in Firestore
    const docRef = await adminDb.collection('orders').add(orderWithTimestamp);

    console.log('Order created successfully:', docRef.id);

    return NextResponse.json({
      success: true,
      orderId: docRef.id,
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Failed to create order' 
      },
      { status: 500 }
    );
  }
}
