import { setupServer } from "msw/node";
import { isE2E } from "./utils";

const server = setupServer();

server.listen({ onUnhandledRequest: "bypass" });
console.info("🔶 Mock server running");
if (isE2E) console.info("running in E2E mode");

process.once("SIGINT", () => server.close());
process.once("SIGTERM", () => server.close());
