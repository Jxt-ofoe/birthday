'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { loader } from '@/content/site';
import { EASE } from '@/lib/motion';
import { StarField } from '@/components/effects/StarField';

/**
 * Romantic loading screen with a beating heart, progress bar and rotating
 * status lines. Fades away once the window `load` event fires (or after a
 * minimum display time, whichever is later).
 */
export function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    const MIN_MS = 2100;
    const started = performance.now();
    let loaded = document.readyState === 'complete';

    const onLoad = () => {
      loaded = true;
    };
    window.addEventListener('load', onLoad);

    // Ease the bar toward 90%, then snap to 100 when everything is ready.
    const tick = window.setInterval(() => {
      setProgress((p) => {
        const elapsed = performance.now() - started;
        const canFinish = loaded && elapsed >= MIN_MS;
        if (canFinish) return Math.min(100, p + 7);
        if (p >= 92) return p;
        // decelerating approach
        return p + Math.max(0.7, (92 - p) * 0.045);
      });
    }, 45);

    return () => {
      window.clearInterval(tick);
      window.removeEventListener('load', onLoad);
    };
  }, []);

  useEffect(() => {
    const id = window.setInterval(
      () => setLineIndex((i) => (i + 1) % loader.lines.length),
      1500,
    );
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (progress < 100) return;
    const id = window.setTimeout(() => {
      setVisible(false);
      window.setTimeout(onDone, 900);
    }, 420);
    return () => window.clearTimeout(id);
  }, [progress, onDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-plum-950 px-8"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(12px)', scale: 1.04 }}
          transition={{ duration: 0.9, ease: EASE }}
          role="status"
          aria-live="polite"
          aria-label="Loading"
        >
          <StarField count={54} withShootingStars={false} />

          {/* central glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(249,106,155,0.22),transparent_65%)] blur-2xl"
          />

          <motion.div
            className="relative flex flex-col items-center"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            {/* beating heart */}
            <motion.div
              className="relative text-6xl sm:text-7xl"
              animate={{ scale: [1, 1.16, 1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ filter: 'drop-shadow(0 0 26px rgba(249,106,155,0.6))' }}
              aria-hidden="true"
            >
              ❤️
            </motion.div>

            <motion.p
              className="mt-9 font-script text-xl text-blush-100/90 sm:text-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.8 }}
            >
              {loader.signature}
            </motion.p>

            {/* progress bar */}
            <div className="mt-8 h-[3px] w-56 overflow-hidden rounded-full bg-white/10 sm:w-72">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-blush-300 via-gold-200 to-lavender-300"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'linear' }}
              />
            </div>

            <div className="mt-4 h-5 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={lineIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="font-body text-[11px] uppercase tracking-[0.3em] text-lavender-200/70"
                >
                  {loader.lines[lineIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
