SIMPLE WORKING API ROUTE:
File: src/app/api/store-request/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.teamName || !body.contactName || !body.contactEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate slug
    const slug = body.teamName.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim();
    
    // For now, just log the submission (will work until Firebase is fixed)
    console.log('=== STORE REQUEST RECEIVED ===');
    console.log('Team:', body.teamName);
    console.log('Contact:', body.contactName, body.contactEmail);
    console.log('Slug:', slug);
    console.log('Logo URL:', body.logoUrl);
    console.log('Full data:', JSON.stringify(body, null, 2));
    
    // Return success - this will allow form to work
    return NextResponse.json({
      success: true,
      message: 'Request received and logged',
      subdomain: `${slug}.swagstore.ca`
    });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
