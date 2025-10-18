import { NextRequest, NextResponse } from 'next/server';
import { restoreTenant } from '@/lib/actions/tenant-actions';

/**
 * POST /api/admin/tenants/restore
 * Restore a declined tenant back to pending status
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenantId } = body;
    
    if (!tenantId) {
      return NextResponse.json(
        { error: 'Tenant ID is required' },
        { status: 400 }
      );
    }
    
    const result = await restoreTenant(tenantId);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to restore tenant' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Tenant has been restored to pending'
    });
    
  } catch (error) {
    console.error('API Error (restore tenant):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
