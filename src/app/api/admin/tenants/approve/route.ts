import { NextRequest, NextResponse } from 'next/server';
import { approveTenant } from '@/lib/actions/tenant-actions';

/**
 * POST /api/admin/tenants/approve
 * Approve a pending tenant and create their active store
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenantId, adminUserId } = body;
    
    if (!tenantId) {
      return NextResponse.json(
        { error: 'Tenant ID is required' },
        { status: 400 }
      );
    }
    
    const result = await approveTenant(tenantId, adminUserId || 'admin');
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to approve tenant' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      tenant: result.tenant,
      message: `Tenant ${result.tenant?.storeName} has been approved and activated`
    });
    
  } catch (error) {
    console.error('API Error (approve tenant):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
