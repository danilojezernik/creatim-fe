/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'star-wars' : '0px 0px 250px 0px #E3D61D66'
      }
    },
    colors: {
      'edit-bg': '#E3D61D'
    }
  },
  plugins: [],
}
