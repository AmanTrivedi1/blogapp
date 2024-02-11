import { createThemes } from 'tw-colors';

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      Poppins: "Poppins",
      Inter: "Inter", // Ensure fonts with spaces have " " surrounding it.
    },


    fontSize: {
      sm: "12px",
      base: "14px",
      xl: "16px",
      "2xl": "20px",
      "3xl": "28px",
      "4xl": "38px",
      "5xl": "50px",
    },

    extend: {
      fontFamily: {
        inter: ["'Inter'", "sans-serif"],
        gelasio: ["'Gelasio'", "serif"],
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide'),
  createThemes({
     light:{
        white: "#FFFFFF",
        black: "#242424",
        grey: "#F3F3F3",
        "dark-grey": "#6B6B6B",
        red: "#FF4E4E",
        transparent: "transparent",
        twitter: "#1DA1F2",
        purple: "#8B46FF",
     },
     dark:{
      white: "#0F0F0F",
      black: "#D0D0D0",
      grey: "#3a3a3a",
      "dark-grey": "#aeaeae",
      red: "#991F1F",
      transparent: "transparent",
      twitter: "#0E71A8",
      purple: "#582C8E",
      
     }
  })
],
};
