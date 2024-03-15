/** @type {import('tailwindcss').Config} */
module.exports = {
  content: {
    relative: true,
    files: ['./src/**/*.{html,js}'],
  },
  theme: {
    extend: {
      colors: {
        brand: '#df3a8e',
        primary: '#fff4f9',
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
        button: '8px 8px 8px 0px rgba(0, 0, 0, 0.8)',
        magazine: '7px 7px 10px 0px rgba(0, 0, 0, 0.5)',
      },
      aspectRatio: {
        '16/10': '16 / 10',
      },
      keyframes: {
        slideIn: {
          from: { left: '100%' },
          to: { left: '0%' },
        },
        slideOut: {
          from: { left: '0%' },
          to: { left: '100%' },
        },
        spinOnce: {
          to: { transform: 'rotate(360deg)' },
        },
        imageFloater: {
          '0%': { transform: 'translate(-200%, 110vh) rotate(45deg)' },
          '12.5%': { transform: 'translate(120vw, -120%) scale(1.2)' },
          '25%': { transform: 'translate(-200%, 50vh) rotate(-90deg)' },
          '37.5%': { transform: 'translate(-200%, -120%)' },
          '50%': { transform: 'translate(100vw, 50vh) scale(.5)' },
          '62.5%': { transform: 'translate(20vw, 100vh)' },
          '75%': { transform: 'translate(-200%, 100vh) rotate(180deg)' },
          '87.5%': { transform: 'translate(50vw, -200%)' },
          '100%': { transform: 'translate(-200%, 110vh) rotate(-360deg)' },
        },
        movingArm: {
          '0%': { transform: 'translatex(-100%) rotate(3deg)' },
          '20%': { transform: 'translatex(-10%)' },
          '40%': { transform: 'rotate(5deg)' },
          '60%': { transform: 'rotate(-2deg) translatex(-15%)' },
          '80%': { transform: 'rotate(5deg)' },
          '100%': { transform: 'translatex(-100%)' },
        },
      },
      animation: {
        'slide-in': 'slideIn 0.5s ease-out 1',
        'slide-out': 'slideOut 0.5s ease-out 1',
        'spin-once': 'spinOnce 150ms ease-in-out 1',
        'image-floater': 'imageFloater 75s linear infinite',
        'moving-arm': 'movingArm 10s linear infinite',
      },
    },
  },
  plugins: [],
};
