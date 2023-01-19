import type {
  Fixtures,
  PlaywrightTestArgs,
  PlaywrightTestOptions,
  PlaywrightWorkerArgs,
  PlaywrightWorkerOptions,
  TestFixture,
} from "@playwright/test";

export type TestFixtureType<ReturnType, Args> = TestFixture<
  ReturnType,
  Args &
    PlaywrightTestArgs &
    PlaywrightTestOptions &
    PlaywrightWorkerArgs &
    PlaywrightWorkerOptions
>;

export type TestFixturesType<
  T extends Record<string, any>,
  W extends Record<string, any>
> = Fixtures<
  T,
  W,
  PlaywrightTestArgs & PlaywrightTestOptions,
  PlaywrightWorkerArgs & PlaywrightWorkerOptions
>;
