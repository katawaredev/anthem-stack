import type { LoaderFunction } from "@remix-run/node";
import { stylesheet } from "remix-utils";

import { ThemeVariant } from "~/theme/variants";
import { lightColors, darkColors } from "~/theme/colors.server";
import { getThemeSession } from "~/theme/theme.server";
import { makeCssVars } from "~/theme/utils.server";

export let loader: LoaderFunction = async ({ request }) => {
  // Check for URL parameter
  const url = new URL(request.url);
  if (url.searchParams.get("light"))
    return stylesheet(`.light{${makeCssVars("--color", lightColors)}}`);
  if (url.searchParams.get("dark"))
    return stylesheet(`.dark{${makeCssVars("--color", darkColors)}}`);

  // Check for session cookie
  const session = await getThemeSession(request);
  const theme = session.getTheme();
  switch (theme) {
    case ThemeVariant.LIGHT:
      return stylesheet(`.light{${makeCssVars("--color", lightColors)}}`);
    case ThemeVariant.DARK:
      return stylesheet(`.dark{${makeCssVars("--color", darkColors)}}`);
    default:
      // Return both styles if no preference was specified
      const lightStyle = makeCssVars("--color", lightColors);
      const darkStyle = makeCssVars("--color", darkColors);
      return stylesheet(
        `.light,@media (prefers-color-scheme: light){${lightStyle}}` +
          `.dark,@media (prefers-color-scheme: dark),{${darkStyle}}` +
          `.light{${lightStyle}}` +
          `.dark{${darkStyle}}`
      );
  }
};
