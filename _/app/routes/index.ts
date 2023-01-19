import { redirect } from "@remix-run/node";
import type { LoaderFunction, LinksFunction } from "@remix-run/node";

import tailwindBaseStylesheetUrl from "~/styles/tailwind-base.css";

export let links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwindBaseStylesheetUrl },
];

// TODO: Load user page here
export const loader: LoaderFunction = async () => {
  return redirect("/~");
};
