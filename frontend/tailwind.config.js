const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  important: "#__next",
  theme: {
    extend: {
      colors: {
        blackZ: "#121212",
        greyZ: "#bdbdbd",
        redZ: "#e53935",
        whiteZ: "#d8d8d8",
        blueZ: "#1976d2",
      },
    },
    screens: {
      mobile: "480px",
      tablet: "768px",
      laptop: "1024px",
      desktop: "1280px",
      ...defaultTheme.screens,
    },
  },
  plugins: [],
};
