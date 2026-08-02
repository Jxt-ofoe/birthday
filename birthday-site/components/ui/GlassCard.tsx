'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { EASE } from '@/lib/motion';

type Props = HTMLMotionProps<'div'> & {
  children: ReactNode;
  className?: string;
  /** Adds a hover lift + sheen micro-interaction. */
  interactive?: boolean;
  strong?: boolean;
  /** Warm gold rim instead of the default white hairline. */
  gold?: boolean;
};

export function GlassCard({
  children,
  className,
  interactive = false,
  strong = false,
  gold = false,
  ...rest
}: Props) {
  return (
    <motion.div
      className={cn(
        'relative overflow-hidden rounded-3xl',
        strong ? 'glass-strong' : 'glass',
        gold && 'border-gold-300/30',
        interactive && 'group cursor-default transition-colors hover:border-white/25',
        className,
      )}
      whileHover={interactive ? { y: -6, transition: { duration: 0.45, ease: EASE } } : undefined}
      {...rest}
    >
      {/* top hairline highlight */}
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent to-transparent',
          gold ? 'via-gold-300/60' : 'via-white/45',
        )}
      />
      {/* hover sheen */}
      {interactive && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.07] to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full"
        />
      )}
      {children}
    </motion.div>
  );
}
