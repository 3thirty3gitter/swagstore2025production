const admin = require('firebase-admin');

const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || './service-account-key.json';
const serviceAccount = require(serviceAccountPath);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function checkTenantWebsite() {
  try {
    const tenantsSnapshot = await db.collection('tenants').get();
    
    tenantsSnapshot.forEach(doc => {
      const data = doc.data();
      console.log('\n=== Tenant:', data.name, '===');
      console.log('ID:', doc.id);
      
      if (data.website && data.website.pages) {
        data.website.pages.forEach(page => {
          console.log(`\nPage: ${page.name} (${page.path})`);
          
          if (page.sections) {
            page.sections.forEach(section => {
              console.log(`  - ${section.type}:`, section.id);
              if (section.type === 'Product List') {
                console.log('    Props:', JSON.stringify(section.props, null, 4));
              }
            });
          }
        });
      }
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

checkTenantWebsite().then(() => process.exit(0));
