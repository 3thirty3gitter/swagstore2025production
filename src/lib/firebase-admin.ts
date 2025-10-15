import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';

let adminApp: any = null;

export function getAdminApp() {
  if (!adminApp && getApps().length === 0) {
    try {
      // Prefer explicit env var but fall back to project-based bucket
      const storageBucket = process.env.FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || `${process.env.FIREBASE_PROJECT_ID}.appspot.com`;

      console.log('Firebase Admin - Using storage bucket:', storageBucket);

      // Build service account object using only recommended fields
      const serviceAccount: any = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      };

      adminApp = initializeApp({
        credential: cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket,
      });
    } catch (error) {
      console.error('Firebase Admin initialization failed:', error);
      throw new Error('Firebase Admin configuration error');
    }
  } else if (getApps().length > 0) {
    adminApp = getApps()[0];
  }

  return {
    app: adminApp,
    db: getFirestore(adminApp),
    auth: getAuth(adminApp),
    storage: getStorage(adminApp),
  };
}
