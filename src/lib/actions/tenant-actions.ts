'use server';

import { getAdminApp } from '@/lib/firebase-admin';
import { generateDefaultWebsiteData } from '@/lib/tenant-utils';
import type { Tenant } from '@/lib/types';

interface ApproveResult {
  success: boolean;
  error?: string;
  tenant?: Tenant;
}

interface DeclineResult {
  success: boolean;
  error?: string;
}

/**
 * Approve a pending tenant and create their active store
 * Server action that moves tenant from pendingTenants to tenants collection
 */
export async function approveTenant(
  tenantId: string, 
  adminUserId: string = 'admin'
): Promise<ApproveResult> {
  try {
    const { db } = getAdminApp();
    
    // Get pending tenant
    const pendingRef = db.collection('pendingTenants').doc(tenantId);
    const pendingDoc = await pendingRef.get();
    
    if (!pendingDoc.exists) {
      return { success: false, error: 'Pending tenant not found' };
    }
    
    const pendingData = pendingDoc.data() as Tenant;
    
    // Generate default website data
    const defaultWebsite = generateDefaultWebsiteData(pendingData);
    
    // Create active tenant
    const activeTenant: Tenant = {
      ...pendingData,
      status: 'active',
      isActive: true,
      website: defaultWebsite,
      approvedAt: new Date(),
      approvedBy: adminUserId,
      createdAt: new Date(),
    };
    
    // Batch write: add to tenants, remove from pendingTenants
    const batch = db.batch();
    const tenantRef = db.collection('tenants').doc(tenantId);
    
    batch.set(tenantRef, activeTenant);
    batch.delete(pendingRef);
    
    await batch.commit();
    
    console.log(`✅ Tenant approved: ${activeTenant.storeName} (${tenantId})`);
    
    return { success: true, tenant: activeTenant };
    
  } catch (error) {
    console.error('Error approving tenant:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to approve tenant' 
    };
  }
}

/**
 * Decline a pending tenant and move to declined collection
 * Server action that moves tenant from pendingTenants to declinedTenants
 */
export async function declineTenant(
  tenantId: string,
  adminUserId: string = 'admin',
  reason?: string
): Promise<DeclineResult> {
  try {
    const { db } = getAdminApp();
    
    // Get pending tenant
    const pendingRef = db.collection('pendingTenants').doc(tenantId);
    const pendingDoc = await pendingRef.get();
    
    if (!pendingDoc.exists) {
      return { success: false, error: 'Pending tenant not found' };
    }
    
    const pendingData = pendingDoc.data() as Tenant;
    
    // Create declined tenant record
    const declinedTenant: Tenant = {
      ...pendingData,
      status: 'declined',
      isActive: false,
      declinedAt: new Date(),
      declinedBy: adminUserId,
      declineReason: reason,
    };
    
    // Batch write: add to declinedTenants, remove from pendingTenants
    const batch = db.batch();
    const declinedRef = db.collection('declinedTenants').doc(tenantId);
    
    batch.set(declinedRef, declinedTenant);
    batch.delete(pendingRef);
    
    await batch.commit();
    
    console.log(`❌ Tenant declined: ${declinedTenant.storeName} (${tenantId})`);
    
    return { success: true };
    
  } catch (error) {
    console.error('Error declining tenant:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to decline tenant' 
    };
  }
}

/**
 * Restore a declined tenant back to pending status
 * Server action that moves tenant from declinedTenants to pendingTenants
 */
export async function restoreTenant(tenantId: string): Promise<DeclineResult> {
  try {
    const { db } = getAdminApp();
    
    // Get declined tenant
    const declinedRef = db.collection('declinedTenants').doc(tenantId);
    const declinedDoc = await declinedRef.get();
    
    if (!declinedDoc.exists) {
      return { success: false, error: 'Declined tenant not found' };
    }
    
    const declinedData = declinedDoc.data() as Tenant;
    
    // Create pending tenant (remove declined metadata)
    const restoredTenant: Tenant = {
      ...declinedData,
      status: 'pending',
      isActive: false,
    };
    
    // Remove declined audit fields
    delete restoredTenant.declinedAt;
    delete restoredTenant.declinedBy;
    delete restoredTenant.declineReason;
    
    // Batch write: add back to pendingTenants, remove from declinedTenants
    const batch = db.batch();
    const pendingRef = db.collection('pendingTenants').doc(tenantId);
    
    batch.set(pendingRef, restoredTenant);
    batch.delete(declinedRef);
    
    await batch.commit();
    
    console.log(`🔄 Tenant restored: ${restoredTenant.storeName} (${tenantId})`);
    
    return { success: true };
    
  } catch (error) {
    console.error('Error restoring tenant:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to restore tenant' 
    };
  }
}

/**
 * Permanently delete a declined tenant
 * Server action that removes tenant from declinedTenants collection
 */
export async function deleteDeclinedTenant(tenantId: string): Promise<DeclineResult> {
  try {
    const { db } = getAdminApp();
    
    const declinedRef = db.collection('declinedTenants').doc(tenantId);
    const declinedDoc = await declinedRef.get();
    
    if (!declinedDoc.exists) {
      return { success: false, error: 'Declined tenant not found' };
    }
    
    await declinedRef.delete();
    
    console.log(`🗑️  Declined tenant deleted: ${tenantId}`);
    
    return { success: true };
    
  } catch (error) {
    console.error('Error deleting declined tenant:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete tenant' 
    };
  }
}
