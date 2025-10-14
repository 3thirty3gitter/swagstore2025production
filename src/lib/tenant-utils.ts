import type { Website, Tenant } from './types';

export const generateDefaultWebsiteData = (tenant: Tenant): Website => ({
  header: {
    layout: 'centered',
    menuItems: [],
    logoWidth: 96,
    logoUrl: tenant.logoUrl || undefined,
  },
  pages: [
    {
      id: 'home',
      name: 'Home',
      path: '/',
      sections: [
        {
          id: `section-${Date.now()}`,
          type: 'Hero Section',
          props: {
            title: `Welcome to ${tenant.storeName}`,
            text: `Discover our amazing ${tenant.teamType === 'hockey' ? 'hockey gear' : 'merchandise'}.`,
            buttonText: "Shop Now",
            buttonLink: "#products",
            imageUrl: `https://picsum.photos/seed/${tenant.slug}/1200/800`,
            imageHint: tenant.teamType || "team merchandise",
            layout: 'center-right',
            imageWidth: 80,
            imageHeight: 60,
          }
        }
      ]
    }
  ]
});

export const approveTenant = async (tenantId: string, adminUserId: string) => {
  // This would be called when admin approves a pending tenant
  // Implementation would:
  // 1. Update tenant status to 'active'
  // 2. Set isActive to true
  // 3. Generate default website data
  // 4. Set approvedAt and approvedBy
  // 5. Send confirmation email to contact
};

export const generateSlugFromName = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
};
