/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        iconsM: "rgba(255, 255, 255, 0.5)",
        iconsTM: "rgb(238, 238, 238)",
        textLink: "#213547",
        default: "#5A626F",
      },
    },
  },
  plugins: [],
};
