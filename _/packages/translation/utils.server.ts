import type { InitOptions } from "i18next";
import i18next from "./i18next.server";

export type TranslateOptions = Omit<InitOptions, "react"> | undefined;

export const getTranslate = (
  request: Request | string,
  namespaces?: string | readonly string[] | undefined,
  options?: TranslateOptions
) => {
  if (typeof request === "string")
    return i18next.getFixedT(request, namespaces, options);

  return i18next.getFixedT(request, namespaces, options);
};

export const getLocale = (request: Request) => i18next.getLocale(request);
