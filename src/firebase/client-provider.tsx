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
  const [app, setApp] = useState<FirebaseApp | null>(null);

  useEffect(() => {
    setApp(firebaseApp);
  }, []);

  if (!app) {
    return null; 
  }

  return <FirebaseProvider app={app}>{children}</FirebaseProvider>;
}
