'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { loveLetter as L } from '@/content/site';
import { Section } from '@/components/ui/Section';
import { ChapterHeading } from '@/components/ui/ChapterHeading';
import { GlowButton } from '@/components/ui/GlowButton';
import { EASE } from '@/lib/motion';
import { usePrefersReducedMotion } from '@/lib/hooks';
import { cn } from '@/lib/utils';

/**
 * Chapter 7 — a handwritten-style letter on aged paper that types itself
 * out, line by line, when it scrolls into view.
 */
export function LoveLetter() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const reduce = usePrefersReducedMotion();

  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [runId, setRunId] = useState(0);

  const lines = L.body;

  const skip = useCallback(() => {
    setLineIndex(lines.length);
    setCharIndex(0);
    setDone(true);
  }, [lines.length]);

  const replay = useCallback(() => {
    setLineIndex(0);
    setCharIndex(0);
    setDone(false);
    setRunId((r) => r + 1);
  }, []);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      skip();
      return;
    }
    if (done) return;

    const current = lines[lineIndex];

    // Finished every line
    if (current === undefined) {
      setDone(true);
      return;
    }

    // Blank line = paragraph break: pause, then move on
    if (current === '') {
      const t = window.setTimeout(() => {
        setLineIndex((i) => i + 1);
        setCharIndex(0);
      }, 420);
      return () => window.clearTimeout(t);
    }

    if (charIndex < current.length) {
      // Slight speed variance feels more human than a fixed interval
      const ch = current[charIndex];
      const delay = ch === ',' ? 90 : ch === '.' ? 150 : 17 + Math.random() * 22;
      const t = window.setTimeout(() => setCharIndex((c) => c + 1), delay);
      return () => window.clearTimeout(t);
    }

    const t = window.setTimeout(() => {
      setLineIndex((i) => i + 1);
      setCharIndex(0);
    }, 300);
    return () => window.clearTimeout(t);
  }, [inView, lineIndex, charIndex, lines, done, reduce, skip, runId]);

  const typingActive = inView && !done;

  return (
    <Section id="chapter-7" glow="gold" label="Chapter Seven: A Letter For You">
      <ChapterHeading number={L.number} title={L.title} subtitle={L.subtitle} />

      <motion.div
        ref={ref}
        className="mx-auto mt-16 w-full max-w-2xl sm:mt-20"
        initial={{ opacity: 0, y: 46, rotateX: 8 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.2, ease: EASE }}
        style={{ perspective: 1200 }}
      >
        {/* ---------- the paper ---------- */}
        <div className="relative overflow-hidden rounded-2xl p-5 xs:p-7 shadow-2xl sm:rounded-3xl sm:p-11">
          {/* aged paper background */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10"
            style={{
              background:
                'linear-gradient(160deg, #fdf8f3 0%, #faf1ea 45%, #f6e9e2 100%)',
            }}
          />
          {/* subtle paper grain + ruled lines */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 opacity-[0.07]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, transparent, transparent 31px, #4b2a6b 31px, #4b2a6b 32px)',
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 opacity-30"
            style={{
              background:
                'radial-gradient(ellipse 70% 60% at 20% 15%, rgba(255,255,255,0.9), transparent 60%), radial-gradient(ellipse 60% 50% at 90% 95%, rgba(201,151,58,0.13), transparent 60%)',
            }}
          />
          {/* torn/soft edges */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-plum-900/[0.07] sm:rounded-3xl"
          />

          {/* wax seal */}
          <motion.div
            className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full text-base sm:right-8 sm:top-8 sm:h-14 sm:w-14 sm:text-lg"
            style={{
              background: 'radial-gradient(circle at 35% 30%, #f96a9b, #a3235a)',
              boxShadow: '0 6px 18px rgba(163,35,90,0.4), inset 0 2px 6px rgba(255,255,255,0.35)',
            }}
            initial={{ scale: 0, rotate: -40 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 220, damping: 14 }}
            aria-hidden="true"
          >
            <span className="text-white/90">❤</span>
          </motion.div>

          {/* ---------- letter body ---------- */}
          <div className="relative">
            <motion.p
              className="font-script text-xl text-plum-600 sm:text-3xl"
              initial={{ opacity: 0, x: -14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.25 }}
            >
              {L.greeting}
            </motion.p>

            <div
              className="mt-6 min-h-[260px] space-y-3 sm:min-h-[320px]"
              aria-live="polite"
              aria-atomic="false"
            >
              {/* Accessible full text for screen readers */}
              <span className="sr-only">{lines.filter(Boolean).join(' ')}</span>

              <div aria-hidden="true">
                {lines.map((line, i) => {
                  if (i > lineIndex) return null;
                  if (line === '') return <div key={i} className="h-3" />;

                  const isCurrent = i === lineIndex && !done;
                  const text = isCurrent ? line.slice(0, charIndex) : line;

                  return (
                    <p
                      key={i}
                      className={cn(
                        'font-script text-[17px] leading-[1.8] text-plum-700/90 sm:text-[22px] sm:leading-[1.9]',
                      )}
                    >
                      {text}
                      {isCurrent && typingActive && (
                        <span className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[3px] bg-plum-600/70 animate-blink" />
                      )}
                    </p>
                  );
                })}
              </div>
            </div>

            {/* ---------- signature ---------- */}
            <motion.div
              className="mt-8 flex flex-col items-end gap-1"
              initial={{ opacity: 0, y: 14 }}
              animate={done ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
            >
              <span className="font-script text-lg text-plum-600/75 sm:text-xl">{L.signOff}</span>
              <SignatureFlourish show={done} />
              <span className="font-script text-3xl text-plum-600 sm:text-4xl">{L.signature}</span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* ---------- controls ---------- */}
      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        {!done && inView && !reduce && (
          <GlowButton variant="ghost" size="sm" onClick={skip}>
            {L.skipLabel}
          </GlowButton>
        )}
        {done && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            <GlowButton variant="ghost" size="sm" onClick={replay}>
              <span aria-hidden="true">↻</span>
              {L.replayLabel}
            </GlowButton>
          </motion.div>
        )}
      </div>
    </Section>
  );
}

/** A little hand-drawn underline that draws itself under the sign-off. */
function SignatureFlourish({ show }: { show: boolean }) {
  return (
    <svg
      viewBox="0 0 160 22"
      className="h-5 w-32 text-blush-500/50"
      fill="none"
      aria-hidden="true"
    >
      <motion.path
        d="M4 14C22 5 40 3 58 8s34 12 52 8 30-11 46-9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: show ? 1 : 0 }}
        transition={{ duration: 1.4, ease: EASE, delay: 0.35 }}
      />
    </svg>
  );
}
