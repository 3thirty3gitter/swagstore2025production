'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Globe, Mail, Phone, MapPin, Users, Eye } from 'lucide-react';
import Image from 'next/image';

export default function PendingTenantsPage() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchTenants() {
      try {
        const response = await fetch('/api/admin/tenants/pending');
        const data = await response.json();
        setTenants(data.tenants || []);
      } catch (e) {
        console.error('Failed to fetch tenants:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchTenants();
  }, []);

  if (loading) {
    return <div>Loading pending requests...</div>;
  }

  if (tenants.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-full max-w-md mx-auto text-center">
        <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
        <h2 className="text-xl font-semibold mb-1">No pending requests</h2>
        <p className="text-muted-foreground">You're all caught up.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Pending Tenants</h1>
        <Badge variant="secondary">{tenants.length} pending</Badge>
      </div>

      <div className="grid gap-6">
        {tenants.map((t: any) => (
          <Card key={t.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  {t.logoUrl && (
                    <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={t.logoUrl} alt={`${t.storeName} logo`} width={64} height={64} className="object-contain" />
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-xl">{t.storeName}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Globe className="h-4 w-4" />
                      {t.subdomain}.swagstore.ca
                    </CardDescription>
                    <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Users className="h-4 w-4" />{t.teamType || 'Team'}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{t.city}, {t.province}</span>
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Contact</p>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> {t.contactEmail}</div>
                    {t.contactPhone && (<div className="flex items-center gap-2"><Phone className="h-4 w-4" /> {t.contactPhone}</div>)}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Details</p>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>Team Size: {t.teamSize || '—'}</div>
                    <div>Expected Volume: {t.expectedVolume || '—'}</div>
                    <div>Urgency: {t.urgency || '—'}</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-3 border-t">
                <Button className="flex-1" onClick={() => router.push(`/admin/tenants/pending/${t.id}`)}>
                  <Eye className="h-4 w-4 mr-2" /> Review Request
                </Button>
                <Button variant="outline" onClick={() => router.push(`/admin/tenants/pending/${t.id}`)}>
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
