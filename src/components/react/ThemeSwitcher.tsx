import React, { useEffect, useState } from "react";
import { loadSettings, saveSettings } from "../../scripts/storage";
import { useTranslation } from "./useTranslation";

const palettes = ["default", "coastal", "moors", "heath", "ember", "aurora"] as const;

export const ThemeSwitcher: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [palette, setPalette] = useState<typeof palettes[number]>("default");
  const { t } = useTranslation();

  useEffect(() => {
    if (typeof document === "undefined") return;
    const settings = loadSettings();
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = settings.theme ?? (prefersDark ? "dark" : "light");
    const initialPalette = settings.palette ?? "default";
    setTheme(initialTheme);
    setPalette(initialPalette);
    document.documentElement.dataset.theme = initialTheme;
    if (initialPalette !== "default") {
      document.documentElement.dataset.palette = initialPalette;
    }
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.dataset.theme = theme;
    saveSettings({ theme });
  }, [theme]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (palette === "default") {
      delete document.documentElement.dataset.palette;
    } else {
      document.documentElement.dataset.palette = palette;
    }
    saveSettings({ palette });
  }, [palette]);

  return (
    <div className="flex items-center gap-2">
      <label className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-300">
        {t("theme.label")}
        <select
          className="rounded-md border border-neutral-200 bg-white px-2 py-1 text-sm text-neutral-800 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
          value={theme}
          onChange={(event) => setTheme(event.target.value as "light" | "dark")}
        >
          <option value="light">{t("theme.light")}</option>
          <option value="dark">{t("theme.dark")}</option>
        </select>
      </label>
      <label className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-300">
        {t("palette.label")}
        <select
          className="rounded-md border border-neutral-200 bg-white px-2 py-1 text-sm text-neutral-800 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
          value={palette}
          onChange={(event) => setPalette(event.target.value as typeof palettes[number])}
        >
          {palettes.map((option) => (
            <option key={option} value={option}>
              {option === "default" ? t("palette.classic") : t(`palette.${option}`)}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};
