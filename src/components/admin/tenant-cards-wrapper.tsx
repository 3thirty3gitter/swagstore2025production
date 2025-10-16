'use client';

import { TenantCards } from '@/components/admin/tenant-cards';
import type { Tenant } from '@/lib/types';
import { useState, useEffect } from 'react';

type TenantCardsWrapperProps = {
  initialTenants: Tenant[];
};

export function TenantCardsWrapper({ initialTenants }: TenantCardsWrapperProps) {
  const [tenants, setTenants] = useState<Tenant[]>(initialTenants);

  useEffect(() => {
    const handler = (e: any) => {
      const detail = e.detail as Tenant;
      setTenants((prev) => {
        // Avoid duplicates
        if (prev.find((t) => t.id === detail.id)) return prev;
        return [detail, ...prev];
      });
    };
    window.addEventListener('tenant-created', handler as EventListener);
    return () => window.removeEventListener('tenant-created', handler as EventListener);
  }, []);

  return <TenantCards tenants={tenants} />;
}
