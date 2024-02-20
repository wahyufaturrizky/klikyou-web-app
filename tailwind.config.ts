import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "primary-blue": "#0AADE0",
        "secondary-blue": "#2379AA",
        red: "#F44550",
        green: "#23C464",
        "primary-gray": "#9CB1C6",
        "primary-purple": "#B0039E",
        "gray-dark": "#455C72",
        link: "#2166E9",
        warn: "#FFB800",
      },
    },
  },
  plugins: [],
};
export default config;
