const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    projectId: "store-hub-1ty89"
  });
}

async function updateVohonSubdomain() {
  try {
    const db = admin.firestore();
    
    // Update existing Vohon tenant to add subdomain field
    await db.collection('tenants').doc('vohon').update({
      subdomain: 'vohon', // Add this field for vohon.swagstore.ca
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log('✅ Vohon tenant updated with subdomain support!');
    console.log('🌐 Now supports: vohon.swagstore.ca');
    
  } catch (error) {
    console.error('❌ Error updating Vohon tenant:', error);
  }
}

updateVohonSubdomain();
