/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#050914",
        midnight: "#080e1d",
        panel: "#0d1527",
        electric: "#20d9ff",
        signal: "#65efff",
        muted: "#8b97ae",
      },
      fontFamily: {
        sans: ["Arial", "Helvetica", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 32px rgba(32, 217, 255, 0.28)",
      },
      backgroundImage: {
        "grid-fade": "linear-gradient(rgba(101,239,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(101,239,255,.06) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
