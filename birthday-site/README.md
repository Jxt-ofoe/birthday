# Happy Birthday, Chelsey ❤️

A cinematic, interactive digital love letter — an eight-chapter scroll-through
story that ends with a birthday surprise.

Built with **Next.js 15** (App Router), **TypeScript**, **Tailwind CSS** and
**Framer Motion**. Mobile-first, accessible, and optimised for Vercel.

---

## ⚡ Quick start

```bash
npm install
npm run dev        # → http://localhost:3000
```

---

## 🔒 Read-only by design

The site is **completely non-editable from the screen**. Content can only ever
be changed by editing the code and redeploying.

Verified in a real browser — the rendered page contains:

| | |
|---|---|
| `contentEditable` elements | **0** |
| `<input>` / `<textarea>` / `<form>` | **0** |
| File-upload fields | **0** |
| API routes / server actions | **none** |
| `localStorage` / `sessionStorage` / cookies written | **0** |

All text is baked into the static build at compile time from `content/site.ts`.
There is no admin panel, no click-to-edit, and nothing that persists a change
in the browser. If she taps, long-presses or tries to select and type over
anything, **nothing changes** — and a refresh always restores the original.

No setup instructions or file paths are ever shown on screen either. Empty
photo slots render as soft romantic placeholders, so an unfinished section
still looks intentional to her.

---

## ✏️ Personalising it — everything lives in ONE file

Open **`content/site.ts`**. That's it. Every name, date, story line, photo,
song and message is in there, clearly labelled with comments.

### 1. Her name & the countdown

```ts
export const person = {
  name: 'Chelsey',
  fullName: 'Chelsey Twumwaa',
  from: 'Ernest',
  birthday: '2026-08-14T00:00:00',   // ⚠️ set her real birthday
};
```

> **Important:** update `birthday` to her actual date or the countdown
> will be wrong. Format is `YYYY-MM-DDTHH:mm:ss` in your local time.

### 2. Photos

Drop images into `public/photos/`, then point to them:

```ts
photos: [
  { src: '/photos/first-meeting.jpg', alt: 'The day we met', caption: 'Where it all started' },
]
```

Any slot left as `src: null` shows an elegant placeholder instead of breaking —
so the site always looks finished. The Artist Night gallery (Chapter 4) takes
as many photos as you want; the grid adapts and every photo opens in a
full-screen lightbox with swipe navigation.

### 3. Background music

Put a soft romantic track at **`public/music/romantic.mp3`**.

If that file doesn't exist, the site automatically plays a gentle **generated
ambient piano pad** built with the Web Audio API — so it's never silent. The
mute/unmute button floats in the bottom-right corner.

> Browsers block autoplay until the user interacts. Music starts when she taps
> **"Begin Our Journey"** (or the mute button).

### 4. Songs (Chapter 8)

Paste in the IDs — the embeds load only when tapped, keeping the page fast.

```ts
tracks: [
  { title: 'Our song', note: '…', provider: 'spotify', id: '1BxfuPKGuaTgP7aM0Bbdwr' },
  { title: 'For the 2 AM nights', note: '…', provider: 'youtube', id: 'dQw4w9WgXcQ' },
]
```

- **Spotify** — Share → Copy Song Link →
  `open.spotify.com/track/`**`1BxfuPKGuaTgP7aM0Bbdwr`**
- **YouTube** — `youtube.com/watch?v=`**`dQw4w9WgXcQ`**

### 5. Your birthday video

Drop it at **`public/video/birthday-message.mp4`**. It plays in the modal
behind the *"Play My Birthday Message"* button at the very end.

### 6. The love letter & reason cards

`loveLetter.body` is an array of lines typed out one at a time — a blank
string `''` creates a paragraph break. `chapter6.reasons` is a plain array,
so add, remove or reword cards freely.

---

## 🚀 Deploying to Vercel

**Easiest way**

1. Push this folder to a GitHub repo.
2. Go to [vercel.com/new](https://vercel.com/new) and import it.
3. Framework preset auto-detects as **Next.js** — just click **Deploy**.

No environment variables, no database, nothing else to configure.

**Or from the terminal**

```bash
npm i -g vercel
vercel        # preview
vercel --prod # production
```

**Tip:** in Vercel → Settings → Domains you can set a sweet URL like
`chelsey.vercel.app`.

---

## 📁 Project structure

```
content/site.ts            ← 💖 EDIT THIS (all copy, photos, songs, dates)

app/
  layout.tsx               fonts, metadata, skip-link
  page.tsx                 composes every chapter in order
  globals.css              theme tokens, glassmorphism, reduced-motion

components/
  sections/                one file per chapter
    LoadingScreen.tsx      romantic loader with progress
    Hero.tsx               night sky + title + countdown + CTA
    Countdown.tsx          live flip-digit countdown
    Chapter1.tsx  …  Chapter6.tsx
    LoveLetter.tsx         typewriter letter on aged paper
    MusicChapter.tsx       lazy Spotify / YouTube embeds
    FinalSurprise.tsx      gift box → confetti + fireworks + reveal
  ui/                      reusable pieces
    GlassCard, GlowButton, ChapterHeading, PhotoFrame,
    StoryText, Reveal, Section, Lightbox, GiftBox,
    VideoModal, ScrollProgress, ChapterNav
  effects/                 StarField, FloatingHearts, Particles,
                           CursorSparkle, Fireworks
  audio/MusicPlayer.tsx    mute/unmute + ambient fallback

lib/
  motion.ts                shared easing + animation variants
  hooks.ts                 countdown, media query, scroll lock, …
  ambientAudio.ts          the generated piano pad
  utils.ts                 cn(), seeded RNG, smooth scroll
```

---

## ✨ What's included

| | |
|---|---|
| 🌌 | Animated night sky — twinkling stars + shooting stars |
| 💗 | Floating hearts and drifting golden particles |
| ✨ | Cursor sparkle trail (desktop only, auto-disabled on touch) |
| 🎬 | Cinematic scroll reveals on every section |
| 🪟 | Glassmorphism throughout |
| 💬 | Chat bubbles that pop in one by one (Chapter 3) |
| 🖼️ | Photo gallery with full-screen lightbox + swipe |
| ✍️ | Handwritten letter with typewriter animation |
| 🎵 | Background music with mute/unmute + generated fallback |
| 🎁 | Gift box → confetti, fireworks, hearts, glow, reveal |
| ⏳ | Live countdown to her birthday |
| 📱 | Mobile-first, safe-area aware, fully responsive |

---

## ♿ Accessibility & performance

- Full `prefers-reduced-motion` support — animations collapse, the letter
  shows instantly, particle canvases don't mount at all.
- Semantic landmarks, `aria-label`s, a skip link, visible focus rings, and
  keyboard support everywhere (Esc closes modals, ←/→ navigate the lightbox).
- Canvas loops pause when scrolled off-screen or when the tab is hidden.
- Embeds and the video are lazy-mounted; fonts self-host via `next/font`.
- Static-rendered — **~189 kB First Load JS**.

---

Made with love. 💛
