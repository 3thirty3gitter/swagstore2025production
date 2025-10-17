'use client';

import { useEffect, useRef } from 'react';
import { animate, stagger, utils } from 'animejs';

interface AnimatedHeroProps {
  children: React.ReactNode;
}

export function AnimatedHero({ children }: AnimatedHeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    // Get elements
    const titleSpans = heroRef.current.querySelectorAll('.hero-title span');
    const subtitle = heroRef.current.querySelector('.hero-subtitle');
    const stats = heroRef.current.querySelectorAll('.hero-stat');
    const ctaElements = heroRef.current.querySelectorAll('.hero-cta');
    const trustIndicators = heroRef.current.querySelectorAll('.trust-indicator');

    // Animate title spans with CSS variables
    if (titleSpans.length) {
      utils.set(titleSpans, {
        '--y': '50px',
        '--opacity': '0',
        opacity: () => 'var(--opacity)',
        transform: () => 'translateY(var(--y))'
      });
      animate(titleSpans, {
        '--y': '0px',
        '--opacity': '1',
        easing: 'outExpo',
        duration: 1200,
        delay: stagger(100, { start: 300 })
      });
    }

    // Animate subtitle
    if (subtitle) {
      utils.set(subtitle, {
        '--y': '30px',
        '--opacity': '0',
        opacity: () => 'var(--opacity)',
        transform: () => 'translateY(var(--y))'
      });
      animate(subtitle, {
        '--y': '0px',
        '--opacity': '1',
        easing: 'outExpo',
        duration: 1000,
        delay: 800
      });
    }

    // Animate stats with scale
    if (stats.length) {
      utils.set(stats, {
        '--scale': '0',
        '--opacity': '0',
        opacity: () => 'var(--opacity)',
        transform: () => 'scale(var(--scale))'
      });
      animate(stats, {
        '--scale': '1',
        '--opacity': '1',
        easing: 'outElastic',
        duration: 1500,
        delay: stagger(150, { start: 1000 })
      });
    }

    // Animate CTA buttons
    if (ctaElements.length) {
      utils.set(ctaElements, {
        '--y': '20px',
        '--opacity': '0',
        opacity: () => 'var(--opacity)',
        transform: () => 'translateY(var(--y))'
      });
      animate(ctaElements, {
        '--y': '0px',
        '--opacity': '1',
        easing: 'outExpo',
        duration: 1000,
        delay: 1400
      });
    }

    // Animate trust indicators
    if (trustIndicators.length) {
      utils.set(trustIndicators, {
        '--x': '-20px',
        '--opacity': '0',
        opacity: () => 'var(--opacity)',
        transform: () => 'translateX(var(--x))'
      });
      animate(trustIndicators, {
        '--x': '0px',
        '--opacity': '1',
        easing: 'outExpo',
        duration: 800,
        delay: stagger(100, { start: 1600 })
      });
    }

  }, []);

  return <div ref={heroRef}>{children}</div>;
}
