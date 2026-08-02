'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { person } from '@/content/site';
import { useCountdown } from '@/lib/hooks';
import { EASE } from '@/lib/motion';
import { cn } from '@/lib/utils';

/**
 * Live countdown to her birthday. Renders a neutral shell during SSR and
 * hydration, then animates each digit as it changes.
 */
export function Countdown({ className }: { className?: string }) {
  const time = useCountdown(person.birthday);

  const units = time
    ? [
        { label: 'Days', value: time.days },
        { label: 'Hours', value: time.hours },
        { label: 'Minutes', value: time.minutes },
        { label: 'Seconds', value: time.seconds },
      ]
    : [
        { label: 'Days', value: 0 },
        { label: 'Hours', value: 0 },
        { label: 'Minutes', value: 0 },
        { label: 'Seconds', value: 0 },
      ];

  if (time?.isPast) {
    return (
      <motion.div
        className={cn('flex flex-col items-center gap-3', className)}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <span className="font-body text-[10px] uppercase tracking-[0.34em] text-gold-300/80">
          The wait is over
        </span>
        <p className="font-script text-2xl text-gradient-gold sm:text-3xl">
          {person.bigDayLabel}
        </p>
      </motion.div>
    );
  }

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      <span className="font-body text-[10px] uppercase tracking-[0.34em] text-lavender-200/70">
        Counting down to your day
      </span>

      <div className="flex items-start gap-1.5 xs:gap-2 sm:gap-3.5">
        {units.map((u, i) => (
          <div key={u.label} className="flex items-start gap-1.5 xs:gap-2 sm:gap-3.5">
            <TimeUnit label={u.label} value={u.value} ready={Boolean(time)} />
            {i < units.length - 1 && (
              <span
                aria-hidden="true"
                className="mt-2.5 font-display text-base text-blush-300/35 xs:mt-3.5 xs:text-lg sm:mt-5 sm:text-xl"
              >
                :
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function TimeUnit({
  label,
  value,
  ready,
}: {
  label: string;
  value: number;
  ready: boolean;
}) {
  const display = String(value).padStart(2, '0');

  return (
    <div className="flex flex-col items-center">
      <div className="relative grid h-[46px] w-[46px] place-items-center overflow-hidden rounded-xl glass xs:h-[52px] xs:w-[52px] xs:rounded-2xl sm:h-[68px] sm:w-[68px]">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-2 top-0 h-px bg-gradient-to-r from-transparent via-gold-200/50 to-transparent sm:inset-x-3"
        />
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={display}
            initial={ready ? { y: '-70%', opacity: 0, filter: 'blur(4px)' } : false}
            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
            exit={{ y: '70%', opacity: 0, filter: 'blur(4px)' }}
            transition={{ duration: 0.42, ease: EASE }}
            className="font-display text-xl font-light tabular-nums text-blush-50 xs:text-2xl sm:text-3xl"
          >
            {display}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="mt-1.5 font-body text-[8px] uppercase tracking-[0.16em] text-lavender-200/60 xs:text-[9px] xs:tracking-[0.2em] sm:mt-2 sm:text-[10px]">
        {label}
      </span>
    </div>
  );
}
