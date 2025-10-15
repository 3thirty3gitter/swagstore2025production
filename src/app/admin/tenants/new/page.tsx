'use client';

import { TenantForm } from '@/components/admin/tenant-form';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

export default function NewTenantPage() {
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // no-op: page only renders the TenantForm; success handling handled in TenantForm via onSuccess prop
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-4">Create New Tenant</h1>
      <div className="bg-card p-6 rounded-md">
        <TenantForm onSuccess={() => router.push('/admin/tenants')} />
      </div>
    </div>
  );
}
