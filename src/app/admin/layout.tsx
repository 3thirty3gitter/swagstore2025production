'use client';

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useUser } from "@/firebase/auth/use-user";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, AlertCircle, Lock } from "lucide-react";
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
  
  // Allow access to login page without auth
  const isLoginPage = pathname === '/admin/login';

  // Check if user is YOUR admin (not tenant registration)
  useEffect(() => {
    async function verifyPlatformAdmin() {
      if (userLoading || isLoginPage) return;
      
      if (!user) {
        router.push('/login-admin');
        return;
      }

      if (!firestore) return;

      try {
        // Only check if user is in admin collection (no self-registration)
        const adminDoc = await getDoc(doc(firestore, 'admins', user.uid));
        setIsAdmin(adminDoc.exists() && adminDoc.data()?.role === 'admin');
      } catch (error) {
        console.error('Admin verification failed:', error);
        setIsAdmin(false);
      }
    }

    verifyPlatformAdmin();
  }, [user, userLoading, firestore, router, isLoginPage]);

  // For login page, just show the content
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Show loading while checking authentication
  if (userLoading || isAdmin === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Verifying platform admin access...</p>
        </div>
      </div>
    );
  }

  // Show access denied - NO REGISTRATION OPTION
  if (isAdmin === false) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="max-w-md mx-auto text-center p-8">
          <Lock className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-red-600 mb-4">Platform Admin Only</h1>
          <p className="text-gray-600 mb-6">
            This area is restricted to the platform administrator.
          </p>
          
          {user && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
              <p className="text-sm text-red-700 mb-2">Logged in as:</p>
              <p className="font-semibold text-red-800">{user.email}</p>
              <p className="text-xs text-red-600 mt-2">Not authorized for admin access</p>
            </div>
          )}

          <div className="space-y-3">
            <Button 
              onClick={() => router.push('/')}
              className="w-full"
              variant="default"
            >
              Go to SwagStore Home
            </Button>
            
            <Button 
              onClick={() => router.push('/login-admin')}
              variant="outline"
              className="w-full"
            >
              Different Admin Login
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 mt-4">
            For team store access, visit your team's custom store URL
          </p>
        </div>
      </div>
    );
  }

  // Only redirect if not authenticated
  if (!user) {
    router.push('/login-admin');
    return null;
  }

  // ONLY show admin interface if verified platform admin
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
}
