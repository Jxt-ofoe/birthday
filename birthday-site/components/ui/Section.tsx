'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  id: string;
  children: ReactNode;
  className?: string;
  /** Vertical rhythm. 'lg' is the default chapter spacing. */
  spacing?: 'md' | 'lg' | 'xl';
  /** Renders a soft coloured glow behind the section. */
  glow?: 'blush' | 'lavender' | 'gold' | 'none';
  label?: string;
};

const SPACING = {
  md: 'py-14 sm:py-24',
  lg: 'py-16 sm:py-32 lg:py-40',
  xl: 'py-20 sm:py-44 lg:py-52',
};

const GLOWS = {
  blush:
    'before:bg-[radial-gradient(ellipse_60%_50%_at_50%_35%,rgba(249,106,155,0.15),transparent_70%)]',
  lavender:
    'before:bg-[radial-gradient(ellipse_60%_50%_at_50%_35%,rgba(139,106,224,0.19),transparent_70%)]',
  gold: 'before:bg-[radial-gradient(ellipse_60%_50%_at_50%_35%,rgba(201,151,58,0.14),transparent_70%)]',
  none: '',
};

export function Section({
  id,
  children,
  className,
  spacing = 'lg',
  glow = 'none',
  label,
}: Props) {
  return (
    <section
      id={id}
      aria-label={label}
      className={cn(
        'relative w-full scroll-mt-16',
        SPACING[spacing],
        glow !== 'none' &&
          cn(
            'before:pointer-events-none before:absolute before:inset-0 before:-z-10',
            GLOWS[glow],
          ),
        className,
      )}
    >
      <div className="mx-auto w-full max-w-5xl px-4 xs:px-6 sm:px-8">{children}</div>
    </section>
  );
}

/** Thin decorative divider between chapters. */
export function ChapterDivider() {
  return (
    <div aria-hidden="true" className="mx-auto flex max-w-xs items-center gap-4 px-6 py-2">
      <span className="hairline" />
    </div>
  );
}
