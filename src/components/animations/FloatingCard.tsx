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

  useEffect(() => {
    if (!cardRef.current) return;

    // Set initial CSS variables for smooth animation
    utils.set(cardRef.current, {
      '--opacity': '0',
      '--y': '30px',
      '--float-y': '0px',
      '--scale': '1',
      opacity: () => 'var(--opacity)',
      transform: () => 'translateY(calc(var(--y) + var(--float-y))) scale(var(--scale))',
    });

    // Initial fade in and slide up
    animate(cardRef.current, {
      '--opacity': '1',
      '--y': '0px',
      '--scale': [0.95, 1],
      easing: 'outExpo',
      duration: 1200,
      delay: delay
    });

    // Continuous floating animation using CSS variables
    animate(cardRef.current, {
      '--float-y': ['-12px', '12px'],
      duration: 4000,
      easing: 'inOutSine',
      direction: 'alternate',
      loop: true,
      delay: delay + 1200
    });

  }, [delay]);

  return (
    <div ref={cardRef} className={className}>
      {children}
    </div>
  );
}
