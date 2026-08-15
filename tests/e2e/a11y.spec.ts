import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const paths = [
  '/',
  '/projects',
  '/blog',
  '/blog/qarm-fruit-sorting',
  '/blog/fred-factory-station-design',
  '/blog/argos-can-reverse-engineering',
  '/blog/solidworks-drawing-automation',
  '/blog/lattice-planning-comparison',
  '/blog/visual-regression-shared-component',
  '/blog/qarm-camera-calibration-debugging',
  '/cv',
  '/404',
];

for (const path of paths) {
  test(`axe: no WCAG A/AA violations on ${path}`, async ({ page }) => {
    await page.goto(path === '/404' ? '/definitely-not-a-page' : path);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}
