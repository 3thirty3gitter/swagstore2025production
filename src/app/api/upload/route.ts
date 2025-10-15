import { NextRequest, NextResponse } from 'next/server';
import { getAdminApp } from '@/lib/firebase-admin';

function dataUrlToBuffer(dataUrl: string) {
  const matches = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!matches) return null;
  const mime = matches[1];
  const b64 = matches[2];
  const buffer = Buffer.from(b64, 'base64');
  return { buffer, mime };
}

export async function POST(request: NextRequest) {
  try {
    console.log('Upload API called');

    const formData = await request.formData();

    const file = formData.get('file') as any; // File or Blob from browser
    const dataUrl = formData.get('dataUrl') as string | null;
    const fileName = (formData.get('fileName') as string) || (file?.name as string) || `upload-${Date.now()}`;

    let buffer: Buffer | null = null;
    let contentType = 'application/octet-stream';

    if (dataUrl) {
      const parsed = dataUrlToBuffer(dataUrl);
      if (!parsed) {
        return NextResponse.json({ success: false, error: 'Invalid dataUrl' }, { status: 400 });
      }
      buffer = parsed.buffer;
      contentType = parsed.mime;
    } else if (file) {
      // The spec for formData file in NextRequest is a Blob-like object with arrayBuffer()
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
      contentType = file.type || contentType;
    } else {
      return NextResponse.json({ success: false, error: 'Missing file data' }, { status: 400 });
    }

    const { storage } = getAdminApp();
    const bucketName = storage?.bucket?.().name || process.env.FIREBASE_STORAGE_BUCKET;
    const bucket = storage.bucket();

    const destPath = `uploads/${Date.now()}_${fileName}`;
    const fileRef = bucket.file(destPath);

    await fileRef.save(buffer as Buffer, {
      metadata: { contentType },
      resumable: false,
    });

    // Default to signed URLs unless explicitly disabled
    const useSignedEnv = process.env.USE_SIGNED_URLS;
    const useSigned = typeof useSignedEnv === 'undefined' ? true : (useSignedEnv === '1' || useSignedEnv === 'true');

    if (useSigned) {
      // Signed URL expiry configurable via env in seconds (default 24 hours)
      const expirySeconds = Number(process.env.SIGNED_URL_EXPIRY_SECONDS) || 60 * 60 * 24;
      const [signedUrl] = await fileRef.getSignedUrl({
        action: 'read',
        expires: Date.now() + expirySeconds * 1000,
      });
      console.log('Upload successful (signed):', signedUrl);
      return NextResponse.json({ success: true, url: signedUrl });
    }

    // Make public (fallback)
    try {
      await fileRef.makePublic();
    } catch (err) {
      console.warn('Could not make file public:', err);
    }

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${encodeURI(destPath)}`;

    console.log('Upload successful:', publicUrl);

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}