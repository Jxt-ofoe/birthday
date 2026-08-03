/* ============================================================================
 *  ❤️  EDIT EVERYTHING HERE  ❤️
 *  ---------------------------------------------------------------------------
 *  This is the ONLY file you need to touch to personalise the whole website.
 *  Names, dates, every line of the story, photos, music links, the love letter,
 *  the reason cards and the final message all live here.
 *
 *  PHOTOS / VIDEO / MUSIC:
 *    Drop your files into the `public/` folder and reference them with a path
 *    that starts with a slash, e.g. "/photos/first-date.jpg".
 *    Any slot left as `null` shows an elegant placeholder instead — so the site
 *    always looks finished, even before you add media.
 * ==========================================================================*/

export type Photo = {
  /** e.g. "/photos/us-01.jpg" or "/photos/us-01.mp4" — or null to show a styled placeholder */
  src: string | null;
  alt: string;
  caption?: string;
  /** Explicitly set to true if source is a video file (auto-detected for .mp4, .webm, .mov) */
  isVideo?: boolean;
};

export type ChatBubble = {
  from: 'me' | 'her';
  text: string;
  time?: string;
  isSticker?: boolean;
  stickerLabel?: string;
};

export type MusicTrack = {
  title: string;
  artist?: string;
  note: string;
  /** "spotify" | "youtube" | "local" */
  provider: 'spotify' | 'youtube' | 'local';
  /** Spotify track ID, YouTube video ID, or local file path */
  id: string | null;
  /** Local audio file path */
  src?: string | null;
};

/* -------------------------------------------------------------------------- */
/*  THE BASICS                                                                */
/* -------------------------------------------------------------------------- */

export const person = {
  /** Her name — shown in the countdown and final surprise */
  name: 'Chelsey',
  fullName: 'Chelsey Twumwaa',
  /** Your name — signs the love letter */
  from: 'Ernest',
  /** Her birthday. Format: YYYY-MM-DDTHH:mm:ss  (24h, local time)
   *  ⚠️ UPDATE THIS to her real birthday so the countdown is accurate. */
  birthday: '2026-08-14T00:00:00',
  /** Shown on the countdown when the day has arrived */
  bigDayLabel: 'Today is your day, my love.',
};

/* -------------------------------------------------------------------------- */
/*  AUDIO                                                                     */
/* -------------------------------------------------------------------------- */

export const audio = {
  /** Romantic background track */
  src: '/music/Love Theme from Romeo and Juliet - Joslin - Henri Mancini, Nino Rota.mp3',
  volume: 0.35,
};

/* -------------------------------------------------------------------------- */
/*  OPENING SCREEN                                                            */
/* -------------------------------------------------------------------------- */

export const hero = {
  eyebrow: 'A little something, made just for you',
  title: 'Happy Birthday, My Love',
  subtitle:
    'Before you celebrate another beautiful year of your life, I’d love to take you on a little journey through ours.',
  cta: 'Begin Our Journey',
  scrollHint: 'Scroll gently',
};

/* -------------------------------------------------------------------------- */
/*  LOADING SCREEN                                                            */
/* -------------------------------------------------------------------------- */

export const loader = {
  lines: [
    'Gathering the stars…',
    'Collecting our memories…',
    'Wrapping it all in love…',
  ],
  signature: 'For Chelsey, with all my heart',
};

/* -------------------------------------------------------------------------- */
/*  CHAPTER 1 — THE BEGINNING                                                 */
/* -------------------------------------------------------------------------- */

export const chapter1 = {
  number: 'Chapter One',
  title: 'The Day Everything Began',
  subtitle: 'The Beginning',
  /** Each string is its own fade-in paragraph. Add or remove freely. */
  paragraphs: [
    'I still remember the first time we met.',
    'One of the very first questions I asked you was,',
  ],
  /** Rendered as elegant highlighted quotes, in order */
  exchange: [
    { speaker: 'me' as const, line: 'Which church do you attend?' },
    { speaker: 'her' as const, line: 'Why?' },
    {
      speaker: 'me' as const,
      line: 'Because I wanted to know the church we’ll be attending together one day.',
    },
    { speaker: 'her' as const, line: 'Eeeiii! 😄' },
  ],
  beforeReaction: 'You looked at me and asked,',
  afterQuestion: 'I smiled and replied,',
  reactionIntro: 'Your reaction was unforgettable. You simply said,',
  closing:
    'I don’t know if you realized it then, but from that moment I already saw something special in you.',
  photos: [
    { src: '/photos/pic2.jpeg', alt: 'A photo of us' },
    { src: '/photos/WhatsApp Image 2026-08-02 at 9.56.42 AM.jpeg', alt: 'Another photo of us' },
  ] as Photo[],
};

/* -------------------------------------------------------------------------- */
/*  CHAPTER 2 — TAKING A CHANCE                                               */
/* -------------------------------------------------------------------------- */

export const chapter2 = {
  number: 'Chapter Two',
  title: 'When I Told You How I Felt',
  subtitle: 'Taking a Chance',
  paragraphs: [
    'When I first told you how I felt, you didn’t give me an answer immediately.',
    'Later, I messaged you again.',
  ],
  quote: 'I’ll think about it.',
  quoteLead: 'You simply said,',
  paragraphsAfter: [
    'Waiting wasn’t easy, but you were worth waiting for.',
    'Looking back now, I’m so thankful that you gave us a chance to build something beautiful together.',
  ],
  photos: [{ src: '/photos/WhatsApp Image 2026-08-02 at 10.03.49 AM.jpeg', alt: 'A photo of us' }] as Photo[],
};

/* -------------------------------------------------------------------------- */
/*  CHAPTER 3 — UNFORGETTABLE CONVERSATIONS                                  */
/* -------------------------------------------------------------------------- */

export const chapter3 = {
  number: 'Chapter Three',
  title: 'Unforgettable Conversations',
  subtitle: 'The Bestie Application',
  paragraphs: [
    'One of my favorite conversations that I’ll always smile looking back on.',
    'You mentioned hiring a "male bestie"… and I made it clear right away that I wasn’t applying for that job.',
  ],
  closing: [
    'Looking back now, I’m so glad I stood my ground.',
    'Because I didn’t just want to be one of the guys in your classes — I wanted to be the one holding your heart.',
  ],
  /** Animated chat bubbles */
  bubbles: [
    { from: 'her', text: 'They want to be my "best friend."' },
    { from: 'me', text: '📖 Glasses & Book', isSticker: true, stickerLabel: 'Reading...' },
    { from: 'her', text: "I'm hiring." },
    { from: 'her', text: 'You can bring your application.' },
    { from: 'her', text: "I'm hiring a male bestie." },
    { from: 'me', text: "I'll pass." },
    { from: 'her', text: "Don't be overconfident." },
    { from: 'me', text: "Trust me, I'm serious." },
    { from: 'her', text: 'About what?' },
    { from: 'her', text: "That you'll pass??" },
    { from: 'me', text: 'Yep.' },
    { from: 'her', text: 'As how? 😂' },
    { from: 'me', text: 'Be there erh.' },
    { from: 'her', text: "I'm the hiring." },
    { from: 'her', text: 'Not you.' },
    { from: 'her', text: 'I can change my mind. 😂' },
    { from: 'her', text: 'Anytime.' },
    { from: 'me', text: "🤷‍♂️ I know some guys that'll be interested." },
    { from: 'me', text: 'Not me tho.' },
    { from: 'her', text: 'Which guys?' },
    { from: 'me', text: 'In your classes.' },
    { from: 'her', text: '👀 "Oh, I see!"', isSticker: true, stickerLabel: 'Oh, I see...' },
  ] as ChatBubble[],
};

/* -------------------------------------------------------------------------- */
/*  CHAPTER 4 — PENT HALL WEEK ARTIST NIGHT                                   */
/* -------------------------------------------------------------------------- */

export const chapter4 = {
  number: 'Chapter Four',
  title: 'Pent Hall Week Artist Night',
  subtitle: 'One of My Favorite Memories',
  paragraphs: [
    'One memory I’ll always treasure is the night we spent together during Pent Hall Week Artist Night.',
    'Sharing that evening with you made it unforgettable.',
    'It wasn’t about where we were.',
    'It was about who I was with.',
    'Moments like that remind me how lucky I am to have you.',
  ],
  /** Add as many as you like — the grid adapts automatically */
  gallery: [
    { src: '/video/WhatsApp Video 2026-08-02 at 9.56.46 AM.mp4', alt: 'Special video memory' },
    { src: '/photos/pic2.jpeg', alt: 'Artist Night photo 1' },
    { src: '/photos/WhatsApp Image 2026-08-02 at 9.56.42 AM.jpeg', alt: 'Artist Night photo 2' },
    { src: '/photos/WhatsApp Image 2026-08-02 at 10.03.49 AM.jpeg', alt: 'Artist Night photo 3' },
    { src: null, alt: 'Artist Night photo 4' },
    { src: null, alt: 'Artist Night photo 5' },
  ] as Photo[],
};

/* -------------------------------------------------------------------------- */
/*  CHAPTER 5 — EVERY DAY WITH YOU                                            */
/* -------------------------------------------------------------------------- */

export const chapter5 = {
  number: 'Chapter Five',
  title: 'My Favorite Day',
  subtitle: 'Every Day With You',
  paragraphs: [
    'People sometimes ask what my favorite day with you has been.',
    'Honestly —',
    'Every day I spend with you becomes my favorite.',
    'Whether we’re laughing, talking, walking together, or simply sitting in silence, every moment with you becomes a memory I treasure.',
    'You make ordinary days feel extraordinary.',
  ],
  finale: 'I love you very much.',
  photos: [{ src: '/photos/pic2.jpeg', alt: 'An everyday photo of us' }] as Photo[],
};

/* -------------------------------------------------------------------------- */
/*  CHAPTER 6 — REASONS I LOVE YOU                                            */
/* -------------------------------------------------------------------------- */

export const chapter6 = {
  number: 'Chapter Six',
  title: 'Reasons I Love You',
  subtitle: 'And there are so many more',
  /** Fully editable — change the text, add cards, reorder them. */
  reasons: [
    { icon: '✨', title: 'Your beautiful smile', body: 'It changes the temperature of a whole room — and of my whole day.' },
    { icon: '🤍', title: 'Your kindness', body: 'You are gentle with people in a way that makes them feel safe.' },
    { icon: '💗', title: 'Your caring heart', body: 'You notice the small things, and you always show up.' },
    { icon: '😄', title: 'The way you make me laugh', body: 'Nobody makes me laugh the way you do. Nobody.' },
    { icon: '🌿', title: 'Your strength', body: 'You carry so much with grace, and you keep going. I admire you.' },
    { icon: '🕊️', title: 'The peace I feel around you', body: 'With you, everything gets quiet in the best possible way.' },
    { icon: '🌟', title: 'The way you make me a better person', body: 'You make me want to grow, to be softer, to be more.' },
    { icon: '❤️', title: 'Everything that makes you uniquely you', body: 'Every little detail. There is no one else like you.' },
  ],
};

/* -------------------------------------------------------------------------- */
/*  CHAPTER 7 — LOVE LETTER                                                   */
/* -------------------------------------------------------------------------- */

export const loveLetter = {
  number: 'Chapter Seven',
  title: 'A Letter For You',
  subtitle: 'Written slowly, meant deeply',
  greeting: 'My dearest Chelsey,',
  /** Typed out one line at a time. Blank strings ('') create a paragraph break. */
  body: [
    'There are things I find easier to write than to say out loud, so I’m writing them here.',
    '',
    'Thank you for your patience with me, for your softness, and for the way you make even the quietest evenings feel full.',
    '',
    'I love how easy it is to be myself around you. I don’t have to perform or pretend — I can just be, and that is the rarest gift anyone has ever given me.',
    '',
    'I hope this year brings you everything you’ve been quietly praying for. And I hope you always know that whatever happens, you have someone in your corner who is proud of you.',
    '',
    'Thank you for choosing me. I’d choose you again, every single time.',
  ],
  signOff: 'Forever yours,',
  signature: 'Ernest ❤️',
  replayLabel: 'Read it again',
  skipLabel: 'Show the whole letter',
};

/* -------------------------------------------------------------------------- */
/*  CHAPTER 8 — MUSIC                                                         */
/* -------------------------------------------------------------------------- */

export const musicChapter = {
  number: 'Chapter Eight',
  title: 'Songs That Remind Me Of You',
  subtitle: 'Our little soundtrack',
  /**
   * HOW TO GET THE IDs
   * ------------------
   * Spotify: open a song → Share → Copy Song Link.
   *   https://open.spotify.com/track/1BxfuPKGuaTgP7aM0Bbdwr?si=...
   *                                   ^^^^^^^^^^^^^^^^^^^^^^ ← that's the id
   *
   * YouTube: https://www.youtube.com/watch?v=dQw4w9WgXcQ
   *                                          ^^^^^^^^^^^ ← that's the id
   */
  tracks: [
    {
      title: 'Love Theme from Romeo & Juliet',
      artist: 'Joslin / Nino Rota & Henri Mancini',
      note: 'Our main background melody.',
      provider: 'local',
      id: null,
      src: '/music/Love Theme from Romeo and Juliet - Joslin - Henri Mancini, Nino Rota.mp3',
    },
    {
      title: 'Beauty and the Beast',
      artist: 'Ariana Grande & John Legend',
      note: 'Tale as old as time.',
      provider: 'local',
      id: null,
      src: '/music/Ariana Grande, John Legend - Beauty and the Beast (From Beauty and the Beast - Official Video).mp3',
    },
    {
      title: 'Until I Found You',
      artist: 'Stephen Sanchez',
      note: 'I would never fall in love until I found you.',
      provider: 'local',
      id: null,
      src: '/music/Stephen Sanchez - Until I Found You (Official Video).mp3',
    },
    {
      title: "Say You Won't Let Go",
      artist: 'James Arthur',
      note: 'The song that always brings you to mind.',
      provider: 'local',
      id: null,
      src: "/music/James Arthur - Say You Won't Let Go.mp3",
    },
    {
      title: 'Rest of My Life',
      artist: 'Keenan Te',
      note: 'Soft, slow, and for all our tomorrows.',
      provider: 'local',
      id: null,
      src: '/music/Keenan Te - Rest of My Life (Official Lyric Video).mp3',
    },
    {
      title: 'Dandelions',
      artist: 'Ruth B.',
      note: 'Wishing on dandelions for you.',
      provider: 'local',
      id: null,
      src: '/music/Ruth B. - Dandelions (Lyrics).mp3',
    },
  ] as MusicTrack[],
};

/* -------------------------------------------------------------------------- */
/*  FINAL SURPRISE                                                            */
/* -------------------------------------------------------------------------- */

export const surprise = {
  prompt: 'One last thing…',
  hint: 'Tap the gift',
  title: 'Happy Birthday, My Beautiful Girl ❤️',
  paragraphs: [
    'Thank you for coming into my life.',
    'Thank you for every laugh, every conversation, every memory, and every moment we’ve shared.',
    'I may not have the biggest gift today, but I hope this reminds you just how much you mean to me.',
    'I love you more than words can fully express, and I pray this new year of your life is filled with happiness, success, good health, peace, and endless smiles.',
    'Happy Birthday, my love.',
  ],
  signOff: 'Forever yours, Ernest ❤️',
  videoButton: 'Play My Birthday Message',
  videoSrc: '/video/WhatsApp Video 2026-08-02 at 9.56.46 AM.mp4',
  videoPoster: null as string | null,
  videoTitle: 'A message from me to you',
  /* Shown only if the video file is missing. Keep it warm — she might see it. */
  videoFallback: 'This message is coming soon, my love. ❤️',
};

/* -------------------------------------------------------------------------- */
/*  NAVIGATION (auto-built from the chapters above)                           */
/* -------------------------------------------------------------------------- */

export const navigation = [
  { id: 'hero', label: 'Start' },
  { id: 'chapter-1', label: 'The Beginning' },
  { id: 'chapter-2', label: 'Taking a Chance' },
  { id: 'chapter-3', label: 'Conversations' },
  { id: 'chapter-4', label: 'Artist Night' },
  { id: 'chapter-5', label: 'Every Day' },
  { id: 'chapter-6', label: 'Reasons' },
  { id: 'chapter-7', label: 'Letter' },
  { id: 'chapter-8', label: 'Music' },
  { id: 'surprise', label: 'Surprise' },
];

export const meta = {
  title: 'Happy Birthday, Chelsey ❤️',
  description:
    'A little journey through our story — written for Chelsey, with all my love. ❤️',
  themeColor: '#0f0718',
};
