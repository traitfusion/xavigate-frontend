/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      // Custom colors for Xavigate
      colors: {
        'xavi-primary': '#3B82F6',
        'xavi-secondary': '#10B981',
        'xavi-accent': '#8B5CF6',
      },
    },
  },
  plugins: [],
};
