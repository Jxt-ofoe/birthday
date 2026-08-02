'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Props = Omit<HTMLMotionProps<'button'>, 'ref'> & {
  children: ReactNode;
  variant?: 'primary' | 'ghost' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const SIZES = {
  sm: 'px-5 py-2.5 text-sm',
  md: 'px-7 py-3.5 text-[15px]',
  lg: 'px-9 py-4 text-base sm:px-11 sm:py-[18px] sm:text-lg',
};

/**
 * The signature button: a soft gradient pill with an animated glow halo
 * and a gentle press micro-interaction.
 */
export function GlowButton({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...rest
}: Props) {
  const base =
    'relative isolate inline-flex items-center justify-center gap-2.5 rounded-full font-body font-medium tracking-wide transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50';

  const variants = {
    primary:
      'text-plum-900 bg-gradient-to-r from-blush-200 via-blush-100 to-lavender-200 hover:from-blush-100 hover:to-lavender-100',
    gold: 'text-plum-900 bg-gradient-to-r from-gold-200 via-gold-100 to-blush-200 hover:from-gold-100 hover:to-blush-100',
    ghost:
      'text-blush-100 glass hover:bg-white/[0.1] hover:text-white border border-white/15',
  };

  return (
    <motion.button
      type="button"
      className={cn(base, SIZES[size], variants[variant], className)}
      whileHover={{ scale: 1.035 }}
      whileTap={{ scale: 0.965 }}
      transition={{ type: 'spring', stiffness: 420, damping: 26 }}
      {...rest}
    >
      {/* animated glow halo */}
      {variant !== 'ghost' && (
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 -z-10 rounded-full blur-xl"
          style={{
            background:
              variant === 'gold'
                ? 'linear-gradient(90deg, rgba(239,208,122,0.75), rgba(255,182,206,0.65))'
                : 'linear-gradient(90deg, rgba(255,182,206,0.7), rgba(201,180,255,0.7))',
          }}
          animate={{ opacity: [0.45, 0.85, 0.45], scale: [0.97, 1.06, 0.97] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      {/* inner top gloss */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-4 top-0 h-px rounded-full bg-white/70"
      />
      {children}
    </motion.button>
  );
}
