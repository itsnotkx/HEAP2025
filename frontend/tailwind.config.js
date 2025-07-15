import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
    },
  },
  darkMode: 'class',
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: '#2EC4B6',
              foreground: '#2E2E2E', // Used for primary text on primary bg
            },
            secondary: {
              DEFAULT: '#FF6B6B',
              foreground: '#6B7280', 
            },
            accent: {
              DEFAULT: '#FF6B6B',
            },
            background: '#F9FAFB',
            card: '#FFFFFF',
            border: '#E5E7EB',
            highlight: '#D1FAF0',
            focus: '#06B6D4', // optional highlight for focusable components
          },
        },
      },
    }),
  ],
};

module.exports = config;
