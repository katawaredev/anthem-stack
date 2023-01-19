/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx,jsx,js}",
    "./packages/*/**/*.{ts,tsx,jsx,js,md,mdx}",
  ],
  theme: {
    extend: {
      /** @type {import('../../app/theme/variants').ThemeColors} */
      colors: {
        primary: {
          DEFAULT: "var(--color-primary)",
          focus: "var(--color-primary-focus)",
          content: "var(--color-primary-content)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          focus: "var(--color-secondary-focus)",
          content: "var(--color-secondary-content)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          focus: "var(--color-accent-focus)",
          content: "var(--color-accent-content)",
        },
        neutral: {
          DEFAULT: "var(--color-neutral)",
          focus: "var(--color-neutral-focus)",
          content: "var(--color-neutral-content)",
        },
        base: {
          DEFAULT: "var(--color-base)",
          content: "var(--color-base-content)",
          dark: "var(--color-base-dark)",
          darker: "var(--color-base-darker)",
        },
        info: {
          DEFAULT: "var(--color-info)",
          content: "var(--color-info-content)",
        },
        success: {
          DEFAULT: "var(--color-success)",
          content: "var(--color-success-content)",
        },
        warning: {
          DEFAULT: "var(--color-warning)",
          content: "var(--color-warning-content)",
        },
        error: {
          DEFAULT: "var(--color-error)",
          content: "var(--color-error-content)",
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/line-clamp"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
