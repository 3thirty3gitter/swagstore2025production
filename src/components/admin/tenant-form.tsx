'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Store, ExternalLink, X } from 'lucide-react';
import type { Tenant } from '@/lib/types';

interface TenantFormProps {
  tenant?: Tenant | null;
  onSave: (tenant: Partial<Tenant>) => void;
  onCancel: () => void;
  creating?: boolean;
}

export function TenantForm({ tenant, onSave, onCancel, creating = false }: TenantFormProps) {
  const [formData, setFormData] = useState({
    name: tenant?.name || '',
    slug: tenant?.slug || '',
    subdomain: tenant?.subdomain || '',
    storeName: tenant?.storeName || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleSubdomainChange = (value: string) => {
    // Auto-sync subdomain and slug
    const cleanValue = value.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 50);
    setFormData(prev => ({
      ...prev,
      subdomain: cleanValue,
      slug: cleanValue // Keep them in sync
    }));
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Store className="w-5 h-5" />
          {tenant ? 'Edit Tenant Store' : 'Create New Tenant Store'}
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Team/Organization Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Vohon Dance"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="storeName">Store Display Name</Label>
              <Input
                id="storeName"
                value={formData.storeName}
                onChange={(e) => setFormData(prev => ({ ...prev, storeName: e.target.value }))}
                placeholder="Vohon Dance Club"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="subdomain" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Custom Subdomain (Primary Store URL)
            </Label>
            <Input
              id="subdomain"
              value={formData.subdomain}
              onChange={(e) => handleSubdomainChange(e.target.value)}
              placeholder="vohon"
              required
            />
            <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-blue-800 mb-1">🌐 Custom Store Domain:</p>
              <p className="font-mono text-blue-900">
                <strong>{formData.subdomain || 'subdomain'}.swagstore.ca</strong>
              </p>
              {formData.subdomain && (
                <a 
                  href={`https://${formData.subdomain}.swagstore.ca`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mt-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  Preview Store
                </a>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              This creates a custom domain for the team's store. Fallback route: /{formData.subdomain}
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-800 mb-2">✅ Subdomain System</h4>
            <div className="text-sm space-y-1">
              <p><strong>Primary URL:</strong> {formData.subdomain || 'subdomain'}.swagstore.ca</p>
              <p><strong>Fallback URL:</strong> swagstore.ca/{formData.subdomain || 'subdomain'}</p>
              <p className="text-green-600">Teams get their own custom domain!</p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1" disabled={creating}>
              {creating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {tenant ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                tenant ? 'Update Store' : 'Create Store'
              )}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
