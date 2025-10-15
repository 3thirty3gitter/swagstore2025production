import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getStorage, Storage } from 'firebase-admin/storage';

const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
};

type AdminContext = {
  app: App;
  db: Firestore;
  storage: Storage;
};

export function getAdminApp(): AdminContext {
  let app: App;
  if (getApps().length === 0) {
    app = initializeApp(firebaseAdminConfig);
  } else {
    app = getApps()[0];
  }

  const db = getFirestore(app);
  const storage = getStorage(app);

  return { app, db, storage };
}

export const adminDb = getFirestore(getAdminApp().app);
