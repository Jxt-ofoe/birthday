'use client';

import { useEffect, useRef } from 'react';

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
};

type Rocket = {
  x: number;
  y: number;
  vy: number;
  targetY: number;
  color: string;
};

const COLORS = [
  '255, 182, 206', // blush
  '239, 208, 122', // gold
  '201, 180, 255', // lavender
  '255, 255, 255', // white
  '249, 106, 155', // deep pink
];

/**
 * Canvas fireworks for the final surprise. Runs for `durationMs` then
 * fades itself out and stops the RAF loop entirely.
 */
export function Fireworks({ active, durationMs = 9000 }: { active: boolean; durationMs?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = window.innerWidth;
    let h = window.innerHeight;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    let particles: Particle[] = [];
    let rockets: Rocket[] = [];
    let raf = 0;
    const startedAt = performance.now();
    let lastLaunch = 0;

    const launch = () => {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      rockets.push({
        x: w * (0.15 + Math.random() * 0.7),
        y: h + 10,
        vy: -(h * 0.011 + Math.random() * 2.6),
        targetY: h * (0.14 + Math.random() * 0.3),
        color,
      });
    };

    const explode = (x: number, y: number, color: string) => {
      const n = reduce ? 22 : 54 + Math.floor(Math.random() * 34);
      const speed = 2.4 + Math.random() * 2.2;
      for (let i = 0; i < n; i++) {
        const angle = (Math.PI * 2 * i) / n + Math.random() * 0.16;
        const v = speed * (0.55 + Math.random() * 0.6);
        const maxLife = 900 + Math.random() * 700;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * v,
          vy: Math.sin(angle) * v,
          life: maxLife,
          maxLife,
          // occasional contrast spark
          color: Math.random() > 0.86 ? '255, 255, 255' : color,
          size: Math.random() * 2 + 1.1,
        });
      }
    };

    const frame = (now: number) => {
      const elapsed = now - startedAt;
      const fading = elapsed > durationMs;

      // Trail effect instead of hard clear
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';

      if (!fading && now - lastLaunch > (reduce ? 1400 : 520)) {
        lastLaunch = now;
        launch();
        if (Math.random() > 0.55) setTimeout(launch, 180);
      }

      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.y += r.vy;
        r.vy += 0.045;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 2.1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r.color}, 0.95)`;
        ctx.fill();

        if (r.y <= r.targetY || r.vy >= 0) {
          explode(r.x, r.y, r.color);
          rockets.splice(i, 1);
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= 16.7;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.028; // gravity
        p.vx *= 0.988; // drag
        p.vy *= 0.988;

        const t = p.life / p.maxLife;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(p.size * t, 0.1), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${t * 0.95})`;
        ctx.fill();
      }

      ctx.globalCompositeOperation = 'source-over';

      if (fading && particles.length === 0 && rockets.length === 0) {
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    // initial volley
    launch();
    setTimeout(launch, 260);
    setTimeout(launch, 620);
    raf = requestAnimationFrame(frame);
    window.addEventListener('resize', resize, { passive: true });

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [active, durationMs]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60]"
    />
  );
}
