'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { animate } from 'animejs';

interface FloatingCardProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function FloatingCard({ children, delay = 0, className = '' }: FloatingCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    // Initial fade in
    animate(cardRef.current, {
      opacity: [0, 1],
      translateY: [30, 0],
      easing: 'outExpo',
      duration: 1200,
      delay: delay
    });

    // Continuous floating animation
    animate(cardRef.current, {
      translateY: [-10, 10],
      duration: 3000,
      easing: 'inOutSine',
      direction: 'alternate',
      loop: true,
      delay: delay + 1200
    });

  }, [delay]);

  return (
    <div ref={cardRef} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
