const admin = require('firebase-admin');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: "store-hub-1ty89"
  });
}

async function createPlatformAdmin() {
  try {
    const db = admin.firestore();
    
    // Your specific admin UID
    const adminUID = 'GcGeEteUlpe09rTUD7lCOmAyZhu1';
    
    // Create your admin document in Firestore
    await db.collection('admins').doc(adminUID).set({
      email: 'admin@example.com',
      role: 'admin',
      isPlatformAdmin: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      permissions: {
        manageProducts: true,
        manageTenants: true,
        manageOrders: true,
        manageSwagBucks: true,
        viewAnalytics: true,
        managePlatform: true
      }
    });
    
    console.log('✅ Platform admin created successfully!');
    console.log('UID: GcGeEteUlpe09rTUD7lCOmAyZhu1');
    console.log('Email: admin@example.com');
    console.log('You now have full admin access to SwagStore platform!');
    
  } catch (error) {
    console.error('❌ Error creating platform admin:', error);
  }
}

createPlatformAdmin();
