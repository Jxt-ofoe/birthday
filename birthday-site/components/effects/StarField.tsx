'use client';

import { useMemo } from 'react';
import { seededRandom, range, cn } from '@/lib/utils';

type Props = {
  /** How many stars to draw. Keep modest on mobile for performance. */
  count?: number;
  /** Adds a few larger, slowly drifting "hero" stars. */
  withShootingStars?: boolean;
  className?: string;
};

/**
 * A purely CSS-animated star field. Uses a seeded RNG so the server and
 * client render identical markup (no hydration mismatch) and no JS runs
 * per-frame — the browser compositor handles the twinkle.
 */
export function StarField({ count = 90, withShootingStars = true, className }: Props) {
  const stars = useMemo(() => {
    const rand = seededRandom(20260814);
    return range(count).map((i) => {
      const size = rand() * 2.1 + 0.7;
      return {
        id: i,
        left: rand() * 100,
        top: rand() * 100,
        size,
        delay: rand() * 6,
        duration: 3 + rand() * 5,
        opacity: 0.35 + rand() * 0.5,
        // A few stars get a warm gold or blush tint
        tint: rand() > 0.82 ? (rand() > 0.5 ? '#efd07a' : '#ffb6ce') : '#ffffff',
      };
    });
  }, [count]);

  const shooting = useMemo(() => {
    const rand = seededRandom(77123);
    return range(3).map((i) => ({
      id: i,
      top: rand() * 45,
      left: rand() * 60,
      delay: 4 + i * 9 + rand() * 5,
      duration: 2.4 + rand(),
    }));
  }, []);

  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
    >
      {stars.map((s) => (
        <span
          key={s.id}
          className="absolute rounded-full animate-twinkle will-change-[opacity,transform]"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            background: s.tint,
            opacity: s.opacity,
            boxShadow: `0 0 ${s.size * 3}px ${s.size * 0.8}px ${s.tint}55`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}

      {withShootingStars &&
        shooting.map((s) => (
          <span
            key={`shoot-${s.id}`}
            className="absolute h-px w-[120px] opacity-0"
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              background:
                'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 55%, rgba(255,182,206,0) 100%)',
              animation: `shoot ${s.duration}s ease-in ${s.delay}s infinite`,
            }}
          />
        ))}

      <style jsx>{`
        @keyframes shoot {
          0% {
            opacity: 0;
            transform: translate3d(0, 0, 0) rotate(18deg) scaleX(0.2);
          }
          8% {
            opacity: 1;
          }
          38% {
            opacity: 0;
            transform: translate3d(340px, 150px, 0) rotate(18deg) scaleX(1);
          }
          100% {
            opacity: 0;
            transform: translate3d(340px, 150px, 0) rotate(18deg) scaleX(1);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          span {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
