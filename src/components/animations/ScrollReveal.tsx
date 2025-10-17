'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { animate } from 'animejs';

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale';
  className?: string;
}

export function ScrollReveal({ 
  children, 
  delay = 0, 
  direction = 'up',
  className = '' 
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current && elementRef.current) {
            hasAnimated.current = true;
            
            const animations: any = {
              opacity: [0, 1],
              easing: 'outExpo',
              duration: 1200,
              delay: delay
            };

            switch (direction) {
              case 'up':
                animations.translateY = [50, 0];
                break;
              case 'down':
                animations.translateY = [-50, 0];
                break;
              case 'left':
                animations.translateX = [50, 0];
                break;
              case 'right':
                animations.translateX = [-50, 0];
                break;
              case 'scale':
                animations.scale = [0.8, 1];
                break;
            }

            animate(elementRef.current, animations);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [delay, direction]);

  return (
    <div ref={elementRef} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
