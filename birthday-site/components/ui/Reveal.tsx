'use client';

import { motion, type Variants } from 'framer-motion';
import type { ElementType, ReactNode } from 'react';
import { fadeUp, viewportOnce } from '@/lib/motion';
import { cn } from '@/lib/utils';

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  variants?: Variants;
  as?: ElementType;
  amount?: number;
  once?: boolean;
};

/**
 * The workhorse scroll-reveal wrapper. Wrap anything in it and it fades,
 * rises and un-blurs into view exactly once.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  variants = fadeUp,
  as = 'div',
  amount = viewportOnce.amount,
  once = true,
}: Props) {
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  return (
    <MotionTag
      className={cn(className)}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  );
}

/** Container that staggers its <Reveal> children. */
export function RevealGroup({
  children,
  className,
  stagger = 0.14,
  delayChildren = 0,
  amount = 0.2,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
  amount?: number;
  as?: ElementType;
}) {
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  return (
    <MotionTag
      className={cn(className)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren } },
      }}
    >
      {children}
    </MotionTag>
  );
}

/** A child of RevealGroup — inherits the parent's stagger timing. */
export function RevealItem({
  children,
  className,
  variants = fadeUp,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  as?: ElementType;
}) {
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;
  return (
    <MotionTag className={cn(className)} variants={variants}>
      {children}
    </MotionTag>
  );
}
