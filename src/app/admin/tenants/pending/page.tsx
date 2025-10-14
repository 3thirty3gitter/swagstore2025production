'use client';

import { collection, doc, updateDoc, query, where } from 'firebase/firestore';
import { useFirebase } from '@/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, X, Globe, Mail, Phone, MapPin, Users } from 'lucide-react';
import Image from 'next/image';

export default function PendingTenantsPage() {
  const { firestore } = useFirebase();

  const pendingQuery = firestore 
    ? query(collection(firestore, 'tenants'), where('status', '==', 'pending'))
    : null;
  const { data: tenants, isLoading } = useCollection<any>(pendingQuery);

  const handleApprove = async (tenantId: string) => {
    if (!firestore) return;
    await updateDoc(doc(firestore, 'tenants', tenantId), {
      status: 'active',
      isActive: true,
      approvedAt: new Date(),
    });
  };

  const handleReject = async (tenantId: string) => {
    if (!firestore) return;
    await updateDoc(doc(firestore, 'tenants', tenantId), {
      status: 'rejected',
      rejectedAt: new Date(),
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading pending requests...</span>
      </div>
    );
  }

  if (!tenants || tenants.length === 0) {
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

              {t.description && (
                <div className="text-sm bg-muted/40 p-3 rounded-md">{t.description}</div>
              )}

              <div className="flex gap-3 pt-3 border-t">
                <Button onClick={() => handleApprove(t.id)} className="flex-1">Approve</Button>
                <Button onClick={() => handleReject(t.id)} variant="outline">Reject</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
