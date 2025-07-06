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
        primary: '#CFA75F',      // Gold
        secondary: '#111111',    // Black
        accent: '#CFA75F',      // Gold (same as primary for consistency)
        surface: '#FAFAFA',     // White
        background: '#FAFAFA',  // White
        success: '#10B981',     // Keep existing green
        warning: '#F59E0B',     // Keep existing orange
        error: '#D62828',       // Red
        info: '#3B82F6',        // Keep existing blue
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