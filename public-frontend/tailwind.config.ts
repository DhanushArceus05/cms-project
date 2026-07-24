import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f5f6f8',
          100: '#e7e9ee',
          200: '#cbd0db',
          300: '#a3aabd',
          400: '#767f9a',
          500: '#5a6280',
          600: '#474e69',
          700: '#3a3f56',
          800: '#282b3c',
          900: '#181a26',
          950: '#0e0f17',
        },
        accent: {
          50: '#eef4ff',
          100: '#dbe6ff',
          200: '#bcd0ff',
          300: '#8fb0ff',
          400: '#5c87ff',
          500: '#3862f5',
          600: '#2745e0',
          700: '#2137b8',
          800: '#1f3193',
          900: '#1e2e74',
        },
        canvas: '#f7f8fb',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px 0 rgb(15 23 42 / 0.04), 0 1px 3px 0 rgb(15 23 42 / 0.06)',
        popover: '0 10px 15px -3px rgb(15 23 42 / 0.08), 0 4px 6px -4px rgb(15 23 42 / 0.08)',
      },
      borderRadius: {
        xl: '0.875rem',
      },
    },
  },
  plugins: [],
};

export default config;
