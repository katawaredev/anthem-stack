export enum ThemeVariant {
  DARK = "dark",
  LIGHT = "light",
}

export const prefersDarkMQ = "(prefers-color-scheme: dark)";

export const prefersLightMQ = "(prefers-color-scheme: light)";

export type ThemeColors = {
  primary: {
    DEFAULT: string;
    focus: string;
    content: string;
  };
  secondary: {
    DEFAULT: string;
    focus: string;
    content: string;
  };
  accent: {
    DEFAULT: string;
    focus: string;
    content: string;
  };
  neutral: {
    DEFAULT: string;
    focus: string;
    content: string;
  };
  base: {
    content: string;
    DEFAULT: string;
    dark: string;
    darker: string;
  };
  info: {
    DEFAULT: string;
    content: string;
  };
  success: {
    DEFAULT: string;
    content: string;
  };
  warning: {
    DEFAULT: string;
    content: string;
  };
  error: {
    DEFAULT: string;
    content: string;
  };
};
