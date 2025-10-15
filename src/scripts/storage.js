const STORAGE_KEY = 'portfolio-sites:settings:v1';

export function loadSettings() {
  if (typeof localStorage === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch (error) {
    console.warn('Failed to parse settings', error);
    return {};
  }
}

export function saveSettings(settings) {
  if (typeof localStorage === 'undefined') return;
  const current = loadSettings();
  const merged = { ...current, ...settings };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
}
