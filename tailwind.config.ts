import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // RURAL-CONNECT project palette (taken from the project logo's green → teal → blue gradient).
        // The Tailwind `blue` scale is remapped to the brand teal, so every `*-blue-*` class follows the brand.
        blue: {
          50: "#ecf8f9",
          100: "#d3eef1",
          200: "#a9dde3",
          300: "#76c8d1",
          400: "#3fafbb",
          500: "#1f9aa8",
          600: "#178593",
          700: "#115f6e",
          800: "#0f4c59",
          900: "#0f3d47",
        },
        brand: {
          blue: "#178593",
          "blue-dark": "#115f6e",
          "blue-light": "#e6f4f6",
          sidebar: "#0f3d47",
          "sidebar-hover": "#175562",
          "sidebar-active": "#1d6676",
          accent: {
            green: "#2f9e77",
            orange: "#fbbc04",
            red: "#ea4335",
          },
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [forms],
};

export default config;
