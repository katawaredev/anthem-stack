import type { LinksFunction, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { getSeo, getSeoMeta, manifest } from "~/seo";

import AppLayout from "~/layouts/AppLayout";
import { getTranslate } from "packages/translation/utils.server";

import tailwindStylesheetUrl from "~/styles/tailwind.css";

let [, seoLinks] = getSeo();

export async function loader({ request }: LoaderArgs) {
  const t = await getTranslate(request);
  return json({
    t: {
      description: t("description"),
    },
  });
}

export const meta: MetaFunction = ({ data: { t } }) => {
  let seoMeta = getSeoMeta({
    description: t.description,
  });
  return {
    ...seoMeta,
  };
};

export let links: LinksFunction = () => [
  ...seoLinks,
  ...manifest,
  { rel: "stylesheet", href: tailwindStylesheetUrl },
  { rel: "stylesheet", href: "/~/styles/theme.css", title: "theme" },
];

export default function AppPage() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
