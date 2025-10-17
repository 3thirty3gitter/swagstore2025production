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
  const rafId = useRef<number>();
  const mousePos = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });

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
      '--rotate-z': '0deg',
      '--scale': '0.85',
      '--blur': '8px',
      '--float-y': '0px',
      '--scroll-y': '0px',
      '--mouse-rotate-x': '0deg',
      '--mouse-rotate-y': '0deg',
      opacity: () => 'var(--opacity)',
      transform: () => 'perspective(1200px) translateX(var(--x)) translateY(calc(var(--y) + var(--float-y) + var(--scroll-y))) rotateX(calc(var(--rotate-x) + var(--mouse-rotate-x))) rotateY(calc(var(--rotate-y) + var(--mouse-rotate-y))) rotateZ(var(--rotate-z)) scale(var(--scale))',
      filter: () => 'blur(var(--blur))',
    });

    // Spectacular entrance animation with 3D transforms
    animate(element, {
      '--opacity': ['0', '1'],
      '--y': ['100px', '0px'],
      '--x': ['50px', '0px'],
      '--rotate-x': ['15deg', '0deg'],
      '--rotate-y': ['-15deg', '0deg'],
      '--scale': ['0.85', '1'],
      '--blur': ['8px', '0px'],
      easing: 'spring(1, 80, 10, 0)',
      duration: 2000,
      delay: delay,
    });

    // Smooth scroll-based parallax with requestAnimationFrame
    let scrollY = 0;
    let targetScrollY = 0;
    
    const smoothScroll = () => {
      const rect = element.getBoundingClientRect();
      const scrollProgress = 1 - (rect.top / window.innerHeight);
      const isInView = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (isInView && scrollProgress > 0) {
        targetScrollY = Math.max(0, Math.min(1, scrollProgress)) * 20;
      } else {
        targetScrollY = 0;
      }
      
      // Smooth interpolation
      scrollY += (targetScrollY - scrollY) * 0.1;
      
      utils.set(element, {
        '--scroll-y': `${-scrollY}px`,
      });
      
      rafId.current = requestAnimationFrame(smoothScroll);
    };

    const handleScroll = () => {
      if (!rafId.current) {
        rafId.current = requestAnimationFrame(smoothScroll);
      }
    };

    // Smooth mouse move parallax with RAF
    let isHovering = false;
    
    const smoothMouseMove = () => {
      const targetX = mousePos.current.x;
      const targetY = mousePos.current.y;
      
      // Smooth interpolation for mouse movement
      currentRotation.current.x += (targetY - currentRotation.current.x) * 0.1;
      currentRotation.current.y += (targetX - currentRotation.current.y) * 0.1;
      
      if (isHovering) {
        utils.set(element, {
          '--mouse-rotate-x': `${currentRotation.current.x}deg`,
          '--mouse-rotate-y': `${currentRotation.current.y}deg`,
        });
        
        rafId.current = requestAnimationFrame(smoothMouseMove);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) / rect.width;
      const deltaY = (e.clientY - centerY) / rect.height;
      
      mousePos.current = {
        x: deltaX * 8,
        y: -deltaY * 8
      };
      
      if (!isHovering) {
        isHovering = true;
        smoothMouseMove();
      }
    };

    const handleMouseLeave = () => {
      isHovering = false;
      mousePos.current = { x: 0, y: 0 };
      
      // Smooth return to neutral
      const resetAnimation = () => {
        currentRotation.current.x += (0 - currentRotation.current.x) * 0.15;
        currentRotation.current.y += (0 - currentRotation.current.y) * 0.15;
        
        utils.set(element, {
          '--mouse-rotate-x': `${currentRotation.current.x}deg`,
          '--mouse-rotate-y': `${currentRotation.current.y}deg`,
        });
        
        if (Math.abs(currentRotation.current.x) > 0.01 || Math.abs(currentRotation.current.y) > 0.01) {
          requestAnimationFrame(resetAnimation);
        }
      };
      resetAnimation();
    };

    // Seamless continuous floating with multiple keyframes for smooth loop
    setTimeout(() => {
      animationRef.current = animate(element, {
        keyframes: [
          { '--float-y': '0px', '--rotate-z': '0deg' },
          { '--float-y': '-6px', '--rotate-z': '0.8deg' },
          { '--float-y': '-10px', '--rotate-z': '1.2deg' },
          { '--float-y': '-6px', '--rotate-z': '0.8deg' },
          { '--float-y': '0px', '--rotate-z': '0deg' },
          { '--float-y': '6px', '--rotate-z': '-0.8deg' },
          { '--float-y': '10px', '--rotate-z': '-1.2deg' },
          { '--float-y': '6px', '--rotate-z': '-0.8deg' },
          { '--float-y': '0px', '--rotate-z': '0deg' },
        ],
        duration: 6000,
        easing: 'linear',
        loop: true,
      });
    }, delay + 2000);

    // Add event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);
    
    // Start smooth scroll
    smoothScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
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
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
}
