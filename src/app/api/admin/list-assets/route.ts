import { NextResponse } from 'next/server';
import { getAdminApp } from '@/lib/firebase-admin';

export async function GET(req: Request) {
  try {
    const auth = req.headers.get('authorization') || '';
    const token = auth.replace(/^Bearer\s*/i, '');
    const expected = process.env.SITE_ADMIN_TOKEN;
    if (!expected || !token || token !== expected) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { storage } = getAdminApp();
    const bucketName = process.env.FIREBASE_STORAGE_BUCKET;
    if (!bucketName) return NextResponse.json({ error: 'No bucket configured' }, { status: 500 });

    const [files] = await storage.bucket(bucketName).getFiles({ prefix: 'assets/', maxResults: 200 });
    const names = files.map((f: any) => f.name).slice(0, 200);
    return NextResponse.json({ bucket: bucketName, files: names });
  } catch (err) {
    console.error('list-assets error', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
