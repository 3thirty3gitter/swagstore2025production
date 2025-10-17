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
      '--y': '80px',
      '--scale': '0.9',
      '--blur': '4px',
      '--float-y': '0px',
      '--float-rotate': '0deg',
      opacity: () => 'var(--opacity)',
      transform: () => 'translateY(calc(var(--y) + var(--float-y))) scale(var(--scale)) rotateZ(var(--float-rotate))',
      filter: () => 'blur(var(--blur))',
    });

    // Entrance animation
    animate(element, {
      '--opacity': '1',
      '--y': '0px',
      '--scale': '1',
      '--blur': '0px',
      easing: 'spring(1, 80, 10, 0)',
      duration: 1800,
      delay: delay,
    });

    // Seamless continuous floating animation
    setTimeout(() => {
      animationRef.current = animate(element, {
        keyframes: [
          { '--float-y': '0px', '--float-rotate': '0deg' },
          { '--float-y': '-12px', '--float-rotate': '1deg' },
          { '--float-y': '0px', '--float-rotate': '0deg' },
          { '--float-y': '12px', '--float-rotate': '-1deg' },
          { '--float-y': '0px', '--float-rotate': '0deg' },
        ],
        duration: 8000,
        easing: 'linear',
        loop: true,
      });
    }, delay + 1800);

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
      style={{ 
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
}
