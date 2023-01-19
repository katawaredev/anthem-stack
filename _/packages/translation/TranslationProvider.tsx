import { I18nextProvider } from "react-i18next";
import type { i18n } from "i18next";
import type { ReactNode } from "react";

export type TranslationProviderProps = {
  children: ReactNode;
  config: i18n;
};

export default function TranslationProvider({
  children,
  config,
}: TranslationProviderProps) {
  return <I18nextProvider i18n={config}>{children}</I18nextProvider>;
}
