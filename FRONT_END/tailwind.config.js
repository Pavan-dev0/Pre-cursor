/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        accent: '#6C63FF',
        surface: '#0d0d14',
        surface2: '#13131f',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['Syne Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
