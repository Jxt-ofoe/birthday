'use client';

import { motion } from 'framer-motion';
import { RevealGroup, RevealItem } from './Reveal';
import { fadeUp, EASE } from '@/lib/motion';
import { cn } from '@/lib/utils';

/** A stack of paragraphs that fade up one after another. */
export function StoryText({
  paragraphs,
  className,
  center = true,
  size = 'md',
  stagger = 0.22,
}: {
  paragraphs: string[];
  className?: string;
  center?: boolean;
  size?: 'md' | 'lg';
  stagger?: number;
}) {
  return (
    <RevealGroup
      className={cn('space-y-5 sm:space-y-6', center && 'text-center', className)}
      stagger={stagger}
      amount={0.15}
    >
      {paragraphs.map((p, i) => (
        <RevealItem key={i} variants={fadeUp} as="p">
          <span
            className={cn(
              'block font-body font-light leading-[1.9] text-blush-50/90 text-pretty',
              size === 'lg'
                ? 'text-[17px] sm:text-xl sm:leading-[1.95]'
                : 'text-[15.5px] sm:text-[17px]',
            )}
          >
            {p}
          </span>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}

/**
 * A spoken line in the story, styled as an elegant quote card.
 * `speaker` tints it: 'me' = lavender, 'her' = blush.
 */
export function SpokenQuote({
  line,
  speaker = 'me',
  delay = 0,
  className,
}: {
  line: string;
  speaker?: 'me' | 'her';
  delay?: number;
  className?: string;
}) {
  const isHer = speaker === 'her';

  return (
    <motion.blockquote
      className={cn(
        'relative mx-auto w-fit max-w-[92%] rounded-2xl px-6 py-4 sm:px-8 sm:py-5',
        'glass',
        isHer ? 'border-blush-300/25' : 'border-lavender-300/25',
        className,
      )}
      initial={{ opacity: 0, y: 24, scale: 0.96, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.85, ease: EASE, delay }}
    >
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-y-3 left-0 w-px rounded-full',
          isHer
            ? 'bg-gradient-to-b from-transparent via-blush-300/70 to-transparent'
            : 'bg-gradient-to-b from-transparent via-lavender-300/70 to-transparent',
        )}
      />
      <p
        className={cn(
          'font-script text-xl leading-relaxed sm:text-2xl',
          isHer ? 'text-blush-200' : 'text-lavender-100',
        )}
      >
        “{line}”
      </p>
    </motion.blockquote>
  );
}

/** A short lead-in line above a quote, e.g. "You simply said," */
export function StoryLead({ children, className }: { children: string; className?: string }) {
  return (
    <RevealItem as="p" variants={fadeUp}>
      <span
        className={cn(
          'block text-center font-body text-[15px] font-light leading-relaxed text-blush-100/70 sm:text-base',
          className,
        )}
      >
        {children}
      </span>
    </RevealItem>
  );
}
