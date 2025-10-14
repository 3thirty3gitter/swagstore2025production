'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, ExternalLink, Edit, Loader2, AlertCircle } from 'lucide-react';
import { useUser } from "@/firebase/auth/use-user";
import { useFirebase } from "@/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import type { Tenant } from "@/lib/types";

export default function WebsiteAdminPage() {
  const { user, isLoading: userLoading } = useUser();
  const { firestore } = useFirebase();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
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

  // Load tenants
  useEffect(() => {
    async function loadTenants() {
      if (!firestore || !isAdmin) return;

      try {
        setLoading(true);
        const tenantsSnapshot = await getDocs(collection(firestore, 'tenants'));
        const tenantsData = tenantsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Tenant[];
        
        setTenants(tenantsData);
      } catch (error) {
        console.error('Error loading tenants:', error);
      } finally {
        setLoading(false);
      }
    }

    loadTenants();
  }, [firestore, isAdmin]);

  // Show loading while checking authentication
  if (userLoading || isAdmin === null) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Verifying admin access...</span>
      </div>
    );
  }

  // Show access denied for non-admins
  if (isAdmin === false) {
    return (
      <div className="flex flex-col justify-center items-center h-full max-w-md mx-auto text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-red-600 mb-2">Platform Admin Only</h1>
        <p className="text-gray-600">This area is restricted to the platform administrator.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Website Editor</h1>
          <p className="text-muted-foreground">Design and customize tenant storefronts</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading tenant stores...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tenants.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground text-lg">No tenant stores found to edit.</p>
            </div>
          ) : (
            tenants.map((tenant) => (
              <Card key={tenant.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    {tenant.storeName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Team: {tenant.name}</p>
                    <p className="font-mono text-sm text-blue-600">{tenant.subdomain}.swagstore.ca</p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => router.push(`/admin/website/${tenant.slug}/edit`)}
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Website
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`https://${tenant.subdomain}.swagstore.ca`, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
