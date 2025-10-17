'use client';

import { Store, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useParams } from 'next/navigation';
import Image from "next/image";
import type { Tenant } from "@/lib/types";
import { useCollection } from "@/firebase/firestore/use-collection";
import { collection, query, where } from "firebase/firestore";
import { useFirebase } from "@/firebase";
import { Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { CartProvider, useCart } from '@/contexts/cart-context';
import { Button } from "@/components/ui/button";

function CartIcon() {
  const { itemCount } = useCart();

  return (
    <Link href="/cart">
      <Button variant="ghost" size="icon" className="relative">
        <ShoppingCart className="h-5 w-5" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
            {itemCount}
          </span>
        )}
      </Button>
    </Link>
  );
}

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const tenantSlug = params.tenantSlug as string;
  const { firestore } = useFirebase();

  const tenantsQuery = firestore ? query(collection(firestore, 'tenants') as any, where('slug', '==', tenantSlug)) as any : null;
  const { data: tenants, isLoading } = useCollection<Tenant>(tenantsQuery);
  const tenant = tenants?.[0];
  const [serverTenant, setServerTenant] = useState<Tenant | null>(null);
  const [isLoadingServerTenant, setIsLoadingServerTenant] = useState(false);

  // If client firestore isn't available (firebase hasn't initialized yet), fetch tenant from server admin API.
  useEffect(() => {
    let cancelled = false;
    async function fetchServerTenant() {
      if (firestore || !tenantSlug || serverTenant) return;
      setIsLoadingServerTenant(true);
      try {
        const res = await fetch(`/api/admin/tenant?slug=${encodeURIComponent(tenantSlug)}`);
        if (!res.ok) {
          if (!cancelled) setIsLoadingServerTenant(false);
          return;
        }
        const json = await res.json();
        if (!cancelled) {
          setServerTenant(json as Tenant);
          setIsLoadingServerTenant(false);
        }
      } catch (e) {
        if (!cancelled) setIsLoadingServerTenant(false);
      }
    }
    fetchServerTenant();
    return () => { cancelled = true; };
  }, [firestore, tenantSlug, serverTenant]);

  const effectiveTenant = tenant || serverTenant || null;
  // Don't block on loading at all - let page content render
  // The page component has its own tenant data from server
  const effectiveLoading = false; // Never block - page will handle its own loading
  
  const [logoWidth, setLogoWidth] = useState(96); // Default logo width
  const [isEditor, setIsEditor] = useState(false);
  const logoRef = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    if (window.self !== window.top) {
      setIsEditor(true);
    }
  }, []);

  useEffect(() => {
    const t = effectiveTenant;
    if (t?.website?.header?.logoWidth) {
      setLogoWidth(t.website.header.logoWidth);
    }
  }, [effectiveTenant]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'logo-width-update') {
        setLogoWidth(event.data.width);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  useEffect(() => {
    if (!isEditor || !dragHandleRef.current || !logoRef.current) return;

    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      isDragging.current = true;
      document.body.style.cursor = 'ew-resize';
    };

    const handleMouseUp = (e: MouseEvent) => {
      if(isDragging.current) {
        e.preventDefault();
        e.stopPropagation();
        isDragging.current = false;
        document.body.style.cursor = 'default';
        window.parent.postMessage({ type: 'logo-width-final-update', width: logoWidth }, '*');
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current && logoRef.current) {
        e.preventDefault();
        e.stopPropagation();
        const logoRect = logoRef.current.getBoundingClientRect();
        const newWidth = e.clientX - logoRect.left;
        
        const clampedWidth = Math.max(32, Math.min(newWidth, 300));

        setLogoWidth(clampedWidth);
        window.parent.postMessage({ type: 'logo-width-live-update', width: clampedWidth }, '*');
      }
    };
    
    const dragHandle = dragHandleRef.current;
    dragHandle.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
        dragHandle.removeEventListener('mousedown', handleMouseDown);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('mousemove', handleMouseMove);
    };

  }, [isEditor, logoWidth]);


  // Don't show loading spinner - let page content render immediately
  // Don't show 404 - the page component will handle that if needed
  // Just render the layout chrome and let children display
  
  const headerLayout = effectiveTenant?.website?.header?.layout || 'centered';
  const menuItems = effectiveTenant?.website?.header?.menuItems || [];
  const logoUrl = effectiveTenant?.website?.header?.logoUrl;
  
  const navAlignment = headerLayout === 'left-aligned' ? 'ml-6' : 'justify-center';
  const logoAlignment = headerLayout === 'centered' ? 'absolute left-1/2 -translate-x-1/2' : '';

  return (
    <CartProvider>
    <div className={cn(isEditor && 'pointer-events-none')}>
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-card sticky top-0 z-50 backdrop-blur-sm bg-background/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-16 relative py-2">
            {effectiveTenant && (
            <div className={`flex items-center ${headerLayout === 'left-aligned' ? '' : 'flex-1'}`}>
                <Link href="/" className={cn(`flex items-center gap-2 ${logoAlignment}`, isEditor && 'pointer-events-none')}>
                  {logoUrl ? (
                    <div ref={logoRef} className={cn("relative group", isEditor && "pointer-events-auto")} style={{ width: `${logoWidth}px`, height: `${logoWidth / 2}px` }}>
                       <Image src={logoUrl} alt={`${effectiveTenant.storeName} logo`} fill style={{objectFit: 'contain'}} />
                       {isEditor && (
                        <>
                           <div className="absolute inset-0 border-2 border-dashed border-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                           <div 
                              ref={dragHandleRef}
                              className="absolute -right-1 -bottom-1 w-4 h-4 rounded-full bg-blue-500 cursor-ew-resize border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity"
                           />
                        </>
                       )}
                    </div>
                  ) : (
                    <>
                      <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                        <Store className="h-6 w-6" />
                      </div>
                      <span className="text-xl font-bold font-headline">{effectiveTenant?.storeName || 'Store'}</span>
                    </>
                  )}
                </Link>
            </div>
            )}

            {headerLayout !== 'minimal' && menuItems.length > 0 && (
              <nav className={`flex-1 flex items-center ${navAlignment}`}>
                  <ul className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
                    {menuItems.map(item => (
                        <li key={item.id}>
                            <Link href={item.link} className="hover:text-foreground transition-colors">
                                {item.label}
                            </Link>
                        </li>
                    ))}
                  </ul>
              </nav>
            )}

            <div className="flex items-center ml-auto">
              <CartIcon />
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="border-t">
        <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {effectiveTenant?.storeName || 'Store'}. All rights reserved.</p>
        </div>
      </footer>
    </div>
    </div>
    </CartProvider>
  );
}
