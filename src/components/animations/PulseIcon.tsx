'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { animate, utils } from 'animejs';

interface PulseIconProps {
  children: ReactNode;
  className?: string;
}

export function PulseIcon({ children, className = '' }: PulseIconProps) {
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!iconRef.current) return;

    // Set up CSS variable for scale
    utils.set(iconRef.current, {
      '--scale': '1',
      transform: () => 'scale(var(--scale))',
    });

    const animation = animate(iconRef.current, {
      '--scale': ['1', '1.15', '1'],
      easing: 'inOutSine',
      duration: 2000,
      loop: true
    });

    return () => {
      animation.pause();
    };
  }, []);

  return (
    <div ref={iconRef} className={className}>
      {children}
    </div>
  );
}
