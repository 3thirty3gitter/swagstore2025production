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

    const element = cardRef.current;

    // Set initial CSS variables
    utils.set(element, {
      '--opacity': '0',
      '--y': '40px',
      opacity: () => 'var(--opacity)',
      transform: () => 'translateY(var(--y))',
    });

    // Simple fade in and slide up entrance
    animate(element, {
      '--opacity': '1',
      '--y': '0px',
      easing: 'outExpo',
      duration: 1200,
      delay: delay,
    });
  }, [delay]);

  return (
    <div ref={cardRef} className={className}>
      {children}
    </div>
  );
}
