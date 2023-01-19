import { json, redirect } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";

import { getThemeSession } from "~/theme/theme.server";
import { isTheme } from "~/theme/utils";

export const action: ActionFunction = async ({ request }) => {
  const themeSession = await getThemeSession(request);
  const requestText = await request.text();
  const form = new URLSearchParams(requestText);
  const theme = form.get("theme");

  if (!isTheme(theme)) {
    return json({
      success: false,
      message: `theme value of \`${theme}\` is not a valid theme`,
    });
  }

  themeSession.setTheme(theme);

  const options = {
    headers: { "Set-Cookie": await themeSession.commit() },
  };

  const redirectTo =
    form.get("redirectTo") || request.headers.get("Referer") || "/~";

  //return json({ success: true }, options);
  return redirect(redirectTo, options);
};
