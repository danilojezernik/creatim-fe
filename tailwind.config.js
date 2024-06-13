/**
 * Configuration file for Tailwind CSS.
 * Defines custom styles and extends the default theme.
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      // Extend padding utility with a custom variant for edit button.
      padding: {
        'edit-btn': '8px 50px 8px 50px'
      },
      // Extend width utility with a custom width size of the card.
      width: {
        '283': '283px',
      },
      // Extend height utility with a custom height size of the card.
      height: {
        '614': '614px',
      },
      // Extend boxShadow utility with custom styles for star wars card and edit button.
      boxShadow: {
        'star-wars-card': '0px 0px 250px 0px #E3D61D66',
        'edit-btn': '0 0 30px 0 #E3D61D4D'
      },
      // Extend colors utility with a custom background color for edit button.
      colors: {
        'edit-bg': '#E3D61D',
      },
      // Extend textColor utility with an important black color variant.
      textColor: {
        'black-imp': '#000000!important'
      }
    }
  },
  plugins: [],
}
