import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "ui-serif", "serif"],
      },
      colors: {
        background: "#FFFFFF",
        offwhite: "#FAFAF7",
        cream: "#F7EFE5",
        softpink: "#F8DDEB",
        softgreen: "#DDEFE3",
        textdark: "#1F2937",
        textgray: "#6B7280",
        bordergray: "#E5E7EB",
        success: "#16A34A",
        warning: "#F59E0B",
        error: "#DC2626",
      },
      borderRadius: {
        card: "20px",
        hero: "28px",
        modal: "24px",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "menu-in": {
          "0%":   { opacity: "0", transform: "translateY(-6px) scale(0.985)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "mega-in": {
          "0%":   { opacity: "0", transform: "translateY(-10px) scale(0.99)" },
          "60%":  { opacity: "1" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "content-swap": {
          "0%":   { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "float":          "float 3.2s ease-in-out infinite",
        "float-slow":     "float 4s ease-in-out 0.5s infinite",
        "float-slower":   "float 3.6s ease-in-out 1s infinite",
        "float-slowest":  "float 4.4s ease-in-out 1.5s infinite",
        // Refined "premium" easing (easeOutExpo-like) for a soft settle
        "menu-in":        "menu-in 0.24s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "mega-in":        "mega-in 0.38s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "content-swap":   "content-swap 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
