import { notFound } from "next/navigation";
import { HeroSection } from "@/components/store/sections/hero-section";
import { ImageWithTextSection } from "@/components/store/sections/image-with-text-section";
import { SwagBucksTrackerSection } from "@/components/store/sections/swag-bucks-tracker";
import { ProductListSection } from "@/components/store/sections/product-list-section";
import type { Tenant } from "@/lib/types";
import { getAdminApp } from "@/lib/firebase-admin";

// Force dynamic rendering for fresh tenant data
export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ tenantSlug: string }>;
}

async function getTenantBySlug(slug: string): Promise<Tenant | null> {
  try {
    const { db } = getAdminApp();
    const tenantsRef = db.collection('tenants');
    const snapshot = await tenantsRef.where('slug', '==', slug).limit(1).get();
    
    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    } as Tenant;
  } catch (error) {
    console.error('Error fetching tenant:', error);
    return null;
  }
}

export default async function TenantPage({ params }: PageProps) {
  const { tenantSlug } = await params;
  const tenant = await getTenantBySlug(tenantSlug);

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
