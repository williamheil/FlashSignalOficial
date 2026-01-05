/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        background: {
          primary: '#0A0E1A',
          secondary: '#141824',
          tertiary: '#1E2430',
          accent: 'rgba(20, 24, 36, 0.7)',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#8B92A8',
          muted: '#4A5568',
        },
        border: {
          primary: '#1E2430',
          accent: 'rgba(255, 255, 255, 0.1)',
        },
        trading: {
          green: '#00C853',
          red: '#FF1744',
          blue: '#2196F3',
          amber: '#FFC107',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};
