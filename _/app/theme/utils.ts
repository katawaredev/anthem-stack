import { ThemeVariant, prefersDarkMQ } from "./variants";

const themes: Array<ThemeVariant> = Object.values(ThemeVariant);

export function isTheme(value: unknown): value is ThemeVariant {
  return typeof value === "string" && themes.includes(value as ThemeVariant);
}

export const getPreferredTheme = () => {
  if (typeof window !== "object") return null;
  return window.matchMedia(prefersDarkMQ).matches
    ? ThemeVariant.DARK
    : ThemeVariant.LIGHT;
};

export function setTheme(theme: ThemeVariant) {
  reloadTheme(theme);

  const cl = document.documentElement.classList;
  if (!cl.contains(theme)) {
    if (cl.contains(ThemeVariant.LIGHT)) cl.remove(ThemeVariant.LIGHT);
    else if (cl.contains(ThemeVariant.DARK)) cl.remove(ThemeVariant.DARK);
    cl.add(theme);
  }

  const meta: HTMLMetaElement | null = document.querySelector(
    "meta[name=color-scheme]"
  );
  if (meta) {
    if (theme === ThemeVariant.DARK) {
      meta.content = "dark light";
    } else if (theme === ThemeVariant.LIGHT) {
      meta.content = "light dark";
    }
  } else {
    console.warn(
      "Hi there, could you file a bug report to let us know you're seeing this message? Thanks!"
    );
  }
}

export const reloadTheme = (theme: ThemeVariant) => {
  // Cache busting to force reloading new styles
  const themeUrl = `/~/styles/theme.css?${theme}=${new Date().getTime()}`;
  const themeLink = document.querySelector(
    'link[title="theme"][rel="stylesheet"]'
  );
  if (themeLink) {
    const newThemeLink = themeLink.cloneNode() as HTMLLinkElement;
    newThemeLink.href = themeUrl;
    themeLink.remove();
    document.getElementsByTagName("head")[0].appendChild(newThemeLink);
  }
};
