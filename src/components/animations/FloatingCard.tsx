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

    // Set initial CSS variables with 3D transform support
    utils.set(element, {
      '--opacity': '0',
      '--y': '100px',
      '--x': '50px',
      '--rotate-x': '15deg',
      '--rotate-y': '-15deg',
      '--rotate-z': '5deg',
      '--scale': '0.85',
      '--blur': '8px',
      opacity: () => 'var(--opacity)',
      transform: () => 'perspective(1200px) translateX(var(--x)) translateY(var(--y)) rotateX(var(--rotate-x)) rotateY(var(--rotate-y)) rotateZ(var(--rotate-z)) scale(var(--scale))',
      filter: () => 'blur(var(--blur))',
    });

    // Spectacular entrance animation with 3D transforms
    const entranceTimeline = animate(element, {
      '--opacity': ['0', '1'],
      '--y': ['100px', '0px'],
      '--x': ['50px', '0px'],
      '--rotate-x': ['15deg', '0deg'],
      '--rotate-y': ['-15deg', '0deg'],
      '--rotate-z': ['5deg', '0deg'],
      '--scale': ['0.85', '1'],
      '--blur': ['8px', '0px'],
      easing: 'spring(1, 80, 10, 0)',
      duration: 2000,
      delay: delay,
    });

    // Enhanced scroll-based parallax effect
    const handleScroll = () => {
      if (!element) return;
      
      const rect = element.getBoundingClientRect();
      const scrollProgress = 1 - (rect.top / window.innerHeight);
      const isInView = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (isInView && scrollProgress > 0) {
        // Calculate scroll-based values
        const scrollY = Math.max(0, Math.min(1, scrollProgress)) * 30;
        const rotateIntensity = (scrollProgress - 0.5) * 8;
        const scaleValue = 1 + (Math.sin(scrollProgress * Math.PI) * 0.05);
        
        // Apply smooth scroll-based transforms
        utils.set(element, {
          '--scroll-y': `${-scrollY}px`,
          '--scroll-rotate-x': `${rotateIntensity * 0.5}deg`,
          '--scroll-rotate-y': `${rotateIntensity}deg`,
          '--scroll-scale': `${scaleValue}`,
          transform: () => `perspective(1200px) 
            translateY(calc(var(--y) + var(--scroll-y))) 
            translateX(var(--x)) 
            rotateX(calc(var(--rotate-x) + var(--scroll-rotate-x))) 
            rotateY(calc(var(--rotate-y) + var(--scroll-rotate-y))) 
            rotateZ(var(--rotate-z)) 
            scale(calc(var(--scale) * var(--scroll-scale)))`,
        });
      }
    };

    // Mouse move parallax effect
    const handleMouseMove = (e: MouseEvent) => {
      if (!element) return;
      
      const rect = element.getBoundingClientRect();
      const isHovering = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (isHovering) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) / rect.width;
        const deltaY = (e.clientY - centerY) / rect.height;
        
        // Smooth mouse-based tilt
        animate(element, {
          '--mouse-rotate-x': `${-deltaY * 12}deg`,
          '--mouse-rotate-y': `${deltaX * 12}deg`,
          transform: () => `perspective(1200px) 
            translateY(calc(var(--y) + var(--scroll-y, 0px))) 
            translateX(var(--x)) 
            rotateX(calc(var(--rotate-x) + var(--scroll-rotate-x, 0deg) + var(--mouse-rotate-x, 0deg))) 
            rotateY(calc(var(--rotate-y) + var(--scroll-rotate-y, 0deg) + var(--mouse-rotate-y, 0deg))) 
            rotateZ(var(--rotate-z)) 
            scale(calc(var(--scale) * var(--scroll-scale, 1)))`,
          duration: 800,
          easing: 'outQuad',
        });
      }
    };

    const handleMouseLeave = () => {
      // Reset mouse effects smoothly
      animate(element, {
        '--mouse-rotate-x': '0deg',
        '--mouse-rotate-y': '0deg',
        duration: 600,
        easing: 'outExpo',
      });
    };

    // Continuous floating animation with easing variations
    setTimeout(() => {
      animationRef.current = animate(element, {
        '--float-offset': ['-8px', '8px'],
        '--float-rotate': ['-1deg', '1deg'],
        keyframes: [
          { '--y': '0px', '--rotate-z': '-0.5deg' },
          { '--y': '-8px', '--rotate-z': '0.5deg' },
          { '--y': '0px', '--rotate-z': '-0.5deg' },
        ],
        duration: 4500,
        easing: 'inOutSine',
        loop: true,
      });
    }, delay + 2000);

    // Add event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);
    
    // Initial scroll check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
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
        transformStyle: 'preserve-3d',
        willChange: 'transform, opacity',
      }}
    >
      {children}
    </div>
  );
}
