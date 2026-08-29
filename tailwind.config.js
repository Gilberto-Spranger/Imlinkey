/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        imlinkey: "#0A1733",
        primary: "#0A1733",
      },
      animation: {
        draw: "draw 8s ease forwards",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        draw: {
          from: { strokeDashoffset: 4500 },
          to: { strokeDashoffset: 0 },
        },
      },
    },
  },
  plugins: [],
};