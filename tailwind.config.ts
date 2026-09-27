import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          950: "#040806",
          900: "#070c09",
          850: "#0b140e",
          800: "#101b13",
          700: "#18281d",
          600: "#223829",
        },
        line: "#1a2e21",
        ink: {
          100: "#ffffff",
          300: "#e2e8f0",
          500: "#94a3b8",
          700: "#475569",
        },
        green: {
          500: "#00e676",
          400: "#33ff9c",
          600: "#00b359",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "SFMono-Regular", "ui-monospace", "Menlo", "Consolas", "monospace"],
      },
      borderRadius: {
        DEFAULT: "12px",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(0,230,118,0.25), 0 8px 30px -8px rgba(0,230,118,0.45)",
        "glow-lg": "0 0 0 1px rgba(0,230,118,0.3), 0 20px 60px -12px rgba(0,230,118,0.55)",
        "glow-green": "0 0 0 1px rgba(0,230,118,0.3), 0 8px 30px -8px rgba(0,230,118,0.4)",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #00e676 0%, #00b359 100%)",
        "brand-gradient-soft": "linear-gradient(135deg, rgba(0,230,118,0.18) 0%, rgba(0,179,89,0.1) 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
