import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, ExternalLink, Edit } from 'lucide-react';
import type { Tenant } from "@/lib/types";
import { getAdminApp } from '@/lib/firebase-admin';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getWebsiteTenants() {
  const { db } = getAdminApp();
  const tenantsSnapshot = await db.collection('tenants').get();
  
  return tenantsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Tenant[];
}

export default async function WebsiteAdminPage() {
  const tenants = await getWebsiteTenants();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Website Editor</h1>
          <p className="text-muted-foreground">Design and customize tenant storefronts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tenants.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground text-lg">No tenant stores found to edit.</p>
          </div>
        ) : (
          tenants.map((tenant) => (
            <Card key={tenant.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  {tenant.storeName}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Team: {tenant.name}</p>
                  <p className="font-mono text-sm text-blue-600">{tenant.subdomain}.swagstore.ca</p>
                </div>

                <div className="flex gap-2">
                  <Link href={`/admin/website/${tenant.slug}/edit`} className="flex-1">
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Website
                    </Button>
                  </Link>
                  <Link href={`https://${tenant.subdomain}.swagstore.ca`} target="_blank">
                    <Button
                      variant="outline"
                      size="sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
