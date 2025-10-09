import { notFound } from 'next/navigation';
import { getDoc, doc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { firebaseApp } from '@/firebase/config';
import { Product } from '@/lib/types';
import ProductDetails from '@/components/store/product-details';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ tenantSlug: string; productId: string }>;
}) {
  const { productId } = await params;
  const db = getFirestore(firebaseApp);
  
  const productDoc = await getDoc(doc(db, 'products', productId));
  
  if (!productDoc.exists()) {
    notFound();
  }
  
  const product = { id: productDoc.id, ...productDoc.data() } as Product;
  
  return <ProductDetails product={product} />;
}
