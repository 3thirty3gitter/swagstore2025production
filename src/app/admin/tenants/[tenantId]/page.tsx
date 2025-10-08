'use client';

import { notFound, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TenantProductList } from "@/components/admin/tenant-product-list";
import { ArrowLeft, ExternalLink, Edit, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Tenant, Product } from "@/lib/types";
import { useFirebase } from "@/firebase";
import { useDoc } from "@/firebase/firestore/use-doc";
import { useCollection } from "@/firebase/firestore/use-collection";
import { doc, collection } from "firebase/firestore";

type TenantDetailPageProps = {
    params: {
        tenantId: string;
    }
}

export default function TenantDetailPage({ params: initialParams }: TenantDetailPageProps) {
    const { firestore } = useFirebase();
    const params = useParams();
    const tenantId = params.tenantId as string;

    const { data: tenant, isLoading: tenantLoading } = useDoc<Tenant>(
        firestore ? doc(firestore, 'tenants', tenantId) : null
    );

    const { data: allProducts, isLoading: productsLoading } = useCollection<Product>(
        firestore ? collection(firestore, 'products') : null
    );
    
    const isLoading = tenantLoading || productsLoading;

    if (isLoading) {
        return (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        );
    }
    
    if (!tenant) {
        notFound();
    }
    
    const tenantProducts = allProducts?.filter(p => p.tenantIds.includes(tenant.id)) || [];

    return (
        <div className="space-y-8">
            <div>
                <Link href="/admin/tenants" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Tenants
                </Link>
                <div className="flex justify-between items-center mt-2">
                    <h1 className="text-3xl font-bold tracking-tight font-headline">{tenant.name}</h1>
                    <div className="flex gap-2">
                        <Link href={`/${tenant.slug}`} target="_blank">
                            <Button variant="outline">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                View Storefront
                            </Button>
                        </Link>
                        <Link href={`/admin/tenants/${tenant.id}/editor`}>
                            <Button>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Website
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Storefront Name</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{tenant.storeName}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Store Slug</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-mono text-muted-foreground">/{tenant.slug}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{tenantProducts.length}</p>
                    </CardContent>
                </Card>
            </div>
            
            <div>
                <h2 className="text-2xl font-bold tracking-tight font-headline mb-4">Assigned Products</h2>
                <TenantProductList products={tenantProducts} />
            </div>
        </div>
    )
}
