'use client';

import { useState } from 'react';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/contexts/cart-context';
import { useToast } from '@/hooks/use-toast';

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { toast } = useToast();

  const selectedVariant = product.variants?.find(variant => {
    return Object.entries(selectedOptions).every(
      ([key, value]) => variant[key] === value
    );
  });

  const activeVariant = selectedVariant || product.variants?.[0];
  const price = activeVariant?.price || 0;
  
  const inventoryManagement = activeVariant?.inventoryManagement || 'tracked';
  const trackInventory = inventoryManagement !== 'none';
  const inventory = activeVariant?.inventoryQuantity || activeVariant?.inventory || 0;
  const inStock = !trackInventory || inventory > 0;

  // Check if all required options are selected
  const allOptionsSelected = product.options?.every(option => 
    selectedOptions[option.name] !== undefined && selectedOptions[option.name] !== ''
  ) ?? true;

  const handleAddToCart = () => {
    // Validate variant selection
    if (product.options && product.options.length > 0 && !allOptionsSelected) {
      toast({
        title: 'Please select all options',
        description: 'You must select all product options before adding to cart',
        variant: 'destructive',
      });
      return;
    }

    if (!activeVariant) {
      toast({
        title: 'Invalid selection',
        description: 'Please select valid product options',
        variant: 'destructive',
      });
      return;
    }

    const getImageSrc = (img: any) => {
      if (!img) return undefined;
      if (typeof img === 'string') return img;
      return img.src;
    };

    for (let i = 0; i < quantity; i++) {
      addItem({
        productId: product.id,
        productName: product.name,
        variantId: activeVariant.id || 'default',
        price: price,
        image: getImageSrc(product.images?.[0]),
        selectedOptions: selectedOptions,
      });
    }

    toast({
      title: 'Added to cart',
      description: `${quantity}x ${product.name} added to your cart`,
    });
  };

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionName]: value
    }));
  };

  const getImageSrc = (image: string | { src: string } | undefined) => {
    if (!image) return '/placeholder.png';
    if (typeof image === 'string') return image;
    return image.src || '/placeholder.png';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={getImageSrc(product.images?.[selectedImage])}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square relative rounded-md overflow-hidden border-2 ${
                    selectedImage === index ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <Image
                    src={getImageSrc(image)}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <Badge className="mb-2">{product.category}</Badge>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-3xl font-bold mt-4">${price.toFixed(2)}</p>
          </div>

          {product.description && (
            <p className="text-muted-foreground">{product.description}</p>
          )}

          {product.options && product.options.length > 0 && (
            <div className="space-y-4">
              {product.options.map((option) => (
                <div key={option.name}>
                  <label className="text-sm font-medium block mb-2">
                    {option.name} {!selectedOptions[option.name] && <span className="text-destructive">*</span>}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {option.values.map((value) => (
                      <Button
                        key={value}
                        variant={selectedOptions[option.name] === value ? 'default' : 'outline'}
                        onClick={() => handleOptionChange(option.name, value)}
                        className="min-w-[60px]"
                      >
                        {value}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
              {!allOptionsSelected && (
                <p className="text-sm text-destructive">
                  Please select all options to continue
                </p>
              )}
            </div>
          )}

          <div>
            <label className="text-sm font-medium block mb-2">Quantity</label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              className="flex-1"
              size="lg"
              disabled={!inStock || !allOptionsSelected}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
            <Button variant="outline" size="lg">
              <Heart className="h-5 w-5" />
            </Button>
          </div>

          {trackInventory && inStock && (
            <p className="text-sm text-green-600">In Stock ({inventory} available)</p>
          )}
          {trackInventory && !inStock && (
            <p className="text-sm text-red-600">Out of Stock</p>
          )}
          {!trackInventory && (
            <p className="text-sm text-blue-600">In Stock</p>
          )}
        </div>
      </div>
    </div>
  );
}
