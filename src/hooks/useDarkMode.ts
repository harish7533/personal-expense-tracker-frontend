import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "app-theme";

export default function useDarkMode() {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    return stored === "dark" ? "dark" : "light";
  });

  // 🔹 On first load → apply theme to DOM
  // useEffect(() => {
  //   document.documentElement.setAttribute("data-theme", theme);
  // }, [theme]);

  // 🔹 Whenever theme changes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  // 🔹 Toggle helper
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return {
    theme,
    // setTheme,
    toggleTheme,
    isDark: theme === "dark",
  };
}
