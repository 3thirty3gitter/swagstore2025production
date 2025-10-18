
'use client';

import ProductCard from "@/components/store/product-card";
import type { Product } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { useCollection } from "@/firebase/firestore/use-collection";
import { collection, query, where, documentId } from "firebase/firestore";
import { useFirebase } from "@/firebase/provider";

type ProductListSectionProps = {
    tenantId: string;
    title: string;
    selectedProductIds?: string[];
    tenantProducts?: Product[]; // Server-provided products
}

export function ProductListSection({ tenantId, title, selectedProductIds, tenantProducts }: ProductListSectionProps) {
    const { firestore } = useFirebase();

    // Debug logging
    console.log('ProductListSection props:', { tenantId, title, selectedProductIds, serverProducts: tenantProducts?.length });

    // If we have server-provided products, use them instead of fetching
    if (tenantProducts) {
        const hasSelectedProducts = selectedProductIds && selectedProductIds.length > 0;
        
        const orderedProducts = hasSelectedProducts
            ? selectedProductIds
                .map(id => tenantProducts.find(p => p.id === id))
                .filter((p): p is Product => p !== undefined)
            : tenantProducts;

        return (
            <div id="products">
                <h2 className="text-3xl font-bold font-headline mb-6 text-center">{title}</h2>
                {orderedProducts && orderedProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {orderedProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 border-2 border-dashed rounded-lg">
                        <h2 className="text-xl font-semibold">No products yet</h2>
                        <p className="text-muted-foreground mt-2">Check back soon for new arrivals!</p>
                    </div>
                )}
            </div>
        );
    }

    // Fallback to client-side fetching if no server products provided (e.g., in editor preview)
    let productsQuery = null;
    const hasSelectedProducts = selectedProductIds && selectedProductIds.length > 0;

    if (firestore) {
        if (hasSelectedProducts) {
            // Firestore 'in' queries are limited to 30 items. 
            // If you expect more, this would need pagination or a different approach.
            productsQuery = query(collection(firestore, 'products'), where(documentId(), 'in', selectedProductIds));
        } else {
            productsQuery = query(collection(firestore, 'products'), where('tenantIds', 'array-contains', tenantId));
        }
    }
    
    const { data: clientProducts, isLoading: productsLoading } = useCollection<Product>(productsQuery);

    const orderedProducts = hasSelectedProducts && clientProducts
        ? selectedProductIds
            .map(id => clientProducts.find(p => p.id === id))
            .filter((p): p is Product => p !== undefined)
        : clientProducts;

    return (
        <div id="products">
            <h2 className="text-3xl font-bold font-headline mb-6 text-center">{title}</h2>
            {productsLoading ? (
                 <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : orderedProducts && orderedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {orderedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 border-2 border-dashed rounded-lg">
                    <h2 className="text-xl font-semibold">No products yet</h2>
                    <p className="text-muted-foreground mt-2">Check back soon for new arrivals!</p>
                </div>
            )}
      </div>
    )
}

