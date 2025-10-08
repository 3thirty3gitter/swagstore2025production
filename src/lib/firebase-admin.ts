
import { App, cert, getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

let app: App;

if (getApps().length === 0) {
  app = initializeApp({
    credential: cert(require('../../serviceAccountKey.json')),
    storageBucket: `store-hub-1ty89.firebasestorage.app`
  });
} else {
  app = getApp();
}

const db = getFirestore(app);
const adminAuth = getAuth(app);
const storage = getStorage(app);

export const getAdminApp = () => ({
    db,
    adminAuth,
    storage,
});
