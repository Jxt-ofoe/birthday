'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { hero } from '@/content/site';
import { GlowButton } from '@/components/ui/GlowButton';
import { StarField } from '@/components/effects/StarField';
import { FloatingHearts } from '@/components/effects/FloatingHearts';
import { Particles } from '@/components/effects/Particles';
import { Countdown } from './Countdown';
import { EASE } from '@/lib/motion';
import { scrollToId } from '@/lib/utils';

/**
 * The opening screen: a magical animated night sky with a parallax
 * cinematic title reveal, countdown and the glowing "Begin Our Journey" CTA.
 */
export function Hero({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Cinematic parallax as she scrolls away from the hero
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '26%']);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const skyY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);

  const handleBegin = () => {
    // Autoplay policies: this user gesture is our chance to start the music.
    const w = window as unknown as { __startMusic?: () => void };
    w.__startMusic?.();
    scrollToId('chapter-1');
  };

  const show = ready ? 'show' : 'hidden';

  return (
    <section
      ref={ref}
      id="hero"
      aria-label="Happy Birthday"
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-4 py-16 xs:px-5 xs:py-20 sm:px-8 sm:py-24"
    >
      {/* ---------- night sky ---------- */}
      <motion.div aria-hidden="true" className="absolute inset-0" style={{ y: skyY }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_70%_at_50%_0%,rgba(75,42,107,0.55),transparent_60%)]" />
        <StarField count={110} />
        <Particles count={40} />
        {/* moon glow */}
        <motion.div
          className="absolute right-[4%] top-[8%] h-20 w-20 rounded-full bg-gradient-to-br from-blush-100/90 to-lavender-200/50 blur-[2px] sm:right-[8%] sm:top-[12%] sm:h-32 sm:w-32"
          animate={{ opacity: [0.55, 0.8, 0.55], scale: [1, 1.03, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ boxShadow: '0 0 90px 30px rgba(255,214,232,0.22)' }}
        />
      </motion.div>

      <FloatingHearts count={10} seed={101} intensity="subtle" />

      {/* ---------- content ---------- */}
      <motion.div
        className="relative z-10 flex w-full max-w-3xl flex-col items-center text-center"
        style={{ y, opacity, scale }}
      >
        <motion.p
          initial="hidden"
          animate={show}
          variants={{
            hidden: { opacity: 0, y: 16, filter: 'blur(6px)' },
            show: { opacity: 1, y: 0, filter: 'blur(0px)' },
          }}
          transition={{ duration: 1, ease: EASE, delay: 0.15 }}
          className="max-w-[19rem] font-body text-[10px] uppercase leading-relaxed tracking-[0.2em] text-gold-300/85 sm:max-w-none sm:text-xs sm:tracking-[0.4em]"
        >
          {hero.eyebrow}
        </motion.p>

        {/* Title — word-by-word cinematic reveal */}
        <h1 className="mt-5 font-display text-[clamp(2.1rem,9vw,5.2rem)] font-light leading-[1.06] tracking-tight text-balance sm:mt-7">
          <span className="sr-only">{hero.title} ❤️</span>
          <span aria-hidden="true" className="inline-block">
            {hero.title.split(' ').map((word, i) => (
              <motion.span
                key={`${word}-${i}`}
                className="mr-[0.28em] inline-block text-gradient-romance"
                initial="hidden"
                animate={show}
                variants={{
                  hidden: { opacity: 0, y: 42, filter: 'blur(12px)', rotateX: 45 },
                  show: { opacity: 1, y: 0, filter: 'blur(0px)', rotateX: 0 },
                }}
                transition={{ duration: 1.15, ease: EASE, delay: 0.4 + i * 0.13 }}
              >
                {word}
              </motion.span>
            ))}
            <motion.span
              className="inline-block"
              initial={{ opacity: 0, scale: 0.4 }}
              animate={ready ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.9, ease: EASE, delay: 1.05, type: 'spring', bounce: 0.45 }}
              style={{ filter: 'drop-shadow(0 0 20px rgba(249,106,155,0.55))' }}
            >
              ❤️
            </motion.span>
          </span>
        </h1>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={ready ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 1.2, ease: EASE, delay: 1.15 }}
          className="mt-6 h-px w-36 bg-gradient-to-r from-transparent via-gold-300/70 to-transparent sm:mt-8 sm:w-56"
        />

        <motion.p
          initial="hidden"
          animate={show}
          variants={{
            hidden: { opacity: 0, y: 22, filter: 'blur(8px)' },
            show: { opacity: 1, y: 0, filter: 'blur(0px)' },
          }}
          transition={{ duration: 1.2, ease: EASE, delay: 1.3 }}
          className="mt-6 max-w-xl font-body text-[14px] font-light leading-[1.8] text-blush-100/85 text-pretty sm:mt-8 sm:text-lg"
        >
          {hero.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: EASE, delay: 1.6 }}
          className="mt-8 sm:mt-11"
        >
          <GlowButton size="lg" variant="primary" onClick={handleBegin}>
            {hero.cta}
            <motion.span
              aria-hidden="true"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              →
            </motion.span>
          </GlowButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: EASE, delay: 1.9 }}
          className="mt-10 sm:mt-14"
        >
          <Countdown />
        </motion.div>
      </motion.div>

      {/* ---------- scroll hint ---------- */}
      <motion.div
        className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2.5 pb-safe"
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 2.3 }}
        style={{ opacity }}
        aria-hidden="true"
      >
        <span className="font-body text-[9px] uppercase tracking-[0.3em] text-lavender-200/50">
          {hero.scrollHint}
        </span>
        <motion.div
          className="flex h-8 w-[22px] justify-center rounded-full border border-white/20 pt-1.5"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <motion.span
            className="h-1.5 w-1 rounded-full bg-blush-200"
            animate={{ y: [0, 11, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
