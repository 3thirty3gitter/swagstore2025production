
// Follow this pattern to import other Firebase services
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";

const firebaseConfig = {
  "projectId": "store-hub-1ty89",
  "appId": "1:1040909284901:web:5519c67fbe3163c80431cc",
  "apiKey": "AIzaSyD6n6_SWrhN6cbTJnvU4G7KcGDoWzZ3jo0",
  "authDomain": "store-hub-1ty89.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "1040909284901"
};

// Initialize Firebase
let firebaseApp: FirebaseApp;
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApp();
}

export { firebaseApp };
