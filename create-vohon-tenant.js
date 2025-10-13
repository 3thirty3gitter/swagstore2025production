const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    projectId: "store-hub-1ty89"
  });
}

async function createVohonTenant() {
  try {
    const db = admin.firestore();
    
    // Create vohon tenant with subdomain
    await db.collection('tenants').doc('vohon-id').set({
      id: 'vohon-id',
      name: 'Vohon Dance Club',
      slug: 'vohon',
      subdomain: 'vohon', // This enables vohon.swagstore.ca
      storeName: 'Vohon Dance Club Store',
      website: {
        header: {
          logoWidth: 120,
          layout: 'left-aligned',
          menuItems: [
            {
              id: 'home',
              label: 'Home',
              link: '/vohon'
            },
            {
              id: 'products',
              label: 'Merchandise',
              link: '/vohon/products'
            }
          ]
        },
        pages: [
          {
            id: 'home',
            name: 'Home',
            path: '/',
            sections: [
              {
                id: 'hero',
                type: 'Hero Section',
                props: {
                  title: 'Vohon Dance Club',
                  subtitle: 'Express yourself through movement',
                  description: 'Official merchandise to support our dance community',
                  layout: 'center-left'
                }
              }
            ]
          }
        ]
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      isActive: true
    });
    
    console.log('✅ Vohon tenant created with subdomain support');
    console.log('🌐 Subdomain: vohon.swagstore.ca');
    console.log('📁 Slug route: /vohon (fallback)');
    
  } catch (error) {
    console.error('❌ Error creating Vohon tenant:', error);
  }
}

createVohonTenant();
