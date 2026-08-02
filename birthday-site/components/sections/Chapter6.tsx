'use client';

import { motion } from 'framer-motion';
import { chapter6 as c } from '@/content/site';
import { Section } from '@/components/ui/Section';
import { ChapterHeading } from '@/components/ui/ChapterHeading';
import { GlassCard } from '@/components/ui/GlassCard';
import { EASE } from '@/lib/motion';
import { FloatingHearts } from '@/components/effects/FloatingHearts';

/** Chapter 6 — elegant animated reason cards in a responsive grid. */
export function Chapter6() {
  return (
    <Section id="chapter-6" glow="lavender" label="Chapter Six: Reasons I Love You">
      <FloatingHearts count={12} seed={66} />

      <ChapterHeading number={c.number} title={c.title} subtitle={c.subtitle} />

      <div className="mt-16 grid grid-cols-1 gap-4 sm:mt-20 sm:grid-cols-2 sm:gap-5 lg:gap-6">
        {c.reasons.map((reason, i) => (
          <ReasonCard key={i} {...reason} index={i} />
        ))}
      </div>

      {/* closing flourish */}
      <motion.p
        className="mt-14 text-center font-script text-xl text-blush-200/80 sm:mt-16 sm:text-2xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1, ease: EASE }}
      >
        …and a thousand little things I haven’t found words for yet.
      </motion.p>
    </Section>
  );
}

function ReasonCard({
  icon,
  title,
  body,
  index,
}: {
  icon: string;
  title: string;
  body: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: EASE, delay: (index % 2) * 0.1 }}
      className="h-full"
    >
      <GlassCard interactive className="h-full p-6 sm:p-7">
        <div className="flex items-start gap-4">
          <motion.span
            className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/12 bg-gradient-to-br from-blush-500/20 to-lavender-500/20 text-xl"
            whileHover={{ scale: 1.15, rotate: 8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 14 }}
            aria-hidden="true"
          >
            {icon}
          </motion.span>

          <div className="min-w-0 flex-1">
            <h3 className="font-display text-lg font-normal leading-snug text-blush-50 sm:text-xl">
              {title}
            </h3>
            <p className="mt-2 font-body text-[14px] font-light leading-relaxed text-blush-100/70 text-pretty sm:text-[15px]">
              {body}
            </p>
          </div>
        </div>

        {/* bottom accent line grows on hover */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-6 right-6 h-px origin-left scale-x-0 bg-gradient-to-r from-blush-300/60 via-gold-200/50 to-transparent transition-transform duration-700 ease-out group-hover:scale-x-100"
        />
      </GlassCard>
    </motion.div>
  );
}
