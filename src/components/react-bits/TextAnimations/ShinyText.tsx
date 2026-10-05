'use client';

import { ReactNode } from 'react';

interface ShinyTextProps {
  children: ReactNode;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

export default function ShinyText({ children, disabled = false, speed = 5, className = '' }: ShinyTextProps) {
  const animationDuration = `${speed}s`;
  return (
    <span
      className={`inline-block ${disabled ? '' : 'animate-shine'} ${className}`}
      style={{
        color: disabled ? 'inherit' : 'transparent',
        backgroundImage: disabled ? 'none' : 'linear-gradient(120deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 60%)',
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: disabled ? 'border-box' : 'text',
        backgroundClip: disabled ? 'border-box' : 'text',
        display: 'inline-block',
        animationDuration,
        animationTimingFunction: 'linear',
        animationIterationCount: 'infinite',
        animationFillMode: 'forwards',
        animationPlayState: disabled ? 'paused' : 'running',
        width: 'fit-content'
      } as React.CSSProperties}
    >
      {children}
    </span>
  );
}
