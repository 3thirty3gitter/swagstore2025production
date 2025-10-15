'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  CheckCircle, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Users, 
  ExternalLink,
  Search,
  Calendar,
  Settings,
  Plus,
  ArrowLeft
} from 'lucide-react';
import Image from 'next/image';

export default function TenantsPage() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [filteredTenants, setFilteredTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function fetchTenants() {
      try {
        const response = await fetch('/api/admin/tenants');
        const data = await response.json();
        setTenants(data.tenants || []);
        setFilteredTenants(data.tenants || []);
      } catch (e) {
        console.error('Failed to fetch tenants:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchTenants();
  }, []);

  useEffect(() => {
    const filtered = tenants.filter(tenant => 
      tenant.storeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.contactEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.subdomain?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.city?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTenants(filtered);
  }, [searchTerm, tenants]);

  const handleVisitStore = (subdomain: string) => {
    window.open(`https://${subdomain}.swagstore.ca`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading tenants...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Active Tenants</h1>
          <p className="text-muted-foreground mt-1">Manage approved team storefronts</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="text-sm px-3 py-1">
            {filteredTenants.length} active stores
          </Badge>
          <Button 
            onClick={() => router.push('/admin/tenants/pending')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            View Pending
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search stores, emails, or subdomains..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredTenants.length === 0 ? (
        <div className="flex flex-col justify-center items-center py-16">
          {searchTerm ? (
            <>
              <Search className="h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">No matching stores found</h2>
              <p className="text-muted-foreground mb-4">Try adjusting your search terms</p>
              <Button onClick={() => setSearchTerm('')} variant="outline">
                Clear search
              </Button>
            </>
          ) : (
            <>
              <CheckCircle className="h-12 w-12 text-blue-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">No active stores yet</h2>
              <p className="text-muted-foreground mb-4">Approved tenants will appear here</p>
              <Button onClick={() => router.push('/admin/tenants/pending')}>
                Review pending requests
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredTenants.map((tenant: any) => (
            <Card key={tenant.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    {tenant.logoUrl && (
                      <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                        <Image 
                          src={tenant.logoUrl} 
                          alt={`${tenant.storeName} logo`} 
                          width={64} 
                          height={64} 
                          className="object-contain"
                        />
                      </div>
                    )}
                    <div>
                      <CardTitle className="text-xl">{tenant.storeName}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Globe className="h-4 w-4" />
                        <button
                          onClick={() => handleVisitStore(tenant.subdomain)}
                          className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                        >
                          {tenant.subdomain}.swagstore.ca
                          <ExternalLink className="h-3 w-3" />
                        </button>
                      </CardDescription>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {tenant.teamType || 'Team'}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {tenant.city}, {tenant.province}
                        </span>
                        {tenant.approvedAt && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Approved {new Date(tenant.approvedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                      Active
                    </Badge>
                    {tenant.isActive && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Live
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-900">Contact Information</p>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <a 
                          href={`mailto:${tenant.contactEmail}`}
                          className="hover:text-blue-600 hover:underline"
                        >
                          {tenant.contactEmail || 'No email'}
                        </a>
                      </div>
                      {tenant.contactPhone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <a 
                            href={`tel:${tenant.contactPhone}`}
                            className="hover:text-blue-600 hover:underline"
                          >
                            {tenant.contactPhone}
                          </a>
                        </div>
                      )}
                      <div className="text-xs text-gray-500 mt-1">
                        Contact: {tenant.contactName || 'No contact name'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-900">Store Details</p>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>Team Size: {tenant.teamSize || '—'}</div>
                      <div>Expected Volume: {tenant.expectedVolume || '—'}</div>
                      <div>Status: {tenant.status || 'active'}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-900">Performance</p>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>SwagBucks: 0 earned</div>
                      <div>Orders: 0 total</div>
                      <div>Revenue: $0.00</div>
                    </div>
                  </div>
                </div>

                {tenant.description && (
                  <div className="bg-muted/40 p-3 rounded-md">
                    <p className="text-sm font-medium mb-1">Notes</p>
                    <p className="text-sm text-gray-700">{tenant.description}</p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="text-xs text-gray-500">
                    Created: {tenant.approvedAt ? new Date(tenant.approvedAt).toLocaleDateString() : 'Unknown'}
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleVisitStore(tenant.subdomain)}
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Visit Store
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Settings className="h-4 w-4" />
                      Manage
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
