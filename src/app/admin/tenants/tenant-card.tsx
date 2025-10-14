'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Store, Globe, ExternalLink, Edit, Trash2 } from 'lucide-react';
import type { Tenant } from '@/lib/types';

interface TenantCardProps {
  tenant: Tenant;
  onEdit: (tenant: Tenant) => void;
  onDelete: (tenantId: string) => void;
}

export function TenantCard({ tenant, onEdit, onDelete }: TenantCardProps) {
  const subdomainUrl = `https://${tenant.subdomain}.swagstore.ca`;
  const fallbackUrl = `https://swagstore.ca/${tenant.slug}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            {tenant.storeName}
          </div>
          {tenant.isActive ? (
            <Badge variant="default" className="bg-green-600">Active</Badge>
          ) : (
            <Badge variant="secondary">Inactive</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Team: {tenant.name}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-600" />
            <div className="flex-1">
              <p className="text-sm font-medium">Custom Domain</p>
              <p className="font-mono text-sm text-blue-600">{subdomainUrl}</p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => window.open(subdomainUrl, '_blank')}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-gray-600" />
            <div className="flex-1">
              <p className="text-sm font-medium">Fallback URL</p>
              <p className="font-mono text-sm text-gray-600">{fallbackUrl}</p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => window.open(fallbackUrl, '_blank')}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(tenant)}
            className="flex-1"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Store
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(tenant.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
