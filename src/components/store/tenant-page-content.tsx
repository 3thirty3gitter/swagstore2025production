'use client';

import { HeroSection } from "@/components/store/sections/hero-section";
import { ImageWithTextSection } from "@/components/store/sections/image-with-text-section";
import { SwagBucksTrackerSection } from "@/components/store/sections/swag-bucks-tracker";
import { ProductListSection } from "@/components/store/sections/product-list-section";
import type { Tenant, Product } from "@/lib/types";

interface TenantPageContentProps {
  tenant: Tenant;
  tenantProducts?: Product[];
}

export function TenantPageContent({ tenant, tenantProducts }: TenantPageContentProps) {
  const homePage = tenant.website?.pages.find(p => p.path === '/');

  if (!homePage || !homePage.sections || homePage.sections.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-semibold">Welcome to {tenant.storeName}</h2>
        <p className="text-muted-foreground mt-2">This store is being set up. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="space-y-16 md:space-y-24">
      {homePage.sections.map(section => {
        console.log('Rendering section:', section.type, 'Props:', section.props);
        
        switch (section.type) {
          case 'Hero Section':
            return <HeroSection key={section.id} sectionId={section.id} {...section.props} />;
          case 'Image With Text':
            return <ImageWithTextSection key={section.id} {...section.props} />;
          case 'Swag Bucks Tracker':
            return <SwagBucksTrackerSection key={section.id} tenantId={tenant.id} {...section.props} />;
          case 'Product List':
            return <ProductListSection key={section.id} tenantId={tenant.id} tenantProducts={tenantProducts} {...section.props} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
