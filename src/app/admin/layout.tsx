'use client';

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useUser } from "@/firebase/auth/use-user";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { AdminLayoutClientWrapper } from "./client-wrapper";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  
  // Allow access to login page without auth
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!isLoading && !user && !isLoginPage) {
      router.push('/login-admin');
    }
  }, [user, isLoading, router, isLoginPage]);

  // Show loading for non-login pages when checking auth
  if ((isLoading || !user) && !isLoginPage) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // For login page, just show the content without sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  // For authenticated users, show full admin layout
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
