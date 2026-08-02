import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './content/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      /* Finer-grained alpha steps for the glassmorphism layers. */
      opacity: {
        12: '0.12',
        15: '0.15',
        18: '0.18',
        35: '0.35',
        45: '0.45',
        55: '0.55',
        65: '0.65',
        85: '0.85',
        92: '0.92',
      },
      transitionDuration: {
        400: '400ms',
      },
      colors: {
        blush: {
          50: '#fff5f8',
          100: '#ffe9f0',
          200: '#ffd3e2',
          300: '#ffb6ce',
          400: '#ff8fb4',
          500: '#f96a9b',
        },
        gold: {
          100: '#fdf3d8',
          200: '#f7e3ab',
          300: '#efd07a',
          400: '#e3b855',
          500: '#c9973a',
        },
        lavender: {
          100: '#f2ecff',
          200: '#e2d6ff',
          300: '#c9b4ff',
          400: '#ab8ef5',
          500: '#8b6ae0',
        },
        plum: {
          500: '#4b2a6b',
          600: '#3a1f55',
          700: '#2a1540',
          800: '#1b0d2b',
          900: '#0f0718',
          950: '#080310',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        script: ['var(--font-script)', 'cursive'],
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(255, 182, 206, 0.45)',
        'glow-gold': '0 0 50px -10px rgba(239, 208, 122, 0.5)',
        glass: '0 8px 32px 0 rgba(15, 7, 24, 0.37)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: '0.15', transform: 'scale(0.85)' },
          '50%': { opacity: '1', transform: 'scale(1.15)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        'rise-heart': {
          '0%': { transform: 'translateY(0) scale(0.6)', opacity: '0' },
          '10%': { opacity: '0.9' },
          '100%': { transform: 'translateY(-110vh) scale(1.1)', opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 30px -6px rgba(255,182,206,0.45)' },
          '50%': { boxShadow: '0 0 60px 4px rgba(239,208,122,0.55)' },
        },
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
      },
      animation: {
        twinkle: 'twinkle 4s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        'rise-heart': 'rise-heart 14s linear infinite',
        shimmer: 'shimmer 3.5s linear infinite',
        'pulse-glow': 'pulse-glow 3.2s ease-in-out infinite',
        blink: 'blink 1.1s step-end infinite',
      },
    },
  },
  plugins: [],
};

export default config;
