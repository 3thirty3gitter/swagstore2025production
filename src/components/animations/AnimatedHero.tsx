'use client';

import { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';

interface AnimatedHeroProps {
  children: React.ReactNode;
}

export function AnimatedHero({ children }: AnimatedHeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    // Animate headline text with stagger
    animate('.hero-title span', {
      translateY: [50, 0],
      opacity: [0, 1],
      easing: 'outExpo',
      duration: 1200,
      delay: stagger(100, { start: 300 })
    });

    // Animate subtitle
    animate('.hero-subtitle', {
      translateY: [30, 0],
      opacity: [0, 1],
      easing: 'outExpo',
      duration: 1000,
      delay: 800
    });

    // Animate stats with scale
    animate('.hero-stat', {
      scale: [0, 1],
      opacity: [0, 1],
      easing: 'outElastic(1, .8)',
      duration: 1500,
      delay: stagger(150, { start: 1000 })
    });

    // Animate CTA buttons
    animate('.hero-cta', {
      translateY: [20, 0],
      opacity: [0, 1],
      easing: 'outExpo',
      duration: 1000,
      delay: 1400
    });

    // Animate trust indicators
    animate('.trust-indicator', {
      translateX: [-20, 0],
      opacity: [0, 1],
      easing: 'outExpo',
      duration: 800,
      delay: stagger(100, { start: 1600 })
    });

  }, []);

  return <div ref={heroRef}>{children}</div>;
}
