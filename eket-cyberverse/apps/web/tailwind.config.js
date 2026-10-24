/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#080D18',
          bg2: '#0D1424',
          panel: '#111C30',
          elevated: '#17243A',
          border: '#25344D',
          blue: '#2F80FF',
          cyan: '#29D3FF',
          text: '#F4F7FC',
          muted: '#A8B6CC',
          critical: '#FF4D5A',
          warning: '#FFB84D',
          success: '#2ECC91',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
};
