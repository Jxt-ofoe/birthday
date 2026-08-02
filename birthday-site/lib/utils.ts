import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes safely. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Deterministic pseudo-random number generator (mulberry32).
 *  Using a seed keeps server and client renders identical, which avoids
 *  React hydration mismatches for our decorative star/particle layers. */
export function seededRandom(seed: number) {
  let t = seed + 0x6d2b79f5;
  return () => {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const range = (n: number) => Array.from({ length: n }, (_, i) => i);

/** Smoothly scroll to an element id, accounting for reduced-motion prefs. */
export function scrollToId(id: string) {
  if (typeof document === 'undefined') return;
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}

/** Check if a photo object or URL represents a video file. */
export function isVideoSource(photo?: { src: string | null; isVideo?: boolean } | null): boolean {
  if (!photo) return false;
  if (photo.isVideo) return true;
  if (!photo.src) return false;
  return /\.(mp4|webm|mov|m4v|ogg)(\?.*)?$/i.test(photo.src);
}
