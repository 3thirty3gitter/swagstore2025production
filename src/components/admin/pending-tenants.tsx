'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  Clock, 
  Mail, 
  Phone, 
  MapPin, 
  Users, 
  Calendar,
  Globe,
  X,
  XCircle,
  RotateCcw
} from 'lucide-react';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { useFirebase } from '@/firebase/provider';
import type { Tenant } from '@/lib/types';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { generateDefaultWebsiteData } from '@/lib/tenant-utils';

export function PendingTenants() {
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const [approvingIds, setApprovingIds] = useState<Set<string>>(new Set());
  const [decliningIds, setDecliningIds] = useState<Set<string>>(new Set());

  // Query pendingTenants collection
  const pendingQuery = firestore 
    ? query(collection(firestore, 'pendingTenants'))
    : null;
  
  // Query declinedTenants collection
  const declinedQuery = firestore
    ? query(collection(firestore, 'declinedTenants'))
    : null;
  
  const { data: pendingTenants, isLoading: pendingLoading } = useCollection<Tenant>(pendingQuery);
  const { data: declinedTenants, isLoading: declinedLoading } = useCollection<Tenant>(declinedQuery);

  const handleApprove = async (tenant: Tenant) => {
    if (!firestore) {
      console.error('Firestore not initialized');
      return;
    }
    
    setApprovingIds(prev => new Set(prev).add(tenant.id));
    
    try {
      console.log('Approving tenant:', tenant);
      
      // Generate default website data
      const defaultWebsite = generateDefaultWebsiteData(tenant);
      console.log('Generated default website:', defaultWebsite);
      
      // Create new active tenant in the tenants collection
      const activeTenant = {
        ...tenant,
        status: 'active' as const,
        isActive: true,
        website: defaultWebsite,
        approvedAt: new Date().toISOString(),
        approvedBy: 'admin', // You could pass in current user ID
        createdAt: tenant.createdAt || new Date().toISOString(),
        submittedAt: tenant.submittedAt || new Date().toISOString(),
      };

      console.log('Writing active tenant to Firestore:', activeTenant);
      
      // Add to tenants collection
      await setDoc(doc(firestore, 'tenants', tenant.id), activeTenant);
      console.log('Successfully wrote to tenants collection');
      
      // Remove from pendingTenants collection
      await deleteDoc(doc(firestore, 'pendingTenants', tenant.id));
      console.log('Successfully deleted from pendingTenants collection');

      toast({
        title: 'Tenant Approved!',
        description: `${tenant.storeName} has been activated and their store is now live at ${tenant.subdomain}.swagstore.ca`,
      });
    } catch (error) {
      console.error('Error approving tenant:', error);
      console.error('Error details:', error instanceof Error ? error.message : String(error));
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to approve tenant: ${error instanceof Error ? error.message : 'Please try again.'}`,
      });
    } finally {
      setApprovingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(tenant.id);
        return newSet;
      });
    }
  };

  const handleDecline = async (tenant: Tenant) => {
    if (!firestore) return;
    
    setDecliningIds(prev => new Set(prev).add(tenant.id));
    
    try {
      // Move to declinedTenants collection
      const declinedTenant = {
        ...tenant,
        status: 'declined' as const,
        declinedAt: new Date(),
        declinedBy: 'admin', // You could pass in current user ID
      };

      // Add to declinedTenants collection
      await setDoc(doc(firestore, 'declinedTenants', tenant.id), declinedTenant);
      
      // Remove from pendingTenants collection
      await deleteDoc(doc(firestore, 'pendingTenants', tenant.id));

      toast({
        title: 'Request Declined',
        description: `${tenant.storeName} has been moved to declined requests.`,
      });
    } catch (error) {
      console.error('Error declining tenant:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to decline request. Please try again.',
      });
    } finally {
      setDecliningIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(tenant.id);
        return newSet;
      });
    }
  };

  const handleRestore = async (tenant: Tenant) => {
    if (!firestore) return;
    
    try {
      // Move back to pendingTenants collection
      const restoredTenant = {
        ...tenant,
        status: 'pending' as const,
      };

      // Remove declined metadata
      delete (restoredTenant as any).declinedAt;
      delete (restoredTenant as any).declinedBy;

      // Add back to pendingTenants collection
      await setDoc(doc(firestore, 'pendingTenants', tenant.id), restoredTenant);
      
      // Remove from declinedTenants collection
      await deleteDoc(doc(firestore, 'declinedTenants', tenant.id));

      toast({
        title: 'Request Restored',
        description: `${tenant.storeName} has been moved back to pending requests.`,
      });
    } catch (error) {
      console.error('Error restoring tenant:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to restore request. Please try again.',
      });
    }
  };

  const handleReject = async (tenantId: string) => {
    if (!firestore) return;
    
    try {
      // Simply delete from pendingTenants collection
      await deleteDoc(doc(firestore, 'pendingTenants', tenantId));

      toast({
        title: 'Request Rejected',
        description: 'The store request has been rejected and removed.',
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

  const handleDeleteDeclined = async (tenantId: string) => {
    if (!firestore) return;
    
    try {
      // Permanently delete from declinedTenants collection
      await deleteDoc(doc(firestore, 'declinedTenants', tenantId));

      toast({
        title: 'Request Deleted',
        description: 'The declined request has been permanently deleted.',
      });
    } catch (error) {
      console.error('Error deleting declined tenant:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete request. Please try again.',
      });
    }
  };

  if (pendingLoading || declinedLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Clock className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">Loading requests...</p>
        </div>
      </div>
    );
  }

  const renderTenantCard = (tenant: Tenant, isDeclined: boolean = false) => (
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
          {isDeclined ? (
            <Badge variant="destructive" className="bg-red-100 text-red-800">
              <XCircle className="h-3 w-3 mr-1" />
              Declined
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              <Clock className="h-3 w-3 mr-1" />
              Pending
            </Badge>
          )}
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
                  {tenant.submittedAt ? new Date(tenant.submittedAt).toLocaleDateString() : 'N/A'}
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
        {isDeclined ? (
          <div className="flex gap-3 mt-6 pt-4 border-t">
            <Button 
              onClick={() => handleRestore(tenant)}
              variant="outline"
              className="flex-1"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Restore to Pending
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => handleDeleteDeclined(tenant.id)}
              className="px-4"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
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
              onClick={() => handleDecline(tenant)}
              disabled={decliningIds.has(tenant.id)}
              className="px-8"
            >
              {decliningIds.has(tenant.id) ? (
                <Clock className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Decline
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">Store Requests</h2>
        <p className="text-muted-foreground">Review and manage team store requests</p>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pending
            {pendingTenants && pendingTenants.length > 0 && (
              <Badge variant="secondary" className="ml-1 bg-yellow-100 text-yellow-800">
                {pendingTenants.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="declined" className="flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            Declined
            {declinedTenants && declinedTenants.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {declinedTenants.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          {!pendingTenants || pendingTenants.length === 0 ? (
            <div className="text-center p-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">All Caught Up!</h3>
              <p className="text-muted-foreground">No pending store requests at the moment.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {pendingTenants.map((tenant) => renderTenantCard(tenant, false))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="declined" className="mt-6">
          {!declinedTenants || declinedTenants.length === 0 ? (
            <div className="text-center p-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Declined Requests</h3>
              <p className="text-muted-foreground">You haven't declined any store requests yet.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {declinedTenants.map((tenant) => renderTenantCard(tenant, true))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
