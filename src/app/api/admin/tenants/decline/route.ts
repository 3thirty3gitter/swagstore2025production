import { NextRequest, NextResponse } from 'next/server';
import { declineTenant } from '@/lib/actions/tenant-actions';

/**
 * POST /api/admin/tenants/decline
 * Decline a pending tenant and move to declined collection
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenantId, adminUserId, reason } = body;
    
    if (!tenantId) {
      return NextResponse.json(
        { error: 'Tenant ID is required' },
        { status: 400 }
      );
    }
    
    const result = await declineTenant(tenantId, adminUserId || 'admin', reason);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to decline tenant' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Tenant has been declined'
    });
    
  } catch (error) {
    console.error('API Error (decline tenant):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
