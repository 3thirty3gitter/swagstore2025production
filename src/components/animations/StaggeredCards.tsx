'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { animate, stagger } from 'animejs';

interface StaggeredCardsProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}

export function StaggeredCards({ children, staggerDelay = 150, className = '' }: StaggeredCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current && containerRef.current) {
            hasAnimated.current = true;
            
            const cards = containerRef.current.querySelectorAll('.stagger-item');
            
            animate(cards, {
              translateY: [60, 0],
              opacity: [0, 1],
              scale: [0.9, 1],
              easing: 'outExpo',
              duration: 1200,
              delay: stagger(staggerDelay)
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [staggerDelay]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
