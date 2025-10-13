'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFirebase } from "@/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Loader2 } from "lucide-react";
import type { Tenant } from "@/lib/types";

export default function SubdomainTenantPage() {
  const router = useRouter();
  const { firestore } = useFirebase();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function handleSubdomain() {
      try {
        // Extract subdomain from hostname
        const hostname = window.location.hostname;
        const subdomain = hostname.split('.')[0];
        
        // Skip if main domain or admin
        if (hostname === 'swagstore.ca' || subdomain === 'www' || subdomain === 'admin') {
          router.push('/');
          return;
        }

        if (!firestore) return;

        // Look up tenant by subdomain
        const tenantsQuery = query(
          collection(firestore, 'tenants'),
          where('subdomain', '==', subdomain)
        );
        
        const tenantSnapshot = await getDocs(tenantsQuery);
        
        if (tenantSnapshot.empty) {
          setError(`Store "${subdomain}" not found`);
          setLoading(false);
          return;
        }

        const tenantData = tenantSnapshot.docs[0].data() as Tenant;
        
        // Redirect to the tenant's slug-based route
        router.push(`/${tenantData.slug}`);
        
      } catch (error) {
        console.error('Subdomain routing error:', error);
        setError('Unable to load store');
        setLoading(false);
      }
    }

    handleSubdomain();
  }, [firestore, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your store...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold text-red-600 mb-4">404</h1>
          <h2 className="text-2xl font-bold mb-4">Store Not Found</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <a 
            href="https://swagstore.ca" 
            className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Visit SwagStore Home
          </a>
        </div>
      </div>
    );
  }

  return null; // Should redirect before reaching here
}
