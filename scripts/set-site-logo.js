#!/usr/bin/env node
const admin = require('firebase-admin');

function gsToHttps(gs) {
  if (!gs || !gs.startsWith('gs://')) return gs;
  const parts = gs.replace('gs://', '').split('/');
  const bucket = parts.shift();
  const path = parts.join('/');
  return `https://storage.googleapis.com/${bucket}/${encodeURI(path)}`;
}

function initAdmin() {
  if (admin.apps && admin.apps.length > 0) return admin.app();

  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY || process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY;
  if (privateKey) privateKey = privateKey.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    console.error('Missing FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL or FIREBASE_PRIVATE_KEY in env');
    process.exit(2);
  }

  const serviceAccount = {
    projectId,
    clientEmail,
    privateKey,
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId,
  });

  return admin.app();
}

async function main() {
  const raw = process.argv[2];
  if (!raw) {
    console.error('Usage: node scripts/set-site-logo.js <gs://bucket/path or https url>');
    process.exit(2);
  }

  const url = gsToHttps(raw);

  initAdmin();
  const db = admin.firestore();

  try {
    await db.collection('siteSettings').doc('global').set({ logoUrl: url }, { merge: true });
    console.log('Wrote logoUrl:', url);
  } catch (err) {
    console.error('Failed to write siteSettings/global:', err);
    process.exit(1);
  }
}

main();
