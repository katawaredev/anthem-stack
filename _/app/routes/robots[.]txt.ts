import type { LoaderFunction } from "@remix-run/node";

export let loader: LoaderFunction = async ({ request }) => {
  // TODO: Custom robots.txt rules from user settings
  return new Response("User-agent: *\nDisallow:");
};
