'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { EASE } from '@/lib/motion';

/**
 * An elegant animated gift box, drawn in SVG so it stays razor sharp.
 * Idles with a gentle float + shimmer, and bursts open when tapped.
 */
export function GiftBox({ opened, onOpen }: { opened: boolean; onOpen: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      disabled={opened}
      aria-label={opened ? 'Gift opened' : 'Open your gift'}
      className="group relative grid place-items-center rounded-3xl p-4 disabled:cursor-default"
      whileHover={opened ? undefined : { scale: 1.06 }}
      whileTap={opened ? undefined : { scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 340, damping: 20 }}
    >
      {/* glow behind the box */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 rounded-full blur-2xl"
        style={{
          background:
            'radial-gradient(circle, rgba(239,208,122,0.5), rgba(249,106,155,0.28) 45%, transparent 70%)',
        }}
        animate={
          opened
            ? { opacity: [0.6, 1, 0.75], scale: [1, 1.8, 1.5] }
            : { opacity: [0.35, 0.7, 0.35], scale: [0.9, 1.1, 0.9] }
        }
        transition={{
          duration: opened ? 1.2 : 3.6,
          repeat: opened ? 0 : Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* orbiting sparkles while closed */}
      <AnimatePresence>
        {!opened &&
          [0, 1, 2, 3].map((i) => (
            <motion.span
              key={i}
              aria-hidden="true"
              className="pointer-events-none absolute text-sm"
              style={{ originX: 0.5, originY: 0.5 }}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 1, 0],
                x: [0, Math.cos((i * Math.PI) / 2) * 82, 0],
                y: [0, Math.sin((i * Math.PI) / 2) * 82, 0],
                scale: [0.4, 1, 0.4],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 3.4,
                repeat: Infinity,
                delay: i * 0.85,
                ease: 'easeInOut',
              }}
            >
              ✨
            </motion.span>
          ))}
      </AnimatePresence>

      <motion.div
        animate={
          opened
            ? { y: 0, rotate: 0 }
            : { y: [0, -10, 0], rotate: [-1.5, 1.5, -1.5] }
        }
        transition={
          opened
            ? { duration: 0.4 }
            : { duration: 4, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        <svg
          viewBox="0 0 200 200"
          className="h-36 w-36 xs:h-40 xs:w-40 sm:h-52 sm:w-52"
          role="img"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="boxBody" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f9b8d0" />
              <stop offset="45%" stopColor="#f96a9b" />
              <stop offset="100%" stopColor="#a3235a" />
            </linearGradient>
            <linearGradient id="boxLid" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffd9e6" />
              <stop offset="50%" stopColor="#f98cb4" />
              <stop offset="100%" stopColor="#c4356f" />
            </linearGradient>
            <linearGradient id="ribbon" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fdf3d8" />
              <stop offset="40%" stopColor="#efd07a" />
              <stop offset="100%" stopColor="#c9973a" />
            </linearGradient>
            <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ---- box body ---- */}
          <motion.g
            animate={opened ? { y: 6 } : { y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <rect
              x="42"
              y="86"
              width="116"
              height="82"
              rx="9"
              fill="url(#boxBody)"
              stroke="rgba(255,255,255,0.35)"
              strokeWidth="1.2"
            />
            {/* vertical ribbon on body */}
            <rect x="90" y="86" width="20" height="82" fill="url(#ribbon)" opacity="0.95" />
            {/* soft inner shadow */}
            <rect x="42" y="86" width="116" height="82" rx="9" fill="url(#boxBody)" opacity="0" />
            <path
              d="M42 140 h116"
              stroke="rgba(0,0,0,0.10)"
              strokeWidth="10"
              strokeLinecap="round"
              opacity="0.35"
            />
          </motion.g>

          {/* ---- lid (flies off when opened) ---- */}
          <motion.g
            animate={
              opened
                ? { y: -95, rotate: -22, opacity: 0, scale: 0.85 }
                : { y: 0, rotate: 0, opacity: 1, scale: 1 }
            }
            style={{ originX: '100px', originY: '86px' }}
            transition={{ duration: 0.95, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <rect
              x="32"
              y="64"
              width="136"
              height="30"
              rx="8"
              fill="url(#boxLid)"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1.2"
            />
            <rect x="90" y="64" width="20" height="30" fill="url(#ribbon)" />

            {/* ---- bow ---- */}
            <g filter="url(#softGlow)">
              <motion.path
                d="M100 64 C 86 64, 62 52, 66 38 C 69 27, 88 32, 100 64 Z"
                fill="url(#ribbon)"
                stroke="rgba(255,255,255,0.45)"
                strokeWidth="1"
                animate={opened ? {} : { rotate: [-2.5, 2.5, -2.5] }}
                style={{ originX: '100px', originY: '62px' }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.path
                d="M100 64 C 114 64, 138 52, 134 38 C 131 27, 112 32, 100 64 Z"
                fill="url(#ribbon)"
                stroke="rgba(255,255,255,0.45)"
                strokeWidth="1"
                animate={opened ? {} : { rotate: [2.5, -2.5, 2.5] }}
                style={{ originX: '100px', originY: '62px' }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              />
              <circle cx="100" cy="62" r="9" fill="url(#ribbon)" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" />
            </g>
          </motion.g>

          {/* ---- light bursting out ---- */}
          <AnimatePresence>
            {opened && (
              <motion.circle
                cx="100"
                cy="96"
                r="10"
                fill="#fff6e0"
                initial={{ opacity: 0, r: 6 }}
                animate={{ opacity: [0, 0.95, 0], r: [6, 80, 120] }}
                transition={{ duration: 1.3, ease: 'easeOut' }}
              />
            )}
          </AnimatePresence>
        </svg>
      </motion.div>

      {/* shimmer sweep on hover */}
      {!opened && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -translate-x-full overflow-hidden rounded-3xl bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full"
        />
      )}
    </motion.button>
  );
}
