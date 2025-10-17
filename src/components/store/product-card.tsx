'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description?: string;
    category: string;
    images?: Array<string | { src: string; alt?: string }>;
    variants?: Array<{ price: number; inventory: number }>;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const params = useParams();
  const tenantSlug = params.tenantSlug as string;
  const price = product.variants?.[0]?.price || 0;

  // Handle both string URLs and image objects
  const getImageSrc = (image: string | { src: string; alt?: string } | undefined) => {
    if (!image) return '/placeholder.png';
    if (typeof image === 'string') return image;
    return image.src || '/placeholder.png';
  };

  const imageSrc = getImageSrc(product.images?.[0]);

  // On subdomain, tenantSlug is already in the URL path, so don't duplicate it
  const productLink = tenantSlug ? `/products/${product.id}` : `/products/${product.id}`;

  return (
    <Link href={productLink}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        <div className="aspect-square relative">
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        <CardContent className="p-4">
          <Badge className="mb-2">{product.category}</Badge>
          <h3 className="font-semibold text-lg">{product.name}</h3>
          {product.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {product.description}
            </p>
          )}
          <p className="text-lg font-bold mt-2">${price.toFixed(2)}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
