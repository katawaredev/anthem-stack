const { darkMode: _, ...config } = require("../tailwind.config");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "media",
  ...config,
};
