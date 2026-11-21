import type { Config } from 'tailwindcss';

// Note: Tailwind v4 uses CSS-based configuration (@theme in index.css).
// This file is kept for tooling/editor support and legacy plugin use.
const config: Config = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#0a0a0b',
          bg2: '#0f0f10',
          surface: '#141416',
          surface2: '#1c1c1f',
          surface3: '#242428',
          border: '#2a2a2e',
          'border-red': '#5a1e28',
          red: '#e02840',
          'red-hi': '#ff3d55',
          'red-dim': 'rgba(224,40,64,0.13)',
          'red-glow': 'rgba(224,40,64,0.28)',
          'red-deep': '#8b0e1a',
          ash: '#b0a8a8',
          ash2: '#6e6868',
          ash3: '#3a3535',
          green: '#2ea86a',
          amber: '#d4820a',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Orbitron', 'sans-serif'],
      },
      animation: {
        scan: 'scan 1.5s linear infinite',
        float: 'float 5s ease-in-out infinite',
        tick: 'tick 28s linear infinite',
        'glitch-main': 'gm 0.18s steps(3) forwards',
      },
    },
  },
  plugins: [],
};

export default config;
