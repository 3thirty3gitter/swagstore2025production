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

export async function POST(request: NextRequest) {
  try {
    const { square, stripe } = await request.json();

    console.log('Saving payment settings:', { 
      hasSquare: !!square, 
      hasStripe: !!stripe 
    });

    // Get existing settings first
    const settingsRef = adminDb.collection('settings').doc('payment');
    const existingDoc = await settingsRef.get();
    const existingData = existingDoc.exists ? existingDoc.data() : {};

    // Merge new settings with existing ones
    const updatedData: any = { ...existingData };
    
    if (square !== undefined) {
      updatedData.square = square;
    }
    
    if (stripe !== undefined) {
      updatedData.stripe = stripe;
    }

    // Save to Firestore
    await settingsRef.set(updatedData, { merge: true });

    console.log('Payment settings saved successfully');

    return NextResponse.json({
      success: true,
      message: 'Settings saved successfully',
    });
  } catch (error: any) {
    console.error('Error saving payment settings:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Failed to save settings' 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const settingsDoc = await adminDb.collection('settings').doc('payment').get();
    
    if (!settingsDoc.exists) {
      return NextResponse.json({
        success: true,
        data: {
          square: { enabled: false },
          stripe: { enabled: false },
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: settingsDoc.data(),
    });
  } catch (error: any) {
    console.error('Error loading payment settings:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Failed to load settings' 
      },
      { status: 500 }
    );
  }
}
