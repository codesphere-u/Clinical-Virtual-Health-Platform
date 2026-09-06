/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/design-system/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        docaas: {
          teal: {
            DEFAULT: '#0D746F',
            50: '#F0FDFA',
            100: '#CCFBF1',
            500: '#14B8A6',
            600: '#0D9488',
            700: '#0D746F',
            800: '#115E59',
            900: '#134E4A',
          },
          slate: {
            50: '#F8FAFC',
            100: '#F1F5F9',
            200: '#E2E8F0',
            300: '#CBD5E1',
            700: '#334155',
            800: '#1E293B',
            900: '#0F172A',
          },
        },
      },
    },
  },
  plugins: [],
};
