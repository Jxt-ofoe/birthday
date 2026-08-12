'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { surprise } from '@/content/site';
import { useEscapeKey, useScrollLock } from '@/lib/hooks';
import { EASE } from '@/lib/motion';

/**
 * Modal that presents your personal birthday message.
 */
export function VideoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useScrollLock(open);
  useEscapeKey(onClose, open);

  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => closeRef.current?.focus(), 320);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[95] flex items-center justify-center bg-plum-950/92 p-4 backdrop-blur-xl sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={surprise.videoTitle}
        >
          <motion.div
            className="relative w-full max-w-2xl max-h-[85vh] flex flex-col"
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.55, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overflow-hidden rounded-3xl glass-strong p-6 shadow-glass sm:p-8 flex flex-col max-h-[85vh]">
              <div className="mb-4 flex items-center justify-between gap-4 px-1 shrink-0 border-b border-blush-200/10 pb-4">
                <h3 className="font-display text-lg font-light text-gradient-gold sm:text-xl">
                  {surprise.videoTitle}
                </h3>
                <motion.button
                  ref={closeRef}
                  type="button"
                  onClick={onClose}
                  aria-label="Close message"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full glass text-blush-100"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.92 }}
                >
                  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>

              {/* Message scroll container */}
              <div className="overflow-y-auto space-y-4 pr-2 text-left font-body text-[15px] leading-relaxed text-blush-50/90 sm:text-[16.5px] scrollbar-thin scrollbar-thumb-blush-200/20">
                {surprise.birthdayMessage?.map((p, i) => (
                  <p key={i} className="leading-[1.85]">
                    {p}
                  </p>
                ))}
                <div className="pt-6 pb-2 font-script text-2xl text-gradient-romance text-right sm:text-3xl">
                  {surprise.signOff}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

