import { notFound } from 'next/navigation';
import { Product } from '@/lib/types';
import ProductDetails from '@/components/store/product-details';
import { getAdminApp } from '@/lib/firebase-admin';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

async function getProduct(productId: string): Promise<Product | null> {
  try {
    console.log('[getProduct] Fetching product:', productId);
    const { db } = getAdminApp();
    const productDoc = await db.collection('products').doc(productId).get();
    
    if (!productDoc.exists) {
      console.log('[getProduct] Product not found:', productId);
      return null;
    }

    const data = productDoc.data();
    const product = JSON.parse(JSON.stringify({
      id: productDoc.id,
      ...data
    })) as Product;
    
    console.log('[getProduct] Found product:', product.name);
    return product;
  } catch (error) {
    console.error('[getProduct] Error fetching product:', error);
    return null;
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ tenantSlug: string; productId: string }>;
}) {
  const { productId } = await params;
  const product = await getProduct(productId);
  
  if (!product) {
    notFound();
  }
  
  return <ProductDetails product={product} />;
}
