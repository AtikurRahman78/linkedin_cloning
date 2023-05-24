/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'nunito': ['Nunito', 'sans-serif',],
        'barlow': ['Barlow', 'sans-serif',],
      },
      colors: {
        'primary': '#0077B5',
        'secondary': '#11175D',
        'tertiary': '#B8B9CE',
        'fontColor': '#181818',
        'footer': '#0275B1',
        'border': '#E7E7E7',
      },
      maxWidth: {
        'container': '90%',
      }
    },
  },
  plugins: [],
}
