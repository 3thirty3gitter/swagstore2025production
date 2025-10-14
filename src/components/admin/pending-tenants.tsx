'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Clock, 
  Mail, 
  Phone, 
  MapPin, 
  Users, 
  Calendar,
  Globe,
  X
} from 'lucide-react';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, where, doc, updateDoc } from 'firebase/firestore';
import { useFirebase } from '@/firebase';
import type { Tenant } from '@/lib/types';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { generateDefaultWebsiteData } from '@/lib/tenant-utils';

export function PendingTenants() {
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const [approvingIds, setApprovingIds] = useState<Set<string>>(new Set());

  const pendingQuery = firestore 
    ? query(collection(firestore, 'tenants'), where('status', '==', 'pending'))
    : null;
  
  const { data: pendingTenants, isLoading } = useCollection<Tenant>(pendingQuery);

  const handleApprove = async (tenant: Tenant) => {
    if (!firestore) return;
    
    setApprovingIds(prev => new Set(prev).add(tenant.id));
    
    try {
      // Generate default website data
      const defaultWebsite = generateDefaultWebsiteData(tenant);
      
      // Update tenant to active status
      await updateDoc(doc(firestore, 'tenants', tenant.id), {
        status: 'active',
        isActive: true,
        website: defaultWebsite,
        approvedAt: new Date(),
        approvedBy: 'admin', // You could pass in current user ID
      });

      toast({
        title: 'Tenant Approved!',
        description: `${tenant.storeName} has been activated and their store is now live.`,
      });
    } catch (error) {
      console.error('Error approving tenant:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to approve tenant. Please try again.',
      });
    } finally {
      setApprovingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(tenant.id);
        return newSet;
      });
    }
  };

  const handleReject = async (tenantId: string) => {
    if (!firestore) return;
    
    try {
      await updateDoc(doc(firestore, 'tenants', tenantId), {
        status: 'rejected',
        rejectedAt: new Date(),
      });

      toast({
        title: 'Request Rejected',
        description: 'The store request has been rejected.',
      });
    } catch (error) {
      console.error('Error rejecting tenant:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to reject request. Please try again.',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Clock className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">Loading pending requests...</p>
        </div>
      </div>
    );
  }

  if (!pendingTenants || pendingTenants.length === 0) {
    return (
      <div className="text-center p-8">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">All Caught Up!</h3>
        <p className="text-muted-foreground">No pending store requests at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">Pending Store Requests</h2>
        <p className="text-muted-foreground">Review and approve new team store requests</p>
      </div>

      <div className="grid gap-6">
        {pendingTenants.map((tenant) => (
          <Card key={tenant.id} className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  {tenant.logoUrl && (
                    <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      <Image 
                        src={tenant.logoUrl} 
                        alt={`${tenant.storeName} logo`}
                        width={64}
                        height={64}
                        className="object-contain"
                      />
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-xl">{tenant.storeName}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Globe className="h-4 w-4" />
                      {tenant.subdomain}.swagstore.ca
                    </CardDescription>
                    <div className="flex items-center gap-4 mt-2">
                      <Badge variant="secondary">{tenant.teamType}</Badge>
                      {tenant.organizationLevel && (
                        <Badge variant="outline">{tenant.organizationLevel}</Badge>
                      )}
                      <Badge variant="outline">{tenant.urgency}</Badge>
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  <Clock className="h-3 w-3 mr-1" />
                  Pending
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Contact Information */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Contact</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{tenant.contactName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{tenant.contactEmail}</span>
                    </div>
                    {tenant.contactPhone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{tenant.contactPhone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{tenant.city}, {tenant.province}</span>
                    </div>
                  </div>
                </div>

                {/* Store Details */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Team Size:</span>
                      <span className="text-sm font-medium">{tenant.teamSize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Expected Volume:</span>
                      <span className="text-sm font-medium">{tenant.expectedVolume}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Submitted:</span>
                      <span className="text-sm font-medium">
                        {tenant.submittedAt ? new Date(tenant.submittedAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {tenant.description && (
                <div className="mt-6">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">Requirements</h4>
                  <p className="text-sm bg-muted/50 p-3 rounded-md">{tenant.description}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 mt-6 pt-4 border-t">
                <Button 
                  onClick={() => handleApprove(tenant)}
                  disabled={approvingIds.has(tenant.id)}
                  className="flex-1"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {approvingIds.has(tenant.id) ? 'Approving...' : 'Approve & Create Store'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleReject(tenant.id)}
                  className="px-4"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
