/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#F5385D",
        transitionProperty: {
          height: "height",
          spacing: "margin, padding",
          fontFamily: {
            circular: [
              "Circular",
              "-apple-system",
              "BlinkMacSystemFont",
              "Roboto",
              '"Helvetica Neue"',
              "sans-serif",
            ],
          },
        },
      },
    },
  },
  plugins: [],
};
