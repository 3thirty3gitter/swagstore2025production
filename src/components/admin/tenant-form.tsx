'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Tenant } from '@/lib/types';
import { saveTenant } from '@/lib/actions';
import { useServerFormState } from '@/hooks/use-server-form-state';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Globe, Store } from 'lucide-react';

type TenantFormProps = {
  tenant?: Tenant | null;
  onSuccess: () => void;
};

export function TenantForm({ tenant, onSuccess }: TenantFormProps) {
  const {
    formState,
    formAction,
    register,
    formErrors,
    watch,
    setValue,
    isSuccess,
    lastSubmittedValues,
    lastActionResult,
  } = useServerFormState(saveTenant, tenant);
  const { toast } = useToast();

  const name = watch('name', tenant?.name || '');
  const subdomain = watch('subdomain', tenant?.subdomain || '');

  useEffect(() => {
    if (name && !tenant) {
      const newSubdomain = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setValue('subdomain', newSubdomain);
      // Slug mirrors subdomain for internal routing
      setValue('slug', newSubdomain);
    }
  }, [name, setValue, tenant]);

  useEffect(() => {
    if (isSuccess) {
      const submittedName = lastSubmittedValues?.name || watch('name') || tenant?.name || '';
      // If the server returned a created id, include it in the toast for verification.
      const createdId = !tenant && lastActionResult?.id ? lastActionResult.id : undefined;
      toast({
        title: tenant ? 'Store Updated' : 'Store Created',
        description: createdId
          ? `The store "${submittedName}" has been saved successfully (id: ${createdId}).`
          : `The store "${submittedName}" has been saved successfully.`,
      });
      // Dispatch a global event so list pages can optimistically show the new tenant.
      try {
        if (typeof window !== 'undefined') {
          const payload = lastActionResult?.tenant || (lastActionResult?.id ? {
            id: lastActionResult.id,
            name: submittedName,
            subdomain: lastSubmittedValues?.subdomain || subdomain,
            slug: lastSubmittedValues?.subdomain || subdomain, // slug mirrors subdomain
            storeName: lastSubmittedValues?.storeName || '',
          } : null);
          if (payload) {
            window.dispatchEvent(new CustomEvent('tenant-created', { detail: payload }));
          }
        }
      } catch (e) {
        // swallow any errors dispatching the event
      }
      onSuccess();
    }
  }, [isSuccess, onSuccess, tenant, watch, toast, lastSubmittedValues, lastActionResult, subdomain]);

  return (
    <div className="space-y-6">
      <form id="tenant-form" action={formAction} className="space-y-6">
        <input type="hidden" {...register('id')} value={tenant?.id || ''} />
        
        {/* Basic Information */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Team/Organization Name
            </Label>
            <Input 
              id="name" 
              {...register('name')} 
              placeholder="e.g. Vohon Dance Club" 
              className="h-10"
            />
            {formErrors.name && (
              <p className="text-sm text-destructive">{formErrors.name[0]}</p>
            )}
            <p className="text-xs text-muted-foreground">
              The name of your team or organization
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="storeName" className="text-sm font-medium">
              Store Display Name
            </Label>
            <Input
              id="storeName"
              {...register('storeName')}
              placeholder="e.g. Vohon Dance Club Store"
              className="h-10"
            />
            {formErrors.storeName && (
              <p className="text-sm text-destructive">
                {formErrors.storeName[0]}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              The name that will appear on your storefront
            </p>
          </div>

          {/* Hidden slug field - automatically synced with subdomain */}
          <input type="hidden" {...register('slug')} />

          <div className="space-y-2">
            <Label htmlFor="subdomain" className="text-sm font-medium">
              Custom Subdomain
            </Label>
            <div className="flex items-center space-x-2">
              <Input 
                id="subdomain" 
                {...register('subdomain')} 
                placeholder="e.g. vohon" 
                className="h-10 flex-1"
                onChange={(e) => {
                  const value = e.target.value;
                  setValue('subdomain', value);
                  setValue('slug', value); // Keep slug in sync
                }}
              />
              <span className="text-sm text-muted-foreground">.swagstore.ca</span>
            </div>
            {formErrors.subdomain && (
              <p className="text-sm text-destructive">{formErrors.subdomain[0]}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Your unique store URL (letters, numbers, and hyphens only)
            </p>
          </div>
        </div>

        {/* Preview Section */}
        {subdomain && (
          <Card className="bg-muted/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Store URL Preview
              </CardTitle>
              <CardDescription>
                Your store will be accessible at this URL
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Badge variant="default" className="gap-1">
                  <Store className="h-3 w-3" />
                  Store URL
                </Badge>
                <code className="text-sm bg-background px-2 py-1 rounded border font-semibold text-blue-600">
                  https://{subdomain}.swagstore.ca
                </code>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button
            type="submit"
            disabled={formState.isSubmitting}
            className="min-w-[120px]"
          >
            {formState.isSubmitting ? 'Creating...' : (tenant ? 'Update Store' : 'Create Store')}
          </Button>
        </div>
      </form>
    </div>
  );
}
