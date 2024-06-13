/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      padding: {
        'edit-btn': '8px 50px 8px 50px'
      },
      width: {
        '283': '283px',
      },
      height: {
        '614': '614px',
      },
      boxShadow: {
        'star-wars-card': '0px 0px 250px 0px #E3D61D66',
        'edit-btn': '0 0 30px 0 #E3D61D4D'
      },
      colors: {
        'edit-bg': '#E3D61D',
      },
      textColor: {
        'black-imp': '#000000!important'
      }
    }
  },
  plugins: [],
}
