'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { TenantForm } from './tenant-form';
import type { Tenant } from '@/lib/types';

type TenantFormDialogProps = {
  tenant?: Tenant | null;
  children: React.ReactNode;
};

export function TenantFormDialog({ tenant, children }: TenantFormDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {tenant ? 'Edit Store' : 'Create New Store'}
          </DialogTitle>
        </DialogHeader>
        <TenantForm tenant={tenant} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
