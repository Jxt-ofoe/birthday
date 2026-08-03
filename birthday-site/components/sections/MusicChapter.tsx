'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { musicChapter as M, type MusicTrack } from '@/content/site';
import { Section } from '@/components/ui/Section';
import { ChapterHeading } from '@/components/ui/ChapterHeading';
import { GlassCard } from '@/components/ui/GlassCard';
import { EASE } from '@/lib/motion';

/**
 * Chapter 8 — Soundtrack featuring local MP3 audio files or embedded players.
 */
export function MusicChapter() {
  return (
    <Section id="chapter-8" glow="lavender" label="Chapter Eight: Songs That Remind Me Of You">
      <ChapterHeading number={M.number} title={M.title} subtitle={M.subtitle} />

      <div className="mt-16 space-y-5 sm:mt-20 sm:space-y-6">
        {M.tracks.map((track, i) => (
          <TrackCard key={i} track={track} index={i} />
        ))}
      </div>
    </Section>
  );
}

function TrackCard({ track, index }: { track: MusicTrack; index: number }) {
  const [loaded, setLoaded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isLocal = track.provider === 'local' || Boolean(track.src);
  const isSpotify = track.provider === 'spotify';

  const embedUrl = track.id
    ? isSpotify
      ? `https://open.spotify.com/embed/track/${track.id}?utm_source=generator&theme=0`
      : `https://www.youtube-nocookie.com/embed/${track.id}?rel=0&modestbranding=1&autoplay=1`
    : null;

  const toggleLocalPlay = () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      document.querySelectorAll('audio.local-track-audio').forEach((a) => {
        if (a !== el) (a as HTMLAudioElement).pause();
      });
      void el.play().catch(() => {});
      setPlaying(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.85, ease: EASE, delay: index * 0.1 }}
    >
      <GlassCard interactive={!loaded} className="overflow-hidden p-5 sm:p-6">
        {isLocal && (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <audio
            ref={audioRef}
            src={track.src as string}
            className="local-track-audio hidden"
            onEnded={() => setPlaying(false)}
            onPause={() => setPlaying(false)}
            onPlay={() => setPlaying(true)}
          />
        )}

        <div className="flex items-center gap-4">
          <motion.span
            className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/12 bg-gradient-to-br from-lavender-500/25 to-blush-500/20 text-xl"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut', delay: index * 0.4 }}
            aria-hidden="true"
          >
            {isLocal ? (
              '🎵'
            ) : isSpotify ? (
              <SpotifyIcon />
            ) : (
              <YouTubeIcon />
            )}
          </motion.span>

          <div className="min-w-0 flex-1">
            <h3 className="truncate font-display text-lg font-normal text-blush-50 sm:text-xl">
              {track.title} {track.artist && <span className="font-body text-xs font-light text-blush-200/70">— {track.artist}</span>}
            </h3>
            <p className="mt-0.5 truncate font-body text-[13px] font-light text-blush-100/65">
              {track.note}
            </p>
          </div>

          {isLocal ? (
            <motion.button
              type="button"
              onClick={toggleLocalPlay}
              aria-label={playing ? `Pause ${track.title}` : `Play ${track.title}`}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blush-200 to-lavender-200 text-plum-900 shadow-md"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.92 }}
            >
              {playing ? (
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5 fill-current">
                  <path d="M8 5.14v14l11-7-11-7Z" />
                </svg>
              )}
            </motion.button>
          ) : embedUrl && !loaded ? (
            <motion.button
              type="button"
              onClick={() => setLoaded(true)}
              aria-label={`Play ${track.title}`}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blush-200 to-lavender-200 text-plum-900"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.92 }}
            >
              <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5" fill="currentColor">
                <path d="M8 5.14v14l11-7-11-7Z" />
              </svg>
            </motion.button>
          ) : (
            <span aria-hidden="true" className="shrink-0 text-lg text-blush-200/45">
              ♪
            </span>
          )}
        </div>

        {/* animated waveform */}
        {(playing || (!loaded && embedUrl)) && (
          <div className="mt-4 flex h-6 items-end gap-[3px] opacity-75" aria-hidden="true">
            {Array.from({ length: 44 }).map((_, i) => (
              <motion.span
                key={i}
                className="flex-1 rounded-full bg-gradient-to-t from-lavender-400/70 to-blush-300/80"
                animate={playing ? { height: [4, 6 + ((i * 7) % 18), 4] } : { height: 4 }}
                transition={{
                  duration: 1.2 + (i % 5) * 0.18,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: (i % 11) * 0.08,
                }}
                style={{ height: 5 }}
              />
            ))}
          </div>
        )}

        {/* the real embed, mounted on demand */}
        {loaded && embedUrl && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mt-5 overflow-hidden rounded-xl"
          >
            <iframe
              src={embedUrl}
              title={track.title}
              loading="lazy"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
              className="w-full rounded-xl border-0"
              style={{ height: isSpotify ? 152 : 220 }}
            />
          </motion.div>
        )}
      </GlassCard>
    </motion.div>
  );
}

function SpotifyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#1ed760]" fill="currentColor">
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.59 14.42a.62.62 0 0 1-.86.21c-2.35-1.44-5.3-1.76-8.79-.96a.62.62 0 1 1-.28-1.22c3.81-.87 7.09-.5 9.72 1.11.3.18.39.57.21.86Zm1.22-2.73a.78.78 0 0 1-1.07.26c-2.69-1.65-6.79-2.13-9.97-1.17a.78.78 0 1 1-.45-1.49c3.63-1.1 8.15-.56 11.24 1.33.36.23.48.7.25 1.07Zm.11-2.85c-3.23-1.92-8.55-2.09-11.63-1.16a.93.93 0 1 1-.54-1.79c3.54-1.07 9.42-.87 13.13 1.34a.94.94 0 0 1-.96 1.61Z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#ff4757]" fill="currentColor">
      <path d="M23.5 6.5a3 3 0 0 0-2.12-2.12C19.5 3.87 12 3.87 12 3.87s-7.5 0-9.38.51A3 3 0 0 0 .5 6.5C0 8.38 0 12 0 12s0 3.62.5 5.5a3 3 0 0 0 2.12 2.12c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3 3 0 0 0 2.12-2.12C24 15.62 24 12 24 12s0-3.62-.5-5.5ZM9.6 15.6V8.4l6.24 3.6-6.24 3.6Z" />
    </svg>
  );
}
