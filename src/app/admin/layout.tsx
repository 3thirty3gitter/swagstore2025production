'use client';

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { AdminLayoutClientWrapper } from "./client-wrapper";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Allow access to login page without auth
  const isLoginPage = pathname === '/admin/login';

  // For login page, just show the content
  if (isLoginPage) {
    return <>{children}</>;
  }

  // BYPASS ALL AUTHENTICATION - Just show the admin interface
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