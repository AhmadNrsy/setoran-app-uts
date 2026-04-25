/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        
        // === BASE PALETTE — Forest Teal (Vizora-inspired) ===
        background: "#F0F4F3",       // page bg — soft sage gray
        surface:    "#FFFFFF",       // cards, topbar
        secondary:  "#0D2B22",       // sidebar dark forest
        primary:    "#1A4A38",       // nav active, buttons
        accent:     "#2DD4A0",       // highlight, badges, active dots
        soft:       "#C8DDD8",       // borders, dividers
        muted:      "#7A9E9B",       // secondary text
        error:      "#E53E3E",       // logout hover, cancel

        // === EXTENDED TOKENS ===
        forest: {
          950: "#071912",
          900: "#0D2B22",
          800: "#12382D",
          700: "#1A4A38",
          600: "#246055",
        },
        brand: {
          50:  "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
        },
        status: {
          validBg:      "#ECFDF5",
          validBorder:  "#6EE7B7",
          validText:    "#065F46",
          cancelBg:     "#FFF1F2",
          cancelBorder: "#FECDD3",
          cancelText:   "#BE123C",
        },
      },

      fontFamily: {
        sans:    ["'DM Sans'", "system-ui", "sans-serif"],
        display: ["'DM Serif Display'", "Georgia", "serif"],
        mono:    ["'JetBrains Mono'", "'Fira Mono'", "monospace"],
      },

      boxShadow: {
        deep:   "0 8px 32px rgba(7, 25, 18, 0.18)",
        card:   "0 1px 4px rgba(13, 43, 34, 0.08)",
        soft:   "0 2px 12px rgba(13, 43, 34, 0.06)",
        "card-hover": "0 6px 20px rgba(13, 43, 34, 0.12)",
      },

      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.25rem",
      },

      keyframes: {
        fadeInUp: {
          "0%":   { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
      },
      animation: {
        "fade-in-up": "fadeInUp 0.3s ease both",
        "fade-in":    "fadeIn 0.2s ease both",
        shimmer:      "shimmer 1.4s ease infinite",
      },
    },
  },
  plugins: [],
};