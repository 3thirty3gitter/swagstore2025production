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
  } = useServerFormState(saveTenant, tenant);
  const { toast } = useToast();

  const name = watch('name', tenant?.name || '');
  const slug = watch('slug', tenant?.slug || '');

  useEffect(() => {
    if (name && !tenant) {
      const newSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setValue('slug', newSlug);
    }
  }, [name, setValue, tenant]);

  useEffect(() => {
    if (isSuccess) {
      const submittedName = lastSubmittedValues?.name || watch('name') || tenant?.name || '';
      toast({
        title: tenant ? 'Store Updated' : 'Store Created',
        description: `The store "${submittedName}" has been saved successfully.`,
      });
      onSuccess();
    }
  }, [isSuccess, onSuccess, tenant, watch, toast, lastSubmittedValues]);

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

          <div className="space-y-2">
            <Label htmlFor="slug" className="text-sm font-medium">
              Custom Subdomain
            </Label>
            <div className="flex items-center space-x-2">
              <Input 
                id="slug" 
                {...register('slug')} 
                placeholder="e.g. vohon" 
                className="h-10 flex-1"
              />
              <span className="text-sm text-muted-foreground">.swagstore.ca</span>
            </div>
            {formErrors.slug && (
              <p className="text-sm text-destructive">{formErrors.slug[0]}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Your unique store URL (letters, numbers, and hyphens only)
            </p>
          </div>
        </div>

        {/* Preview Section */}
        {slug && (
          <Card className="bg-muted/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Store Preview
              </CardTitle>
              <CardDescription>
                Your store will be accessible at these URLs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge variant="default" className="gap-1">
                  <Store className="h-3 w-3" />
                  Primary
                </Badge>
                <code className="text-sm bg-background px-2 py-1 rounded border">
                  https://{slug}.swagstore.ca
                </code>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="gap-1">
                  <Globe className="h-3 w-3" />
                  Fallback
                </Badge>
                <code className="text-sm bg-background px-2 py-1 rounded border">
                  https://swagstore.ca/{slug}
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
