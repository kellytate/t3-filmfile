import { type Config } from "tailwindcss";


export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class', // or 'media' or 'class
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
