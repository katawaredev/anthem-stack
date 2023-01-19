import { test as base } from "@playwright/test";
import { axe } from "./fixtures/axe";
import { lighthouse } from "./fixtures/lighthouse";

import type { AxeFixtureT } from "./fixtures/axe";
import type {
  LighthouseFixturesT,
  LighthouseFixturesW,
} from "./fixtures/lighthouse";

type FixturesT = AxeFixtureT & LighthouseFixturesT;
type FixturesW = LighthouseFixturesW;

export const test = base.extend<FixturesT, FixturesW>({
  ...axe,
  ...lighthouse,
});

export { expect } from "@playwright/test";
