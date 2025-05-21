/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        logo: ["K2D"],
        text: ["Kadwa"]
      },
      colors: {
        colorback: '#F8FAE5',
      }
    },
  },
  plugins: [require("daisyui")],
  darkMode: ["selector", '[data-theme = "light"]'],
};
