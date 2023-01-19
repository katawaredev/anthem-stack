import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { ThemeVariant } from "./variants";
import { useFetcher } from "@remix-run/react";
import { setTheme as setUserTheme } from "./utils";

type ThemeContextType = {
  theme: ThemeVariant | null;
  setTheme: (theme: ThemeVariant) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export default function ThemeProvider({
  children,
  theme,
}: {
  children: ReactNode;
  theme: ThemeVariant | null;
}) {
  const persistTheme = useFetcher();
  const setTheme = (theme: ThemeVariant) => {
    setUserTheme(theme);
    persistTheme.submit(
      { theme },
      { action: "/~/action/theme/set", method: "post" }
    );
  };
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
