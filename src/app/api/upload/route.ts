import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('Upload API called');
    
    const formData = await request.formData();
    const dataUrl = formData.get('dataUrl') as string;
    const fileName = formData.get('fileName') as string;
    
    if (!dataUrl || !fileName) {
      return NextResponse.json(
        { success: false, error: 'Missing file data' },
        { status: 400 }
      );
    }

    console.log('File received:', fileName);
    
    // For now, return the data URL as the upload URL
    // In production, you would upload to cloud storage
    const uploadUrl = dataUrl;
    
    console.log('Upload successful');
    
    return NextResponse.json({
      success: true,
      url: uploadUrl
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Upload failed' },
      { status: 500 }
    );
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