'use client';

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import type {Tenant} from '@/lib/types';
import {saveTenant} from '@/lib/actions';
import {useServerFormState} from '@/hooks/use-server-form-state';
import {useEffect} from 'react';
import { useToast } from '@/hooks/use-toast';

type TenantFormProps = {
  tenant?: Tenant | null;
  onSuccess: () => void;
};

export function TenantForm({tenant, onSuccess}: TenantFormProps) {
  const {
    formState,
    formAction,
    register,
    formErrors,
    watch,
    setValue,
    isSuccess,
  } = useServerFormState(saveTenant, tenant);
  const { toast } = useToast();

  const name = watch('name', tenant?.name || '');

  useEffect(() => {
    if (name) {
      const newSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setValue('slug', newSlug);
    }
  }, [name, setValue]);

  useEffect(() => {
    if(isSuccess) {
      toast({
        title: tenant ? 'Tenant Updated' : 'Tenant Created',
        description: `The tenant "${watch('name')}" has been saved successfully.`,
      });
      onSuccess();
    }
  }, [isSuccess, onSuccess, tenant, watch, toast]);

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{tenant ? 'Edit Tenant' : 'Create New Tenant'}</DialogTitle>
        <DialogDescription>
          Fill in the details for the tenant storefront.
        </DialogDescription>
      </DialogHeader>
      <form id="tenant-form" action={formAction} className="space-y-4 py-4">
        <input type="hidden" {...register('id')} value={tenant?.id || ''} />
        <div className="space-y-2">
          <Label htmlFor="name">Tenant Name</Label>
          <Input id="name" {...register('name')} placeholder="e.g. Acme Inc" />
          {formErrors.name && (
            <p className="text-sm text-destructive">{formErrors.name[0]}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="storeName">Storefront Name</Label>
          <Input
            id="storeName"
            {...register('storeName')}
            placeholder="e.g. Acme's Swag Store"
          />
          {formErrors.storeName && (
            <p className="text-sm text-destructive">
              {formErrors.storeName[0]}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Store Slug</Label>
          <Input id="slug" {...register('slug')} placeholder="e.g. acme-inc" />
          <p className="text-xs text-muted-foreground">
            The unique URL path for the store. e.g. /acme-inc
          </p>
          {formErrors.slug && (
            <p className="text-sm text-destructive">{formErrors.slug[0]}</p>
          )}
        </div>
      </form>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="secondary">
            Cancel
          </Button>
        </DialogClose>
        <Button
          type="submit"
          form="tenant-form"
          disabled={formState.isSubmitting}
        >
          {formState.isSubmitting ? 'Saving...' : 'Save Tenant'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
