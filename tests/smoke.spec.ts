import { expect, test } from '@playwright/test';

async function acceptForms(page) {
  await page.route('https://formspree.io/**', async (route) => {
    await route.fulfill({ status: 200, body: 'ok' });
  });
}

test('navigation works across demos', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('link', { name: 'RapidFix' }).click();
  await expect(page).toHaveURL(/service-business/);
  await page.getByRole('link', { name: 'La Terra Café' }).click();
  await expect(page).toHaveURL(/restaurant/);
});

test('cart persists between reloads', async ({ page }) => {
  await page.goto('./demos/online-store/shop/');
  await page.getByRole('button', { name: 'Add to bag' }).first().click();
  await page.reload();
  await page.getByRole('link', { name: 'Bag' }).click();
  await expect(page.getByText('Your bag')).toBeVisible();
});

test('header hides on scroll', async ({ page }) => {
  await page.goto('./');
  const header = page.locator('header');
  await page.mouse.wheel(0, 600);
  await expect(header).toHaveClass(/-translate-y-full/);
  await page.mouse.wheel(0, -600);
  await expect(header).not.toHaveClass(/-translate-y-full/);
});

test('theme and palette persist', async ({ page, context }) => {
  await page.goto('./');
  await page.getByLabel('Theme').selectOption('dark');
  await page.getByLabel('Palette').selectOption('aurora');
  await page.reload();
  await expect(await page.locator('html').getAttribute('data-theme')).toBe('dark');
  await expect(await page.locator('html').getAttribute('data-palette')).toBe('aurora');
});

test('forms submit successfully', async ({ page }) => {
  await acceptForms(page);
  await page.goto('./demos/service-business/contact/');
  await page.getByLabel('Name').fill('Test User');
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Message').fill('Need help.');
  await page.getByRole('button', { name: 'Send message' }).click();
});
