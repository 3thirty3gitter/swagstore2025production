import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TenantProductList } from "@/components/admin/tenant-product-list";
import { ArrowLeft, ExternalLink, Edit } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Tenant, Product } from "@/lib/types";
import { getAdminApp } from "@/lib/firebase-admin";

// Force dynamic rendering for fresh data
export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ tenantId: string }>;
}

async function getTenantDetails(tenantId: string) {
    try {
        const { db } = getAdminApp();
        
        const [tenantDoc, productsSnapshot] = await Promise.all([
            db.collection('tenants').doc(tenantId).get(),
            db.collection('products').get(),
        ]);

        if (!tenantDoc.exists) {
            return null;
        }

        const tenant: Tenant = {
            id: tenantDoc.id,
            ...tenantDoc.data()
        } as Tenant;

        const allProducts: Product[] = productsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Product));

        const tenantProducts = allProducts.filter(p => p.tenantIds?.includes(tenantId));

        return { tenant, tenantProducts };
    } catch (error) {
        console.error('Error fetching tenant details:', error);
        return null;
    }
}

export default async function TenantDetailPage({ params }: PageProps) {
    const { tenantId } = await params;
    const data = await getTenantDetails(tenantId);

    if (!data) {
        notFound();
    }

    const { tenant, tenantProducts } = data;

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
