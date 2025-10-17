'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/cart-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useParams, useRouter } from 'next/navigation';
import { Truck, Store, CreditCard, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import SquarePaymentForm from '@/components/store/square-payment-form';
import { calculateCanadianTax, formatCurrency } from '@/lib/tax-calculator';

export default function CheckoutPage() {
  const { items, total: subtotal, clearCart } = useCart();
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const tenantSlug = params.tenantSlug as string;
  
  const [step, setStep] = useState<'details' | 'payment'>('details');
  const [fulfillmentMethod, setFulfillmentMethod] = useState<'shipping' | 'pickup'>('pickup'); // Default to pickup
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'AB',
    postalCode: '',
    country: 'Canada',
  });

  // Calculate taxes based on province
  const taxCalculation = calculateCanadianTax(subtotal, formData.state || 'AB');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePaymentSuccess = async (paymentId: string) => {
    try {
      const orderData = {
        tenantSlug,
        fulfillmentMethod,
        customer: formData,
        items: items.map(item => ({
          productId: item.productId,
          productName: item.productName,
          variantId: item.variantId,
          price: item.price,
          quantity: item.quantity,
          selectedOptions: item.selectedOptions,
        })),
        subtotal: taxCalculation.subtotal,
        tax: {
          gst: taxCalculation.gst,
          pst: taxCalculation.pst,
          hst: taxCalculation.hst,
          totalTax: taxCalculation.totalTax,
          province: formData.state,
          breakdown: taxCalculation.taxBreakdown,
        },
        shipping: 0,
        total: taxCalculation.total,
        paymentId,
        paymentStatus: 'completed',
        status: 'pending',
      };

      console.log('Creating order via API...');
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to create order');
      }

      console.log('Order created:', result.orderId);

      toast({
        title: 'Order placed successfully!',
        description: `Order #${result.orderId.slice(0, 8)} has been created`,
      });

      router.push(`/order-confirmation?orderId=${result.orderId}`);
      
      setTimeout(() => {
        clearCart();
      }, 100);
      
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: 'Order creation failed',
        description: 'Payment was successful but order creation failed. Please contact support.',
        variant: 'destructive',
      });
    }
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: 'Payment failed',
      description: error,
      variant: 'destructive',
    });
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">Add some products before checking out</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Checkout</h1>
      <p className="text-muted-foreground mb-8">
        {step === 'details' ? 'Step 1 of 2: Contact Details' : 'Step 2 of 2: Payment'}
      </p>
      
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {step === 'details' ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Fulfillment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={fulfillmentMethod} onValueChange={(value: 'shipping' | 'pickup') => setFulfillmentMethod(value)}>
                    {/* Shipping - Disabled (Coming Soon) */}
                    <div className="flex items-center space-x-3 border rounded-lg p-4 opacity-50 cursor-not-allowed bg-muted">
                      <RadioGroupItem value="shipping" id="shipping" disabled />
                      <Label htmlFor="shipping" className="flex items-center gap-3 flex-1 cursor-not-allowed">
                        <Truck className="h-5 w-5" />
                        <div>
                          <p className="font-semibold">Shipping</p>
                          <p className="text-sm text-muted-foreground">Coming Soon</p>
                        </div>
                      </Label>
                      <span className="text-sm text-muted-foreground">Coming Soon</span>
                    </div>
                    
                    {/* Pickup - Active */}
                    <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-accent mt-3" onClick={() => setFulfillmentMethod('pickup')}>
                      <RadioGroupItem value="pickup" id="pickup" />
                      <Label htmlFor="pickup" className="flex items-center gap-3 cursor-pointer flex-1">
                        <Store className="h-5 w-5" />
                        <div>
                          <p className="font-semibold">Pickup</p>
                          <p className="text-sm text-muted-foreground">Pick up at store location</p>
                        </div>
                      </Label>
                      <span className="font-semibold">FREE</span>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContinueToPayment} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 rounded-md font-medium"
                    >
                      Continue to Payment
                    </button>
                  </form>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SquarePaymentForm
                  amount={taxCalculation.total}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                  tenantSlug={tenantSlug}
                />
                
                <button
                  onClick={() => setStep('details')}
                  className="w-full mt-4 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8 rounded-md"
                >
                  Back to Details
                </button>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.variantId}`} className="flex justify-between text-sm">
                    <span>
                      {item.productName} × {item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">{formatCurrency(taxCalculation.subtotal)}</span>
                </div>
                
                {/* Tax Breakdown */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">Tax</span>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(taxCalculation.totalTax)}</div>
                    <div className="text-xs text-muted-foreground">{taxCalculation.taxBreakdown}</div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pickup</span>
                  <span className="text-sm font-semibold text-green-600">FREE</span>
                </div>
                
                <div className="border-t pt-2 flex justify-between font-bold text-xl">
                  <span>Total</span>
                  <span>{formatCurrency(taxCalculation.total)} CAD</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}