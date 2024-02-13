/** @type {import('tailwindcss').Config} */
module.exports = {
  content: {
    relative: true,
    files: ['./src/index.html'],
  },
  theme: {
    extend: {
      colors: {
        brand: '#df3a8e',
        primary: '#ffe4f6',
      },
      cursor: {
        pickle: "url('/img/cursor.png'), auto",
      },
      backgroundImage: {
        'insta-gradient':
          'radial-gradient(61.46% 59.09% at 36.25% 96.55%, #ffd600 0%, #ff6930 48.44%, #fe3b36 73.44%, rgba(254, 59, 54, 0) 100% ), radial-gradient( 202.83% 136.37% at 84.5% 113.5%, #ff1b90 24.39%, #f80261 43.67%, #ed00c0 68.85%, #c500e9 77.68%, #7017ff 89.32%)',
      },
      screens: {
        tablet: '768px',
        desktop: '1280px',
      },
      boxShadow: {
        button: '4px 4px 2px 0px #000',
      },
      aspectRatio: {
        '16/10': '16 / 10',
      },
    },
  },
  plugins: [],
  purge: {
    content: ['./src/**/*.html'],
    safelist: ['scrolled', 'active'],
  },
};
