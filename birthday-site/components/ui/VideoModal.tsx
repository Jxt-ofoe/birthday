'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { surprise } from '@/content/site';
import { useEscapeKey, useScrollLock } from '@/lib/hooks';
import { EASE } from '@/lib/motion';

/**
 * Modal that plays your personal birthday video.
 * Reads `surprise.videoSrc`; if the file is missing it shows a graceful
 * message telling you exactly where to drop it.
 */
export function VideoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [failed, setFailed] = useState(false);

  useScrollLock(open);
  useEscapeKey(onClose, open);

  // Pause + reset when closed; focus close button and trigger play when opened.
  useEffect(() => {
    if (open) {
      setFailed(false);
      const v = videoRef.current;
      if (v) {
        v.setAttribute('playsinline', 'true');
        v.setAttribute('webkit-playsinline', 'true');
        void v.play().catch(() => {});
      }
      const t = window.setTimeout(() => closeRef.current?.focus(), 320);
      return () => window.clearTimeout(t);
    }
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
  }, [open]);

  const hasVideo = Boolean(surprise.videoSrc) && !failed;

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
            className="relative w-full max-w-2xl"
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.55, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overflow-hidden rounded-3xl glass-strong p-4 shadow-glass sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-4 px-1">
                <h3 className="font-display text-lg font-light text-gradient-gold sm:text-xl">
                  {surprise.videoTitle}
                </h3>
                <motion.button
                  ref={closeRef}
                  type="button"
                  onClick={onClose}
                  aria-label="Close video"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full glass text-blush-100"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.92 }}
                >
                  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>

              <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-plum-900/80">
                {hasVideo ? (
                  // eslint-disable-next-line jsx-a11y/media-has-caption
                  <video
                    ref={videoRef}
                    src={surprise.videoSrc as string}
                    poster={surprise.videoPoster ?? undefined}
                    controls
                    autoPlay
                    playsInline
                    onError={() => setFailed(true)}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
                    <motion.span
                      className="text-4xl"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      aria-hidden="true"
                    >
                      💌
                    </motion.span>
                    <p className="max-w-sm font-script text-xl leading-relaxed text-blush-100/85">
                      {surprise.videoFallback}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
