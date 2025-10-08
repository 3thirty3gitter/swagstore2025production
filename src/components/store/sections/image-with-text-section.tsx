
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type ImageWithTextSectionProps = {
  title: string;
  text: string;
  buttonText?: string;
  buttonLink?: string;
  imageUrl: string;
  imageHint?: string;
  layout: 'left' | 'right';
};

export function ImageWithTextSection({
  title,
  text,
  buttonText,
  buttonLink,
  imageUrl,
  imageHint,
  layout,
}: ImageWithTextSectionProps) {
  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto">
        <div className={cn(
          "grid md:grid-cols-2 gap-8 md:gap-12 items-center",
          layout === 'right' && 'md:[&>*:last-child]:-order-1'
        )}>
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
              data-ai-hint={imageHint}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">
              {title}
            </h2>
            <p className="text-lg text-muted-foreground">
              {text}
            </p>
            {buttonText && buttonLink && (
              <div className="pt-4">
                <Link href={buttonLink}>
                  <Button size="lg">
                    {buttonText}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
