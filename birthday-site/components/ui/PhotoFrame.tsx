'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import type { Photo } from '@/content/site';
import { cn, isVideoSource } from '@/lib/utils';
import { EASE } from '@/lib/motion';

type Props = {
  photo: Photo;
  className?: string;
  /** Tailwind aspect ratio class, e.g. 'aspect-[4/5]' */
  aspect?: string;
  priority?: boolean;
  /** Slight rotation for a scattered polaroid feel. */
  tilt?: number;
  sizes?: string;
  onClick?: () => void;
};

/**
 * A photo or video in an elegant glass frame. Supports both images and videos (.mp4, .webm).
 * Automatically handles mobile Safari inline autoplay policies and pauses off-screen videos.
 */
export function PhotoFrame({
  photo,
  className,
  aspect = 'aspect-[4/5]',
  priority = false,
  tilt = 0,
  sizes = '(max-width: 640px) 88vw, (max-width: 1024px) 45vw, 380px',
  onClick,
}: Props) {
  const [errored, setErrored] = useState(false);
  const hasMedia = Boolean(photo.src) && !errored;
  const isVideo = isVideoSource(photo);

  return (
    <motion.figure
      className={cn('group relative', className)}
      style={{ rotate: `${tilt}deg` }}
      whileHover={{ rotate: 0, y: -8, transition: { duration: 0.55, ease: EASE } }}
    >
      <div
        className={cn(
          'relative overflow-hidden rounded-2xl glass p-2 shadow-glass',
          onClick && 'cursor-pointer',
        )}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={
          onClick
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onClick();
                }
              }
            : undefined
        }
      >
        <div className={cn('relative overflow-hidden rounded-xl bg-plum-800/60', aspect)}>
          {hasMedia ? (
            isVideo ? (
              <InlineVideo src={photo.src as string} onError={() => setErrored(true)} />
            ) : (
              <Image
                src={photo.src as string}
                alt={photo.alt}
                fill
                sizes={sizes}
                priority={priority}
                onError={() => setErrored(true)}
                className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.06]"
              />
            )
          ) : (
            <PhotoPlaceholder alt={photo.alt} />
          )}

          {isVideo && hasMedia && (
            <span className="absolute right-2.5 top-2.5 z-10 grid h-8 w-8 place-items-center rounded-full bg-plum-950/70 text-white shadow-md backdrop-blur-md transition-transform group-hover:scale-110">
              <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4 fill-current">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          )}

          {/* soft vignette + sheen */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-plum-950/55 via-transparent to-white/[0.06]"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-[1.6s] ease-out group-hover:translate-x-full"
          />
        </div>
      </div>
    </motion.figure>
  );
}

/**
 * Mobile-compatible inline video player.
 * Configures DOM attributes for iOS Safari (playsinline, webkit-playsinline, defaultMuted)
 * and uses IntersectionObserver to pause video playback when scrolled off-screen.
 */
function InlineVideo({ src, onError }: { src: string; onError: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute('playsinline', 'true');
    video.setAttribute('webkit-playsinline', 'true');

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.15 },
    );

    io.observe(video);
    return () => {
      io.disconnect();
      video.pause();
    };
  }, [src]);

  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <video
      ref={videoRef}
      src={src}
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      onError={onError}
      className="h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.06]"
    />
  );
}

/**
 * Shown when a photo slot is still empty.
 * Deliberately contains NO developer instructions — she should only ever see
 * something soft and intentional, never a note about editing files.
 */
function PhotoPlaceholder({ alt }: { alt: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-lavender-500/20 via-plum-700/40 to-blush-500/15 p-5 text-center">
      <div className="absolute inset-3 rounded-lg border border-white/10" />
      <motion.span
        aria-hidden="true"
        className="text-3xl"
        animate={{ scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
        style={{ filter: 'drop-shadow(0 0 12px rgba(255,182,206,0.45))' }}
      >
        🤍
      </motion.span>
      <p className="relative px-2 font-script text-base text-blush-100/70">{alt}</p>
    </div>
  );
}
