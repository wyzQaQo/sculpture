'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';

interface CounterProps {
  from?: number;
  to: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export default function Counter({ from = 0, to, suffix = '', prefix = '', duration = 2, className = '' }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [count, setCount] = useState(from);

  useEffect(() => {
    if (!inView) return;
    const startTime = performance.now();
    const endValue = to;
    const range = endValue - from;

    const animate = (currentTime: number) => {
      const elapsed = (currentTime - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(from + range * eased));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [inView, from, to, duration]);

  return (
    <span ref={ref} className={`counter-value ${className || ''}`}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}
