import { useEffect } from "react";
import type { ThemeVariant } from "./variants";
import { getPreferredTheme, setTheme } from "./utils";
import { version } from "package.json";
import { useLocation } from "@remix-run/react";

export type UserThemeProps = {
  theme: ThemeVariant | null;
};

export default function UserTheme({ theme }: UserThemeProps) {
  let { pathname } = useLocation();

  useEffect(() => {
    if (theme) return;

    const preferredTheme = getPreferredTheme();
    if (preferredTheme) setTheme(preferredTheme);
  }, [theme]);

  return (
    <>
      <meta
        name="color-scheme"
        content={theme === "light" ? "light dark" : "dark light"}
      />
      {
        // Users with disabled JavaScript will get styles based on their prefered color scheme
        // because the needed classes for html cannot be set client side
        !theme && pathname.startsWith("/~/") && (
          <noscript>
            <link
              rel="stylesheet"
              href={`/~/styles/tailwind-variants.css?v=${version}`}
            />
          </noscript>
        )
      }
    </>
  );
}
