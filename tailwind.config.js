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
        'edit-btn': '0 0 30px 0 #E3D61D4D',
        'cancel-btn': '0 0 15px 0 #f10e10',
        'text': '2px 2px 2px black'
      },
      // Extend colors utility with a custom background color for edit button.
      colors: {
        'edit-bg': '#E3D61D',
        'cancel-bg': '#de1b1c',
      },
      // Extend textColor utility with an important black color variant.
      textColor: {
        'black-imp': '#000000!important'
      },
    }
  },
  plugins: [
    // Plugin to add a custom text shadow utility class
    function ({ addUtilities }) {
      const newUtilities = {
        '.text-shadow-custom': {
          textShadow: '2px 2px 2px black', // Custom text shadow for specific use cases
        },
      };

      // Dynamically add the new utilities to Tailwind CSS
      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
}
