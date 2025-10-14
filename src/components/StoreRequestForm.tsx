'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Send, CheckCircle, Upload, X } from "lucide-react";
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { CANADIAN_PROVINCES, validateCanadianPostalCode, formatCanadianPostalCode } from '@/lib/canadaData';
import { uploadFile } from '@/lib/actions';
import Image from 'next/image';

interface StoreRequestData {
  teamName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  teamType: string;
  description: string;
  hasExistingMerch: boolean;
  urgency: string;
  city: string;
  province: string;
  postalCode: string;
  organizationLevel: string;
  teamSize: string;
  expectedVolume: string;
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
    hasExistingMerch: false,
    urgency: '',
    city: '',
    province: '',
    postalCode: '',
    organizationLevel: '',
    teamSize: '',
    expectedVolume: '',
    logoUrl: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const logoInputRef = useRef<HTMLInputElement>(null);

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
      setUploadingLogo(true);
      
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async (loadEvent) => {
        const dataUrl = loadEvent.target?.result as string;
        if (dataUrl) {
          const formDataUpload = new FormData();
          formDataUpload.append('dataUrl', dataUrl);
          formDataUpload.append('fileName', file.name);
          
          const result = await uploadFile(null, formDataUpload);
          
          if (result.success && result.url) {
            handleInputChange('logoUrl', result.url);
          }
        }
      };
      setUploadingLogo(false);
    }
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isClient) return;
    
    if (!formData.teamName || !formData.contactName || !formData.contactEmail) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await addDoc(collection(db, 'store-requests'), {
        ...formData,
        submittedAt: new Date(),
        status: 'pending'
      });
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
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
          <p className="text-muted-foreground">
            Thank you for your interest! We'll be in touch within 24 hours to discuss your custom store.
          </p>
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
              </div>
              <div>
                <Label htmlFor="teamType">Team Type *</Label>
                <Select onValueChange={(value) => handleInputChange('teamType', value)}>
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
                <Select onValueChange={(value) => handleInputChange('province', value)}>
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
                <div className="relative w-32 h-32 bg-muted rounded-md overflow-hidden">
                  <Image src={formData.logoUrl} alt="Team logo" fill className="object-contain" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-1 right-1 bg-background/80 hover:bg-background"
                    onClick={() => handleInputChange('logoUrl', '')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
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
                  Upload Logo
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
                <Select onValueChange={(value) => handleInputChange('expectedVolume', value)}>
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
                <Select onValueChange={(value) => handleInputChange('urgency', value)}>
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
            disabled={isSubmitting || !formData.teamName || !formData.contactName || !formData.contactEmail}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting Request...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit Store Request
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
