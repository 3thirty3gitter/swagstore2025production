import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Product } from '@/lib/types';
import { ShoppingCart } from 'lucide-react';

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const getPriceRange = () => {
    if (!product.variants || product.variants.length === 0) {
      return '$--.--';
    }
    if (product.variants.length === 1) {
      return `$${product.variants[0].price.toFixed(2)}`;
    }

    const prices = product.variants.map(v => v.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    if (minPrice === maxPrice) {
      return `$${minPrice.toFixed(2)}`;
    }

    return `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`;
  };
  
  const mainImage = product.images?.[0] || { src: 'https://placehold.co/600x400', alt: 'Placeholder', hint: 'placeholder' };

  return (
    <Card className="flex flex-col">
      <CardHeader className="p-0">
        <div className="aspect-square relative bg-muted/20 rounded-t-lg">
          <Image
            src={mainImage.src}
            alt={product.name}
            fill
            className="object-cover rounded-t-lg"
            data-ai-hint={mainImage.hint}
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-semibold leading-snug mb-2">{product.name}</CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-3">{product.description}</p>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center">
        <p className="text-lg font-bold">{getPriceRange()}</p>
        <Button variant="outline">
          <ShoppingCart className="mr-2 h-4 w-4" /> View Options
        </Button>
      </CardFooter>
    </Card>
  );
}
