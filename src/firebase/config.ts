import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";

// Use environment variables with fallback to hard-coded values for development
const firebaseConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "store-hub-1ty89",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1040909284901:web:5519c67fbe3163c80431cc",
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyD6n6_SWrhN6cbTJnvU4G7KcGDoWzZ3jo0",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "store-hub-1ty89.firebaseapp.com",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1040909284901",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
};

// Initialize Firebase app (works on both client and server during build)
let firebaseApp: FirebaseApp;
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApp();
}

export { firebaseApp };
