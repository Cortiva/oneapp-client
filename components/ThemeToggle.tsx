import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="text-sm px-3 py-1 text-black dark:text-white rounded cursor-pointer"
    >
      {resolvedTheme === "light" ? <Sun size={22} /> : <Moon size={22} />}
    </button>
  );
}
