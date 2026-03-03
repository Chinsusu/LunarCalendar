import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F5ECD7",
        card: "#FAF3E4",
        primary: "#8B1A1A",
        secondary: "#5C3317",
        accent: "#C9A84C",
        ink: "#2C1810",
        muted: "#8B7355",
        border: "#E8D5B0",
        "hoang-dao": "#2D6A4F",
        "hac-dao": "#C62828",
      },
      fontFamily: {
        display: ["Lora", "Georgia", "serif"],
        body: ["Be Vietnam Pro", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "8px",
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "20px",
      },
      boxShadow: {
        sm: "0 1px 3px rgba(44, 24, 16, 0.08)",
        md: "0 4px 12px rgba(44, 24, 16, 0.12)",
        lg: "0 8px 24px rgba(44, 24, 16, 0.16)",
      },
      fontSize: {
        "lunar-hero": ["80px", { lineHeight: "1", fontWeight: "700" }],
        "lunar-month": ["24px", { lineHeight: "1.3", fontWeight: "600" }],
        "can-chi": ["18px", { lineHeight: "1.4", fontWeight: "600" }],
        "label": ["13px", { lineHeight: "1.4", fontWeight: "400" }],
        "lunar-small": ["11px", { lineHeight: "1.4", fontWeight: "400" }],
      },
      keyframes: {
        slideInRight: {
          from: { opacity: "0", transform: "translateX(30px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        slideOutLeft: {
          from: { opacity: "1", transform: "translateX(0)" },
          to: { opacity: "0", transform: "translateX(-30px)" },
        },
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "slide-in": "slideInRight 200ms ease-out",
        "slide-out": "slideOutLeft 200ms ease-out",
        "fade-in-1": "fadeInUp 300ms ease-out 0ms   both",
        "fade-in-2": "fadeInUp 300ms ease-out 80ms  both",
        "fade-in-3": "fadeInUp 300ms ease-out 160ms both",
      },
    },
  },
  plugins: [],
};

export default config;
