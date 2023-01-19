import type { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react";
import { ThemeVariant } from "./variants";
import type { FormProps } from "@remix-run/react";
import { useFetcher } from "@remix-run/react";
import { useTheme } from "./ThemeProvider";
import { setTheme } from "./utils";

export type ToggleThemeProps = {
  light: ReactNode;
  dark: ReactNode;
};

export default function ToggleTheme({ light, dark }: ToggleThemeProps) {
  const fetcher = useFetcher();
  const { theme } = useTheme();

  if (fetcher.state === "submitting")
    setTheme(
      theme === ThemeVariant.LIGHT ? ThemeVariant.DARK : ThemeVariant.LIGHT
    );

  const formProps: FormProps = {
    method: "post",
    action: "/~/action/theme/set",
  };

  const buttonProps: DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > = {
    type: "submit",
    disabled: !!fetcher.submission,
  };

  return (
    <>
      {theme !== ThemeVariant.DARK && (
        <fetcher.Form
          {...formProps}
          className="relative inline-block dark:hidden"
        >
          <input type="hidden" name="theme" value={ThemeVariant.DARK} />
          <button {...buttonProps}>{light}</button>
        </fetcher.Form>
      )}
      {theme !== ThemeVariant.LIGHT && (
        <fetcher.Form
          {...formProps}
          className="relative hidden dark:inline-block"
        >
          <input type="hidden" name="theme" value={ThemeVariant.LIGHT} />
          <button {...buttonProps}>{dark}</button>
        </fetcher.Form>
      )}
    </>
  );
}
