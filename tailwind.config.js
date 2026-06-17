/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#07080c',
          900: '#0c0e14',
          800: '#14171f',
          700: '#1d212b',
          600: '#2a2f3c',
          500: '#3a4050',
          400: '#5a6172',
          300: '#8b93a4',
          200: '#b8becc',
          100: '#e6e8ee',
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
