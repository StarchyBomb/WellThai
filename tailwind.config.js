/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: '#4CAF8C',
        'accent-light': '#e8f5ee',
        appbg: '#eef4f0',
      },
      fontFamily: { sarabun: ['Sarabun', 'sans-serif'] },
      borderRadius: { card: '16px' },
    },
  },
  plugins: [],
}
