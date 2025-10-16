'use client';

import { ReactNode, useState, useEffect } from 'react';
import { FirebaseApp } from 'firebase/app';
import { FirebaseProvider } from './provider';
import { firebaseApp } from './config';

export function FirebaseClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  // Initialize the firebase app synchronously from the imported config so
  // consumers (like useCollection/useDoc) don't see `firestore` as null on
  // the first render and miss real-time subscriptions.
  const [app] = useState<FirebaseApp | null>(firebaseApp);

  if (!app) {
    return null;
  }

  return <FirebaseProvider app={app}>{children}</FirebaseProvider>;
}
