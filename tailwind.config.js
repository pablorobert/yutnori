/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Gowun Batang"', 'Georgia', 'serif'],
        body: ['"Outfit"', 'system-ui', 'sans-serif'],
      },
      colors: {
        parchment: {
          50: '#fdfaf4',
          100: '#faf5e8',
          200: '#f3e8cc',
          300: '#e8d4a8',
        },
        ink: {
          DEFAULT: '#1a1410',
          light: '#3d3228',
        },
        dancheong: {
          red: '#c0392b',
          blue: '#1a3a5c',
          green: '#2d6a4f',
          gold: '#c77d0a',
        },
      },
    },
  },
  plugins: [],
}
