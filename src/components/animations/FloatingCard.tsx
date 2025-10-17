'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { animate, utils } from 'animejs';

interface FloatingCardProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function FloatingCard({ children, delay = 0, className = '' }: FloatingCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<any>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    const element = cardRef.current;

    // Set initial CSS variables
    utils.set(element, {
      '--opacity': '0',
      '--y': '60px',
      '--scale': '0.95',
      '--float-y': '0px',
      opacity: () => 'var(--opacity)',
      transform: () => 'translateY(calc(var(--y) + var(--float-y))) scale(var(--scale))',
    });

    // Entrance animation
    animate(element, {
      '--opacity': '1',
      '--y': '0px',
      '--scale': '1',
      easing: 'outExpo',
      duration: 1200,
      delay: delay,
    });

    // Continuous smooth floating - no stops
    setTimeout(() => {
      animationRef.current = animate(element, {
        '--float-y': ['-10px', '10px'],
        duration: 3000,
        easing: 'inOutSine',
        direction: 'alternate',
        loop: true,
      });
    }, delay + 1200);

    return () => {
      if (animationRef.current) {
        animationRef.current.pause();
      }
    };
  }, [delay]);

  return (
    <div 
      ref={cardRef} 
      className={className}
    >
      {children}
    </div>
  );
}
