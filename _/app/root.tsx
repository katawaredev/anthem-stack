import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useMatches,
} from "@remix-run/react";
import { getUser } from "./services/auth.server";

import clsx from "clsx";
import UserTheme from "~/theme/UserTheme";
import { getThemeSession } from "./theme/theme.server";
import ThemeProvider from "./theme/ThemeProvider";
import { getLocale } from "packages/translation/utils.server";
import { useTranslation } from "packages/translation";

export async function loader({ request }: LoaderArgs) {
  const themeSession = await getThemeSession(request);
  const locale = await getLocale(request);
  return json({
    user: await getUser(request),
    theme: themeSession.getTheme(),
    locale,
  });
}

export const meta: MetaFunction = () => {
  return {
    charset: "utf-8",
    viewport: "width=device-width,initial-scale=1",
  };
};

export default function App() {
  const matches = useMatches();
  const { theme, locale } = useLoaderData<typeof loader>();
  const { i18n } = useTranslation();

  // If all routes explicitly does not want to hydrate, this will return false
  const includeScripts = matches.some(
    (match) => !match.handle || match.handle.hydrate
  );

  return (
    <html lang={locale} dir={i18n.dir()} className={clsx(theme)}>
      <head>
        <Meta />
        <Links />
        <UserTheme theme={theme} />
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <Outlet />
        </ThemeProvider>
        <ScrollRestoration />
        {includeScripts ? <Scripts /> : null}
        <LiveReload />
      </body>
    </html>
  );
}
