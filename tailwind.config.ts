import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111114",
        paper: "#FAFAFA",
        mist: "#6B6B72",
        mistStrong: "#54545C",
        line: "#E8E8EC",
        accent: {
          DEFAULT: "#0D9488",
          soft: "#E1F5F3",
          dark: "#0F766E",
        },
        threat: {
          high: "#E34D4D",
          med: "#DD9A2B",
          low: "#1FA37A",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Inter",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "JetBrains Mono",
          "Menlo",
          "Consolas",
          "monospace",
        ],
      },
      boxShadow: {
        card: "0 1px 2px rgba(17,17,20,0.04), 0 1px 8px rgba(17,17,20,0.04)",
        cardHover: "0 4px 20px rgba(17,17,20,0.08)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
export default config;
