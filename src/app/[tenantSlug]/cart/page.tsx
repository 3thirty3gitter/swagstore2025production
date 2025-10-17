'use client';

import { useCart } from '@/contexts/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Trash2, Plus, Minus } from 'lucide-react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart();

  const getImageSrc = (image: string | undefined) => {
    if (!image) return '/placeholder.png';
    if (typeof image === 'string') return image;
    return '/placeholder.png';
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">Add some products to get started!</p>
        <Link href="/">
          <Button size="lg">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart ({itemCount} items)</h1>
      
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={`${item.productId}-${item.variantId}`}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="relative w-24 h-24 flex-shrink-0 rounded overflow-hidden">
                    <Image
                      src={getImageSrc(item.image)}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.productName}</h3>
                    {Object.entries(item.selectedOptions).map(([key, value]) => (
                      <p key={key} className="text-sm text-muted-foreground capitalize">
                        {key}: {value}
                      </p>
                    ))}
                    <p className="font-bold mt-2">${item.price.toFixed(2)}</p>
                  </div>
                  
                  <div className="flex flex-col items-end justify-between">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.productId, item.variantId)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <p className="text-sm font-semibold mt-2">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div>
          <Card className="sticky top-20">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-2xl font-bold">Order Summary</h2>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-sm">Calculated at checkout</span>
                </div>
                <div className="border-t pt-4 flex justify-between font-bold text-xl">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              
              <Link href="/checkout" className="block">
                <Button size="lg" className="w-full">
                  Proceed to Checkout
                </Button>
              </Link>
              
              <Link href="/">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
