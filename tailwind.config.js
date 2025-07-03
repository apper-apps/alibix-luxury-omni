/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Plus Jakarta Sans', 'sans-serif'],
        'sans': ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#FF6B00',
        secondary: '#1A1A1A',
        accent: '#FFB366',
        surface: '#FFFFFF',
        background: '#F5F5F5',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0,0,0,0.1)',
        'card': '0 4px 12px rgba(0,0,0,0.08)',
      },
      animation: {
        'pulse-once': 'pulse 0.5s ease-in-out',
        'bounce-gentle': 'bounce 1s ease-in-out',
      },
    },
  },
  plugins: [],
}