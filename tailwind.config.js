/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      width: {
        '1/100': '1%'
      }
    },
    container: {
      center: true,
    },
  },
  plugins: [require('@tailwindcss/forms'), require("daisyui")],
  daisyui: {
    themes: ["winter"],
  },
}

