'use client';

import { createContext, useContext, ReactNode } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';

interface FirebaseContextType {
  app: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
}

const FirebaseContext = createContext<FirebaseContextType>({
  app: null,
  auth: null,
  firestore: null,
});

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = ({
  children,
  app,
}: {
  children: ReactNode;
  app: FirebaseApp;
}) => {
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  console.log('FirebaseProvider: app =', app);
  console.log('FirebaseProvider: auth =', auth);
  console.log('FirebaseProvider: firestore =', firestore);

  return (
    <FirebaseContext.Provider value={{ app, auth, firestore }}>
      {children}
    </FirebaseContext.Provider>
  );
};
