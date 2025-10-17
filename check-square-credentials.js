const admin = require('firebase-admin');

// Check if admin is already initialized
if (!admin.apps.length) {
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function checkSquareCredentials() {
  try {
    console.log('🔍 Checking Square credentials in Firestore...\n');
    
    const settingsDoc = await db.collection('settings').doc('payment').get();
    
    if (!settingsDoc.exists) {
      console.log('❌ No payment settings document found');
      console.log('💡 The document may not have been created yet');
      return;
    }

    const data = settingsDoc.data();
    console.log('📄 Payment settings document exists');
    
    if (!data.square) {
      console.log('❌ No Square configuration in document');
      console.log('💡 Square settings were not saved');
      return;
    }

    const square = data.square;
    
    console.log('✅ Square Configuration Found:\n');
    console.log('   Enabled:', square.enabled);
    console.log('   Environment:', square.environment);
    console.log('   Application ID:', square.applicationId ? `${square.applicationId.substring(0, 20)}...` : 'NOT SET');
    console.log('   Access Token:', square.accessToken ? `${square.accessToken.substring(0, 10)}... (${square.accessToken.length} chars)` : 'NOT SET');
    console.log('   Location ID:', square.locationId || 'NOT SET');

    console.log('\n📊 Validation:');
    
    if (!square.enabled) {
      console.log('   ⚠️  Square is DISABLED - Enable it in admin settings');
    } else {
      console.log('   ✅ Square is ENABLED');
    }
    
    if (!square.applicationId) {
      console.log('   ❌ Application ID is missing');
    } else {
      console.log('   ✅ Application ID is set');
    }
    
    if (!square.accessToken) {
      console.log('   ❌ Access Token is missing');
    } else {
      console.log('   ✅ Access Token is set');
    }
    
    if (!square.locationId) {
      console.log('   ❌ Location ID is missing');
    } else {
      console.log('   ✅ Location ID is set');
    }

    const isFullyConfigured = square.enabled && square.applicationId && square.accessToken && square.locationId;
    
    console.log('\n🎯 Status:', isFullyConfigured ? '✅ FULLY CONFIGURED' : '⚠️  INCOMPLETE CONFIGURATION');
    
    if (!isFullyConfigured) {
      console.log('\n💡 Next steps:');
      console.log('   1. Go to https://swagstore.ca/admin/settings');
      console.log('   2. Enable Square toggle');
      console.log('   3. Fill in all required fields');
      console.log('   4. Click "Save Square Settings"');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

checkSquareCredentials();
