/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false,
  },
  prefix: 'tw-',
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
  ],
  theme: {
    screens: {
      'sm': '600px',
      'md': '960px',
      'lg': '1264px',
      'xl': '1904px',
      '2xl': '2544px',
    },
    extend: {},
  },
  plugins: [],
}
