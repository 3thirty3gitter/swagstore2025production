'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Globe, Mail, Phone, MapPin, Users, Check, X, AlertCircle } from 'lucide-react';
import Image from 'next/image';

export default function TenantDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [tenant, setTenant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    storeName: '',
    subdomain: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    teamType: '',
    city: '',
    province: '',
    teamSize: '',
    expectedVolume: '',
    urgency: '',
    description: '',
    logoUrl: ''
  });

  useEffect(() => {
    async function fetchTenant() {
      try {
        const response = await fetch(`/api/admin/tenants/pending/${id}`);
        if (!response.ok) {
          throw new Error('Tenant not found');
        }
        const data = await response.json();
        const tenantData = data.tenant;
        
        setTenant(tenantData);
        setFormData({
          storeName: tenantData.storeName || tenantData.name || '',
          subdomain: tenantData.subdomain || '',
          contactName: tenantData.contactName || '',
          contactEmail: tenantData.contactEmail || '',
          contactPhone: tenantData.contactPhone || '',
          teamType: tenantData.teamType || '',
          city: tenantData.city || '',
          province: tenantData.province || '',
          teamSize: tenantData.teamSize || '',
          expectedVolume: tenantData.expectedVolume || '',
          urgency: tenantData.urgency || '',
          description: tenantData.description || '',
          logoUrl: tenantData.logoUrl || ''
        });
      } catch (e) {
        console.error('Failed to fetch tenant:', e);
        setMessage('Failed to load tenant details');
      } finally {
        setLoading(false);
      }
    }
    
    if (id) {
      fetchTenant();
    }
  }, [id]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (field === 'storeName') {
      const slug = value.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim();
      setFormData(prev => ({
        ...prev,
        subdomain: slug
      }));
    }
  };

  const handleApprove = async () => {
    setSubmitting(true);
    try {
      const response = await fetch(`/api/admin/tenants/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tenantId: id,
          ...formData
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to approve tenant');
      }

      setMessage(`✅ ${formData.storeName} storefront has been created successfully!`);
      setTimeout(() => router.push('/admin/tenants/pending'), 2000);
    } catch (e) {
      console.error('Failed to approve tenant:', e);
      setMessage('❌ Failed to approve tenant');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    setSubmitting(true);
    try {
      const response = await fetch(`/api/admin/tenants/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tenantId: id
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to reject tenant');
      }

      setMessage('Tenant request has been rejected');
      setTimeout(() => router.push('/admin/tenants/pending'), 1500);
    } catch (e) {
      console.error('Failed to reject tenant:', e);
      setMessage('❌ Failed to reject tenant');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading tenant details...</div>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Tenant Not Found</h2>
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          onClick={() => router.back()} 
          variant="outline" 
          size="sm"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Review Tenant Request</h1>
          <p className="text-muted-foreground">Edit details before approval</p>
        </div>
      </div>

      {message && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          {message}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name *</Label>
                  <Input
                    id="storeName"
                    value={formData.storeName}
                    onChange={(e) => handleInputChange('storeName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subdomain">Subdomain *</Label>
                  <div className="flex">
                    <Input
                      id="subdomain"
                      value={formData.subdomain}
                      onChange={(e) => handleInputChange('subdomain', e.target.value)}
                      className="rounded-r-none"
                    />
                    <div className="bg-muted px-3 py-2 rounded-r border border-l-0 text-sm">
                      .swagstore.ca
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Contact Name *</Label>
                  <Input
                    id="contactName"
                    value={formData.contactName}
                    onChange={(e) => handleInputChange('contactName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Phone</Label>
                <Input
                  id="contactPhone"
                  value={formData.contactPhone}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Team Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="teamType">Team Type</Label>
                  <Select value={formData.teamType} onValueChange={(value) => handleInputChange('teamType', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hockey">Hockey</SelectItem>
                      <SelectItem value="Soccer">Soccer</SelectItem>
                      <SelectItem value="Basketball">Basketball</SelectItem>
                      <SelectItem value="Dance">Dance</SelectItem>
                      <SelectItem value="Music">Music</SelectItem>
                      <SelectItem value="School">School</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="province">Province</Label>
                  <Select value={formData.province} onValueChange={(value) => handleInputChange('province', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AB">Alberta</SelectItem>
                      <SelectItem value="BC">British Columbia</SelectItem>
                      <SelectItem value="ON">Ontario</SelectItem>
                      <SelectItem value="QC">Quebec</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Notes</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-3 bg-muted/50 rounded-lg mb-4">
                <p className="font-medium">{formData.storeName || 'Store Name'}</p>
                <p className="text-sm text-muted-foreground">
                  {formData.subdomain || 'subdomain'}.swagstore.ca
                </p>
              </div>
              
              <div className="text-sm space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {formData.contactEmail}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {formData.city}, {formData.province}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={handleApprove} 
                disabled={submitting || !formData.storeName || !formData.contactEmail}
                className="w-full"
                size="lg"
              >
                {submitting ? 'Processing...' : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Approve & Create Store
                  </>
                )}
              </Button>
              
              <Button 
                onClick={handleReject} 
                disabled={submitting}
                variant="destructive" 
                className="w-full"
              >
                <X className="h-4 w-4 mr-2" />
                Reject Request
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
