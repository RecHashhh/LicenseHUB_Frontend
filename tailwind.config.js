/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#ecfeff",
          100: "#cffafe",
          500: "#0ea5a8",
          700: "#0f766e",
          900: "#134e4a"
        },
        accent: "#f97316"
      },
      fontFamily: {
        heading: ["'Space Grotesk'", "sans-serif"],
        body: ["'IBM Plex Sans'", "sans-serif"]
      }
    }
  },
  plugins: []
};
