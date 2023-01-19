import type {
  PlaywrightTestOptions,
  PlaywrightWorkerOptions,
  Project as PlaywrightProject,
} from "@playwright/test";
import { devices } from "@playwright/test";

export type Device = keyof typeof devices;

export type Project = PlaywrightProject<
  PlaywrightTestOptions,
  PlaywrightWorkerOptions
>;

export const createAuditProject = (): Project => ({
  name: "audit",
  timeout: 20 * 1000,
  testMatch: /\/[a-zA-Z0-9_-]+\.audit\.(test|spec)\.ts$/,
  use: {
    ...devices["Desktop Chrome"],
  },
});

export const createProject = (name: string, device: Device): Project => ({
  name,
  testMatch: /\/[a-zA-Z0-9_-]+\.(spec|test)\.tsx?$/,
  use: getDevice(device),
});

export const createE2EProject = (name: string, device: Device): Project => ({
  name,
  testMatch: /\/[a-zA-Z0-9_-]+\.e2e\.(test|spec)\.ts$/,
  use: getDevice(device),
});

const getDevice = (device: Device): Project["use"] => {
  if (device === "Microsoft Edge")
    return {
      channel: "msedge",
    };
  if (device === "Google Chrome")
    return {
      channel: "chrome",
    };
  return {
    ...devices[device],
  };
};
