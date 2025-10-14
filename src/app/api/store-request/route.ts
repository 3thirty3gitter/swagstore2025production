import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.teamName || !body.contactName || !body.contactEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const slug = body.teamName.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim();
    
    // Send email notification to you instead of database
    const emailData = {
      to: 'trent@3thirty3.ca',
      subject: `New Store Request: ${body.teamName}`,
      text: `
NEW STORE REQUEST:

Team: ${body.teamName}
Contact: ${body.contactName} (${body.contactEmail})
Phone: ${body.contactPhone}
Type: ${body.teamType}
Location: ${body.city}, ${body.province}
Team Size: ${body.teamSize}
Volume: ${body.expectedVolume}
Urgency: ${body.urgency}
Logo: ${body.logoUrl ? 'Uploaded' : 'None'}
Description: ${body.description}

Proposed URL: ${slug}.swagstore.ca
      `,
    };

    // Log to Vercel logs for your reference
    console.log('=== NEW STORE REQUEST ===');
    console.log(JSON.stringify(emailData, null, 2));
    
    // TODO: Send actual email via Resend/SendGrid
    
    return NextResponse.json({ 
      success: true, 
      message: 'Request received successfully' 
    });
    
  } catch (e) {
    console.error('API Error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
