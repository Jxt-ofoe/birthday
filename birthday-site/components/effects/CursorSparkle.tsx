'use client';

import { useEffect, useRef } from 'react';
import { useIsTouchDevice, usePrefersReducedMotion } from '@/lib/hooks';

type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
};

const COLORS = ['255, 214, 232', '239, 208, 122', '201, 180, 255', '255, 255, 255'];

/**
 * Desktop-only cursor trail. Renders to a single fixed canvas and only
 * spawns particles while the pointer is actually moving, so it costs
 * essentially nothing when idle. Disabled on touch + reduced motion.
 */
export function CursorSparkle() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isTouch = useIsTouchDevice();
  const reduce = usePrefersReducedMotion();
  const enabled = !isTouch && !reduce;

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let sparks: Spark[] = [];
    let raf = 0;
    let idleFrames = 0;
    let lastSpawn = 0;

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const spawn = (x: number, y: number) => {
      const now = performance.now();
      // Throttle so fast movement doesn't flood the array
      if (now - lastSpawn < 16) return;
      lastSpawn = now;
      const n = 2;
      for (let i = 0; i < n; i++) {
        const maxLife = 480 + Math.random() * 420;
        sparks.push({
          x: x + (Math.random() - 0.5) * 10,
          y: y + (Math.random() - 0.5) * 10,
          vx: (Math.random() - 0.5) * 0.5,
          vy: -(Math.random() * 0.4 + 0.1),
          life: maxLife,
          maxLife,
          size: Math.random() * 2.4 + 0.8,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        });
      }
      if (sparks.length > 140) sparks = sparks.slice(-140);
      idleFrames = 0;
      start();
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      spawn(e.clientX, e.clientY);
    };

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life -= 16.7;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        s.x += s.vx;
        s.y += s.vy;
        s.vy -= 0.004;

        const t = s.life / s.maxLife;
        const alpha = t * t * 0.9;
        const r = s.size * t;

        ctx.beginPath();
        ctx.arc(s.x, s.y, Math.max(r, 0.1), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.color}, ${alpha})`;
        ctx.fill();

        // tiny four-point twinkle for the brighter sparks
        if (s.size > 2 && t > 0.5) {
          ctx.strokeStyle = `rgba(${s.color}, ${alpha * 0.55})`;
          ctx.lineWidth = 0.7;
          const len = r * 3.4;
          ctx.beginPath();
          ctx.moveTo(s.x - len, s.y);
          ctx.lineTo(s.x + len, s.y);
          ctx.moveTo(s.x, s.y - len);
          ctx.lineTo(s.x, s.y + len);
          ctx.stroke();
        }
      }

      if (sparks.length === 0) {
        idleFrames++;
        if (idleFrames > 20) {
          cancelAnimationFrame(raf);
          raf = 0;
          return;
        }
      }
      raf = requestAnimationFrame(draw);
    };

    const start = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('resize', resize, { passive: true });

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', resize);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[70]"
    />
  );
}
