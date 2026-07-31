import { expect, test } from '@playwright/test';

test('QArm post shows two inline figures with specific alt text', async ({ page }) => {
  await page.goto('/blog/qarm-fruit-sorting');
  const figures = page.locator('article figure');
  await expect(figures).toHaveCount(2);
  await expect(page.getByAltText(/end-effector trajectory/i)).toBeVisible();
  await expect(page.getByAltText(/joint angles/i)).toBeVisible();
});
