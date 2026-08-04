import { expect, test } from '@playwright/test';

test('projects with images render a framed thumbnail; projects without stay text-only', async ({ page }) => {
  await page.goto('/projects');
  const qarmCard = page.getByRole('article').filter({ hasText: 'Autonomous Fruit Sorting' });
  await expect(qarmCard.locator('figure img')).toBeVisible();
  const fredCard = page.getByRole('article').filter({ hasText: 'Automated Manufacturing Station' });
  await expect(fredCard.locator('figure img')).toBeVisible();
  const robodkCard = page.getByRole('article').filter({ hasText: 'RoboDK Factory-in-a-Box' });
  await expect(robodkCard.locator('figure img')).toBeVisible();
  const latticeCard = page.getByRole('article').filter({ hasText: 'State-Lattice Motion Planning' });
  await expect(latticeCard.locator('figure img')).toBeVisible();
  const mooseCard = page.getByRole('article').filter({ hasText: 'Autonomous Navigation for an All-Terrain Robot' });
  await expect(mooseCard.locator('figure img')).toBeVisible();
  const boraCard = page.getByRole('article').filter({ hasText: 'Hotel PMS/CRM in Production' });
  await expect(boraCard.locator('figure')).toHaveCount(0);
});
