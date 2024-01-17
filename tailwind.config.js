/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        brand: "#df3a8e",
        "bg-primary": "#ffe4f6",
      },
      backgroundImage: {
        "blue-tint": "url('/src/img/blue-tint-background.jpg')",
      },
    },
  },
  plugins: [],
};
