/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inria: ['"Inria Sans"', 'sans-serif'],
      },
      keyframes: {
        colorFade: {
          '0%, 100%': { backgroundColor: '#f59e0b' },  // yellow
          '25%': { backgroundColor: '#ec4899' },       // pink
          '50%': { backgroundColor: '#d8b4fe' },       // light purple
          '75%': { backgroundColor: '#9ca3af' },       // greyish
          '80%': { backgroundColor: 'grey' },
        },
      },
      animation: {
        colorCycle: 'colorFade 25s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
