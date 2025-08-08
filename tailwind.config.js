/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{md,mdx}',
    './lib/**/*.{js,ts}',
  ],
  safelist: [
    // dynamic utility families commonly produced by data-driven props
    { pattern: /(text|bg|border)-(slate|gray|neutral|blue|indigo|violet|emerald|red)-(100|200|300|400|500|600|700|800|900)/ },
    { pattern: /(hover:)?(text|bg|border)-(blue|indigo|violet)-(400|500|600|700)/ },
    { pattern: /prose/ },
    { pattern: /(rounded|shadow|shadow-(sm|md|lg|xl))/ },
    { pattern: /(grid-cols|col-span|row-span)-\d+/ },
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

