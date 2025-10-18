export type Tenant = {
  id: string;
  name: string;
  slug: string;
  subdomain: string; // e.g., "vohon" for vohon.swagstore.ca
  storeName: string;
  website?: Website;
  createdAt?: Date;
  isActive?: boolean;
  
  // Store request form fields
  status?: 'pending' | 'active' | 'suspended' | 'declined';
  teamType?: string;
  organizationLevel?: string; // e.g., "Minor/Youth", "High School", "College/University", "Professional/Adult"
  city?: string;
  province?: string;
  postalCode?: string; // Canadian postal code format
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  teamSize?: string; // e.g., "1-25", "26-50", "51-100", "100+"
  expectedVolume?: string; // e.g., "$500-1000", "$1000-2500", "$2500-5000", "$5000+"
  urgency?: string; // e.g., "ASAP", "1-2 weeks", "3-4 weeks", "Flexible"
  description?: string;
  logoUrl?: string;
  submittedAt?: Date;
  
  // Audit fields
  approvedAt?: Date;
  approvedBy?: string;
  declinedAt?: Date;
  declinedBy?: string;
  declineReason?: string;
};

export type MenuItem = {
  id: string;
  label: string;
  link: string;
};

export type HeaderConfig = {
  logoUrl?: string;
  logoWidth?: number;
  layout: 'centered' | 'left-aligned' | 'minimal';
  menuItems?: MenuItem[];
};

export type Website = {
  header: HeaderConfig;
  pages: Page[];
}

export type Page = {
  id: string;
  name: string;
  path: string;
  sections: Section[];
}

export type HeroSectionLayout = 
  | 'top-left' 
  | 'center-left' 
  | 'bottom-left'
  | 'top-right'
  | 'center-right'
  | 'bottom-right';

export type ImageWithTextLayout = 'left' | 'right';

export type SwagBucksGate = {
  id: string;
  name: string;
  target: number;
}

export type Section = {
  id: string;
  type: 'Hero Section' | 'Image With Text' | 'Swag Bucks Tracker' | 'Product List';
  props: any & { 
    imageWidth?: number; 
    imageHeight?: number; // Added height control for Hero sections
    selectedProductIds?: string[] 
  };
}

export type ProductImage = {
  id: string;
  src: string;
  alt: string;
  hint: string;
}

export type ProductOption = {
  id: string;
  name: string;
  values: string[];
};

export type ProductVariant = {
  id: string;
  productId: string;
  title: string; // e.g., "Small / Red"
  price: number;
  compareAtPrice: number | null;
  sku: string;
  option1: string | null;
  option2: string | null;
  option3: string | null;
  imageId: string | null;
  inventoryManagement: 'shopify' | 'none';
  inventoryQuantory: number;
  requiresShipping: boolean;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  images: ProductImage[];
  tenantIds: string[];
  options: ProductOption[];
  variants: ProductVariant[];
  keyFeatures?: string;
  targetAudience?: string;
};

export type Order = {
  id: string;
  tenantId: string;
  productName: string;
  quantity: number;
  total: number;
  customerName: string;
  orderDate: string;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
};

// Store Request Form Data (for backwards compatibility)
export type StoreRequestData = {
  teamName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  teamType: string;
  description: string;
  city: string;
  province: string;
  postalCode: string;
  organizationLevel: string;
  teamSize: string;
  expectedVolume: string;
  urgency: string;
  logoUrl?: string;
};
