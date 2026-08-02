import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter, Dancing_Script } from 'next/font/google';
import { meta } from '@/content/site';
import './globals.css';

/* ---------- typography ---------- */

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-display',
  display: 'swap',
});

const body = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-body',
  display: 'swap',
});

const script = Dancing_Script({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-script',
  display: 'swap',
});

/* ---------- metadata ---------- */

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  applicationName: 'A Birthday Letter',
  openGraph: {
    title: meta.title,
    description: meta.description,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: meta.title,
    description: meta.description,
  },
  robots: { index: false, follow: false },
  icons: {
    icon: [
      {
        url:
          'data:image/svg+xml,' +
          encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="0.9em" font-size="90">❤️</text></svg>',
          ),
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: meta.themeColor,
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${script.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen">
        <a
          href="#chapter-1"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-blush-200 focus:px-5 focus:py-2.5 focus:font-body focus:text-sm focus:text-plum-900"
        >
          Skip to the story
        </a>
        {children}
      </body>
    </html>
  );
}
