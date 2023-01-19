import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import ToggleTheme from "~/theme/ToggleTheme";

export default function ThemeSwitch() {
  const iconProps = {
    className: "w-6 h-6 text-blue-700",
  };

  return (
    <div className="absolute top-2 right-2 z-50">
      <ToggleTheme
        light={<SunIcon {...iconProps} />}
        dark={<MoonIcon {...iconProps} />}
      ></ToggleTheme>
    </div>
  );
}
