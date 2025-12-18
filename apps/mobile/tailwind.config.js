/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    '../../packages/ui/src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#DC2626',
        'hoang-dao': '#FEF3C7',
        'hoang-dao-dark': '#F59E0B',
        'hac-dao': '#FEE2E2',
        'hac-dao-dark': '#DC2626',
        'good-hour': '#D1FAE5',
        'good-hour-dark': '#10B981',
        'bad-hour': '#FEE2E2',
        'bad-hour-dark': '#EF4444',
      },
      maxWidth: {
        'calendar': '1280px',
        'detail': '1024px',
      },
    },
  },
  plugins: [],
};
