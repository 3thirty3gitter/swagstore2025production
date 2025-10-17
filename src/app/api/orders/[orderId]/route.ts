import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

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

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;

    console.log('Fetching order:', orderId);

    const orderDoc = await adminDb.collection('orders').doc(orderId).get();

    if (!orderDoc.exists) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Order not found' 
        },
        { status: 404 }
      );
    }

    const orderData = orderDoc.data();
    
    // Convert Firestore timestamp to serializable format
    const serializedOrder = JSON.parse(JSON.stringify({
      id: orderDoc.id,
      ...orderData,
    }));

    console.log('Order found:', orderId);

    return NextResponse.json({
      success: true,
      order: serializedOrder,
    });
  } catch (error: any) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Failed to fetch order' 
      },
      { status: 500 }
    );
  }
}
