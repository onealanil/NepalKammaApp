/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/screens/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',

  ],
  theme: {
    extend: {
      colors: {
        color1: '#618264',
        color2: '#79AC78',
        color3: '#B0D9B1',
        color4: '#D0E7D2',
      },
    },
  },
  plugins: [],
};
