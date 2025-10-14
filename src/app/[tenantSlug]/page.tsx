
'use client';

import { notFound, useParams } from "next/navigation";
import { HeroSection } from "@/components/store/sections/hero-section";
import { ImageWithTextSection } from "@/components/store/sections/image-with-text-section";
import { SwagBucksTrackerSection } from "@/components/store/sections/swag-bucks-tracker-debug";
import { ProductListSection } from "@/components/store/sections/product-list-section";
import type { Tenant } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { useCollection } from "@/firebase/firestore/use-collection";
import { collection, query, where } from "firebase/firestore";
import { useFirebase } from "@/firebase";

export default function TenantPage() {
  const params = useParams();
  const tenantSlug = params.tenantSlug as string;
  const { firestore } = useFirebase();

  const tenantsQuery = firestore ? query(collection(firestore, 'tenants') as any, where('slug', '==', tenantSlug)) as any : null;
  const { data: tenants, isLoading: tenantLoading } = useCollection<Tenant>(tenantsQuery);
  const tenant = tenants?.[0];
  
  if (tenantLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!tenant) {
    notFound();
  }

  const homePage = tenant.website?.pages.find(p => p.path === '/');

  return (
    <div className="space-y-16 md:space-y-24">
      {homePage?.sections.map(section => {
        switch (section.type) {
          case 'Hero Section':
            return <HeroSection key={section.id} sectionId={section.id} {...section.props} />;
          case 'Image With Text':
            return <ImageWithTextSection key={section.id} {...section.props} />;
          case 'Swag Bucks Tracker':
            return <SwagBucksTrackerSection key={section.id} tenantId={tenant.id} {...section.props} />;
          case 'Product List':
            return <ProductListSection key={section.id} tenantId={tenant.id} {...section.props} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
