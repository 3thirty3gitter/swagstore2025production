'use client';

import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { TenantForm } from '@/components/admin/tenant-form';
import { useState } from 'react';
import type { Tenant } from '@/lib/types';

type TenantFormDialogProps = {
  children: React.ReactNode;
  tenant?: Tenant | null;
};

export function TenantFormDialog({ children, tenant }: TenantFormDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      {isOpen && <TenantForm tenant={tenant} onSuccess={() => setIsOpen(false)} />}
    </Dialog>
  );
}
