'use client';

import { motion } from 'framer-motion';
import { chapter2 as c } from '@/content/site';
import { Section } from '@/components/ui/Section';
import { ChapterHeading } from '@/components/ui/ChapterHeading';
import { StoryText, SpokenQuote } from '@/components/ui/StoryText';
import { PhotoFrame } from '@/components/ui/PhotoFrame';
import { Reveal } from '@/components/ui/Reveal';
import { EASE } from '@/lib/motion';

export function Chapter2() {
  return (
    <Section id="chapter-2" glow="blush" label="Chapter Two: When I Told You How I Felt">
      <ChapterHeading number={c.number} title={c.title} subtitle={c.subtitle} />

      <div className="mx-auto mt-16 max-w-2xl sm:mt-20">
        <StoryText paragraphs={c.paragraphs} />

        <Reveal className="mt-10" delay={0.1}>
          <p className="text-center font-body text-[15px] font-light text-blush-100/70 sm:text-base">
            {c.quoteLead}
          </p>
        </Reveal>

        <div className="mt-6">
          <SpokenQuote line={c.quote} speaker="her" />
        </div>

        {/* "Waiting" — a slow, patient pulse of dots */}
        <Reveal className="mt-12 flex justify-center" delay={0.1}>
          <div className="flex items-center gap-2.5" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-blush-300/70"
                animate={{ opacity: [0.25, 1, 0.25], scale: [0.85, 1.25, 0.85] }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.35,
                }}
              />
            ))}
          </div>
        </Reveal>

        <div className="mt-12 sm:mt-14">
          <StoryText paragraphs={c.paragraphsAfter} size="lg" stagger={0.28} />
        </div>
      </div>

      <div className="mt-16 flex justify-center sm:mt-20">
        {c.photos.map((photo, i) => (
          <motion.div
            key={i}
            className="w-full max-w-sm"
            initial={{ opacity: 0, y: 42, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: EASE }}
          >
            <PhotoFrame photo={photo} aspect="aspect-[4/5]" tilt={1.6} />
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
