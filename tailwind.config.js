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
    { pattern: /(text|bg|border)-(gray)-(50|100|200|300|500|700|900)/ },
    { pattern: /(hover:)?(text|bg|border)-(blue)-(600)/ },
    { pattern: /prose/ },
    { pattern: /(rounded|shadow|shadow-(sm|md|lg|xl))/ },
    { pattern: /(grid-cols|col-span|row-span)-\d+/ },
  ],
  theme: {
    extend: {
      colors: {
        // Lock palette to grayscale + blue only
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          500: '#6B7280',
          700: '#374151',
          900: '#111827',
        },
        blue: {
          600: '#2563EB',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#374151',
            lineHeight: '2',
            'h1, h2, h3, h4, h5, h6': {
              color: '#111827',
              fontWeight: '600',
            },
            a: {
              color: '#2563EB',
              '&:hover': {
                color: '#1D4ED8',
              },
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

