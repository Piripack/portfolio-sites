const SUPPORTED_LANGS = ["en", "es", "fr", "pl", "pt", "ur", "ro"];
const FALLBACK_LANG = "en";
const STORAGE_KEY = "portfolio-sites:settings:v1";
const QUERY_KEY = "lang";
const LOCALE_PATH = "/portfolio-sites/locales/";
const LANG_MAP = {
  en: "en-GB",
  es: "es",
  fr: "fr",
  pl: "pl",
  pt: "pt",
  ur: "ur",
  ro: "ro"
};

let fallbackTranslations = {};
let activeTranslations = {};
let currentLang = FALLBACK_LANG;
let ready = false;

const listeners = new Set();

function isSupported(code) {
  return typeof code === "string" && SUPPORTED_LANGS.includes(code);
}

async function fetchLocale(code) {
  try {
    const response = await fetch(`${LOCALE_PATH}${code}.json`, { cache: "no-cache" });
    if (!response.ok) throw new Error(`Locale load failed: ${code}`);
    return await response.json();
  } catch (error) {
    console.warn("Failed to load locale", code, error);
    return {};
  }
}

function readSettings() {
  if (typeof localStorage === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch (error) {
    console.warn("Unable to parse settings", error);
    return {};
  }
}

function writeSettings(next) {
  if (typeof localStorage === "undefined") return;
  const current = readSettings();
  const merged = { ...current, ...next };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
}

function getTranslation(key) {
  return activeTranslations[key] ?? fallbackTranslations[key] ?? key;
}

function translateElement(element) {
  if (!(element instanceof Element)) return;
  if (!element.hasAttribute("data-i18n")) return;
  const key = element.getAttribute("data-i18n");
  if (!key) return;
  const value = getTranslation(key);
  const attrList = element.getAttribute("data-i18n-attr");
  const allowText = element.getAttribute("data-i18n-text") !== "false";
  if (allowText) {
    if ("value" in element && element.tagName === "INPUT") {
      element.value = value;
    } else if ("value" in element && element.tagName === "TEXTAREA") {
      element.value = value;
    } else {
      element.textContent = value;
    }
  }
  if (attrList) {
    attrList
      .split(/\s+/)
      .filter(Boolean)
      .forEach((attr) => {
        element.setAttribute(attr, value);
      });
  }
}

function translateTree(root = document) {
  if (!(root instanceof Document || root instanceof Element)) return;
  if (root instanceof Element) {
    if (root.hasAttribute("data-i18n")) {
      translateElement(root);
    }
  }
  const elements = (root instanceof Document ? root : root.ownerDocument)?.querySelectorAll?.("[data-i18n]");
  if (elements) {
    elements.forEach((el) => translateElement(el));
  }
}

function updateHtmlLang() {
  const mapped = LANG_MAP[currentLang] || currentLang;
  document.documentElement.lang = mapped;
}

function updateAlternateLinks() {
  const head = document.head;
  head.querySelectorAll('link[rel="alternate"][data-i18n-alt]').forEach((link) => link.remove());
  const baseUrl = new URL(window.location.href);
  baseUrl.searchParams.delete(QUERY_KEY);
  SUPPORTED_LANGS.forEach((code) => {
    const url = new URL(baseUrl);
    if (code !== FALLBACK_LANG) {
      url.searchParams.set(QUERY_KEY, code);
    }
    const link = document.createElement("link");
    link.rel = "alternate";
    link.href = url.toString();
    link.setAttribute("hreflang", LANG_MAP[code] || code);
    link.dataset.i18nAlt = code;
    head.appendChild(link);
  });
  const xDefault = document.createElement("link");
  xDefault.rel = "alternate";
  xDefault.href = baseUrl.toString();
  xDefault.setAttribute("hreflang", "x-default");
  xDefault.dataset.i18nAlt = "x-default";
  head.appendChild(xDefault);
}

async function applyLanguage(code, { silent = false, skipQuery = false } = {}) {
  if (!isSupported(code)) code = FALLBACK_LANG;
  if (code === currentLang && ready) {
    if (!silent) dispatchChange();
    return;
  }
  const nextTranslations = code === FALLBACK_LANG && Object.keys(fallbackTranslations).length > 0
    ? fallbackTranslations
    : await fetchLocale(code);
  if (code === FALLBACK_LANG && Object.keys(fallbackTranslations).length === 0) {
    fallbackTranslations = nextTranslations;
  }
  if (code !== FALLBACK_LANG && Object.keys(fallbackTranslations).length === 0) {
    fallbackTranslations = await fetchLocale(FALLBACK_LANG);
  }
  activeTranslations = nextTranslations;
  currentLang = code;
  writeSettings({ lang: code });
  updateHtmlLang();
  translateTree();
  updateAlternateLinks();
  if (!skipQuery) {
    const url = new URL(window.location.href);
    if (code === FALLBACK_LANG) {
      url.searchParams.delete(QUERY_KEY);
    } else {
      url.searchParams.set(QUERY_KEY, code);
    }
    history.replaceState({}, "", url.toString());
  }
  if (!silent) dispatchChange();
  ready = true;
}

function dispatchChange() {
  const event = new CustomEvent("i18n:change", { detail: { lang: currentLang } });
  listeners.forEach((listener) => {
    try {
      listener(currentLang);
    } catch (error) {
      console.error(error);
    }
  });
  window.dispatchEvent(event);
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function detectInitialLanguage() {
  const url = new URL(window.location.href);
  const queryLang = url.searchParams.get(QUERY_KEY);
  if (isSupported(queryLang)) return queryLang;
  const settingsLang = readSettings().lang;
  if (isSupported(settingsLang)) return settingsLang;
  const htmlLang = document.documentElement.lang;
  if (isSupported(htmlLang)) return htmlLang;
  const navigatorLang = navigator.language?.toLowerCase?.();
  if (navigatorLang) {
    const match = SUPPORTED_LANGS.find((code) => navigatorLang.startsWith(code));
    if (match) return match;
  }
  return FALLBACK_LANG;
}

function initObserver() {
  if (typeof MutationObserver === "undefined") return;
  const observer = new MutationObserver((records) => {
    records.forEach((record) => {
      if (record.type === "childList") {
        record.addedNodes.forEach((node) => {
          if (node instanceof Element) {
            translateTree(node);
          }
        });
      }
      if (record.type === "attributes" && record.target instanceof Element) {
        translateElement(record.target);
      }
    });
  });
  observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["data-i18n"] });
}

async function init() {
  fallbackTranslations = await fetchLocale(FALLBACK_LANG);
  activeTranslations = fallbackTranslations;
  const detected = detectInitialLanguage();
  if (detected !== FALLBACK_LANG) {
    await applyLanguage(detected, { silent: true, skipQuery: true });
  } else {
    currentLang = FALLBACK_LANG;
    updateHtmlLang();
    translateTree();
    updateAlternateLinks();
    ready = true;
  }
  initObserver();
  dispatchChange();
}

if (typeof window !== "undefined") {
  window.__i18n = {
    get lang() {
      return currentLang;
    },
    get supported() {
      return [...SUPPORTED_LANGS];
    },
    t: (key) => getTranslation(key),
    setLanguage: (code) => applyLanguage(code),
    subscribe,
    ready: () => ready
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
}
