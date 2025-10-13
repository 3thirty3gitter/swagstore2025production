import { doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAdminApp } from '../firebase-admin';

// Create admin user (run once for initial setup)
export async function createAdminUser(userId: string, email: string) {
  try {
    const { db } = getAdminApp();
    
    await db.collection('admins').doc(userId).set({
      email,
      role: 'admin',
      createdAt: new Date(),
      permissions: {
        manageProducts: true,
        manageTenants: true,
        manageOrders: true,
        manageSwagBucks: true,
        viewAnalytics: true
      }
    });
    
    console.log(`Admin user created: ${email}`);
    return { success: true };
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
}

// Verify admin role (client-side check)
export async function verifyAdminRole(db: any, userId: string): Promise<boolean> {
  try {
    const adminDoc = await getDoc(doc(db, 'admins', userId));
    return adminDoc.exists() && adminDoc.data()?.role === 'admin';
  } catch (error) {
    console.error('Error verifying admin role:', error);
    return false;
  }
}

// Admin middleware for server actions
export async function requireAdmin(userId: string) {
  const { db } = getAdminApp();
  
  try {
    const adminDoc = await db.collection('admins').doc(userId).get();
    
    if (!adminDoc.exists() || adminDoc.data()?.role !== 'admin') {
      throw new Error('Unauthorized: Admin access required');
    }
    
    return adminDoc.data();
  } catch (error) {
    throw new Error('Authorization failed: ' + error.message);
  }
}
