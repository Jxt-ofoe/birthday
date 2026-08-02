'use client';

import { motion } from 'framer-motion';
import { chapter3 as c } from '@/content/site';
import { Section } from '@/components/ui/Section';
import { ChapterHeading } from '@/components/ui/ChapterHeading';
import { StoryText } from '@/components/ui/StoryText';
import { Reveal } from '@/components/ui/Reveal';
import { EASE } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { StarField } from '@/components/effects/StarField';

/**
 * Chapter 3 — animated chat bubbles that appear one by one as she scrolls,
 * complete with a typing indicator and a soft "2:00 AM" clock.
 */
export function Chapter3() {
  return (
    <Section id="chapter-3" glow="lavender" label="Chapter Three: Unforgettable Conversations">
      {/* starry background layer */}
      <StarField count={40} withShootingStars={false} className="opacity-70" />

      <ChapterHeading number={c.number} title={c.title} subtitle={c.subtitle} />

      <div className="mx-auto mt-16 max-w-2xl sm:mt-20">
        <StoryText paragraphs={c.paragraphs} />
      </div>

      {/* ---------- the phone / chat window ---------- */}
      <motion.div
        className="mx-auto mt-14 w-full max-w-md sm:mt-20"
        initial={{ opacity: 0, y: 48, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 1.1, ease: EASE }}
      >
        <div className="relative overflow-hidden rounded-[2rem] glass-strong p-4 shadow-glass sm:p-5">
          {/* status bar */}
          <div className="mb-4 flex items-center justify-between px-1.5">
            <div className="flex items-center gap-2.5">
              <motion.span
                className="h-2 w-2 rounded-full bg-blush-300"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2.2, repeat: Infinity }}
              />
              <span className="font-body text-[11px] tracking-wide text-blush-100/70">Us</span>
            </div>
            <motion.span
              className="font-body text-[11px] tracking-wide text-lavender-200/60"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              💬 Saved Memory
            </motion.span>
          </div>

          <div className="hairline mb-4" />

          {/* bubbles */}
          <div className="flex flex-col gap-3">
            {c.bubbles.map((b, i) => (
              <ChatBubbleRow key={i} bubble={b} index={i} />
            ))}

            {/* typing indicator */}
            <motion.div
              className="mt-1 flex justify-start"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}
            >
              <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-white/12 bg-white/[0.07] px-4 py-3">
                {[0, 1, 2].map((d) => (
                  <motion.span
                    key={d}
                    className="h-1.5 w-1.5 rounded-full bg-blush-200/80"
                    animate={{ y: [0, -4, 0], opacity: [0.45, 1, 0.45] }}
                    transition={{
                      duration: 1.15,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: d * 0.16,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          <div className="hairline my-5" />

          {/* closing note */}
          <motion.div
            className="flex flex-col items-center gap-1 pb-1"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <span className="font-script text-2xl text-gradient-gold sm:text-3xl">
              and the rest is history ❤️
            </span>
          </motion.div>
        </div>
      </motion.div>

      <div className="mx-auto mt-16 max-w-2xl sm:mt-20">
        <StoryText paragraphs={c.closing} size="lg" stagger={0.3} />
      </div>

      <Reveal className="mt-10 flex justify-center" delay={0.2}>
        <motion.span
          className="text-2xl"
          animate={{ scale: [1, 1.14, 1] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
          style={{ filter: 'drop-shadow(0 0 14px rgba(249,106,155,0.5))' }}
        >
          💗
        </motion.span>
      </Reveal>
    </Section>
  );
}

function ChatBubbleRow({
  bubble,
  index,
}: {
  bubble: { from: 'me' | 'her'; text: string; time?: string; isSticker?: boolean; stickerLabel?: string };
  index: number;
}) {
  const isMe = bubble.from === 'me';

  if (bubble.isSticker) {
    const emoji = bubble.text.includes('📖') ? '📖' : bubble.text.includes('👀') ? '👀' : isMe ? '📖' : '👀';
    const labelText = bubble.stickerLabel || 'Sticker';

    return (
      <motion.div
        className={cn('flex w-full', isMe ? 'justify-end' : 'justify-start')}
        initial={{ opacity: 0, y: 18, scale: 0.8, x: isMe ? 20 : -20 }}
        whileInView={{ opacity: 1, y: 0, scale: 1, x: 0 }}
        viewport={{ once: true, amount: 0.7 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20,
          delay: index * 0.08,
        }}
      >
        <motion.div
          whileHover={{ scale: 1.08, rotate: isMe ? 3 : -3 }}
          className={cn(
            'flex items-center gap-2.5 rounded-2xl px-4 py-2 backdrop-blur-md shadow-lg border',
            isMe
              ? 'bg-gradient-to-br from-lavender-500/30 via-purple-600/25 to-lavender-700/30 border-lavender-300/40 text-lavender-100'
              : 'bg-gradient-to-br from-blush-500/30 via-pink-600/25 to-blush-700/30 border-blush-300/40 text-blush-100',
          )}
        >
          <span aria-hidden="true" className="text-2xl sm:text-3xl filter drop-shadow-md select-none">
            {emoji}
          </span>
          <span className="font-script text-base sm:text-lg tracking-wide opacity-95">
            {labelText}
          </span>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={cn('flex w-full', isMe ? 'justify-end' : 'justify-start')}
      initial={{ opacity: 0, y: 18, scale: 0.92, x: isMe ? 16 : -16 }}
      whileInView={{ opacity: 1, y: 0, scale: 1, x: 0 }}
      viewport={{ once: true, amount: 0.7 }}
      transition={{
        type: 'spring',
        stiffness: 280,
        damping: 24,
        delay: index * 0.09,
      }}
    >
      <div className={cn('flex max-w-[82%] flex-col gap-1', isMe ? 'items-end' : 'items-start')}>
        <div
          className={cn(
            'rounded-2xl px-4 py-2.5 font-body text-[14px] leading-relaxed shadow-sm sm:text-[15px]',
            isMe
              ? 'rounded-br-md bg-gradient-to-br from-lavender-400/85 to-lavender-500/80 text-white'
              : 'rounded-bl-md border border-white/12 bg-white/[0.08] text-blush-50/95 backdrop-blur-sm',
          )}
        >
          {bubble.text}
        </div>
        {bubble.time && (
          <span className="px-1.5 font-body text-[10px] tabular-nums tracking-wide text-lavender-200/45">
            {bubble.time}
          </span>
        )}
      </div>
    </motion.div>
  );
}
