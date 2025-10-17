'use client';

import { useEffect, useRef, useState } from 'react';
import { animate } from 'animejs';

interface AnimatedNumberProps {
  value: number;
  suffix?: string;
  duration?: number;
  delay?: number;
  className?: string;
}

export function AnimatedNumber({ value, suffix = '', duration = 2000, delay = 0, className = '' }: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            
            const obj = { value: 0 };
            animate(obj, {
              value: value,
              duration: duration,
              delay: delay,
              easing: 'outExpo',
              round: 1,
              update: () => {
                setDisplayValue(obj.value);
              }
            });
          }
        });
      },
      { threshold: 0.5 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [value, duration, delay]);

  return (
    <div ref={elementRef} className={className}>
      {displayValue}{suffix}
    </div>
  );
}
