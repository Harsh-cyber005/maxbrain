import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#f3f3f5",
        text: "#111625",
        primaryBtn: {
          DEFAULT: '#5046e4',
          hover: '#3f3bd1',
        },
        secondaryBtn: {
          DEFAULT: '#DFE7FF',
          hover: '#c4d2ff',
        },
        dangerBtn: {
          DEFAULT: '#FF4D4F',
          hover: '#ff3333',
        }
      },
    },
    screens: {
      "xs": "480px",
      "xxs": "408px",
      "md": "768px",
      "sm": "640px",
      "lg": "1024px",
      "xl": "1280px",
      "2xl": "1536px"
    }
  },
  plugins: [],
} satisfies Config;
