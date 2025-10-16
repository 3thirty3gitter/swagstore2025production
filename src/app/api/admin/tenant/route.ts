import { NextResponse } from 'next/server';
import { getAdminApp } from '@/lib/firebase-admin';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const slug = url.searchParams.get('slug');
    const id = url.searchParams.get('id');

    if (!slug && !id) {
      return NextResponse.json({ error: 'id or slug required' }, { status: 400 });
    }

    const { db } = getAdminApp();

    if (id) {
      const docRef = db.collection('tenants').doc(id);
      const docSnap = await docRef.get();
      if (!docSnap.exists) return NextResponse.json({ error: 'not found' }, { status: 404 });
      return NextResponse.json({ id: docSnap.id, ...(docSnap.data() as any) });
    }

    // search by slug
    const querySnap = await db.collection('tenants').where('slug', '==', slug).get();
    if (querySnap.empty) return NextResponse.json({ error: 'not found' }, { status: 404 });
    const first = querySnap.docs[0];
    return NextResponse.json({ id: first.id, ...(first.data() as any) });
  } catch (e: any) {
    console.error('Admin tenant API error', e);
    return NextResponse.json({ error: e.message || 'server error' }, { status: 500 });
  }
}
