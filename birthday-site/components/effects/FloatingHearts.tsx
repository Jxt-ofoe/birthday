'use client';

import { useMemo } from 'react';
import { seededRandom, range, cn } from '@/lib/utils';

type Props = {
  count?: number;
  className?: string;
  /** Seed lets different sections have different heart patterns. */
  seed?: number;
  intensity?: 'subtle' | 'normal' | 'burst';
};

const HEARTS = ['❤️', '💗', '🤍', '💜', '💛'];

/**
 * Soft hearts drifting upward. Pure CSS animation, fixed to the viewport
 * so they float behind the content across the whole page.
 */
export function FloatingHearts({
  count = 14,
  className,
  seed = 424242,
  intensity = 'normal',
}: Props) {
  const opacityScale = intensity === 'subtle' ? 0.45 : intensity === 'burst' ? 1 : 0.72;

  const hearts = useMemo(() => {
    const rand = seededRandom(seed);
    return range(count).map((i) => ({
      id: i,
      left: rand() * 100,
      size: 12 + rand() * 20,
      delay: rand() * 16,
      duration: 12 + rand() * 12,
      drift: (rand() - 0.5) * 90,
      char: HEARTS[Math.floor(rand() * HEARTS.length)],
      opacity: (0.25 + rand() * 0.45) * opacityScale,
    }));
  }, [count, seed, opacityScale]);

  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
    >
      {hearts.map((h) => (
        <span
          key={h.id}
          className="absolute bottom-[-10%] select-none will-change-transform"
          style={
            {
              left: `${h.left}%`,
              fontSize: `${h.size}px`,
              opacity: h.opacity,
              animation: `heart-rise ${h.duration}s linear ${h.delay}s infinite`,
              ['--drift' as string]: `${h.drift}px`,
              filter: 'drop-shadow(0 0 6px rgba(255,182,206,0.4))',
            } as React.CSSProperties
          }
        >
          {h.char}
        </span>
      ))}

      <style jsx>{`
        @keyframes heart-rise {
          0% {
            transform: translate3d(0, 0, 0) scale(0.55) rotate(0deg);
            opacity: 0;
          }
          12% {
            opacity: var(--o, 0.6);
          }
          88% {
            opacity: var(--o, 0.6);
          }
          100% {
            transform: translate3d(var(--drift), -115vh, 0) scale(1.05) rotate(16deg);
            opacity: 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          span {
            animation: none !important;
            opacity: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
