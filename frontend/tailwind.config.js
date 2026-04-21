/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#0ea5e9',
          glow: 'rgba(14, 165, 233, 0.2)',
        },
        secondary: '#6366f1',
        accent: '#22d3ee',
        background: '#020617',
        surface: '#0f172a',
        'surface-brighter': '#1e293b',
        'text-muted': '#94a3b8',
        danger: '#ef4444',
        success: '#10b981',
        warning: '#f59e0b',
      },
    },
  },
  plugins: [],
}
