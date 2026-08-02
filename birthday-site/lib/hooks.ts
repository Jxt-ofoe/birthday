'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/** SSR-safe media query hook. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/** True once the component has mounted on the client. */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

export function usePrefersReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

/** Coarse pointer => touch device. Used to disable the cursor sparkle. */
export function useIsTouchDevice() {
  return useMediaQuery('(hover: none), (pointer: coarse)');
}

export type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
};

const ZERO: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false };

function diff(target: number): TimeLeft {
  const delta = target - Date.now();
  if (delta <= 0) return { ...ZERO, isPast: true };
  const seconds = Math.floor(delta / 1000);
  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
    isPast: false,
  };
}

/** Live countdown. Returns null until mounted to keep SSR output stable. */
export function useCountdown(isoDate: string): TimeLeft | null {
  const [time, setTime] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const target = new Date(isoDate).getTime();
    if (Number.isNaN(target)) return;
    setTime(diff(target));
    const id = window.setInterval(() => setTime(diff(target)), 1000);
    return () => window.clearInterval(id);
  }, [isoDate]);

  return time;
}

/** Runs a callback on each animation frame while `active` is true. */
export function useRafLoop(callback: (dt: number) => void, active = true) {
  const cbRef = useRef(callback);
  cbRef.current = callback;

  useEffect(() => {
    if (!active) return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      cbRef.current(dt);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active]);
}

/** Locks body scroll (for modals). */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [locked]);
}

/** Calls `onClose` on Escape keypress. */
export function useEscapeKey(onClose: () => void, active = true) {
  const handler = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!active) return;
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [active, handler]);
}
