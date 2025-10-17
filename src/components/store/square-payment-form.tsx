'use client';

import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, Shield, Lock } from 'lucide-react';

interface SquarePaymentFormProps {
  amount: number;
  onPaymentSuccess: (paymentId: string) => void;
  onPaymentError: (error: string) => void;
  tenantSlug: string;
}

export default function SquarePaymentForm({
  amount,
  onPaymentSuccess,
  onPaymentError,
  tenantSlug,
}: SquarePaymentFormProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [card, setCard] = useState<any>(null);
  const [squareSettings, setSquareSettings] = useState<any>(null);
  const cardInitialized = useRef(false);

  useEffect(() => {
    if (!cardInitialized.current) {
      loadSquareSettings();
      cardInitialized.current = true;
    }

    return () => {
      if (card) {
        try {
          card.destroy();
        } catch (e) {
          // Ignore errors during cleanup
        }
      }
    };
  }, []);

  const loadSquareSettings = async () => {
    try {
      console.log('Loading Square settings from API...');
      const response = await fetch('/api/admin/settings/payment');
      
      if (!response.ok) {
        throw new Error('Failed to load payment settings');
      }

      const result = await response.json();
      console.log('Payment settings loaded:', result);

      if (result.success && result.data && result.data.square) {
        const square = result.data.square;
        if (square.enabled) {
          console.log('Square is enabled, initializing...');
          setSquareSettings(square);
          await initializeSquare(square);
        } else {
          console.log('Square is not enabled');
          setIsLoading(false);
          onPaymentError('Square payment is not configured. Please contact the store administrator.');
        }
      } else {
        console.log('No Square settings found');
        setIsLoading(false);
        onPaymentError('Payment settings not found. Please contact the store administrator.');
      }
    } catch (error) {
      console.error('Error loading Square settings:', error);
      setIsLoading(false);
      onPaymentError('Failed to load payment settings');
    }
  };

  const initializeSquare = async (settings: any) => {
    try {
      if ((window as any).Square) {
        await attachCard(settings);
        return;
      }

      const script = document.createElement('script');
      const scriptUrl = settings.environment === 'production'
        ? 'https://web.squarecdn.com/v1/square.js'
        : 'https://sandbox.web.squarecdn.com/v1/square.js';
      
      script.src = scriptUrl;
      script.async = true;
      document.body.appendChild(script);

      script.onload = async () => {
        await attachCard(settings);
      };

      script.onerror = () => {
        setIsLoading(false);
        onPaymentError('Failed to load Square payment SDK');
      };
    } catch (error: any) {
      console.error('Error loading Square:', error);
      setIsLoading(false);
      onPaymentError('Failed to initialize payment form');
    }
  };

  const attachCard = async (settings: any) => {
    try {
      const Square = (window as any).Square;
      if (!Square) {
        setIsLoading(false);
        onPaymentError('Square SDK failed to load');
        return;
      }

      const payments = Square.payments(settings.applicationId, settings.locationId);
      const cardElement = await payments.card();
      await cardElement.attach('#card-container');
      setCard(cardElement);
      setIsLoading(false);
    } catch (error: any) {
      console.error('Square initialization error:', error);
      setIsLoading(false);
      onPaymentError('Failed to initialize payment form');
    }
  };

  const handlePayment = async () => {
    if (!card) return;

    setIsProcessing(true);

    try {
      const result = await card.tokenize();
      if (result.status === 'OK') {
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sourceId: result.token,
            amount: amount,
            currency: 'CAD', // Changed from USD to CAD
            tenantSlug,
          }),
        });

        const data = await response.json();

        if (data.success) {
          onPaymentSuccess(data.payment.id);
        } else {
          onPaymentError(data.error || 'Payment failed');
        }
      } else {
        onPaymentError('Card validation failed. Please check your card details.');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      onPaymentError(error.message || 'Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      {squareSettings?.environment === 'sandbox' && (
        <Alert>
          <CreditCard className="h-4 w-4" />
          <AlertDescription>
            <strong>Test Mode:</strong> Use card number 4111 1111 1111 1111 with any future expiry and CVV
          </AlertDescription>
        </Alert>
      )}

      <div id="card-container" className="min-h-[120px] bg-white rounded-lg">
        {isLoading && (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Secure Payment Badge */}
      <div className="flex items-center justify-center gap-6 p-4 bg-muted/50 rounded-lg border">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-600" />
          <Lock className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium">Secure Payment</span>
        </div>
        <div className="h-6 w-px bg-border" />
        <div className="flex items-center gap-2">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4.01 8.38A4.19 4.19 0 0 0 0 12.49v7.32A4.19 4.19 0 0 0 4.19 24h15.62A4.19 4.19 0 0 0 24 19.81v-7.32a4.19 4.19 0 0 0-4.01-4.11L12.18 0zm7.63 9.45a1.44 1.44 0 1 1 0-2.88 1.44 1.44 0 0 1 0 2.88z"/>
          </svg>
          <span className="text-sm font-medium">Powered by Square</span>
        </div>
      </div>

      <div className="text-center text-xs text-muted-foreground">
        <p className="flex items-center justify-center gap-1">
          <Lock className="h-3 w-3" />
          Your payment information is encrypted and securely processed by Square.
        </p>
        <p className="mt-1">
          We never store your complete card details on our servers.
        </p>
      </div>

      <Button
        onClick={handlePayment}
        disabled={isLoading || isProcessing}
        size="lg"
        className="w-full"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing Payment...
          </>
        ) : (
          `Pay $${amount.toFixed(2)} CAD`
        )}
      </Button>
    </div>
  );
}
