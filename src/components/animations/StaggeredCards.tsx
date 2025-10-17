'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { animate, stagger, utils } from 'animejs';

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
            
            // Set initial CSS variables for each card
            utils.set(cards, {
              '--opacity': '0',
              '--y': '60px',
              '--scale': '0.9',
              '--rotate': '2deg',
              opacity: () => 'var(--opacity)',
              transform: () => 'translateY(var(--y)) scale(var(--scale)) rotate(var(--rotate))',
            });
            
            // Animate using CSS variables for smoother performance
            animate(cards, {
              '--y': '0px',
              '--opacity': '1',
              '--scale': '1',
              '--rotate': '0deg',
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
