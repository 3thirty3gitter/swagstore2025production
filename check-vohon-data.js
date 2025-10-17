const admin = require('firebase-admin');

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function checkVohonData() {
  try {
    const snapshot = await db.collection('tenants').where('slug', '==', 'vohon').limit(1).get();
    
    if (snapshot.empty) {
      console.log('❌ No vohon tenant found');
      return;
    }
    
    const doc = snapshot.docs[0];
    const data = doc.data();
    
    console.log('✅ Vohon tenant found!');
    console.log('Tenant ID:', doc.id);
    console.log('\n📋 Full tenant data:');
    console.log(JSON.stringify(data, null, 2));
    
    if (data.website) {
      console.log('\n🌐 Website configuration exists!');
      console.log('Header:', JSON.stringify(data.website.header, null, 2));
      console.log('\nPages:', data.website.pages?.length || 0);
      
      if (data.website.pages && data.website.pages.length > 0) {
        const homePage = data.website.pages[0];
        console.log('\n🏠 Home page sections:', homePage.sections?.length || 0);
        
        if (homePage.sections) {
          homePage.sections.forEach((section, idx) => {
            console.log(`\nSection ${idx + 1}:`, section.type);
            console.log('Props:', JSON.stringify(section.props, null, 2));
          });
        }
      }
    } else {
      console.log('\n⚠️  No website configuration found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkVohonData();
