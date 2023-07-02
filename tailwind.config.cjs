/*
 * This config partially overwrites and extends the default Tailwind config:
 * https://github.com/tailwindlabs/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  corePlugins: {
    // Disable unneeded components to reduce performance impact
    float: false,
    clear: false,
    skew: false,
    caretColor: false,
    sepia: false,
    // Don't want to bother with adding back styles:
    preflight: false,
  },
  darkMode: 'media',
  plugins: [require('@tailwindcss/forms')],
};
