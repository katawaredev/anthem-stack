import postcss from "postcss";
import tailwindcss from "tailwindcss";
import plugin from "tailwindcss/plugin";
import type { Config as TailwindConfig } from "tailwindcss";
// @ts-expect-error Missing TS definitions
import csso from "postcss-csso";

const defaultInputCss = `
  @tailwind components;
  @tailwind utilities;
`;

type CreateStyleProps = {
  html?: string;
  classes?: string[];
  theme?: TailwindConfig["theme"];
};

export async function createStyle({ html, classes, theme }: CreateStyleProps) {
  const tailwindConfig: TailwindConfig = {
    // @ts-expect-error This hack enables variants API to work
    darkMode: null,
    content: html ? [{ raw: html, extension: "html" }] : [],
    plugins: [
      // Both media and class variants must be generated
      // to ensure the user will get correct styles every time
      // https://tailwindcss.com/docs/plugins#adding-variants
      plugin(function ({ addVariant }) {
        addVariant("dark", ["@media (prefers-color-scheme: dark)", ".dark &"]);
      }),
      require("@tailwindcss/typography"),
      require("@tailwindcss/forms"),
      require("@tailwindcss/line-clamp"),
      require("@tailwindcss/aspect-ratio"),
    ],
    safelist: classes ? classes : [],
    theme,
  };

  try {
    const { css } = await postcss([
      tailwindcss({ config: tailwindConfig }),
      csso,
    ]).process(defaultInputCss, {});
    return css;
  } catch {
    return "";
  }
}
