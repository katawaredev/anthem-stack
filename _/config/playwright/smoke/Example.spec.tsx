import { test, expect } from "~test";
import Example from "./Example";

test.use({ viewport: { width: 500, height: 500 } });

test("should work", async ({ mount }) => {
  const component = await mount(<Example></Example>);
  await expect(component).toContainText("Example");
});
