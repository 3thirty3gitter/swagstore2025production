'use client';

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useUser } from "@/firebase/auth/use-user";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, AlertCircle, Shield } from "lucide-react";
import { AdminLayoutClientWrapper } from "./client-wrapper";
import { doc, getDoc } from "firebase/firestore";
import { useFirebase } from "@/firebase";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading: userLoading } = useUser();
  const { firestore } = useFirebase();
  const router = useRouter();
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Allow access to login page without auth
  const isLoginPage = pathname === '/admin/login';

  // Check admin status
  useEffect(() => {
    async function verifyAdminAccess() {
      if (userLoading || isLoginPage) return;
      
      if (!user) {
        router.push('/login-admin');
        return;
      }

      if (!firestore) return;

      try {
        const adminDoc = await getDoc(doc(firestore, 'admins', user.uid));
        
        if (!adminDoc.exists() || adminDoc.data()?.role !== 'admin') {
          setAuthError('Admin access required. Please register as admin first.');
          setIsAdmin(false);
          return;
        }
        
        setIsAdmin(true);
      } catch (error) {
        console.error('Admin verification failed:', error);
        setAuthError('Unable to verify admin permissions.');
        setIsAdmin(false);
      }
    }

    verifyAdminAccess();
  }, [user, userLoading, firestore, router, isLoginPage]);

  // For login page, just show the content without any layout
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Show loading while checking authentication - NO SIDEBAR
  if (userLoading || isAdmin === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Show access denied WITHOUT SIDEBAR
  if (isAdmin === false) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="max-w-md mx-auto text-center p-8">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            {authError || 'You do not have admin permissions.'}
          </p>
          
          {user && (
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-600 mb-2">Current user:</p>
              <p className="font-semibold">{user.email}</p>
            </div>
          )}

          <div className="space-y-3">
            <Button 
              onClick={() => registerAsAdmin()}
              className="w-full"
              variant="default"
            >
              <Shield className="w-4 h-4 mr-2" />
              Register as Admin
            </Button>
            
            <Button 
              onClick={() => router.push('/login-admin')}
              variant="outline"
              className="w-full"
            >
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated at all, redirect - NO SIDEBAR
  if (!user) {
    router.push('/login-admin');
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // ONLY show sidebar and admin layout if user is verified admin
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <AdminLayoutClientWrapper>
          <div className="h-full p-4 md:p-8">{children}</div>
        </AdminLayoutClientWrapper>
      </SidebarInset>
    </SidebarProvider>
  );

  // Helper function for admin registration
  async function registerAsAdmin() {
    if (!user || !firestore) return;
    
    try {
      await setDoc(doc(firestore, 'admins', user.uid), {
        email: user.email,
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
      
      // Refresh the page to reload with admin permissions
      window.location.reload();
    } catch (error) {
      console.error('Admin registration failed:', error);
      setAuthError('Failed to register as admin. Please try again.');
    }
  }
}
