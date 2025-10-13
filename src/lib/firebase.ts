import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  "projectId": "store-hub-1ty89",
  "appId": "1:1040909284901:web:5519c67fbe3163c80431cc",
  "apiKey": "AIzaSyD6n6_SWrhN6cbTJnvU4G7KcGDoWzZ3jo0",
  "authDomain": "store-hub-1ty89.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "1040909284901"
};

// Initialize Firebase only if it hasn't been initialized already
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
