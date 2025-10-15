import { NextResponse } from 'next/server';
import { getAdminApp } from '@/lib/firebase-admin';

export async function GET() {
  try {
    const { db } = getAdminApp();
    const doc = await db.collection('siteSettings').doc('global').get();
    const data = doc.exists ? doc.data() : {};
    return NextResponse.json({ settings: data || {} });
  } catch (err) {
    console.error('Failed to read site settings:', err);
    return NextResponse.json({ settings: {} });
  }
}
