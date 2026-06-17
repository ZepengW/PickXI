/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          950: 'var(--color-ink-950)',
          900: 'var(--color-ink-900)',
          800: 'var(--color-ink-800)',
          700: 'var(--color-ink-700)',
          600: 'var(--color-ink-600)',
          500: 'var(--color-ink-500)',
          400: 'var(--color-ink-400)',
          300: 'var(--color-ink-300)',
          200: 'var(--color-ink-200)',
          100: 'var(--color-ink-100)',
        },
        pitch: {
          50: '#effaf2',
          100: '#d8f3e0',
          400: '#34d36a',
          500: '#16a34a',
          600: '#128a3e',
          700: '#0f6e33',
          900: '#0a3d1c',
        },
        accent: {
          DEFAULT: '#f5c542',
          dark: '#d9a521',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        display: ['"Archivo"', '"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
    },
  },
  plugins: [],
}
