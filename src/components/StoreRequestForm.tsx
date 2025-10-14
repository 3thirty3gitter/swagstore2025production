'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Send, CheckCircle, Upload, X } from "lucide-react";
import { collection, addDoc } from 'firebase/firestore';
import { CANADIAN_PROVINCES, formatCanadianPostalCode } from '@/lib/canadaData';
import { uploadFile } from '@/lib/actions';
import { useFirebase } from '@/firebase';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

interface StoreRequestData {
  teamName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  teamType: string;
  description: string;
  city: string;
  province: string;
  postalCode: string;
  organizationLevel: string;
  teamSize: string;
  expectedVolume: string;
  urgency: string;
  logoUrl?: string;
}

export default function StoreRequestForm() {
  const [formData, setFormData] = useState<StoreRequestData>({
    teamName: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    teamType: '',
    description: '',
    city: '',
    province: '',
    postalCode: '',
    organizationLevel: '',
    teamSize: '',
    expectedVolume: '',
    urgency: '',
    logoUrl: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const { firestore } = useFirebase();
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Generate slug from team name
  const generateSlug = (teamName: string): string => {
    return teamName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();
  };

  const handleInputChange = (field: keyof StoreRequestData, value: string | boolean) => {
    if (field === 'postalCode' && typeof value === 'string') {
      const formatted = formatCanadianPostalCode(value);
      setFormData(prev => ({ ...prev, [field]: formatted }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Starting logo upload...', file.name);
      setUploadingLogo(true);
      
      try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async (loadEvent) => {
          const dataUrl = loadEvent.target?.result as string;
          if (dataUrl) {
            console.log('File read successful, uploading...');
            const formDataUpload = new FormData();
            formDataUpload.append('dataUrl', dataUrl);
            formDataUpload.append('fileName', file.name);
            
            const result = await uploadFile(null, formDataUpload);
            console.log('Upload result:', result);
            
            if (result.success && result.url) {
              handleInputChange('logoUrl', result.url);
              toast({
                title: 'Logo uploaded!',
                description: 'Your logo has been uploaded successfully.',
              });
            } else {
              toast({
                variant: 'destructive',
                title: 'Upload failed',
                description: result.error || 'Failed to upload logo.',
              });
            }
          }
        };
        reader.onerror = () => {
          console.error('File read error');
          toast({
            variant: 'destructive',
            title: 'Upload failed',
            description: 'Failed to read file.',
          });
        };
      } catch (error) {
        console.error('Logo upload error:', error);
        toast({
          variant: 'destructive',
          title: 'Upload failed',
          description: 'Failed to upload logo.',
        });
      } finally {
        setUploadingLogo(false);
      }
    }
    
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submit started');
    console.log('isClient:', isClient);
    console.log('firestore:', !!firestore);
    
    if (!isClient) {
      console.log('Not client side, returning');
      return;
    }

    if (!firestore) {
      console.log('No firestore connection');
      toast({
        variant: 'destructive',
        title: 'Connection Error',
        description: 'Unable to connect to database. Please try again.',
      });
      return;
    }
    
    if (!formData.teamName || !formData.contactName || !formData.contactEmail) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
      });
      return;
    }

    console.log('Starting form submission...');
    setIsSubmitting(true);
    
    try {
      // Generate slug and subdomain
      const slug = generateSlug(formData.teamName);
      const subdomain = slug;

      console.log('Generated slug:', slug);

      // Create pending tenant with all form data
      const pendingTenant = {
        name: formData.teamName,
        slug: slug,
        subdomain: subdomain,
        storeName: formData.teamName,
        status: 'pending',
        isActive: false,
        
        // Contact information
        contactName: formData.contactName,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        
        // Team information
        teamType: formData.teamType,
        organizationLevel: formData.organizationLevel,
        
        // Location
        city: formData.city,
        province: formData.province,
        postalCode: formData.postalCode,
        
        // Store details
        teamSize: formData.teamSize,
        expectedVolume: formData.expectedVolume,
        urgency: formData.urgency,
        description: formData.description,
        
        // Logo
        logoUrl: formData.logoUrl,
        
        // Timestamps
        submittedAt: new Date(),
        createdAt: new Date(),
      };

      console.log('Creating tenant document...');
      
      // Add to tenants collection as pending
      const docRef = await addDoc(collection(firestore, 'tenants'), pendingTenant);
      console.log('Tenant created with ID:', docRef.id);
      
      // Also keep the original store-requests collection for backwards compatibility
      await addDoc(collection(firestore, 'store-requests'), {
        ...formData,
        submittedAt: new Date(),
        status: 'converted-to-tenant'
      });
      
      console.log('Store request backup created');
      
      setIsSubmitted(true);
      toast({
        title: 'Request Submitted!',
        description: 'Your store request has been submitted successfully.',
      });
      
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: 'Failed to submit your request. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-700 mb-2">Request Submitted!</h2>
          <p className="text-muted-foreground mb-4">
            Thank you for your interest! We've received your store request and will have your 
            custom merchandise store live within 24 hours.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Your store URL will be:</strong><br />
              {generateSlug(formData.teamName)}.swagstore.ca
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Request Your Free SwagStore</CardTitle>
        <CardDescription>
          Fill out this form and we'll set up your custom merchandise store within 24 hours. Serving teams across Canada! 🍁
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Team Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Team Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="teamName">Team/Organization Name *</Label>
                <Input
                  id="teamName"
                  value={formData.teamName}
                  onChange={(e) => handleInputChange('teamName', e.target.value)}
                  placeholder="Your team name"
                  required
                />
                {formData.teamName && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Your store URL: <strong>{generateSlug(formData.teamName)}.swagstore.ca</strong>
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="teamType">Team Type *</Label>
                <Select onValueChange={(value) => handleInputChange('teamType', value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hockey">Hockey Team</SelectItem>
                    <SelectItem value="dance">Dance Studio</SelectItem>
                    <SelectItem value="music">Music Group/Band</SelectItem>
                    <SelectItem value="sports">Sports Team (Other)</SelectItem>
                    <SelectItem value="organization">Organization</SelectItem>
                    <SelectItem value="school">School</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="organizationLevel">Organization Level</Label>
                <Select onValueChange={(value) => handleInputChange('organizationLevel', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recreational">Recreational</SelectItem>
                    <SelectItem value="competitive">Competitive</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="youth">Youth</SelectItem>
                    <SelectItem value="adult">Adult</SelectItem>
                    <SelectItem value="corporate">Corporate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Your city"
                  required
                />
              </div>
              <div>
                <Label htmlFor="province">Province/Territory *</Label>
                <Select onValueChange={(value) => handleInputChange('province', value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select province" />
                  </SelectTrigger>
                  <SelectContent>
                    {CANADIAN_PROVINCES.map((province) => (
                      <SelectItem key={province.code} value={province.code}>
                        {province.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  placeholder="K1A 0A9"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactName">Contact Name *</Label>
                <Input
                  id="contactName"
                  value={formData.contactName}
                  onChange={(e) => handleInputChange('contactName', e.target.value)}
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="contactEmail">Email Address *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="contactPhone">Phone Number</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  placeholder="(416) 123-4567"
                />
              </div>
            </div>
          </div>

          {/* Logo Upload */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Logo (Optional)</h3>
            <div className="space-y-4">
              {formData.logoUrl && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-green-700">Logo Preview:</Label>
                  <div className="relative w-32 h-32 bg-green-50 rounded-md overflow-hidden border-2 border-green-300">
                    <Image 
                      src={formData.logoUrl} 
                      alt="Team logo preview" 
                      fill 
                      className="object-contain p-2"
                      unoptimized
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-1 right-1 bg-background/80 hover:bg-background shadow-sm"
                      onClick={() => handleInputChange('logoUrl', '')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                    <span className="text-green-500">✓</span> Logo uploaded successfully
                  </p>
                </div>
              )}
              <div>
                <input
                  type="file"
                  ref={logoInputRef}
                  onChange={handleLogoUpload}
                  accept="image/*"
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => logoInputRef.current?.click()}
                  disabled={uploadingLogo}
                >
                  {uploadingLogo ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="mr-2 h-4 w-4" />
                  )}
                  {formData.logoUrl ? 'Change Logo' : 'Upload Logo'}
                </Button>
                <p className="text-sm text-muted-foreground mt-1">
                  Upload your logo if available (PNG, JPG, SVG recommended)
                </p>
              </div>
            </div>
          </div>

          {/* Store Details */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Store Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="teamSize">Approximate Team Size *</Label>
                <Input
                  id="teamSize"
                  type="number"
                  value={formData.teamSize}
                  onChange={(e) => handleInputChange('teamSize', e.target.value)}
                  placeholder="25"
                  required
                />
              </div>
              <div>
                <Label htmlFor="expectedVolume">Expected Order Volume *</Label>
                <Select onValueChange={(value) => handleInputChange('expectedVolume', value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select volume" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (1-50 items)</SelectItem>
                    <SelectItem value="medium">Medium (51-200 items)</SelectItem>
                    <SelectItem value="high">High (201-500 items)</SelectItem>
                    <SelectItem value="very-high">Very High (500+ items)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="urgency">When do you need your store? *</Label>
                <Select onValueChange={(value) => handleInputChange('urgency', value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asap">ASAP (within 1 week)</SelectItem>
                    <SelectItem value="2weeks">Within 2 weeks</SelectItem>
                    <SelectItem value="month">Within a month</SelectItem>
                    <SelectItem value="flexible">Flexible timeline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Tell us about your team and merchandise needs</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="What types of products are you most interested in? Hockey jerseys, team hoodies, custom gear? Any special requirements?"
              rows={4}
            />
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting || !formData.teamName || !formData.contactName || !formData.contactEmail || !formData.teamType}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting Request...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit Request
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
