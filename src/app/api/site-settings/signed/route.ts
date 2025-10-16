import { NextResponse } from 'next/server';
import { getAdminApp } from '@/lib/firebase-admin';

function parseStoragePath(url: string) {
  if (!url) return null;
  try {
    const u = new URL(url);
    // storage.googleapis.com/bucket/path
    if (u.hostname === 'storage.googleapis.com') {
      const parts = u.pathname.split('/').filter(Boolean);
      const bucket = parts.shift();
      const path = parts.join('/');
      return { bucket, path };
    }
    // firebasestorage.googleapis.com/v0/b/<bucket>/o/<path>?alt=media
    if (u.hostname === 'firebasestorage.googleapis.com') {
      const parts = u.pathname.split('/').filter(Boolean);
      const bIndex = parts.indexOf('b');
      const oIndex = parts.indexOf('o');
      const bucket = parts[bIndex + 1];
      const path = decodeURIComponent(parts[oIndex + 1] || '');
      return { bucket, path };
    }
  } catch (e) {
    // not a URL, maybe a path
  }
  return null;
}

function tryDecodeVariants(path: string) {
  const variants = new Set<string>();
  variants.add(path);
  try {
    variants.add(decodeURIComponent(path));
  } catch (e) {}
  // if it contains %25 (encoded %), try decoding twice
  if (path.includes('%25')) {
    try {
      variants.add(decodeURIComponent(decodeURIComponent(path)));
    } catch (e) {}
  }
  // replace + with space
  variants.add(path.replace(/\+/g, ' '));
  variants.add(decodeURIComponent(path.replace(/\+/g, ' ')));
  return Array.from(variants);
}

export async function GET() {
  try {
    const expiry = parseInt(process.env.SIGNED_URL_EXPIRY_SECONDS || '900', 10);
    const { db, storage } = getAdminApp();
    const doc = await db.collection('siteSettings').doc('global').get();
    const data = doc.exists ? doc.data() : {};
    const logoUrl = data?.logoUrl;
    if (!logoUrl) return NextResponse.json({ signedUrl: null });

    const parsed = parseStoragePath(logoUrl);
    let bucketName = parsed?.bucket || process.env.FIREBASE_STORAGE_BUCKET;
    let filePath = parsed?.path;

    // If URL wasn't parseable, try to derive from storage bucket + logoUrl path
    if (!filePath && logoUrl && bucketName) {
      // remove leading slashes
      filePath = logoUrl.replace(/^\/+/, '');
    }

    if (!bucketName || !filePath) {
      return NextResponse.json({ signedUrl: null });
    }

    // Build candidate bucket names to try
    const bucketsToTry: string[] = [];
    if (bucketName) bucketsToTry.push(bucketName);
    // If bucket has .firebasestorage.app, try .appspot.com variant
    if (bucketName && bucketName.includes('.firebasestorage.app')) {
      bucketsToTry.push(bucketName.replace('.firebasestorage.app', '.appspot.com'));
    }
    // try short name (first segment) + .appspot.com
    if (bucketName && bucketName.includes('.')) {
      const short = bucketName.split('.')[0];
      bucketsToTry.push(`${short}.appspot.com`);
    }
    // also include env fallback
    if (process.env.FIREBASE_STORAGE_BUCKET) bucketsToTry.push(process.env.FIREBASE_STORAGE_BUCKET);

    let file = null;
    for (const bName of bucketsToTry) {
      if (!bName) continue;
      const b = storage.bucket(bName);
      const candidates = tryDecodeVariants(filePath);
      for (const candidate of candidates) {
        const f = b.file(candidate);
        try {
          const [exists] = await f.exists();
          if (exists) {
            file = f;
            break;
          }
        } catch (e) {
          // ignore
        }
      }
      if (file) break;
    }

    // If still not found, try the original bucketName directly
    if (!file) {
      const b = storage.bucket(bucketName);
      file = b.file(filePath);
    }

    const [signedUrl] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + expiry * 1000,
    });

    return NextResponse.json({ signedUrl, expiresIn: expiry });
  } catch (err) {
    console.error('Failed to create signed url', err);
    return NextResponse.json({ signedUrl: null, error: String(err) }, { status: 500 });
  }
}
