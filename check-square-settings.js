const admin = require('firebase-admin');

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function checkSquareSettings() {
  try {
    const settingsDoc = await db.collection('settings').doc('payment').get();
    
    if (!settingsDoc.exists) {
      console.log('❌ No payment settings found');
      console.log('💡 You need to configure Square in Admin > Settings > Payment');
      return;
    }

    const data = settingsDoc.data();
    const square = data?.square;

    if (!square) {
      console.log('❌ No Square configuration found');
      console.log('💡 You need to configure Square in Admin > Settings > Payment');
      return;
    }

    console.log('✅ Square Configuration Found:');
    console.log('   Enabled:', square.enabled);
    console.log('   Environment:', square.environment);
    console.log('   Application ID:', square.applicationId ? `${square.applicationId.substring(0, 15)}...` : 'NOT SET');
    console.log('   Access Token:', square.accessToken ? 'SET (hidden)' : 'NOT SET');
    console.log('   Location ID:', square.locationId || 'NOT SET');

    if (!square.enabled) {
      console.log('\n⚠️  Square is configured but NOT ENABLED');
      console.log('💡 Enable it in Admin > Settings > Payment');
    } else if (!square.applicationId || !square.accessToken || !square.locationId) {
      console.log('\n⚠️  Square is enabled but missing required fields');
      console.log('💡 Complete the configuration in Admin > Settings > Payment');
    } else {
      console.log('\n✅ Square is fully configured and ready!');
      console.log(`🧪 Test mode: ${square.environment === 'sandbox' ? 'YES (use test cards)' : 'NO (live payments)'}`);
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    process.exit(0);
  }
}

checkSquareSettings();
