'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Check, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PaymentIntegrations() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [stripe, setStripe] = useState({
    enabled: false,
    publishableKey: '',
    secretKey: '',
  });

  const [square, setSquare] = useState({
    enabled: false,
    environment: 'sandbox',
    applicationId: '',
    accessToken: '',
    locationId: '',
  });

  useEffect(() => {
    console.log('PaymentIntegrations: loading settings from API');
    loadSettings();
  }, []);

  const loadSettings = async () => {
    console.log('loadSettings called');
    
    try {
      console.log('Loading payment settings from API...');
      const response = await fetch('/api/admin/settings/payment');
      
      if (!response.ok) {
        throw new Error('Failed to load settings');
      }

      const result = await response.json();
      console.log('Settings loaded:', result);

      if (result.success && result.data) {
        if (result.data.stripe) setStripe(result.data.stripe);
        if (result.data.square) setSquare(result.data.square);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      console.log('Setting loading to false');
      setLoading(false);
    }
  };

  const handleSaveStripe = async () => {
    setSaving(true);

    try {
      // Use API route instead of direct Firestore access
      const response = await fetch('/api/admin/settings/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stripe }),
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      toast({
        title: 'Stripe settings saved',
        description: 'Your Stripe integration has been configured',
      });
    } catch (error) {
      console.error('Error saving:', error);
      toast({
        title: 'Error',
        description: 'Failed to save Stripe settings',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSquare = async () => {
    setSaving(true);

    try {
      // Use API route instead of direct Firestore access
      const response = await fetch('/api/admin/settings/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ square }),
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      toast({
        title: 'Square settings saved',
        description: 'Your Square integration has been configured',
      });
    } catch (error) {
      console.error('Error saving:', error);
      toast({
        title: 'Error',
        description: 'Failed to save Square settings',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stripe Integration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded">
                <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <CardTitle>Stripe</CardTitle>
                <CardDescription>Accept payments via Stripe</CardDescription>
              </div>
            </div>
            {stripe.enabled && (
              <Badge variant="default" className="gap-1">
                <Check className="h-3 w-3" />
                Active
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="stripe-enabled">Enable Stripe</Label>
            <Switch
              id="stripe-enabled"
              checked={stripe.enabled}
              onCheckedChange={(checked) => setStripe({ ...stripe, enabled: checked })}
            />
          </div>

          {stripe.enabled && (
            <>
              <div className="space-y-2">
                <Label htmlFor="stripe-publishable">Publishable Key</Label>
                <Input
                  id="stripe-publishable"
                  placeholder="pk_test_..."
                  value={stripe.publishableKey}
                  onChange={(e) => setStripe({ ...stripe, publishableKey: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stripe-secret">Secret Key</Label>
                <Input
                  id="stripe-secret"
                  type="password"
                  placeholder="sk_test_..."
                  value={stripe.secretKey}
                  onChange={(e) => setStripe({ ...stripe, secretKey: e.target.value })}
                />
              </div>

              <Button onClick={handleSaveStripe} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Stripe Settings'
                )}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Square Integration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded">
                <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle>Square</CardTitle>
                <CardDescription>Accept payments via Square</CardDescription>
              </div>
            </div>
            {square.enabled && (
              <Badge variant="default" className="gap-1">
                <Check className="h-3 w-3" />
                Active
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="square-enabled">Enable Square</Label>
            <Switch
              id="square-enabled"
              checked={square.enabled}
              onCheckedChange={(checked) => setSquare({ ...square, enabled: checked })}
            />
          </div>

          {square.enabled && (
            <>
              <div className="space-y-2">
                <Label htmlFor="square-environment">Environment</Label>
                <Select
                  value={square.environment}
                  onValueChange={(value) => setSquare({ ...square, environment: value })}
                >
                  <SelectTrigger id="square-environment">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sandbox">Sandbox (Testing)</SelectItem>
                    <SelectItem value="production">Production (Live)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Use Sandbox for testing, Production for live payments
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="square-app-id">Application ID</Label>
                <Input
                  id="square-app-id"
                  placeholder={square.environment === 'sandbox' ? 'sandbox-sq0idb-...' : 'sq0idp-...'}
                  value={square.applicationId}
                  onChange={(e) => setSquare({ ...square, applicationId: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Found in Square Developer Dashboard under Applications
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="square-token">Access Token</Label>
                <Input
                  id="square-token"
                  type="password"
                  placeholder="EAAAl..."
                  value={square.accessToken}
                  onChange={(e) => setSquare({ ...square, accessToken: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Generate in Square Developer Dashboard under OAuth
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="square-location">Location ID</Label>
                <Input
                  id="square-location"
                  placeholder="L..."
                  value={square.locationId}
                  onChange={(e) => setSquare({ ...square, locationId: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Your Square business location ID
                </p>
              </div>

              <div className="rounded-lg bg-muted p-4 text-sm">
                <h4 className="font-semibold mb-2">Setup Instructions:</h4>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                  <li>Go to Square Developer Dashboard</li>
                  <li>Create or select your application</li>
                  <li>Copy the Application ID</li>
                  <li>Generate an Access Token under OAuth</li>
                  <li>Get your Location ID from Locations</li>
                </ol>
              </div>

              <Button onClick={handleSaveSquare} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Square Settings'
                )}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
