'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cleanupDuplicateTenants } from '@/lib/cleanup-duplicates';
import { useToast } from '@/hooks/use-toast';
import { useState, useTransition } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';

export default function CleanupPage() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<any>(null);

  const handleCleanup = () => {
    startTransition(async () => {
      try {
        const cleanupResult = await cleanupDuplicateTenants();
        setResult(cleanupResult);
        
        if (cleanupResult.success) {
          toast({
            title: 'Cleanup Completed',
            description: cleanupResult.message,
          });
        } else {
          toast({
            variant: 'destructive',
            title: 'Cleanup Failed',
            description: cleanupResult.error,
          });
        }
      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: 'Cleanup Failed',
          description: error.message || 'An unexpected error occurred',
        });
      }
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          System Cleanup
        </h1>
        <p className="text-muted-foreground">
          Administrative tools for maintaining data integrity
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Clean Up Duplicate Tenants
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-yellow-800">Important:</p>
              <p className="text-yellow-700 mt-1">
                This will remove duplicate tenant entries based on slug. The newest entry for each slug will be kept.
                This action cannot be undone.
              </p>
            </div>
          </div>

          {result && (
            <div className={`p-4 rounded-lg border ${
              result.success 
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <p className="font-medium">
                {result.success ? 'Success:' : 'Error:'}
              </p>
              <p className="text-sm mt-1">
                {result.success ? result.message : result.error}
              </p>
              {result.success && result.deletedCount > 0 && (
                <p className="text-sm mt-2 font-mono">
                  Deleted {result.deletedCount} duplicate tenant(s)
                </p>
              )}
            </div>
          )}

          <Button 
            onClick={handleCleanup} 
            disabled={isPending}
            variant="destructive"
            className="w-full"
          >
            {isPending ? 'Running Cleanup...' : 'Run Cleanup'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

  const handleRefresh = () => {
    startTransition(async () => {
      try {
        const refreshResult = await forceRefreshTenants();
        setResult(refreshResult);
        
        if (refreshResult.success) {
          toast({
            title: 'Refresh Completed',
            description: refreshResult.message,
          });
          // Force a page reload to clear any cached data
          window.location.reload();
        } else {
          toast({
            variant: 'destructive',
            title: 'Refresh Failed',
            description: refreshResult.error,
          });
        }
      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: 'Refresh Failed',
          description: error.message || 'An unexpected error occurred',
        });
      }
    });
  };

  // Add this button after the cleanup button
  <Button 
    onClick={handleRefresh} 
    disabled={isPending}
    variant="outline"
    className="w-full mt-2"
  >
    {isPending ? 'Refreshing...' : 'Force Refresh Tenant List'}
  </Button>
