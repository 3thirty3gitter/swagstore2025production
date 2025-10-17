'use client';

import { ReactNode } from 'react';

interface PulseIconProps {
  children: ReactNode;
  className?: string;
}

export function PulseIcon({ children, className = '' }: PulseIconProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
