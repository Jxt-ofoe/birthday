'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

import { LoadingScreen } from '@/components/sections/LoadingScreen';
import { Hero } from '@/components/sections/Hero';
import { Chapter1 } from '@/components/sections/Chapter1';
import { Chapter2 } from '@/components/sections/Chapter2';
import { Chapter3 } from '@/components/sections/Chapter3';
import { Chapter4 } from '@/components/sections/Chapter4';
import { Chapter5 } from '@/components/sections/Chapter5';
import { Chapter6 } from '@/components/sections/Chapter6';
import { LoveLetter } from '@/components/sections/LoveLetter';
import { MusicChapter } from '@/components/sections/MusicChapter';
import { FinalSurprise } from '@/components/sections/FinalSurprise';

import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { ChapterDivider } from '@/components/ui/Section';
import { ChapterNav } from '@/components/ui/ChapterNav';
import { MusicPlayer } from '@/components/audio/MusicPlayer';

/* Client-only extras — excluded from SSR so they never block first paint. */
const CursorSparkle = dynamic(
  () => import('@/components/effects/CursorSparkle').then((m) => m.CursorSparkle),
  { ssr: false },
);

export default function Page() {
  const [ready, setReady] = useState(false);

  return (
    <>
      <LoadingScreen onDone={() => setReady(true)} />

      <ScrollProgress />
      <ChapterNav />
      <CursorSparkle />
      <MusicPlayer />

      <main className="relative">
        <Hero ready={ready} />

        <div className="content-visibility-auto">
          <Chapter1 />
          <ChapterDivider />
          <Chapter2 />
          <ChapterDivider />
          <Chapter3 />
          <ChapterDivider />
          <Chapter4 />
          <ChapterDivider />
          <Chapter5 />
          <ChapterDivider />
          <Chapter6 />
          <ChapterDivider />
          <LoveLetter />
          <ChapterDivider />
          <MusicChapter />
        </div>

        <FinalSurprise />

        <footer className="relative pb-10 pt-4 text-center pb-safe">
          <p className="font-script text-base text-blush-200/40">
            ❦ the end, but really just the beginning ❦
          </p>
        </footer>
      </main>
    </>
  );
}
