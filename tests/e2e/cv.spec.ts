import { expect, test } from '@playwright/test';

test('cv page offers the pdf and the pdf is served', async ({ page, request }) => {
  await page.goto('/cv');
  const link = page.getByRole('link', { name: 'Download PDF' });
  await expect(link).toHaveAttribute('href', '/cv/Piero-Flores-CV.pdf');

  const res = await request.get('/cv/Piero-Flores-CV.pdf');
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('pdf');
  expect((await res.body()).byteLength).toBeGreaterThan(100_000);
});

test('cv page shows the four sections', async ({ page }) => {
  await page.goto('/cv');
  for (const name of ['Education', 'Technical skills', 'Experience', 'Languages & mobility']) {
    await expect(page.getByRole('heading', { name: new RegExp(name) })).toBeVisible();
  }
});
