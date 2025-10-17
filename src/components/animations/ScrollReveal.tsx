'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { animate, utils } from 'animejs';

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
            
            // Set up CSS variables based on direction
            const initialVars: any = {
              '--opacity': '0',
            };
            const animateVars: any = {
              '--opacity': '1',
              easing: 'outExpo',
              duration: 1200,
              delay: delay
            };

            switch (direction) {
              case 'up':
                initialVars['--y'] = '50px';
                initialVars.transform = () => 'translateY(var(--y))';
                animateVars['--y'] = '0px';
                break;
              case 'down':
                initialVars['--y'] = '-50px';
                initialVars.transform = () => 'translateY(var(--y))';
                animateVars['--y'] = '0px';
                break;
              case 'left':
                initialVars['--x'] = '50px';
                initialVars.transform = () => 'translateX(var(--x))';
                animateVars['--x'] = '0px';
                break;
              case 'right':
                initialVars['--x'] = '-50px';
                initialVars.transform = () => 'translateX(var(--x))';
                animateVars['--x'] = '0px';
                break;
              case 'scale':
                initialVars['--scale'] = '0.8';
                initialVars.transform = () => 'scale(var(--scale))';
                animateVars['--scale'] = '1';
                break;
            }

            initialVars.opacity = () => 'var(--opacity)';
            
            utils.set(elementRef.current, initialVars);
            animate(elementRef.current, animateVars);
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
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}
