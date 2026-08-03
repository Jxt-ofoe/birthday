'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { audio as audioConfig } from '@/content/site';
import { AmbientPad } from '@/lib/ambientAudio';
import { cn } from '@/lib/utils';
import { EASE } from '@/lib/motion';

type Source = 'file' | 'ambient' | 'none';

/**
 * Floating mute / unmute control.
 *
 * Tries to play `public/music/romantic.mp3`. If that file doesn't exist (or
 * fails to decode) it transparently falls back to a generated Web Audio
 * ambient pad, so there is always soft music.
 *
 * Autoplay policies mean audio can only begin after a user gesture — the
 * "Begin Our Journey" button calls `window.__startMusic()` which this
 * component registers.
 */
export function MusicPlayer() {
  const [muted, setMuted] = useState(true);
  const [source, setSource] = useState<Source>('none');
  const [ready, setReady] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const padRef = useRef<AmbientPad | null>(null);
  const startedRef = useRef(false);

  /* ---------------- probe for the mp3 once on mount ---------------- */
  useEffect(() => {
    let cancelled = false;

    const probe = async () => {
      try {
        const res = await fetch(audioConfig.src, { method: 'HEAD' });
        const type = res.headers.get('content-type') ?? '';
        // Next dev server returns the HTML 404 page with 200 in some setups,
        // so verify the content type actually looks like audio.
        if (!cancelled && res.ok && !type.includes('text/html')) {
          setSource('file');
        } else if (!cancelled) {
          setSource('ambient');
        }
      } catch {
        if (!cancelled) setSource('ambient');
      } finally {
        if (!cancelled) setReady(true);
      }
    };

    void probe();
    return () => {
      cancelled = true;
    };
  }, []);

  /* ---------------- start / stop plumbing ---------------- */
  const startPlayback = useCallback(async () => {
    if (startedRef.current) return;
    startedRef.current = true;

    if (source === 'file') {
      const el = audioRef.current;
      if (!el) return;
      el.volume = 0;
      try {
        await el.play();
        // gentle fade-in
        const target = audioConfig.volume;
        const steps = 40;
        let i = 0;
        const id = window.setInterval(() => {
          i++;
          el.volume = Math.min(target, (target * i) / steps);
          if (i >= steps) window.clearInterval(id);
        }, 55);
        setMuted(false);
      } catch {
        // Blocked or file unplayable → fall back to the pad
        setSource('ambient');
        startedRef.current = false;
      }
      return;
    }

    if (!padRef.current) padRef.current = new AmbientPad(audioConfig.volume);
    try {
      await padRef.current.start();
      setMuted(false);
    } catch {
      startedRef.current = false;
    }
  }, [source]);

  /* Expose a global starter the hero button can call after a user gesture. */
  useEffect(() => {
    if (!ready) return;
    const w = window as unknown as { __startMusic?: () => void };
    w.__startMusic = () => void startPlayback();
    return () => {
      delete w.__startMusic;
    };
  }, [ready, startPlayback]);

  /* Nudge the user once if music never started. */
  useEffect(() => {
    const id = window.setTimeout(() => {
      if (!startedRef.current) setShowHint(true);
    }, 9000);
    const hide = window.setTimeout(() => setShowHint(false), 17000);
    return () => {
      window.clearTimeout(id);
      window.clearTimeout(hide);
    };
  }, []);

  const toggle = useCallback(async () => {
    setShowHint(false);

    if (!startedRef.current) {
      await startPlayback();
      return;
    }

    if (source === 'file') {
      const el = audioRef.current;
      if (!el) return;
      if (muted) {
        await el.play().catch(() => undefined);
        el.volume = audioConfig.volume;
        setMuted(false);
      } else {
        el.pause();
        setMuted(true);
      }
      return;
    }

    if (muted) {
      await padRef.current?.unmute();
      setMuted(false);
    } else {
      await padRef.current?.mute();
      setMuted(true);
    }
  }, [muted, source, startPlayback]);

  const pausedByMediaRef = useRef(false);

  /* Auto-pause background music whenever any video or soundtrack song plays, and resume when stopped */
  useEffect(() => {
    const handlePauseBg = () => {
      if (startedRef.current && !muted) {
        pausedByMediaRef.current = true;
        if (source === 'file') audioRef.current?.pause();
        else void padRef.current?.mute();
        setMuted(true);
      }
    };

    const handleResumeBg = () => {
      if (pausedByMediaRef.current) {
        // Check if any other media element is still actively playing
        const mediaElems = Array.from(document.querySelectorAll<HTMLMediaElement>('video, audio'));
        const activeMedia = mediaElems.some(
          (m) => m.id !== 'global-bg-audio' && !m.paused && !m.ended && m.readyState > 2,
        );

        if (!activeMedia) {
          pausedByMediaRef.current = false;
          setMuted(false);
          if (source === 'file') void audioRef.current?.play().catch(() => undefined);
          else void padRef.current?.unmute();
        }
      }
    };

    const onMediaPlay = (e: Event) => {
      const target = e.target as HTMLMediaElement;
      if (target && target.id !== 'global-bg-audio') {
        handlePauseBg();
      }
    };

    const onMediaPauseOrEnd = (e: Event) => {
      const target = e.target as HTMLMediaElement;
      if (target && target.id !== 'global-bg-audio') {
        handleResumeBg();
      }
    };

    window.addEventListener('play', onMediaPlay, true);
    window.addEventListener('pause', onMediaPauseOrEnd, true);
    window.addEventListener('ended', onMediaPauseOrEnd, true);
    window.addEventListener('pause-bg-music', handlePauseBg);
    window.addEventListener('resume-bg-music', handleResumeBg);

    return () => {
      window.removeEventListener('play', onMediaPlay, true);
      window.removeEventListener('pause', onMediaPauseOrEnd, true);
      window.removeEventListener('ended', onMediaPauseOrEnd, true);
      window.removeEventListener('pause-bg-music', handlePauseBg);
      window.removeEventListener('resume-bg-music', handleResumeBg);
    };
  }, [muted, source]);

  /* Pause background music and any active media when leaving the browser tab/app, resume when returning */
  useEffect(() => {
    const handleLeave = () => {
      // Pause background audio
      if (source === 'file') audioRef.current?.pause();
      else void padRef.current?.mute();

      // Pause any active HTML5 audio or video elements on the page
      document.querySelectorAll<HTMLMediaElement>('video, audio').forEach((el) => {
        if (el.id !== 'global-bg-audio' && !el.paused) {
          el.pause();
        }
      });
    };

    const handleReturn = () => {
      if (!document.hidden && !muted && startedRef.current && !pausedByMediaRef.current) {
        if (source === 'file') void audioRef.current?.play().catch(() => undefined);
        else void padRef.current?.unmute();
      }
    };

    const onVisChange = () => {
      if (document.hidden) handleLeave();
      else handleReturn();
    };

    document.addEventListener('visibilitychange', onVisChange);
    window.addEventListener('pagehide', handleLeave);
    window.addEventListener('blur', handleLeave);
    window.addEventListener('focus', handleReturn);

    return () => {
      document.removeEventListener('visibilitychange', onVisChange);
      window.removeEventListener('pagehide', handleLeave);
      window.removeEventListener('blur', handleLeave);
      window.removeEventListener('focus', handleReturn);
    };
  }, [muted, source]);

  useEffect(() => () => padRef.current?.destroy(), []);

  const playing = !muted && startedRef.current;

  return (
    <>
      {source === 'file' && (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <audio id="global-bg-audio" ref={audioRef} src={audioConfig.src} loop preload="none" />
      )}

      <div className="fixed bottom-5 right-4 z-50 flex items-center gap-2 pb-safe sm:bottom-7 sm:right-7">
        <AnimatePresence>
          {showHint && (
            <motion.span
              initial={{ opacity: 0, x: 12, filter: 'blur(4px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: 12, filter: 'blur(4px)' }}
              transition={{ duration: 0.5, ease: EASE }}
              className="hidden rounded-full glass px-4 py-2 font-body text-xs tracking-wide text-blush-100/90 sm:block"
            >
              Tap for music ♪
            </motion.span>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={toggle}
          aria-label={playing ? 'Mute background music' : 'Play background music'}
          aria-pressed={playing}
          className={cn(
            'relative grid h-12 w-12 place-items-center rounded-full glass-strong text-blush-100 transition-colors hover:text-white sm:h-14 sm:w-14',
            playing && 'border-gold-300/40',
          )}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
        >
          {/* pulsing halo while playing */}
          <AnimatePresence>
            {playing && (
              <motion.span
                aria-hidden="true"
                className="absolute inset-0 rounded-full border border-gold-300/40"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: [0.6, 0, 0.6], scale: [1, 1.35, 1] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2.6, repeat: Infinity, ease: 'easeOut' }}
              />
            )}
          </AnimatePresence>

          {playing ? <EqualizerIcon /> : <MutedIcon />}
        </motion.button>
      </div>
    </>
  );
}

function EqualizerIcon() {
  return (
    <span aria-hidden="true" className="flex items-end gap-[3px]">
      {[0, 1, 2, 3].map((i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full bg-gradient-to-t from-blush-300 to-gold-200"
          animate={{ height: [5, 15, 8, 18, 5] }}
          transition={{
            duration: 1.5 + i * 0.22,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.12,
          }}
          style={{ height: 8 }}
        />
      ))}
    </span>
  );
}

function MutedIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 5 6 9H3v6h3l5 4V5Z" />
      <path d="m22 9-6 6M16 9l6 6" />
    </svg>
  );
}
