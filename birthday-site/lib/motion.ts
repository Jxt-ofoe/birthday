import type { Variants, Transition } from 'framer-motion';

/** Apple-ish easing curve used across the whole site. */
export const EASE = [0.16, 1, 0.3, 1] as const;
export const EASE_SOFT = [0.22, 0.61, 0.36, 1] as const;

export const transition = (duration = 0.9, delay = 0): Transition => ({
  duration,
  delay,
  ease: EASE,
});

/** Standard "rise into view" used by most blocks. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 34, filter: 'blur(6px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: transition(0.95),
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: transition(1.2) },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: transition(1),
  },
};

export const slideFrom = (dir: 'left' | 'right'): Variants => ({
  hidden: { opacity: 0, x: dir === 'left' ? -48 : 48, filter: 'blur(6px)' },
  show: { opacity: 1, x: 0, filter: 'blur(0px)', transition: transition(0.9) },
});

/** Parent container that staggers its children. */
export const stagger = (staggerChildren = 0.16, delayChildren = 0.05): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren, delayChildren },
  },
});

/** Shared viewport config so every section reveals at the same moment. */
export const viewportOnce = { once: true, amount: 0.25 } as const;
export const viewportEarly = { once: true, amount: 0.12 } as const;
