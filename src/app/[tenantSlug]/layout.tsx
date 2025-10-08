
'use client';

import { Store } from "lucide-react";
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

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const tenantSlug = params.tenantSlug as string;
  const { firestore } = useFirebase();

  const tenantsQuery = firestore ? query(collection(firestore, 'tenants'), where('slug', '==', tenantSlug)) : null;
  const { data: tenants, isLoading } = useCollection<Tenant>(tenantsQuery);
  const tenant = tenants?.[0];
  
  const [logoWidth, setLogoWidth] = useState(tenant?.website?.header?.logoWidth || 96);
  const [isEditor, setIsEditor] = useState(false);
  const logoRef = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    // Check if inside an iframe (the editor)
    if (window.self !== window.top) {
      setIsEditor(true);
    }
  }, []);

  useEffect(() => {
    if (tenant?.website?.header?.logoWidth) {
      setLogoWidth(tenant.website.header.logoWidth);
    }
  }, [tenant]);

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
        // Send final update to parent
        window.parent.postMessage({ type: 'logo-width-final-update', width: logoWidth }, '*');
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current && logoRef.current) {
        e.preventDefault();
        e.stopPropagation();
        const logoRect = logoRef.current.getBoundingClientRect();
        const newWidth = e.clientX - logoRect.left;
        
        // Clamp the width between reasonable values
        const clampedWidth = Math.max(32, Math.min(newWidth, 300));

        setLogoWidth(clampedWidth);
        // Send live update to parent
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


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!tenant) {
    // If no tenant is found for the slug, display a simple not found message.
    // This will be shown in the iframe if the slug is invalid.
    return (
      <div className="min-h-screen bg-background text-foreground">
        <header className="border-b bg-card sticky top-0 z-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex min-h-16 items-center justify-center relative">
              <span className="text-xl font-bold font-headline">Store not found</span>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <h1 className="text-4xl font-bold">404</h1>
            <p className="text-muted-foreground mt-2">The requested storefront could not be found.</p>
          </div>
        </main>
      </div>
    );
  }

  const headerLayout = tenant.website?.header?.layout || 'centered';
  const menuItems = tenant.website?.header?.menuItems || [];
  const logoUrl = tenant.website?.header?.logoUrl;
  
  const navAlignment = headerLayout === 'left-aligned' ? 'ml-6' : 'justify-center';
  const logoAlignment = headerLayout === 'centered' ? 'absolute left-1/2 -translate-x-1/2' : '';

  return (
    <div className={cn(isEditor && 'pointer-events-none')}>
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-card sticky top-0 z-50 backdrop-blur-sm bg-background/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-16 relative py-2">
            <div className={`flex items-center ${headerLayout === 'left-aligned' ? '' : 'flex-1'}`}>
                <Link href={`/${tenant.slug}`} className={cn(`flex items-center gap-2 ${logoAlignment}`, isEditor && 'pointer-events-none')}>
                  {logoUrl ? (
                    <div ref={logoRef} className={cn("relative group", isEditor && "pointer-events-auto")} style={{ width: `${logoWidth}px`, height: `${logoWidth / 2}px` }}>
                       <Image src={logoUrl} alt={`${tenant.storeName} logo`} fill style={{objectFit: 'contain'}} />
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
                      <span className="text-xl font-bold font-headline">{tenant.storeName}</span>
                    </>
                  )}
                </Link>
            </div>

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

            {headerLayout === 'left-aligned' && <div className="w-auto"></div>}
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="border-t">
        <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {tenant.storeName}. All rights reserved.</p>
        </div>
      </footer>
    </div>
    </div>
  );
}
