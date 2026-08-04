import { expect, test } from '@playwright/test';

const viewports = [
  { name: 'mobile', width: 320, height: 900 },
  { name: 'tablet', width: 768, height: 900 },
  { name: 'laptop', width: 1024, height: 900 },
  { name: 'desktop', width: 1440, height: 900 },
];
const pages = [
  { name: 'home', path: '/' },
  { name: 'projects', path: '/projects' },
  { name: 'blog', path: '/blog' },
  { name: 'qarm-post', path: '/blog/qarm-fruit-sorting' },
  { name: 'fred-post', path: '/blog/fred-factory-station-design' },
  { name: 'argos-post', path: '/blog/argos-can-reverse-engineering' },
  { name: 'solidworks-post', path: '/blog/solidworks-drawing-automation' },
  { name: 'cv', path: '/cv' },
];

for (const vp of viewports) {
  for (const p of pages) {
    test(`visual: ${p.name} @ ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(p.path);
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveScreenshot(`${p.name}-${vp.name}.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.02,
      });
    });
  }
}
