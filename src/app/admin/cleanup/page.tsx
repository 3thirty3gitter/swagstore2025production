'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';

export default function CleanupPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCleanup = async () => {
    setIsLoading(true);
    try {
      // Placeholder for cleanup functionality
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setResult({ success: true, message: 'Cleanup completed successfully' });
      toast({
        title: 'Cleanup Completed',
        description: 'System cleanup completed successfully',
      });
    } catch (error: any) {
      setResult({ success: false, error: 'Cleanup failed' });
      toast({
        variant: 'destructive',
        title: 'Cleanup Failed',
        description: error.message || 'An unexpected error occurred',
      });
    } finally {
      setIsLoading(false);
    }
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
            Clean Up System Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-yellow-800">Important:</p>
              <p className="text-yellow-700 mt-1">
                This will clean up system data and remove duplicates.
                This action cannot be undone.
              </p>
            </div>
          </div>

          {result && (
            <div
              className={`p-4 rounded-lg border ${
                result.success 
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              <p className="font-medium">
                {result.success ? 'Success:' : 'Error:'}
              </p>
              <p className="text-sm mt-1">
                {result.success ? result.message : result.error}
              </p>
            </div>
          )}

          <Button 
            onClick={handleCleanup} 
            disabled={isLoading}
            variant="destructive"
            className="w-full"
          >
            {isLoading ? 'Running Cleanup...' : 'Run Cleanup'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}