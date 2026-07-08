import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        radar: {
          navy: "#0B1F3A",
          blue: "#0F4C81",
          cyan: "#00A8CC",
          red: "#D62828",
          orange: "#F77F00",
          green: "#2A9D8F",
          yellow: "#F4D35E",
          bg: "#F8FAFC",
          text: "#1E293B",
          muted: "#64748B",
          border: "#E2E8F0",
          dark: "#071A2E"
        },
        primary: "#0B1F3A",
        danger: "#D62828",
        warning: "#F77F00",
        success: "#2A9D8F",
        surface: "#F8FAFC",
        border: "#E2E8F0"
      },
      boxShadow: {
        soft: "0 16px 40px rgba(11, 31, 58, 0.08)"
      },
      borderRadius: {
        "2xl": "1rem"
      }
    }
  },
  plugins: []
};

export default config;
