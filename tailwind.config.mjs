import { fontFamily } from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";

export default {
  darkMode: "class",
  content: ["./src/**/*.{astro,html,md,mdx,tsx,jsx}", "./public/**/*.html"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Inter Variable'", ...fontFamily.sans],
        display: ["'Poppins'", ...fontFamily.sans]
      },
      colors: {
        primary: "var(--colour-primary)",
        secondary: "var(--colour-secondary)",
        accent: "var(--colour-accent)",
        neutral: "var(--colour-neutral)",
        base: "var(--colour-base)"
      },
      transitionTimingFunction: {
        "swift-out": "cubic-bezier(0.22, 1, 0.36, 1)"
      }
    }
  },
  plugins: [forms, typography]
};
