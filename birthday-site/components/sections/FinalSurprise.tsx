'use client';

import { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { surprise as S, person } from '@/content/site';
import { Section } from '@/components/ui/Section';
import { GiftBox } from '@/components/ui/GiftBox';
import { GlowButton } from '@/components/ui/GlowButton';
import { VideoModal } from '@/components/ui/VideoModal';
import { Fireworks } from '@/components/effects/Fireworks';
import { FloatingHearts } from '@/components/effects/FloatingHearts';
import { StarField } from '@/components/effects/StarField';
import { EASE } from '@/lib/motion';
import { usePrefersReducedMotion } from '@/lib/hooks';

const CONFETTI_COLORS = ['#ffb6ce', '#efd07a', '#c9b4ff', '#ffffff', '#f96a9b', '#fdf3d8'];

/**
 * The finale. Tapping the gift triggers confetti, fireworks, a flood of
 * hearts and a soft background glow, then reveals the birthday message.
 */
export function FinalSurprise() {
  const [opened, setOpened] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const reduce = usePrefersReducedMotion();

  const fireConfetti = useCallback(async () => {
    if (reduce) return;
    const confetti = (await import('canvas-confetti')).default;

    const base = {
      colors: CONFETTI_COLORS,
      disableForReducedMotion: true,
      zIndex: 65,
    };

    // opening burst
    void confetti({ ...base, particleCount: 130, spread: 95, origin: { y: 0.62 }, startVelocity: 48 });

    // side cannons
    window.setTimeout(() => {
      void confetti({ ...base, particleCount: 70, angle: 60, spread: 70, origin: { x: 0, y: 0.7 } });
      void confetti({ ...base, particleCount: 70, angle: 120, spread: 70, origin: { x: 1, y: 0.7 } });
    }, 260);

    // drifting heart confetti
    const heart = confetti.shapeFromText
      ? confetti.shapeFromText({ text: '❤️', scalar: 2 })
      : undefined;

    window.setTimeout(() => {
      void confetti({
        ...base,
        particleCount: 26,
        spread: 110,
        origin: { y: 0.5 },
        scalar: 2,
        gravity: 0.55,
        decay: 0.94,
        shapes: heart ? [heart] : undefined,
      });
    }, 620);

    // gentle continuous shower
    const end = Date.now() + 4200;
    const interval = window.setInterval(() => {
      if (Date.now() > end) {
        window.clearInterval(interval);
        return;
      }
      void confetti({
        ...base,
        particleCount: 4,
        spread: 62,
        startVelocity: 26,
        gravity: 0.62,
        scalar: 0.85,
        origin: { x: Math.random(), y: -0.05 },
      });
    }, 300);
  }, [reduce]);

  const handleOpen = useCallback(() => {
    if (opened) return;
    setOpened(true);
    void fireConfetti();
  }, [opened, fireConfetti]);

  return (
    <Section id="surprise" spacing="xl" glow="blush" label="Your birthday surprise">
      <StarField count={60} />
      <Fireworks active={opened && !reduce} />

      {/* the soft background glow that blooms when opened */}
      <AnimatePresence>
        {opened && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2.2, ease: EASE }}
          >
            <motion.div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse 70% 55% at 50% 45%, rgba(249,106,155,0.24), transparent 65%), radial-gradient(ellipse 55% 45% at 50% 50%, rgba(239,208,122,0.18), transparent 70%)',
              }}
              animate={{ opacity: [0.6, 1, 0.75] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <FloatingHearts
        count={opened ? 30 : 8}
        seed={999}
        intensity={opened ? 'burst' : 'subtle'}
      />

      <div className="relative z-10 flex flex-col items-center">
        {/* ---------- before opening ---------- */}
        <AnimatePresence mode="wait">
          {!opened && (
            <motion.div
              key="closed"
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30, filter: 'blur(10px)' }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1, ease: EASE }}
            >
              <span className="font-body text-[11px] uppercase tracking-[0.42em] text-gold-300/85">
                {S.prompt}
              </span>

              <div className="mt-10">
                <GiftBox opened={opened} onOpen={handleOpen} />
              </div>

              <motion.p
                className="mt-6 font-script text-xl text-blush-200/80"
                animate={{ opacity: [0.55, 1, 0.55], y: [0, -3, 0] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
              >
                {S.hint} 👆
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ---------- after opening ---------- */}
        <AnimatePresence>
          {opened && (
            <motion.div
              key="opened"
              className="flex w-full max-w-2xl flex-col items-center text-center"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: EASE, delay: 0.7 }}
            >
              {/* title */}
              <motion.h2
                className="font-display text-[clamp(1.85rem,7.5vw,3.6rem)] font-light leading-[1.14] tracking-tight text-balance"
                initial={{ opacity: 0, scale: 0.9, filter: 'blur(14px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 1.4, ease: EASE, delay: 0.9 }}
              >
                <span className="text-gradient-gold">{S.title}</span>
              </motion.h2>

              <motion.div
                className="mt-8 h-px w-44 bg-gradient-to-r from-transparent via-gold-300/70 to-transparent sm:w-60"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: EASE, delay: 1.3 }}
              />

              {/* message */}
              <div className="mt-9 space-y-5 sm:mt-11 sm:space-y-6">
                {S.paragraphs.map((p, i) => (
                  <motion.p
                    key={i}
                    className="font-body text-[15.5px] font-light leading-[1.92] text-blush-50/90 text-pretty sm:text-[17px]"
                    initial={{ opacity: 0, y: 22, filter: 'blur(7px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 1, ease: EASE, delay: 1.5 + i * 0.28 }}
                  >
                    {p}
                  </motion.p>
                ))}
              </div>

              {/* signature */}
              <motion.p
                className="mt-11 font-script text-2xl text-gradient-romance sm:text-3xl"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, ease: EASE, delay: 1.5 + S.paragraphs.length * 0.28 }}
              >
                {S.signOff}
              </motion.p>

              {/* video CTA */}
              <motion.div
                className="mt-12"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1,
                  ease: EASE,
                  delay: 1.9 + S.paragraphs.length * 0.28,
                }}
              >
                <GlowButton variant="gold" size="lg" onClick={() => setVideoOpen(true)}>
                  <span aria-hidden="true">▶</span>
                  {S.videoButton}
                </GlowButton>
              </motion.div>

              {/* closing hearts */}
              <motion.div
                className="mt-14 flex items-center gap-3 text-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.4 + S.paragraphs.length * 0.28, duration: 1 }}
                aria-hidden="true"
              >
                {['💗', '❤️', '💜'].map((h, i) => (
                  <motion.span
                    key={i}
                    animate={{ y: [0, -9, 0], scale: [1, 1.16, 1] }}
                    transition={{
                      duration: 2.4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: i * 0.3,
                    }}
                  >
                    {h}
                  </motion.span>
                ))}
              </motion.div>

              <motion.p
                className="mt-10 font-body text-[10px] uppercase tracking-[0.34em] text-lavender-200/45"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.8 + S.paragraphs.length * 0.28, duration: 1 }}
              >
                Made with love, for {person.name}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} />
    </Section>
  );
}
