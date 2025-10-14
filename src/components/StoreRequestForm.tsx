'use client';

import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Send, CheckCircle, Upload, X } from "lucide-react";
import { CANADIAN_PROVINCES, formatCanadianPostalCode } from '@/lib/canadaData';
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
  const logoInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Generate slug from team name
  const generateSlug = (teamName: string): string => {
    return teamName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') 
      .replace(/\s+/g, '-') 
      .replace(/-+/g, '-') 
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
        reader.onload = async (e) => {
          const dataUrl = e.target?.result as string;
          if (dataUrl) {
            console.log('File read successful, uploading...');
            
            const formData = new FormData();
            formData.append('dataUrl', dataUrl);
            formData.append('fileName', file.name);
            
            const response = await fetch('/api/upload', {
              method: 'POST',
              body: formData,
            });
            
            const result = await response.json();
            console.log('Upload result:', result);
            
            if (result.success && result.url) {
              handleInputChange('logoUrl', result.url);
              toast({
                title: 'Logo uploaded!',
                description: 'Your logo has been uploaded successfully.',
              });
            } else {
              throw new Error(result.error || 'Upload failed');
            }
          }
        };
        
        reader.onerror = () => {
          throw new Error('Failed to read file');
        };
        
        reader.readAsDataURL(file);
        
      } catch (error) {
        console.error('Logo upload error:', error);
        toast({
          variant: 'destructive',
          title: 'Upload failed',
          description: 'Failed to upload logo. Please try again.',
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
      console.log('Form data:', formData);
      
      const response = await fetch('/api/store-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      console.log('API response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error response:', errorData);
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Success result:', result);
      
      setIsSubmitted(true);
      toast({
        title: 'Request Submitted!',
        description: `Your store request for ${formData.teamName} has been submitted successfully.`,
      });
      
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: error instanceof Error ? error.message : 'Please try again.',
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
            Thank you! We've received your store request and will have your 
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
                  <p className="text-xs text-green-600 font-medium">
                    ✓ Logo uploaded successfully
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
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Tell us about your team and merchandise needs</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="What types of products are you most interested in? Hockey jerseys, team hoodies, custom gear?"
              rows={3}
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
                Submit Request
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
