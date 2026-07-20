/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#F5E6D3',
          50: '#FBF5EC',
          100: '#F5E6D3',
          200: '#EBD5BA',
          300: '#E0C4A0',
        },
        chocolate: {
          DEFAULT: '#2B1B16',
          50: '#5A463E',
          100: '#4A3830',
          200: '#3A2A22',
          300: '#2B1B16',
          400: '#1E120E',
        },
        pistachio: {
          DEFAULT: '#A8B87A',
          light: '#C4D49A',
          dark: '#8A9A5C',
        },
        gold: {
          DEFAULT: '#C9A24D',
          light: '#DDB868',
          dark: '#A88534',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'luxury': '0.18em',
      },
    },
  },
  plugins: [],
}
