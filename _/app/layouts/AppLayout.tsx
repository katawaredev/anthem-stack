import type { ReactNode } from "react";
import ThemeSwitch from "~/components/ThemeSwitch";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen w-screen flex-row overflow-hidden bg-base md:flex-col">
      <ThemeSwitch />
      {children}
    </div>
  );
}
