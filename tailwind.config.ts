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
        brand: {
          blue: "#1a73e8",
          "blue-dark": "#1558b0",
          "blue-light": "#e8f0fe",
          sidebar: "#1e293b",
          "sidebar-hover": "#273549",
          "sidebar-active": "#2d3f57",
          accent: {
            green: "#34a853",
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
