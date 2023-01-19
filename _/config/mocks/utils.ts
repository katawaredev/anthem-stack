import dns from "dns";

export const isE2E = process.env.RUNNING_E2E === "true";

let connected: boolean | null = null;

export async function isConnectedToTheInternet() {
  if (connected === null) {
    connected = await new Promise((resolve) => {
      dns.lookupService("8.8.8.8", 53, (err) => {
        resolve(!err);
      });
    });
  }
  return connected;
}
