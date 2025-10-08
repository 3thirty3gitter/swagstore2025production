'use client';

import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { ProductForm } from '@/components/admin/product-form';
import { useState } from 'react';
import type { Product, Tenant } from '@/lib/types';

type ProductFormDialogProps = {
  children: React.ReactNode;
  product?: Product | null;
  tenants: Tenant[];
};

export function ProductFormDialog({ children, product, tenants }: ProductFormDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      {isOpen && <ProductForm product={product} tenants={tenants} onSuccess={() => setIsOpen(false)} />}
    </Dialog>
  );
}
