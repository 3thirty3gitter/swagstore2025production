'use server';

import { getAdminApp } from './firebase-admin';
import { revalidatePath } from 'next/cache';

export async function cleanupDuplicateTenants() {
  const { db } = getAdminApp();
  
  try {
    // Get all tenants
    const tenantsSnapshot = await db.collection('tenants').get();
    const tenants = tenantsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Group tenants by slug to find duplicates
    const tenantsBySlug = new Map<string, any[]>();
    
    tenants.forEach(tenant => {
      if (!tenantsBySlug.has(tenant.slug)) {
        tenantsBySlug.set(tenant.slug, []);
      }
      tenantsBySlug.get(tenant.slug)!.push(tenant);
    });
    
    let deletedCount = 0;
    
    // For each slug with duplicates, keep the newest one and delete the rest
    for (const [slug, duplicates] of tenantsBySlug) {
      if (duplicates.length > 1) {
        console.log(`Found ${duplicates.length} duplicates for slug: ${slug}`);
        
        // Sort by createdAt (newest first), fallback to id comparison
        duplicates.sort((a, b) => {
          const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          if (aTime === bTime) {
            return b.id.localeCompare(a.id); // Use ID as tiebreaker
          }
          return bTime - aTime; // Newest first
        });
        
        // Keep the first one (newest), delete the rest
        const toKeep = duplicates[0];
        const toDelete = duplicates.slice(1);
        
        console.log(`Keeping tenant: ${toKeep.id} (${toKeep.name})`);
        
        for (const tenant of toDelete) {
          console.log(`Deleting duplicate tenant: ${tenant.id} (${tenant.name})`);
          await db.collection('tenants').doc(tenant.id).delete();
          deletedCount++;
        }
      }
    }
    
    // Revalidate paths
    revalidatePath('/admin/tenants');
    revalidatePath('/');
    
    return {
      success: true,
      message: `Cleanup completed. Removed ${deletedCount} duplicate tenant(s).`,
      deletedCount
    };
    
  } catch (error: any) {
    console.error('Error cleaning up duplicates:', error);
    return {
      success: false,
      error: error.message || 'Failed to clean up duplicates'
    };
  }
}

export async function forceRefreshTenants() {
  const { db } = getAdminApp();
  
  try {
    // Get all actual tenants from database
    const tenantsSnapshot = await db.collection('tenants').get();
    const actualTenants = tenantsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log(`Found ${actualTenants.length} actual tenants in database`);
    
    // Force revalidation of all paths
    revalidatePath('/admin/tenants');
    revalidatePath('/admin');
    revalidatePath('/');
    
    return {
      success: true,
      message: `Refreshed tenant list. Found ${actualTenants.length} active tenants.`,
      tenantCount: actualTenants.length,
      tenants: actualTenants
    };
    
  } catch (error: any) {
    console.error('Error refreshing tenants:', error);
    return {
      success: false,
      error: error.message || 'Failed to refresh tenant list'
    };
  }
}
