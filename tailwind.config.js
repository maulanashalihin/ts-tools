/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ 
    "./resources/**/*.{js,ts,svelte,edge}",
  ],
  theme: {
    extend: {
      opacity: {
      '02': '0.02',
      }
    },
  },
  plugins: [],
}
