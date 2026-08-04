/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        blueprint: {
          50: '#eef4f9',
          100: '#d6e4ef',
          200: '#adc9df',
          300: '#7fa9cb',
          400: '#4d84b0',
          500: '#2f6795',
          600: '#1f4e77',
          700: '#183c5c',
          800: '#122c44',
          900: '#0b1c2c',
          950: '#071220'
        },
        amber: {
          400: '#f2b134',
          500: '#e8a020'
        },
        graphite: {
          50: '#f6f7f8',
          100: '#eceeef',
          800: '#20262c',
          900: '#161b1f'
        }
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      }
    }
  },
  plugins: []
}
