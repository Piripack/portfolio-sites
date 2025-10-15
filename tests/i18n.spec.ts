import { expect, test } from '@playwright/test';

test('falls back to English when locale is missing keys', async ({ page }) => {
  await page.route('**/locales/es.json', (route) => route.fulfill({ status: 200, body: '{}' }));
  await page.goto('./demos/online-store/?lang=es');
  const hero = page.locator('[data-i18n="store.hero.title"]');
  await expect(hero).toHaveText('Wardrobe essentials for northern climates.');
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
});

test('language selection persists after reload', async ({ page }) => {
  await page.goto('./');
  await page.getByLabel('Choose website language').click();
  await page.getByRole('option', { name: 'French' }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  await expect(page.url()).toContain('lang=fr');
});
