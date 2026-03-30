/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta principal do SIBD
        ink: {
          950: '#0a0b0f',
          900: '#10121a',
          800: '#181c28',
          700: '#232840',
          600: '#2e3554',
        },
        electric: {
          400: '#4df0c0',
          500: '#22d4a0',
          600: '#10b880',
        },
        slate: {
          muted: '#8892a4',
          soft:  '#c4cdd8',
        }
      },
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        body:    ['"DM Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'fade-in':      'fadeIn 0.4s ease forwards',
        'slide-up':     'slideUp 0.5s ease forwards',
        'pulse-slow':   'pulse 3s ease-in-out infinite',
        'blink':        'blink 1.1s step-end infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        blink:   { '0%,100%': { opacity: 1 }, '50%': { opacity: 0 } },
      },
    },
  },
  plugins: [],
}
