'use client';

import { motion } from 'framer-motion';
import { chapter5 as c } from '@/content/site';
import { Section } from '@/components/ui/Section';
import { ChapterHeading } from '@/components/ui/ChapterHeading';
import { StoryText } from '@/components/ui/StoryText';
import { PhotoFrame } from '@/components/ui/PhotoFrame';
import { Reveal } from '@/components/ui/Reveal';
import { EASE } from '@/lib/motion';

export function Chapter5() {
  return (
    <Section id="chapter-5" glow="blush" label="Chapter Five: My Favorite Day">
      <ChapterHeading number={c.number} title={c.title} subtitle={c.subtitle} />

      <div className="mx-auto mt-16 max-w-2xl sm:mt-20">
        <StoryText paragraphs={c.paragraphs} size="lg" stagger={0.26} />
      </div>

      {/* the finale line — bigger, script, glowing */}
      <motion.div
        className="mt-16 flex flex-col items-center gap-6 sm:mt-20"
        initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.15, ease: EASE }}
      >
        <span className="h-px w-20 bg-gradient-to-r from-transparent via-gold-300/60 to-transparent" />
        <motion.p
          className="text-center font-script text-3xl leading-snug text-gradient-gold sm:text-[2.6rem]"
          animate={{ opacity: [0.88, 1, 0.88] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ filter: 'drop-shadow(0 0 22px rgba(239,208,122,0.25))' }}
        >
          {c.finale}
        </motion.p>
        <span className="h-px w-20 bg-gradient-to-r from-transparent via-gold-300/60 to-transparent" />
      </motion.div>

      <div className="mt-16 flex justify-center sm:mt-20">
        {c.photos.map((photo, i) => (
          <Reveal key={i} className="w-full max-w-md">
            <PhotoFrame photo={photo} aspect="aspect-[3/2]" tilt={-1.4} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
