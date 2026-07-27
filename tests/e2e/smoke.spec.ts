import { expect, test } from '@playwright/test';

test('home loads with hero and featured projects', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Piero Flores' })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Featured work/ })).toBeVisible();
  await expect(page.getByRole('article')).toHaveCount(4);
});

test('nav reaches every page', async ({ page }) => {
  await page.goto('/');
  for (const [label, h1] of [
    ['Projects', 'Projects'],
    ['Blog', 'Blog'],
    ['CV', 'Curriculum Vitae'],
  ] as const) {
    await page.getByRole('navigation').getByRole('link', { name: label }).click();
    await expect(page.getByRole('heading', { level: 1, name: h1 })).toBeVisible();
  }
});

test('404 page renders for unknown route', async ({ page }) => {
  const response = await page.goto('/definitely-not-a-page');
  expect(response?.status()).toBe(404);
  await expect(page.getByText('Out of tolerance.')).toBeVisible();
});

test('no phone number anywhere in page content', async ({ page }) => {
  for (const path of ['/', '/projects', '/blog', '/cv']) {
    await page.goto(path);
    const body = await page.locator('body').innerText();
    expect(body).not.toContain('7857');
  }
});
