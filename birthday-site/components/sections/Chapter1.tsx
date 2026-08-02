'use client';

import { motion } from 'framer-motion';
import { chapter1 as c } from '@/content/site';
import { Section } from '@/components/ui/Section';
import { ChapterHeading } from '@/components/ui/ChapterHeading';
import { StoryText, SpokenQuote } from '@/components/ui/StoryText';
import { PhotoFrame } from '@/components/ui/PhotoFrame';
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { fadeUp, EASE } from '@/lib/motion';
import { FloatingHearts } from '@/components/effects/FloatingHearts';

export function Chapter1() {
  return (
    <Section id="chapter-1" glow="lavender" label="Chapter One: The Day Everything Began">
      <FloatingHearts count={7} seed={1} intensity="subtle" />

      <ChapterHeading number={c.number} title={c.title} subtitle={c.subtitle} />

      <div className="mx-auto mt-16 max-w-2xl sm:mt-20">
        <StoryText paragraphs={c.paragraphs} />

        {/* The conversation that started it all */}
        <div className="mt-10 space-y-6 sm:mt-12 sm:space-y-7">
          <SpokenQuote line={c.exchange[0].line} speaker="me" />

          <RevealGroup className="space-y-6" stagger={0.2}>
            <RevealItem as="p" variants={fadeUp}>
              <span className="block text-center font-body text-[15px] font-light text-blush-100/70 sm:text-base">
                {c.beforeReaction}
              </span>
            </RevealItem>
          </RevealGroup>

          <SpokenQuote line={c.exchange[1].line} speaker="her" />

          <RevealGroup className="space-y-6" stagger={0.2}>
            <RevealItem as="p" variants={fadeUp}>
              <span className="block text-center font-body text-[15px] font-light text-blush-100/70 sm:text-base">
                {c.afterQuestion}
              </span>
            </RevealItem>
          </RevealGroup>

          <SpokenQuote line={c.exchange[2].line} speaker="me" />

          <RevealGroup className="space-y-6" stagger={0.2}>
            <RevealItem as="p" variants={fadeUp}>
              <span className="block text-center font-body text-[15px] font-light text-blush-100/70 sm:text-base">
                {c.reactionIntro}
              </span>
            </RevealItem>
          </RevealGroup>

          {/* Her unforgettable reaction — gets a playful spring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7, rotate: -4 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ type: 'spring', stiffness: 260, damping: 15, mass: 0.9 }}
            className="flex justify-center"
          >
            <span className="relative inline-block max-w-full text-balance text-center rounded-2xl border border-gold-300/35 bg-gradient-to-r from-blush-500/20 via-gold-400/15 to-lavender-500/20 px-5 py-3 font-script text-xl text-gradient-gold shadow-glow-gold backdrop-blur-xl sm:rounded-full sm:px-10 sm:text-3xl">
              “{c.exchange[3].line}”
            </span>
          </motion.div>
        </div>

        <Reveal delay={0.15} className="mt-14 sm:mt-16">
          <p className="text-center font-body text-[16px] font-light leading-[1.9] text-blush-50/90 text-pretty sm:text-lg">
            {c.closing}
          </p>
        </Reveal>
      </div>

      {/* Photos */}
      <div className="mt-16 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 sm:gap-7">
        {c.photos.map((photo, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 42, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: EASE, delay: i * 0.16 }}
          >
            <PhotoFrame photo={photo} tilt={i % 2 === 0 ? -2.2 : 2.2} />
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
