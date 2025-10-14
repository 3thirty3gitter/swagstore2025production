export type Tenant = {
  id: string;
  name: string;
  slug: string;
  subdomain: string; // e.g., "vohon" for vohon.swagstore.ca
  storeName: string;
  website?: Website;
  createdAt?: Date;
  isActive?: boolean;
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
  props: any & { imageWidth?: number; selectedProductIds?: string[] };
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
  inventoryQuantity: number;
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
