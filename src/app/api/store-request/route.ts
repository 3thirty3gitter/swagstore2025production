import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.teamName || !body.contactName || !body.contactEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const slug = body.teamName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();

    // Log submission to Vercel function logs
    console.log('=== STORE REQUEST RECEIVED ===');
    console.log('Team:', body.teamName);
    console.log('Contact:', body.contactName, body.contactEmail);
    console.log('Logo URL:', body.logoUrl ? 'YES' : 'NO');
    console.log('Location:', body.city, body.province);
    console.log('Team Type:', body.teamType);
    console.log('Full Data:', JSON.stringify(body, null, 2));

    return NextResponse.json({
      success: true,
      message: 'Request received successfully',
      subdomain: `${slug}.swagstore.ca`,
    });
  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Store request API working', timestamp: new Date().toISOString() });
}
