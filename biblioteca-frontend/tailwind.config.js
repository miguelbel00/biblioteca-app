/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        wood: {
          light: "#f5e6ca",
          medium: "#c19a6b",
          dark: "#5b3a29",
          accent: "#8b5e3c",
          text: "#3b2a1a",
        },
      },
    },
  },
  plugins: [],
};
