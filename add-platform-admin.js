// This creates YOU as the platform admin (not tenant self-registration)
const admin = require('firebase-admin');

// Initialize with your existing Firebase project
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: "store-hub-1ty89"
    // Use Application Default Credentials or service account
  });
}

async function addPlatformAdmin() {
  try {
    const db = admin.firestore();
    
    // Get the Firebase Auth UID for admin@example.com
    const userRecord = await admin.auth().getUserByEmail('admin@example.com');
    console.log('Found user UID:', userRecord.uid);
    
    // Add to admin collection
    await db.collection('admins').doc(userRecord.uid).set({
      email: 'admin@example.com',
      role: 'admin',
      isPlatformAdmin: true, // Platform owner flag
      createdAt: new Date(),
      permissions: {
        manageProducts: true,
        manageTenants: true,
        manageOrders: true,
        manageSwagBucks: true,
        viewAnalytics: true,
        managePlatform: true // Super admin permission
      }
    });
    
    console.log('✅ Platform admin created successfully');
    console.log('You can now access the admin panel with admin@example.com');
    
  } catch (error) {
    console.error('❌ Error creating platform admin:', error);
  }
}

addPlatformAdmin();
