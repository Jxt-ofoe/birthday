'use client';

import { motion } from 'framer-motion';
import { Reveal } from './Reveal';
import { fadeUp, scaleIn } from '@/lib/motion';
import { cn } from '@/lib/utils';

type Props = {
  number: string;
  title: string;
  subtitle?: string;
  className?: string;
  align?: 'center' | 'left';
};

export function ChapterHeading({
  number,
  title,
  subtitle,
  className,
  align = 'center',
}: Props) {
  const centered = align === 'center';

  return (
    <div className={cn('relative', centered && 'text-center', className)}>
      <Reveal variants={fadeUp}>
        <span className="inline-flex items-center gap-3 font-body text-[11px] uppercase tracking-[0.42em] text-gold-300/85 sm:text-xs">
          <span
            aria-hidden="true"
            className="h-px w-7 bg-gradient-to-r from-transparent to-gold-300/70"
          />
          {number}
          <span
            aria-hidden="true"
            className="h-px w-7 bg-gradient-to-l from-transparent to-gold-300/70"
          />
        </span>
      </Reveal>

      <Reveal variants={fadeUp} delay={0.1}>
        <h2 className="mt-5 font-display text-[clamp(1.9rem,7vw,3.6rem)] font-light leading-[1.12] tracking-tight text-balance">
          <span className="text-gradient-romance">{title}</span>
        </h2>
      </Reveal>

      {subtitle && (
        <Reveal variants={fadeUp} delay={0.2}>
          <p className="mt-4 font-script text-lg text-lavender-200/80 sm:text-xl">{subtitle}</p>
        </Reveal>
      )}

      <motion.div
        className={cn('mt-7 flex items-center gap-3', centered && 'justify-center')}
        variants={scaleIn}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.6 }}
      >
        <span className="h-px w-12 bg-gradient-to-r from-transparent to-blush-300/50" />
        <span className="text-sm text-blush-300/80" aria-hidden="true">
          ❦
        </span>
        <span className="h-px w-12 bg-gradient-to-l from-transparent to-blush-300/50" />
      </motion.div>
    </div>
  );
}
