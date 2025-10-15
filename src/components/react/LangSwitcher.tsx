import React, { useEffect, useRef, useState } from "react";
import { setLanguage, useTranslation } from "./useTranslation";

const LABEL_KEYS: Record<string, string> = {
  en: "lang.en",
  es: "lang.es",
  fr: "lang.fr",
  pl: "lang.pl",
  pt: "lang.pt",
  ur: "lang.ur",
  ro: "lang.ro"
};

export const LangSwitcher: React.FC = () => {
  const { lang, t, supported } = useTranslation();
  const [open, setOpen] = useState(false);
  const [focusIndex, setFocusIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    setFocusIndex(Math.max(0, supported.indexOf(lang)));
  }, [lang, supported]);

  useEffect(() => {
    if (!open) return;
    const handler = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (open) {
      optionRefs.current[focusIndex]?.focus();
    }
  }, [open, focusIndex]);

  const selectLanguage = (code: string) => {
    setLanguage(code);
    setOpen(false);
  };

  const handleButtonKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen(true);
    }
  };

  const handleListKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setFocusIndex((current) => (current + 1) % supported.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setFocusIndex((current) => (current - 1 + supported.length) % supported.length);
    } else if (event.key === "Home") {
      event.preventDefault();
      setFocusIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setFocusIndex(supported.length - 1);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const code = supported[focusIndex];
      if (code) selectLanguage(code);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-semibold text-neutral-700 shadow-sm transition hover:border-primary hover:text-primary dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("header.languageHint")}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={handleButtonKeyDown}
      >
        <span className="sr-only">{t("header.language")}</span>
        <span aria-hidden="true">🌐</span>
        <span>{t(LABEL_KEYS[lang] ?? "lang.en")}</span>
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label={t("header.languageHint")}
          className="absolute right-0 z-50 mt-2 w-40 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-900"
          tabIndex={-1}
          onKeyDown={handleListKeyDown}
        >
          {supported.map((code, index) => (
            <li
              key={code}
              ref={(el) => (optionRefs.current[index] = el)}
              role="option"
              tabIndex={-1}
              aria-selected={code === lang}
              className={`flex cursor-pointer items-center justify-between gap-2 px-3 py-2 text-sm transition hover:bg-primary/10 ${
                code === lang ? "bg-primary/10 font-semibold text-primary" : "text-neutral-700 dark:text-neutral-100"
              }`}
              onMouseEnter={() => setFocusIndex(index)}
              onClick={() => selectLanguage(code)}
            >
              <span>{t(LABEL_KEYS[code] ?? "lang.en")}</span>
              {code === lang && <span className="sr-only">{t("header.languageCurrent")}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
