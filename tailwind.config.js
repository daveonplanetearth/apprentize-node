/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        ink: '#16233B',
        'ink-soft': '#4B5768',
        paper: '#F5F3ED',
        'paper-deep': '#EBE8DF',
        card: '#FFFFFF',
        safety: '#FF5A1F',
        'safety-deep': '#D8480F',
        teal: '#1C6E63',
        'teal-soft': '#2E8B7E',
        line: '#D8D2BF',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateY(12px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.8)', opacity: '0.6' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'spectrum-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out forwards',
        'slide-in': 'slide-in 0.5s ease-out forwards',
        'pulse-ring': 'pulse-ring 2.5s ease-out infinite',
        float: 'float 4s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
        'spectrum-shift': 'spectrum-shift 4s linear infinite',
      },
    },
  },
  plugins: [],
};
