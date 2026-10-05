'use client';

import { useRef, ReactNode } from 'react';

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
}

export default function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(255, 255, 255, 0.15)'
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = divRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    divRef.current?.style.setProperty('--mouse-x', `${x}px`);
    divRef.current?.style.setProperty('--mouse-y', `${y}px`);
    divRef.current?.style.setProperty('--spotlight-color', spotlightColor);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      className={`relative rounded-[1.5rem] border border-white/10 bg-[#09090b] p-8 overflow-hidden
        before:absolute before:inset-0 before:rounded-[1.5rem]
        before:opacity-0 hover:before:opacity-60 before:transition-opacity before:duration-500 before:pointer-events-none
        before:bg-[radial-gradient(circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),var(--spotlight-color),transparent_80%)]
        ${className}`}
    >
      {children}
    </div>
  );
}
