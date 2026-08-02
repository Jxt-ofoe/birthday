'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { chapter4 as c } from '@/content/site';
import { Section } from '@/components/ui/Section';
import { ChapterHeading } from '@/components/ui/ChapterHeading';
import { StoryText } from '@/components/ui/StoryText';
import { PhotoFrame } from '@/components/ui/PhotoFrame';
import { Reveal } from '@/components/ui/Reveal';
import { Lightbox } from '@/components/ui/Lightbox';
import { EASE } from '@/lib/motion';
import { FloatingHearts } from '@/components/effects/FloatingHearts';

/** Chapter 4 — Pent Hall Week Artist Night, with a tappable photo gallery. */
export function Chapter4() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <Section id="chapter-4" glow="gold" label="Chapter Four: Pent Hall Week Artist Night">
      <FloatingHearts count={8} seed={44} intensity="subtle" />

      <ChapterHeading number={c.number} title={c.title} subtitle={c.subtitle} />

      <div className="mx-auto mt-16 max-w-2xl sm:mt-20">
        <StoryText paragraphs={c.paragraphs} stagger={0.24} />
      </div>

      {/* ---------- gallery ---------- */}
      <div className="mt-16 sm:mt-20">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
          {c.gallery.map((photo, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 38, scale: 0.94, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.85, ease: EASE, delay: (i % 3) * 0.1 }}
            >
              <PhotoFrame
                photo={photo}
                aspect="aspect-square"
                tilt={i % 3 === 0 ? -1.8 : i % 3 === 1 ? 0 : 1.8}
                sizes="(max-width: 640px) 44vw, (max-width: 1024px) 30vw, 300px"
                onClick={() => setLightbox(i)}
              />
            </motion.div>
          ))}
        </div>

        {/* Note: no setup instructions are ever shown on screen — empty photo
            slots simply render as soft placeholders. Edit content/site.ts. */}
      </div>

      <Lightbox
        photos={c.gallery}
        index={lightbox}
        onClose={() => setLightbox(null)}
        onNavigate={setLightbox}
      />
    </Section>
  );
}
