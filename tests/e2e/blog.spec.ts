import { expect, test } from '@playwright/test';

test('blog index lists the seed post and navigates to it', async ({ page }) => {
  await page.goto('/blog');
  const postLink = page.getByRole('link', { name: /Sub-micrometer IK/ });
  await expect(postLink).toBeVisible();
  await postLink.click();
  await expect(page).toHaveURL(/\/blog\/qarm-fruit-sorting/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Sub-micrometer IK');
  await expect(page.locator('time').first()).toHaveAttribute('datetime', /2026-07-27/);
});

test('blog index lists the Fred-Factory post and navigates to it with a hero image', async ({ page }) => {
  await page.goto('/blog');
  const postLink = page.getByRole('link', { name: /fixture-driven assembly cell/i });
  await expect(postLink).toBeVisible();
  await postLink.click();
  await expect(page).toHaveURL(/\/blog\/fred-factory-station-design/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('fixture-driven assembly cell');
  await expect(page.locator('article > figure').first().locator('img')).toBeVisible();
});

test('blog index lists the Argos post and navigates to it with a hero image', async ({ page }) => {
  await page.goto('/blog');
  const postLink = page.getByRole('link', { name: /Reverse-engineering a US\$25,000/i });
  await expect(postLink).toBeVisible();
  await postLink.click();
  await expect(page).toHaveURL(/\/blog\/argos-can-reverse-engineering/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Reverse-engineering');
  await expect(page.locator('article > figure').first().locator('img')).toBeVisible();
});
