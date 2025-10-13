'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Send, CheckCircle } from "lucide-react";
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { CANADIAN_PROVINCES, validateCanadianPostalCode, formatCanadianPostalCode } from '@/lib/canadaData';

interface StoreRequestData {
  teamName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  teamType: string;
  organizationType: string;
  location: string;
  province: string;
  postalCode: string;
  teamSize: number;
  expectedOrderVolume: string;
  description: string;
  hasExistingMerch: boolean;
  urgency: string;
}

export default function StoreRequestForm() {
  const [formData, setFormData] = useState<StoreRequestData>({
    teamName: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    teamType: '',
    organizationType: '',
    location: '',
    province: '',
    postalCode: '',
    teamSize: 0,
    expectedOrderVolume: '',
    description: '',
    hasExistingMerch: false,
    urgency: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [postalCodeError, setPostalCodeError] = useState('');

  const handleInputChange = (field: keyof StoreRequestData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Validate postal code on change
    if (field === 'postalCode') {
      const formatted = formatCanadianPostalCode(value);
      setFormData(prev => ({ ...prev, postalCode: formatted }));
      
      if (value && !validateCanadianPostalCode(formatted)) {
        setPostalCodeError('Please enter a valid Canadian postal code (e.g., K1A 0A9)');
      } else {
        setPostalCodeError('');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Validate postal code before submission
    if (formData.postalCode && !validateCanadianPostalCode(formData.postalCode)) {
      setError('Please enter a valid Canadian postal code.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Add to Firestore
      await addDoc(collection(db, 'storeRequests'), {
        ...formData,
        status: 'pending',
        country: 'Canada',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      setIsSubmitted(true);
    } catch (err) {
      console.error('Error submitting request:', err);
      setError('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Request Submitted Successfully!</h3>
          <p className="text-muted-foreground mb-4">
            Thank you for your interest in SwagStore. We'll review your request and get back to you within 24 hours.
          </p>
          <p className="text-sm text-muted-foreground">
            Check your email ({formData.contactEmail}) for confirmation details.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Request Your Free SwagStore</CardTitle>
        <CardDescription>
          Fill out this form and we'll set up your custom merchandise store within 24 hours. Serving teams across Canada! 🍁
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Team Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Team Information</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="teamName">Team/Organization Name *</Label>
                <Input
                  id="teamName"
                  value={formData.teamName}
                  onChange={(e) => handleInputChange('teamName', e.target.value)}
                  placeholder="Maple Leafs Hockey Club"
                  required
                />
              </div>
              <div>
                <Label htmlFor="teamType">Team Type *</Label>
                <Select onValueChange={(value) => handleInputChange('teamType', value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sports">Sports Team</SelectItem>
                    <SelectItem value="hockey">Hockey Team</SelectItem>
                    <SelectItem value="school">School Club</SelectItem>
                    <SelectItem value="nonprofit">Non-Profit</SelectItem>
                    <SelectItem value="community">Community Group</SelectItem>
                    <SelectItem value="corporate">Corporate Team</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="organizationType">Organization Level</Label>
                <Select onValueChange={(value) => handleInputChange('organizationType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="youth">Youth League</SelectItem>
                    <SelectItem value="junior">Junior League</SelectItem>
                    <SelectItem value="highschool">High School</SelectItem>
                    <SelectItem value="college">College/University</SelectItem>
                    <SelectItem value="adult">Adult League</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="location">City *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Toronto, Calgary, Vancouver..."
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  className={postalCodeError ? 'border-red-500' : ''}
                />
                {postalCodeError && (
                  <p className="text-sm text-red-600 mt-1">{postalCodeError}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Contact Information</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactName">Contact Name *</Label>
                <Input
                  id="contactName"
                  value={formData.contactName}
                  onChange={(e) => handleInputChange('contactName', e.target.value)}
                  placeholder="John Smith"
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
                  placeholder="john@mapleleafs.ca"
                  required
                />
              </div>
            </div>

            <div>
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

          {/* Store Details */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Store Details</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="teamSize">Approximate Team Size *</Label>
                <Input
                  id="teamSize"
                  type="number"
                  value={formData.teamSize || ''}
                  onChange={(e) => handleInputChange('teamSize', parseInt(e.target.value) || 0)}
                  placeholder="25"
                  min="1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="expectedOrderVolume">Expected Order Volume *</Label>
                <Select onValueChange={(value) => handleInputChange('expectedOrderVolume', value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select volume" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small (1-50 items/month)</SelectItem>
                    <SelectItem value="medium">Medium (50-200 items/month)</SelectItem>
                    <SelectItem value="large">Large (200+ items/month)</SelectItem>
                    <SelectItem value="seasonal">Seasonal (1-2 big orders/year)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="urgency">When do you need your store? *</Label>
              <Select onValueChange={(value) => handleInputChange('urgency', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asap">ASAP (within 1 week)</SelectItem>
                  <SelectItem value="soon">Soon (within 2-4 weeks)</SelectItem>
                  <SelectItem value="flexible">Flexible (within 2 months)</SelectItem>
                  <SelectItem value="planning">Just planning ahead</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
              {error}
            </div>
          )}

          <Button type="submit" disabled={isSubmitting || !!postalCodeError} className="w-full">
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