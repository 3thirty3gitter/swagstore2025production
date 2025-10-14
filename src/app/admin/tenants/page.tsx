'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { TenantForm } from '@/components/admin/tenant-form';
import { TenantCard } from './tenant-card';
import { Plus, Loader2, AlertCircle } from 'lucide-react';
import { useUser } from "@/firebase/auth/use-user";
import { useFirebase } from "@/firebase";
import { doc, getDoc, collection, addDoc, updateDoc, deleteDoc, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import type { Tenant } from "@/lib/types";

export default function TenantsAdminPage() {
  const { user, isLoading: userLoading } = useUser();
  const { firestore } = useFirebase();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [creating, setCreating] = useState(false);

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

  // Handle save (create or update)
  const handleSave = async (tenantData: Partial<Tenant>) => {
    if (!firestore) return;

    try {
      setCreating(true);
      
      if (editingTenant) {
        // Update existing tenant
        await updateDoc(doc(firestore, 'tenants', editingTenant.id), {
          ...tenantData,
          updatedAt: new Date()
        });
        
        setTenants(prev => prev.map(t => 
          t.id === editingTenant.id ? { ...t, ...tenantData } : t
        ));
      } else {
        // Create new tenant
        const newTenant = {
          ...tenantData,
          id: tenantData.subdomain, // Use subdomain as ID
          isActive: true,
          createdAt: new Date(),
          website: {
            header: {
              logoWidth: 120,
              layout: 'left-aligned' as const,
              menuItems: []
            },
            pages: [
              {
                id: 'home',
                name: 'Home',
                path: '/',
                sections: [
                  {
                    id: 'hero',
                    type: 'Hero Section',
                    props: {
                      title: tenantData.storeName,
                      subtitle: `Welcome to ${tenantData.name}`,
                      description: 'Official merchandise and SwagBucks rewards program',
                      layout: 'center-left'
                    }
                  }
                ]
              }
            ]
          }
        };

        const docRef = await addDoc(collection(firestore, 'tenants'), newTenant);
        setTenants(prev => [...prev, { ...newTenant, id: docRef.id }]);
      }

      setShowForm(false);
      setEditingTenant(null);
    } catch (error) {
      console.error('Error saving tenant:', error);
      alert('Error saving tenant. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  // Handle delete
  const handleDelete = async (tenantId: string) => {
    if (!firestore || !confirm('Are you sure you want to delete this tenant?')) return;

    try {
      await deleteDoc(doc(firestore, 'tenants', tenantId));
      setTenants(prev => prev.filter(t => t.id !== tenantId));
    } catch (error) {
      console.error('Error deleting tenant:', error);
      alert('Error deleting tenant. Please try again.');
    }
  };

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
          <h1 className="text-3xl font-bold tracking-tight font-headline">Tenant Stores</h1>
          <p className="text-muted-foreground">Manage team stores with custom subdomains</p>
        </div>
        <Button onClick={() => setShowForm(true)} disabled={showForm}>
          <Plus className="w-4 h-4 mr-2" />
          Create Store
        </Button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <TenantForm
              tenant={editingTenant}
              onSave={handleSave}
              onCancel={() => {
                setShowForm(false);
                setEditingTenant(null);
              }}
              creating={creating}
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading stores...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tenants.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground text-lg">No stores found. Create one to get started.</p>
            </div>
          ) : (
            tenants.map((tenant) => (
              <TenantCard
                key={tenant.id}
                tenant={tenant}
                onEdit={(tenant) => {
                  setEditingTenant(tenant);
                  setShowForm(true);
                }}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
