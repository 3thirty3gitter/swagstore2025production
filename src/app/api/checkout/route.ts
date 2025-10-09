import { NextRequest, NextResponse } from 'next/server';
import { SquareClient } from 'square';
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
    const { sourceId, amount, currency, tenantSlug } = await request.json();

    console.log('Payment request:', { sourceId, amount, currency, tenantSlug });

    // Get Square settings from Firestore
    const settingsDoc = await adminDb.collection('settings').doc('payment').get();
    
    if (!settingsDoc.exists) {
      return NextResponse.json({ error: 'Payment settings not configured' }, { status: 500 });
    }

    const { square: squareSettings } = settingsDoc.data() as any;

    if (!squareSettings || !squareSettings.enabled) {
      return NextResponse.json({ error: 'Square payment not enabled' }, { status: 500 });
    }

    console.log('Square settings:', {
      environment: squareSettings.environment,
      locationId: squareSettings.locationId,
      hasAccessToken: !!squareSettings.accessToken,
    });

    // Set the correct base URL based on environment
    const baseUrl = squareSettings.environment === 'production' 
      ? 'https://connect.squareup.com'
      : 'https://connect.squareupsandbox.com';

    // Initialize Square client with correct base URL
    const client = new SquareClient({
      token: squareSettings.accessToken,
      baseUrl: baseUrl,
    });

    console.log('Square client initialized with baseUrl:', baseUrl);

    // Create payment
    const paymentRequest = {
      sourceId,
      idempotencyKey: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
      amountMoney: {
        amount: BigInt(Math.round(amount * 100)),
        currency: currency || 'CAD',
      },
      locationId: squareSettings.locationId,
    };

    console.log('Creating payment with:', JSON.stringify(paymentRequest, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));

    const response = await client.payments.create(paymentRequest);

    console.log('Payment successful:', response.payment?.id);

    return NextResponse.json({
      success: true,
      payment: {
        id: response.payment?.id,
        status: response.payment?.status,
        amount: response.payment?.amountMoney?.amount?.toString(),
      },
    });
  } catch (error: any) {
    console.error('Payment error:', error);
    console.error('Error message:', error.message);
    
    // Check for Square-specific errors
    if (error.errors && error.errors.length > 0) {
      const squareError = error.errors[0];
      console.error('Square API error:', squareError);
      
      // Provide helpful error messages
      if (squareError.code === 'UNAUTHORIZED') {
        return NextResponse.json(
          { 
            error: 'Payment authorization failed. Please verify your Square access token and permissions.',
            details: 'Check Admin > Settings > Payment'
          },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { error: squareError.detail || 'Payment processing failed' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Payment processing failed' },
      { status: 500 }
    );
  }
}
