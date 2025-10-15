import { NextResponse } from 'next/server';
import { getAdminApp } from '@/lib/firebase-admin';

function gsToHttps(gs: string) {
  if (!gs) return gs;
  if (!gs.startsWith('gs://')) return gs;
  const parts = gs.replace('gs://', '').split('/');
  const bucket = parts.shift();
  const path = parts.join('/');
  return `https://storage.googleapis.com/${bucket}/${encodeURI(path)}`;
}

export async function POST(req: Request) {
  try {
    const auth = req.headers.get('authorization') || '';
    const token = auth.replace(/^Bearer\s*/i, '');
    const expected = process.env.SITE_ADMIN_TOKEN;
    if (!expected || !token || token !== expected) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const raw = body?.path || body?.url;
    if (!raw) return NextResponse.json({ error: 'Missing path/url in body' }, { status: 400 });

    const url = gsToHttps(raw);

    const { db } = getAdminApp();
    await db.collection('siteSettings').doc('global').set({ logoUrl: url }, { merge: true });

    return NextResponse.json({ success: true, logoUrl: url });
  } catch (err: any) {
    console.error('set-site-logo error', err);
    return NextResponse.json({ error: err?.message || 'unknown' }, { status: 500 });
  }
}
