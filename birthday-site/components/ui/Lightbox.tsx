'use client';

import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect } from 'react';
import type { Photo } from '@/content/site';
import { useScrollLock } from '@/lib/hooks';
import { EASE } from '@/lib/motion';
import { isVideoSource } from '@/lib/utils';

type Props = {
  photos: Photo[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

/** Full-screen photo/video viewer with keyboard + swipe navigation. */
export function Lightbox({ photos, index, onClose, onNavigate }: Props) {
  const open = index !== null;
  useScrollLock(open);

  const photo = open ? photos[index as number] : null;
  const isVideo = isVideoSource(photo);

  const go = useCallback(
    (dir: 1 | -1) => {
      if (index === null) return;
      const next = (index + dir + photos.length) % photos.length;
      onNavigate(next);
    },
    [index, photos.length, onNavigate],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, go]);

  return (
    <AnimatePresence>
      {open && photo && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-plum-950/92 p-4 backdrop-blur-xl sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={photo.alt}
        >
          <motion.button
            type="button"
            onClick={onClose}
            aria-label="Close photo"
            className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full glass text-blush-100 sm:right-7 sm:top-7"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.92 }}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </motion.button>

          {photos.length > 1 && (
            <>
              <NavButton side="left" onClick={(e) => { e.stopPropagation(); go(-1); }} />
              <NavButton side="right" onClick={(e) => { e.stopPropagation(); go(1); }} />
            </>
          )}

          <motion.figure
            key={index}
            className="relative max-h-[82vh] w-full max-w-3xl"
            initial={{ opacity: 0, scale: 0.93, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={(_, info) => {
              if (info.offset.x < -70) go(1);
              if (info.offset.x > 70) go(-1);
            }}
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl glass p-2">
              <div className="relative h-full w-full overflow-hidden rounded-xl bg-plum-800/60 flex items-center justify-center">
                {photo.src ? (
                  isVideo ? (
                    // eslint-disable-next-line jsx-a11y/media-has-caption
                    <video
                      src={photo.src}
                      controls
                      autoPlay
                      loop
                      playsInline
                      className="max-h-full max-w-full rounded-lg object-contain"
                    />
                  ) : (
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(max-width: 768px) 92vw, 768px"
                      className="object-contain"
                    />
                  )
                ) : (
                  <div className="grid h-full place-items-center p-8 text-center">
                    <p className="font-body text-sm text-blush-100/70">{photo.alt}</p>
                  </div>
                )}
              </div>
            </div>
            {photos.length > 1 && (
              <p className="mt-2 text-center font-body text-[10px] uppercase tracking-[0.25em] text-lavender-200/50">
                {(index as number) + 1} / {photos.length}
              </p>
            )}
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function NavButton({
  side,
  onClick,
}: {
  side: 'left' | 'right';
  onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={side === 'left' ? 'Previous photo' : 'Next photo'}
      className={`absolute top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full glass text-blush-100 sm:grid ${
        side === 'left' ? 'left-5' : 'right-5'
      }`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.92 }}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        {side === 'left' ? <path d="m15 18-6-6 6-6" /> : <path d="m9 18 6-6-6-6" />}
      </svg>
    </motion.button>
  );
}
