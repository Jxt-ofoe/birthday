'use client';

import { useEffect, useRef } from 'react';
import { seededRandom, cn } from '@/lib/utils';
import { usePrefersReducedMotion, useMediaQuery } from '@/lib/hooks';

type Props = {
  className?: string;
  /** Base particle count on desktop; halved on small screens. */
  count?: number;
};

type Dust = {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  a: number;
  pulse: number;
  hue: number;
};

const PALETTE = ['255, 214, 232', '239, 208, 122', '201, 180, 255', '255, 255, 255'];

/**
 * Extremely light canvas particle layer — soft golden dust drifting upward.
 * Sits behind content at low opacity. Pauses automatically when the tab is
 * hidden or the section is scrolled out of view (IntersectionObserver).
 */
export function Particles({ className, count = 46 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = usePrefersReducedMotion();
  const isSmall = useMediaQuery('(max-width: 640px)');

  useEffect(() => {
    if (reduce) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const total = isSmall ? Math.round(count * 0.5) : count;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let particles: Dust[] = [];
    let raf = 0;
    let visible = true;

    const rand = seededRandom(9182736);

    const seed = () => {
      particles = Array.from({ length: total }, () => ({
        x: rand() * width,
        y: rand() * height,
        r: rand() * 1.9 + 0.5,
        vx: (rand() - 0.5) * 0.14,
        vy: -(rand() * 0.22 + 0.05),
        a: rand() * 0.5 + 0.15,
        pulse: rand() * Math.PI * 2,
        hue: Math.floor(rand() * PALETTE.length),
      }));
    };

    const resize = () => {
      const parent = canvas.parentElement;
      width = parent?.clientWidth ?? window.innerWidth;
      height = parent?.clientHeight ?? window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!particles.length) seed();
    };

    resize();

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.012;

        if (p.y < -12) {
          p.y = height + 8;
          p.x = rand() * width;
        }
        if (p.x < -12) p.x = width + 8;
        if (p.x > width + 12) p.x = -8;

        const alpha = p.a * (0.55 + 0.45 * Math.sin(p.pulse));
        const rgb = PALETTE[p.hue];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb}, ${alpha})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    const start = () => {
      if (!raf && visible) raf = requestAnimationFrame(draw);
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const onVisibility = () => {
      visible = !document.hidden;
      visible ? start() : stop();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting && !document.hidden;
        visible ? start() : stop();
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    start();

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [count, isSmall, reduce]);

  if (reduce) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
    />
  );
}
