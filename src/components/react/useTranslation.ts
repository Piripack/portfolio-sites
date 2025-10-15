import { useSyncExternalStore } from "react";
import fallbackMessages from "../../public/locales/en.json";

declare global {
  interface Window {
    __i18n?: {
      lang: string;
      supported: string[];
      t: (key: string) => string;
      setLanguage: (code: string) => void;
      subscribe: (listener: (lang: string) => void) => () => void;
      ready: () => boolean;
    };
  }
}

const SUPPORTED = ["en", "es", "fr", "pl", "pt", "ur", "ro"];
const FALLBACK_TRANSLATIONS = fallbackMessages as Record<string, string>;

function subscribe(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }
  const handler = () => callback();
  window.addEventListener("i18n:change", handler);
  return () => window.removeEventListener("i18n:change", handler);
}

function getSnapshot() {
  if (typeof window === "undefined") return "en";
  return window.__i18n?.lang ?? "en";
}

export function useTranslation() {
  const lang = useSyncExternalStore(subscribe, getSnapshot, () => "en");
  const translate = (key: string) => {
    if (typeof window === "undefined") return FALLBACK_TRANSLATIONS[key] ?? key;
    return window.__i18n?.t?.(key) ?? FALLBACK_TRANSLATIONS[key] ?? key;
  };
  const supported = typeof window === "undefined" ? SUPPORTED : window.__i18n?.supported ?? SUPPORTED;
  return { lang, t: translate, supported };
}

export function setLanguage(code: string) {
  if (typeof window === "undefined") return;
  window.__i18n?.setLanguage?.(code);
}
