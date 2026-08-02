'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

/** A slim gradient progress bar pinned to the top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[80] h-[2.5px] origin-left bg-gradient-to-r from-blush-300 via-gold-200 to-lavender-300"
      style={{ scaleX }}
    />
  );
}
