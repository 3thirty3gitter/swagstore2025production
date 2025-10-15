'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { HeroSectionLayout } from '@/lib/types';
import { useState, useEffect, useRef } from 'react';

type HeroSectionProps = {
  sectionId: string;
  title: string;
  text?: string;
  buttonText?: string;
  buttonLink?: string;
  imageUrl: string;
  imageHint?: string;
  layout?: HeroSectionLayout;
  imageWidth?: number;
  imageHeight?: number;
};

export function HeroSection({
  sectionId,
  title,
  text,
  buttonText,
  buttonLink,
  imageUrl,
  imageHint,
  layout = 'center-left',
  imageWidth: initialImageWidth = 80,
  imageHeight: initialImageHeight = 60,
}: HeroSectionProps) {

  const [isEditor, setIsEditor] = useState(false);
  const [imageWidth, setImageWidth] = useState(initialImageWidth);
  const [imageHeight, setImageHeight] = useState(initialImageHeight);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);
  const heightHandleRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const isDraggingHeight = useRef(false);

  useEffect(() => {
    // Check if inside an iframe (the editor)
    if (window.self !== window.top) {
      setIsEditor(true);
    }
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'section-width-update' && event.data.sectionId === sectionId) {
        setImageWidth(event.data.width);
      }
      if (event.data.type === 'section-height-update' && event.data.sectionId === sectionId) {
        setImageHeight(event.data.height);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [sectionId]);

  useEffect(() => {
    if (!isEditor || !dragHandleRef.current || !containerRef.current) return;

    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      isDragging.current = true;
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
    };

    const handleHeightMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      isDraggingHeight.current = true;
      document.body.style.cursor = 'ns-resize';
      document.body.style.userSelect = 'none';
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (isDragging.current) {
        e.preventDefault();
        e.stopPropagation();
        isDragging.current = false;
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';
        window.parent.postMessage({ type: 'section-width-final-update', sectionId, width: imageWidth }, '*');
      }
      if (isDraggingHeight.current) {
        e.preventDefault();
        e.stopPropagation();
        isDraggingHeight.current = false;
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';
        window.parent.postMessage({ type: 'section-height-final-update', sectionId, height: imageHeight }, '*');
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current && containerRef.current) {
        e.preventDefault();
        e.stopPropagation();
        const containerRect = containerRef.current.getBoundingClientRect();
        let newWidth = e.clientX - containerRect.left;
        
        if (layout.includes('right')) {
            newWidth = containerRect.right - e.clientX;
        }

        const newWidthPercentage = (newWidth / containerRect.width) * 100;
        
        const clampedWidth = Math.max(25, Math.min(newWidthPercentage, 90));
        
        setImageWidth(clampedWidth);
        window.parent.postMessage({ type: 'section-width-live-update', sectionId, width: clampedWidth }, '*');
      }
      
      if (isDraggingHeight.current && containerRef.current) {
        e.preventDefault();
        e.stopPropagation();
        const containerRect = containerRef.current.getBoundingClientRect();
        const newHeight = e.clientY - containerRect.top;
        const newHeightPercentage = (newHeight / containerRect.height) * 100;
        
        const clampedHeight = Math.max(20, Math.min(newHeightPercentage, 100));
        
        setImageHeight(clampedHeight);
        window.parent.postMessage({ type: 'section-height-live-update', sectionId, height: clampedHeight }, '*');
      }
    };
    
    const dragHandle = dragHandleRef.current;
    const heightHandle = heightHandleRef.current;
    
    dragHandle?.addEventListener('mousedown', handleMouseDown);
    heightHandle?.addEventListener('mousedown', handleHeightMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
        dragHandle?.removeEventListener('mousedown', handleMouseDown);
        heightHandle?.removeEventListener('mousedown', handleHeightMouseDown);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isEditor, imageWidth, imageHeight, sectionId, layout]);

  return (
    <section className="py-12 md:py-20">
      <div 
        ref={containerRef}
        className="container mx-auto grid gap-8 items-center relative"
        style={{ gridTemplateColumns: layout.includes('right') ? `1fr ${imageWidth}%` : `${imageWidth}% 1fr`}}
      >
        <div className={cn(
          "relative rounded-lg overflow-hidden group",
          layout.includes('right') ? 'md:order-last' : ''
        )}>
          <div 
            className="relative w-full"
            style={{
              height: `${imageHeight}vh`,
              minHeight: '300px',
              maxHeight: '80vh'
            }}
          >
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 80vw"
              data-ai-hint={imageHint}
            />
          </div>
          {isEditor && (
             <>
               <div className="absolute inset-0 border-2 border-dashed border-blue-500 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
               {/* Width drag handle */}
               <div 
                  ref={dragHandleRef}
                  className={cn(
                    "absolute top-1/2 -translate-y-1/2 w-2 h-10 rounded-full bg-blue-500 cursor-ew-resize border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity z-10",
                    layout.includes('right') ? "-left-1" : "-right-1"
                  )}
               />
               {/* Height drag handle */}
               <div 
                  ref={heightHandleRef}
                  className="absolute left-1/2 -translate-x-1/2 -bottom-1 h-2 w-10 rounded-full bg-green-500 cursor-ns-resize border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
               />
            </>
          )}
        </div>
        <div className="space-y-4 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold font-headline leading-[1.1] md:leading-[1.1] overflow-visible">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground">{text}</p>
          {buttonText && buttonLink && (
            <div className="pt-4">
              <Link href={buttonLink}>
                <Button size="lg">{buttonText}</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
