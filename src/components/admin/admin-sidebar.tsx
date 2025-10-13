"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Package,
  Store,
  LogOut,
  Brush,
  Settings,
  Gift,
} from "lucide-react";
import { useFirebase } from "@/firebase";
import { signOut } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";

export function AdminSidebar() {
  const pathname = usePathname();
  const { auth } = useFirebase();
  const { toast } = useToast();

  const handleLogout = async () => {
    if (auth) {
      try {
        await signOut(auth);
        toast({ title: "Logged out successfully." });
      } catch (error) {
        console.error("Error signing out: ", error);
        toast({
          variant: "destructive",
          title: "Logout Failed",
          description: "An error occurred while logging out.",
        });
      }
    }
  };

  const menuItems = [
    {
      href: "/admin/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/admin/swagbucks",
      label: "SwagBucks",
      icon: Gift,
      isNew: true,
    },
    {
      href: "/admin/products",
      label: "Products",
      icon: ShoppingBag,
    },
    {
      href: "/admin/tenants",
      label: "Tenants",
      icon: Users,
    },
    {
      href: "/admin/orders",
      label: "Orders",
      icon: Package,
    },
  ];
  
  const bottomMenuItems = [
    {
      href: "/admin/website",
      label: "Website",
      icon: Brush,
    },
    {
      href: "/admin/settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <div className="bg-primary text-primary-foreground p-2 rounded-lg">
            <Store />
          </div>
          <span className="font-semibold text-lg font-headline">SwagStore</span>
        </div>
      </SidebarHeader>
      <SidebarMenu className="flex-1">
        {menuItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <Link href={item.href} passHref>
              <SidebarMenuButton
                isActive={pathname.startsWith(item.href)}
                tooltip={item.label}
                className={item.isNew ? "bg-green-50 hover:bg-green-100 border-l-2 border-l-green-500" : ""}
              >
                <item.icon className={item.isNew ? "text-green-600" : ""} />
                <div className="flex items-center gap-2">
                  <span className={item.isNew ? "text-green-700 font-medium" : ""}>{item.label}</span>
                  {item.isNew && (
                    <span className="bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                      NEW
                    </span>
                  )}
                </div>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      <SidebarMenu>
        {bottomMenuItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <Link href={item.href} passHref>
              <SidebarMenuButton
                isActive={pathname.startsWith(item.href)}
                tooltip={item.label}
              >
                <item.icon />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      <SidebarFooter>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip="Logout" onClick={handleLogout}>
            <LogOut />
            <span>Logout</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  );
}
