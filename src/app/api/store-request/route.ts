import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('Store request API called');
    
    const formData = await request.json();
    console.log('Received form data:', formData);
    
    // Validate required fields
    if (!formData.teamName || !formData.contactName || !formData.contactEmail) {
      console.log('Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // For now, just log the data and return success
    // In production, you would save to database
    console.log('Store request received for:', formData.teamName);
    console.log('Contact:', formData.contactName, formData.contactEmail);
    
    // Generate slug
    const slug = formData.teamName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Store request received successfully',
      storeUrl: `${slug}.swagstore.ca`,
      teamName: formData.teamName
    });

  } catch (error) {
    console.error('API Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Server error occurred',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Store request API is working' });
}
