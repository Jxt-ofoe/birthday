'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { navigation } from '@/content/site';
import { scrollToId, cn } from '@/lib/utils';
import { EASE } from '@/lib/motion';

/**
 * A minimal dot navigation on the right edge (desktop only).
 * Highlights the section currently in view and lets her jump between
 * chapters. Hidden on mobile to keep the reading experience clean.
 */
export function ChapterNav() {
  const [active, setActive] = useState('hero');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const top = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (top?.target.id) setActive(top.target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5] },
    );

    navigation.forEach((n) => {
      const el = document.getElementById(n.id);
      if (el) observer.observe(el);
    });

    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          aria-label="Chapters"
          className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <ul className="flex flex-col items-end gap-3.5">
            {navigation.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => scrollToId(item.id)}
                    aria-label={`Go to ${item.label}`}
                    aria-current={isActive ? 'true' : undefined}
                    className="group flex items-center gap-3"
                  >
                    <span
                      className={cn(
                        'whitespace-nowrap font-body text-[10px] uppercase tracking-[0.2em] transition-all duration-300',
                        isActive
                          ? 'text-gold-200/90 opacity-100'
                          : 'text-blush-100/60 opacity-0 group-hover:opacity-100',
                      )}
                    >
                      {item.label}
                    </span>
                    <span
                      className={cn(
                        'block rounded-full transition-all duration-400',
                        isActive
                          ? 'h-2.5 w-2.5 bg-gradient-to-br from-gold-200 to-blush-300 shadow-[0_0_12px_rgba(239,208,122,0.7)]'
                          : 'h-1.5 w-1.5 bg-white/30 group-hover:bg-white/60',
                      )}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
