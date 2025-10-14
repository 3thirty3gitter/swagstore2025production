'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useUser } from "@/firebase/auth/use-user";
import { useFirebase } from "@/firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { Loader2, AlertCircle } from 'lucide-react';
import type { Tenant } from "@/lib/types";
import { TenantEditor } from '@/components/admin/tenant-editor';

export default function WebsiteEditorPage() {
  const params = useParams();
  const router = useRouter();
  const tenantSlug = params.tenantSlug as string;
  const { user, isLoading: userLoading } = useUser();
  const { firestore } = useFirebase();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);

  // Verify admin status
  useEffect(() => {
    async function verifyPlatformAdmin() {
      if (userLoading) return;
      
      if (!user) {
        router.push('/login-admin');
        return;
      }

      if (!firestore) return;

      try {
        const adminDoc = await getDoc(doc(firestore, 'admins', user.uid));
        setIsAdmin(adminDoc.exists() && adminDoc.data()?.role === 'admin');
      } catch (error) {
        console.error('Admin verification failed:', error);
        setIsAdmin(false);
      }
    }

    verifyPlatformAdmin();
  }, [user, userLoading, firestore, router]);

  // Load tenant data
  useEffect(() => {
    async function loadTenant() {
      if (!firestore || !isAdmin || !tenantSlug) return;

      try {
        setLoading(true);
        const tenantsQuery = query(
          collection(firestore, 'tenants'),
          where('slug', '==', tenantSlug)
        );
        
        const tenantSnapshot = await getDocs(tenantsQuery);
        
        if (!tenantSnapshot.empty) {
          const tenantData = {
            id: tenantSnapshot.docs[0].id,
            ...tenantSnapshot.docs[0].data()
          } as Tenant;
          
          setTenant(tenantData);
        }
      } catch (error) {
        console.error('Error loading tenant:', error);
      } finally {
        setLoading(false);
      }
    }

    loadTenant();
  }, [firestore, isAdmin, tenantSlug]);

  // Show loading while checking authentication
  if (userLoading || isAdmin === null || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading website editor...</span>
      </div>
    );
  }

  // Show access denied for non-admins
  if (isAdmin === false) {
    return (
      <div className="flex flex-col justify-center items-center h-screen max-w-md mx-auto text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-red-600 mb-2">Platform Admin Only</h1>
        <p className="text-gray-600">This area is restricted to the platform administrator.</p>
      </div>
    );
  }

  // Show error if tenant not found
  if (!tenant) {
    return (
      <div className="flex flex-col justify-center items-center h-screen max-w-md mx-auto text-center">
        <AlertCircle className="h-16 w-16 text-gray-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-700 mb-2">Tenant Not Found</h1>
        <p className="text-gray-600">The tenant "{tenantSlug}" could not be found.</p>
      </div>
    );
  }

  return <TenantEditor tenant={tenant} />;
}
