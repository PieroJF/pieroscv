# Photo Integration (Blog + Projects) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add real images from Piero's public GitHub repos to the blog (existing QArm post + new Fred-Factory post) and to `/projects` cards, via a single reusable `Figure` component, without touching the home hero.

**Architecture:** Images are copied into `src/assets/projects/<slug>/` and imported as ES modules so `astro:assets` optimizes them at build time (no runtime GitHub dependency). A new `Figure.astro` component (hairline border + optional tabular caption) renders every image — blog hero, inline blog figures, and project-card thumbnails all reuse it. `@astrojs/mdx` is added so blog posts can embed `<Figure>` inline; the blog content schema gains optional `heroImage`/`heroImageAlt` fields. `ProjectCard.astro` grows a row layout (image left, text right) that only activates when a project has an `image` field — projects without one keep today's exact markup.

**Tech Stack:** Astro 7.1.4 (static output), `@astrojs/mdx` (new), Tailwind v4, `astro:assets`/`astro:content`, Playwright (E2E + visual regression + axe), Vitest.

## Global Constraints

- Home (`/`) hero stays typographic, no photo — do not touch `src/pages/index.astro`.
- No images from `AAAAA-Thesis` (private repo) — IP review still pending.
- No animated GIFs — static PNG only, for the performance budget.
- Every image is copied into the repo under `src/assets/projects/<slug>/` — never reference `raw.githubusercontent.com` or any GitHub URL at runtime.
- Every `<Image>`/`<Figure>` usage must have a specific, accurate `alt` — no generic "image of X".
- TypeScript strict mode (`astro/tsconfigs/strict`) — all new props/types must be explicit, no `any`.
- WCAG 2.2 AA — `tests/e2e/a11y.spec.ts` must stay green (zero violations) on every path it covers, including new ones added by this plan.
- Visual regression baselines (`tests/e2e/visual.spec.ts-snapshots/*-linux.png`) must be regenerated for any page whose rendered output changes, and committed alongside the code that changed it. Only `-linux.png` files are ours to regenerate from this environment (Linux) — leave `-win32.png` files untouched.
- `prefers-reduced-motion` handling in `src/styles/global.css` is unaffected — this plan adds no new animation.
- Always run `npx playwright test` with an explicit `--workers=1` flag when executing this plan. The dev/build machine this plan was written and executed on is memory-constrained (swap nearly full); the default 4 parallel workers caused flaky 30s timeouts on page loads that were confirmed to disappear entirely (15/15 passing in ~12s) with a single worker. This is a CLI-flag override for local execution only — it does not require changing the committed `workers: 4` in `playwright.config.ts`, which is fine for CI's dedicated runners.

---

### Task 1: MDX pipeline foundation

**Files:**
- Modify: `package.json` (add `@astrojs/mdx` dependency — via `npm install`, do not hand-edit)
- Modify: `astro.config.mjs`
- Modify: `src/content.config.ts`
- Rename: `src/content/blog/qarm-fruit-sorting.md` → `src/content/blog/qarm-fruit-sorting.mdx` (content unchanged in this task)

**Interfaces:**
- Produces: blog collection now loads `.md` and `.mdx` files from `src/content/blog/`; MDX integration active so later tasks can use Astro components inside post bodies.

- [ ] **Step 1: Install `@astrojs/mdx`**

Run: `npm install @astrojs/mdx@^7.0.5`

- [ ] **Step 2: Register the integration**

Edit `astro.config.mjs`:

```js
// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://pieroscv.com',
  integrations: [sitemap(), mdx()],
  vite: { plugins: [tailwindcss()] },
});
```

- [ ] **Step 3: Rename the existing post (no content change yet)**

Run: `git mv src/content/blog/qarm-fruit-sorting.md src/content/blog/qarm-fruit-sorting.mdx`

- [ ] **Step 4: Update the collection loader glob pattern**

Edit `src/content.config.ts` — change only the `pattern` value:

```ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { blog };
```

- [ ] **Step 5: Verify the build and existing suite still pass**

Run: `npm run build`
Expected: build succeeds, 6 pages generated (same as before — MDX output is unchanged since content didn't change).

Run: `npm run test:unit`
Expected: PASS (unaffected).

Run: `npx playwright test --grep "blog|a11y|smoke"`
Expected: PASS — `blog.spec.ts`'s existing assertions (post URL, H1 text, datetime) still hold since the rename doesn't change the content collection `id` or frontmatter.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json astro.config.mjs src/content.config.ts
git add src/content/blog/qarm-fruit-sorting.mdx
git rm src/content/blog/qarm-fruit-sorting.md 2>/dev/null || true
git commit -m "feat: add MDX support for blog content"
```

---

### Task 2: `Figure` component + inline figures in the QArm post

**Files:**
- Create: `src/assets/projects/qarm/trajectory-3d.png`
- Create: `src/assets/projects/qarm/joint-angles.png`
- Create: `src/components/Figure.astro`
- Modify: `src/content/blog/qarm-fruit-sorting.mdx`
- Create: `tests/e2e/blog-figures.spec.ts`
- Modify: `tests/e2e/visual.spec.ts` (add a `qarm-post` entry to the `pages` array — the existing suite only screenshots the `/blog` index, never an individual post page, so without this the new figures would have zero visual-regression coverage)
- Create: `tests/e2e/visual.spec.ts-snapshots/qarm-post-*-linux.png`

**Interfaces:**
- Produces: `Figure.astro` — props `{ src: ImageMetadata; alt: string; caption?: string; number?: string; eager?: boolean; class?: string }`. Renders `<figure class="border border-(--color-hairline) p-2 {class}">` containing an `astro:assets` `<Image>` (`loading="lazy"` unless `eager`, in which case `loading="eager" fetchpriority="high"`) and, only when `caption` is passed, a `<figcaption>` reading `Fig. {number} — {caption}` (the `Fig. {number} — ` prefix is omitted if `number` is not passed).
- Consumes (Task 1): MDX pipeline active, so `.mdx` posts can `import Figure from '../../components/Figure.astro'` and embed it in prose.

- [ ] **Step 1: Download the two source images**

Run:
```bash
mkdir -p src/assets/projects/qarm
gh api "repos/PieroJF/Robot-qarm-ruit-sorting/contents/figures/trajectory_3D.png" --jq '.content' | base64 -d > src/assets/projects/qarm/trajectory-3d.png
gh api "repos/PieroJF/Robot-qarm-ruit-sorting/contents/figures/joint_angles_time.png" --jq '.content' | base64 -d > src/assets/projects/qarm/joint-angles.png
```

- [ ] **Step 2: Write the failing E2E test**

Create `tests/e2e/blog-figures.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test('QArm post shows two inline figures with specific alt text', async ({ page }) => {
  await page.goto('/blog/qarm-fruit-sorting');
  const figures = page.locator('article figure');
  await expect(figures).toHaveCount(2);
  await expect(page.getByAltText(/end-effector trajectory/i)).toBeVisible();
  await expect(page.getByAltText(/joint angles/i)).toBeVisible();
});
```

- [ ] **Step 3: Run it to verify it fails**

Run: `npm run build && npx playwright test tests/e2e/blog-figures.spec.ts`
Expected: FAIL — 0 figures found (component and embeds don't exist yet).

- [ ] **Step 4: Create `Figure.astro`**

Create `src/components/Figure.astro`:

```astro
---
import { Image } from 'astro:assets';
import type { ImageMetadata } from 'astro:assets';

interface Props {
  src: ImageMetadata;
  alt: string;
  caption?: string;
  number?: string;
  eager?: boolean;
  class?: string;
}
const { src, alt, caption, number, eager = false, class: className } = Astro.props;
---
<figure class:list={['border border-(--color-hairline) p-2', className]}>
  <Image
    src={src}
    alt={alt}
    loading={eager ? 'eager' : 'lazy'}
    fetchpriority={eager ? 'high' : undefined}
    class="h-auto w-full"
  />
  {caption && (
    <figcaption class="mt-2 tabular text-xs text-(--color-muted)">
      {number && <>Fig. {number} — </>}{caption}
    </figcaption>
  )}
</figure>
```

- [ ] **Step 5: Embed the two figures in the post**

Edit `src/content/blog/qarm-fruit-sorting.mdx` — add an import line right after the frontmatter closing `---`, and insert the two `<Figure>` embeds at the end of the "Why Newton-Raphson anyway" section and inside "The rest of the pipeline" section respectively. Full resulting file:

```mdx
---
title: "Sub-micrometer IK on a 4-DOF arm: analytical solutions + Newton-Raphson"
description: "How our team's QArm fruit-sorting robot solves inverse kinematics to 0.0002 mm round-trip error, and why we refined closed-form solutions numerically."
pubDate: 2026-07-27
tags: ["robotics", "kinematics", "python"]
---
import Figure from '../../components/Figure.astro';
import trajectoryImg from '../../assets/projects/qarm/trajectory-3d.png';
import jointAnglesImg from '../../assets/projects/qarm/joint-angles.png';

For our Applied Robotics module at the University of Birmingham, a team of four of us
built an autonomous fruit-sorting system on a Quanser QArm: a 4-DOF manipulator with an
Intel RealSense D415 RGB-D camera, sorting 14 fruits into 3 baskets in both autonomous
and teleoperated modes. My focus here is the part I find most interesting: the inverse
kinematics.

## Why analytical first

A 4-DOF arm admits closed-form IK. For a target pose, the geometry yields up to **four
candidate solution branches** (elbow-up/down × shoulder configurations). Closed-form
solutions are exact in theory and fast in practice — no iteration, no local minima. So we
derived the analytical solution from the DH parameters and selected among branches with a
joint-limit-aware rule: discard branches violating limits, then prefer the one closest to
the current configuration to avoid large reconfigurations mid-task.

## Why Newton-Raphson anyway

Real solvers accumulate floating-point error, and the analytical derivation assumes ideal
geometry. We added a Newton-Raphson refinement stage on top of the closed-form seed:
iterate on the pose error with the manipulator Jacobian until convergence. Because the
seed is already near-exact, refinement converges in very few iterations.

The result: **maximum round-trip error of 0.0002 mm** — solve IK for a pose, run forward
kinematics on the joint solution, measure the difference. For a fruit-sorting task this is
overkill by orders of magnitude, which is exactly what you want from the layer you never
want to debug again.

<Figure
  src={trajectoryImg}
  alt="3D plot of the QArm end-effector trajectory during a sorting cycle, showing pick-and-place paths to three color-coded fruit baskets."
  number="01"
  caption="End-effector trajectory for a full sorting cycle — the analytical IK seed refined by Newton-Raphson, run through forward kinematics to measure round-trip error."
  class="my-8"
/>

## The rest of the pipeline

The IK sits inside a 13-state finite-state machine (INIT → SCAN → APPROACH → PICK →
BASKET → PLACE, plus recovery states) with cubic rest-to-rest spline trajectories and
Z-height safeguards against table collisions. Perception is HSV color plus circularity
shape classification in OpenCV, back-projected to 3D with the D415 depth stream
(1280×720 @ 30 fps). Hand-eye calibration uses the closed-form Umeyama SVD method, and a
MATLAB/Simulink facade wraps the Python algorithms for an auditable control layer on the
Quanser HIL stack.

<Figure
  src={jointAnglesImg}
  alt="Four stacked line charts of the QArm's four joint angles over a 70-second sorting cycle, showing the repeated scan-approach-pick-place pattern."
  number="02"
  caption="Joint angles φ₁–φ₄ over a 70 s cycle: the repeated scan → approach → pick → basket → place pattern from the FSM."
  class="my-8"
/>

Code: [github.com/PieroJF/Robot-qarm-ruit-sorting](https://github.com/PieroJF/Robot-qarm-ruit-sorting).
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `npm run build && npx playwright test tests/e2e/blog-figures.spec.ts`
Expected: PASS.

- [ ] **Step 7: Run the full existing suite to check for regressions**

Run: `npx playwright test --grep "blog|a11y|smoke"`
Expected: PASS. Note: because Playwright's `--grep` matches anywhere in the test title, this also runs the 4 existing `visual: blog @ ...` tests (their titles contain the substring "blog") — that's fine, they still pass since the `/blog` index page itself hasn't changed.

- [ ] **Step 8: Add visual-regression coverage for the post page**

The existing `tests/e2e/visual.spec.ts` only screenshots the `/blog` index — no individual post page has ever had visual coverage. Without this step, the two new figures would ship with zero visual-regression protection. Edit `tests/e2e/visual.spec.ts`, adding one entry to the `pages` array (right after `blog`):

```ts
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
```

- [ ] **Step 9: Regenerate the affected visual baselines**

Run: `npx playwright test --update-snapshots --grep "visual: (blog|qarm-post)"`
Expected: 4 brand-new `qarm-post-*-linux.png` files (mobile/tablet/laptop/desktop, showing the post with its two figures). The 4 existing `blog-*-linux.png` files are re-written but should be pixel-identical (the index page didn't change) — `git status` may show them as unchanged.

- [ ] **Step 10: Commit**

```bash
git add src/assets/projects/qarm src/components/Figure.astro
git add src/content/blog/qarm-fruit-sorting.mdx tests/e2e/blog-figures.spec.ts
git add tests/e2e/visual.spec.ts
git add tests/e2e/visual.spec.ts-snapshots/qarm-post-*-linux.png
git add tests/e2e/visual.spec.ts-snapshots/blog-*-linux.png
git commit -m "feat: add inline figures to the QArm blog post"
```

---

### Task 3: New Fred-Factory blog post (station design + digital twin)

**Files:**
- Create: `src/assets/projects/fred-factory/station-photo.png`
- Create: `src/assets/projects/fred-factory/station-3d.png`
- Create: `src/assets/projects/fred-factory/gripper-cad.png`
- Modify: `src/content.config.ts` (add `heroImage`/`heroImageAlt` to the blog schema)
- Modify: `src/layouts/BlogPost.astro` (render the hero image when present)
- Modify: `src/pages/blog/[slug].astro` (pass `heroImage`/`heroImageAlt` through)
- Create: `src/content/blog/fred-factory-station-design.mdx`
- Modify: `tests/e2e/blog.spec.ts` (add a test for the new post)
- Modify: `tests/e2e/a11y.spec.ts` (add the new post's path)
- Modify: `tests/e2e/visual.spec.ts` (add a `fred-post` entry to the `pages` array, same reason as Task 2's `qarm-post` entry)
- Modify: `tests/e2e/visual.spec.ts-snapshots/blog-*-linux.png` (regenerated — the index page listing changes, now shows 2 posts)
- Create: `tests/e2e/visual.spec.ts-snapshots/fred-post-*-linux.png`

**Interfaces:**
- Consumes (Task 2): `Figure` component (`src/components/Figure.astro`).
- Produces: `BlogPost` gains optional props `heroImage?: ImageMetadata`, `heroImageAlt?: string`. Any future post can set `heroImage: <relative-path-string>` + `heroImageAlt: <string>` in its frontmatter to get a framed hero image rendered above the prose.

- [ ] **Step 1: Download the three source images**

Run:
```bash
mkdir -p src/assets/projects/fred-factory
gh api "repos/PieroJF/Fred-Factory-xArm-robot-assembly-line/contents/docs/images/station-photo.png" --jq '.content' | base64 -d > src/assets/projects/fred-factory/station-photo.png
gh api "repos/PieroJF/Fred-Factory-xArm-robot-assembly-line/contents/docs/images/station-3d.png" --jq '.content' | base64 -d > src/assets/projects/fred-factory/station-3d.png
gh api "repos/PieroJF/Fred-Factory-xArm-robot-assembly-line/contents/docs/images/gripper-cad.png" --jq '.content' | base64 -d > src/assets/projects/fred-factory/gripper-cad.png
```

- [ ] **Step 2: Extend the blog schema with an optional hero image**

Edit `src/content.config.ts`:

```ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      tags: z.array(z.string()).default([]),
      heroImage: image().optional(),
      heroImageAlt: z.string().optional(),
    }),
});

export const collections = { blog };
```

- [ ] **Step 3: Write the failing E2E test for the new post**

Add to `tests/e2e/blog.spec.ts`:

```ts
test('blog index lists the Fred-Factory post and navigates to it with a hero image', async ({ page }) => {
  await page.goto('/blog');
  const postLink = page.getByRole('link', { name: /fixture-driven assembly cell/i });
  await expect(postLink).toBeVisible();
  await postLink.click();
  await expect(page).toHaveURL(/\/blog\/fred-factory-station-design/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('fixture-driven assembly cell');
  await expect(page.locator('article > figure').first().locator('img')).toBeVisible();
});
```

- [ ] **Step 4: Run it to verify it fails**

Run: `npm run build && npx playwright test tests/e2e/blog.spec.ts`
Expected: FAIL — no post with that title exists yet.

- [ ] **Step 5: Wire the hero image into `BlogPost.astro`**

Edit `src/layouts/BlogPost.astro`:

```astro
---
import Base from './Base.astro';
import Figure from '../components/Figure.astro';
import { formatDate } from '../lib/format';
import type { ImageMetadata } from 'astro:assets';

interface Props {
  title: string;
  description: string;
  pubDate: Date;
  tags: string[];
  heroImage?: ImageMetadata;
  heroImageAlt?: string;
}
const { title, description, pubDate, tags, heroImage, heroImageAlt } = Astro.props;
---
<Base title={`${title} — Piero Flores`} description={description}>
  <article class="mx-auto max-w-3xl pt-16">
    <p class="flex items-center gap-2 tabular text-sm text-(--color-ink)">
      <span aria-hidden="true" class="h-2 w-2 shrink-0 bg-(--color-accent)"></span>
      <time datetime={pubDate.toISOString()}>{formatDate(pubDate)}</time>
      {tags.length > 0 && <span class="text-(--color-muted)"> · {tags.join(' · ')}</span>}
    </p>
    <h1 class="mt-3 font-(family-name:--font-display) text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
    {heroImage && (
      <Figure src={heroImage} alt={heroImageAlt ?? title} eager class="mt-8" />
    )}
    <div class="prose-custom mt-8">
      <slot />
    </div>
    <p class="mt-12 text-sm"><a class="text-(--color-ink) underline decoration-(--color-accent) underline-offset-2 transition-colors hover:text-(--color-accent)" href="/blog">← All posts</a></p>
  </article>
</Base>
```

- [ ] **Step 6: Pass the hero props through the slug page**

Edit `src/pages/blog/[slug].astro`:

```astro
---
import { getCollection, render } from 'astro:content';
import BlogPost from '../../layouts/BlogPost.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
}

const { post } = Astro.props;
const { Content } = await render(post);
---
<BlogPost
  title={post.data.title}
  description={post.data.description}
  pubDate={post.data.pubDate}
  tags={post.data.tags}
  heroImage={post.data.heroImage}
  heroImageAlt={post.data.heroImageAlt}
>
  <Content />
</BlogPost>
```

- [ ] **Step 7: Draft the post — present to the user for technical review before proceeding**

Create `src/content/blog/fred-factory-station-design.mdx` with the content below, then **stop and show the user the drafted post for accuracy review before running Step 8** (per the approved design spec, decision #26 — Claude drafts, the user reviews before it's considered final):

```mdx
---
title: "Gripper, fixtures and a digital twin: designing a fixture-driven assembly cell"
description: "How a team of four designed a custom pneumatic gripper, four purpose-built fixtures and a Siemens Plant Simulation digital twin for a semi-autonomous FrED assembly station, hitting 41 units/hour and 81.45% value-added."
pubDate: 2026-07-31
tags: ["mechatronics", "manufacturing", "digital-twin"]
heroImage: ../../assets/projects/fred-factory/station-photo.png
heroImageAlt: "FrED Factory Station 1: a white UFACTORY xArm 6 cobot with a Datalogic vision gripper over a conveyor, HMI panel and PLC-driven fixtures on a lab bench."
---
import Figure from '../../components/Figure.astro';
import station3dImg from '../../assets/projects/fred-factory/station-3d.png';
import gripperCadImg from '../../assets/projects/fred-factory/gripper-cad.png';

For our Manufacturing Automation module at Tecnológico de Monterrey, in partnership with
MIT, a team of four of us built Station 1 of the FrED Factory: a semi-autonomous cell that
assembles the structural base of MIT's FrED (Fiber Extrusion Device) — three aluminium
profiles, an MDF base plate and six PLA holders with TPU swivel locks — using a UFACTORY
xArm 6, a Datalogic vision system and a Siemens PLC/HMI. The brief was to beat a
manual-assembly baseline on cost and cycle time. My focus here is the mechanical side: the
custom gripper, the fixtures that make robot teach-points repeatable, and the digital twin
we used to validate the design.

<Figure
  src={station3dImg}
  alt="CAD isometric render of the FrED Factory Station 1 layout: xArm 6, conveyor, HMI stand and emergency stop."
  number="01"
  caption="Station 1 layout — xArm 6, conveyor, HMI stand and E-stop, modeled before the physical build."
  class="my-8"
/>

## A gripper that took several iterations to get right

The xArm doesn't ship with an end-effector for this job, so we designed one from scratch:
a pneumatic jaw with three grip levels — a wider upper section for the MDF plate, a lower
section for the PLA holders and swivels, and a third level so the same jaw handles both
without re-tooling. It sounds simple on paper; getting there wasn't. Air leaks, sealing
problems and insufficient grip force forced several redesigns before it held parts
reliably through a full cycle.

<Figure
  src={gripperCadImg}
  alt="CAD isometric render of the custom three-level pneumatic gripper jaw."
  number="02"
  caption="The custom three-level pneumatic jaw: wide section for the MDF plate, narrow section for holders and swivels."
  class="my-8"
/>

## Fixtures: the unglamorous part that makes teach-points work

A taught robot only repeats what it was taught — if a part isn't in exactly the same pose
every time, the joint positions drift out of tolerance. We built four purpose-built
fixtures: a holder fixture that presents the six PLA grip pieces to the robot on the
conveyor, a 3D-printed T-lock system joining holders to profiles, a base fixture that
locates the profile skeleton during assembly, and a profile storage unit sized and placed
to minimize robot travel.

## Measured cycle times

We instrumented every phase. Skeleton assembly (three profiles + MDF plate) ran 125.9 s;
placing and locking the six holders ran 118.7 s; the full cycle including operator wait
states came to 503.3 s — inside the 2-minute-per-station target the line set for each of
its stations. Final inspection is vision-driven: on the HMI's *Inspection* button, the
robot sweeps all six holder positions and hand-shakes with a Datalogic camera at each one,
which reports pass/fail back to the PLC.

## Validating the design with a digital twin

Alongside the physical build, we modeled the station in Siemens Plant Simulation to check
throughput and material flow before committing to the physical layout. The simulation
processed 245 finished units in the analyzed window at 41 units/hour, with 81.45% of a
part's time in the system spent adding value rather than waiting — evidence the layout and
fixture sequencing weren't leaving throughput on the table.

Code and full documentation (PLC ladder logic, vision system, Python control layer):
[github.com/PieroJF/Fred-Factory-xArm-robot-assembly-line](https://github.com/PieroJF/Fred-Factory-xArm-robot-assembly-line).
```

- [ ] **Step 8: After user approval, run the test to verify it passes**

Run: `npm run build && npx playwright test tests/e2e/blog.spec.ts`
Expected: PASS.

- [ ] **Step 9: Add the new post's path to the accessibility suite**

Edit `tests/e2e/a11y.spec.ts` — update the `paths` array:

```ts
const paths = ['/', '/projects', '/blog', '/blog/qarm-fruit-sorting', '/blog/fred-factory-station-design', '/cv', '/404'];
```

- [ ] **Step 10: Run the full non-visual suite**

Run: `npx playwright test --grep-invert "visual:"`
Expected: PASS.

- [ ] **Step 11: Add visual-regression coverage for the new post page**

Edit `tests/e2e/visual.spec.ts`, adding a `fred-post` entry to the `pages` array (this is the same fix applied in Task 2 for the QArm post — the suite only ever covers the `/blog` index by default, never individual post pages):

```ts
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
```

- [ ] **Step 12: Regenerate the affected visual baselines**

Run: `npx playwright test --update-snapshots --grep "visual: (blog|fred-post)"`
Expected: 4 brand-new `fred-post-*-linux.png` files (mobile/tablet/laptop/desktop, showing the post with its hero image and two inline figures). The 4 `blog-*-linux.png` files are updated too — this time they genuinely change, since the index now lists 2 posts instead of 1.

- [ ] **Step 13: Commit**

```bash
git add src/assets/projects/fred-factory src/content.config.ts
git add src/layouts/BlogPost.astro src/pages/blog/\[slug\].astro
git add src/content/blog/fred-factory-station-design.mdx
git add tests/e2e/blog.spec.ts tests/e2e/a11y.spec.ts tests/e2e/visual.spec.ts
git add tests/e2e/visual.spec.ts-snapshots/fred-post-*-linux.png
git add tests/e2e/visual.spec.ts-snapshots/blog-*-linux.png
git commit -m "feat: add Fred-Factory station design blog post"
```

---

### Task 4: Project thumbnails in `/projects` cards

**Files:**
- Create: `src/assets/projects/robodk/cad-iso.png`
- Create: `src/assets/projects/lattice/obstacle-map.png`
- Modify: `src/data/projects.ts`
- Modify: `src/components/ProjectCard.astro`
- Create: `tests/e2e/projects-images.spec.ts`
- Modify: `tests/e2e/visual.spec.ts-snapshots/projects-*-linux.png` (regenerated)

**Interfaces:**
- Consumes (Task 2): `Figure` component. Consumes (Task 2 + Task 3): the already-imported `qarm/trajectory-3d.png` and `fred-factory/station-photo.png` assets are re-imported here for card thumbnails (same source files, no re-download).
- Produces: `Project` type gains `image?: { src: ImageMetadata; alt: string }`.

- [ ] **Step 1: Download the two new source images**

Run:
```bash
mkdir -p src/assets/projects/robodk src/assets/projects/lattice
gh api "repos/PieroJF/robodk-fiab-assembly-cell/contents/media/cad_iso.png" --jq '.content' | base64 -d > src/assets/projects/robodk/cad-iso.png
gh api "repos/PieroJF/lattice-motion-planning-ros2/contents/RMPC_Assignment2_ENTREGA/report_figures/fig1_obstacle_map.png" --jq '.content' | base64 -d > src/assets/projects/lattice/obstacle-map.png
```
If the second command 404s (repo's default branch is `master`, and the contents API is branch-agnostic so this should not happen — but as a documented fallback): `curl -sL "https://raw.githubusercontent.com/PieroJF/lattice-motion-planning-ros2/master/RMPC_Assignment2_ENTREGA/report_figures/fig1_obstacle_map.png" -o src/assets/projects/lattice/obstacle-map.png`

- [ ] **Step 2: Write the failing E2E test**

Create `tests/e2e/projects-images.spec.ts`:

```ts
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
  await expect(mooseCard.locator('figure')).toHaveCount(0);
});
```

- [ ] **Step 3: Run it to verify it fails**

Run: `npm run build && npx playwright test tests/e2e/projects-images.spec.ts`
Expected: FAIL — no `figure` elements in any card yet.

- [ ] **Step 4: Add the `image` field to the `Project` type and to four entries**

Edit `src/data/projects.ts` — add the import block at the top and the `image` type field, then add `image:` to the `qarm-fruit-sorting`, `fred-factory`, `lattice-planning` and `robodk-fiab` entries only (all other entries are untouched):

```ts
import type { ImageMetadata } from 'astro:assets';
import qarmTrajectory from '../assets/projects/qarm/trajectory-3d.png';
import fredStationPhoto from '../assets/projects/fred-factory/station-photo.png';
import robodkCadIso from '../assets/projects/robodk/cad-iso.png';
import latticeObstacleMap from '../assets/projects/lattice/obstacle-map.png';

export type Project = {
  slug: string;
  title: string;
  period: string;
  role: string;
  stack: string[];
  summary: string;
  highlights: string[];
  repo: string | null;
  featured: boolean;
  note?: string;
  image?: { src: ImageMetadata; alt: string };
};
```

For `qarm-fruit-sorting`, add before the closing `},` of that entry:
```ts
    image: {
      src: qarmTrajectory,
      alt: '3D plot of the QArm end-effector trajectory during a sorting cycle, showing pick-and-place paths to three color-coded fruit baskets.',
    },
```

For `fred-factory`, add:
```ts
    image: {
      src: fredStationPhoto,
      alt: 'FrED Factory Station 1: a white UFACTORY xArm 6 cobot with a Datalogic vision gripper over a conveyor, HMI panel and PLC-driven fixtures on a lab bench.',
    },
```

For `lattice-planning`, add:
```ts
    image: {
      src: latticeObstacleMap,
      alt: '2D environment map with start and goal poses and four rectangular obstacles, used for the state-lattice path planning comparison.',
    },
```

For `robodk-fiab`, add:
```ts
    image: {
      src: robodkCadIso,
      alt: 'CAD isometric render of the RoboDK Factory-in-a-Box XY stage assembly.',
    },
```

- [ ] **Step 5: Add the row layout to `ProjectCard.astro`**

Edit `src/components/ProjectCard.astro`:

```astro
---
import type { Project } from '../data/projects';
import Figure from './Figure.astro';
interface Props { project: Project }
const { project } = Astro.props;
---
<article class="rule group pt-5">
  <div class:list={['flex flex-col gap-6', project.image && 'sm:flex-row']}>
    {project.image && (
      <Figure src={project.image.src} alt={project.image.alt} class="w-full shrink-0 sm:w-1/3" />
    )}
    <div class="min-w-0 flex-1">
      <div class="flex flex-wrap items-baseline justify-between gap-2">
        <h3 class="font-(family-name:--font-display) text-lg font-semibold tracking-tight">
          {project.repo
            ? <a class="hover:text-(--color-accent) transition-colors" href={project.repo}>{project.title}</a>
            : project.title}
        </h3>
        <span class="tabular text-sm text-(--color-muted)">{project.period}</span>
      </div>
      <p class="mt-1 text-sm text-(--color-muted)">{project.role}</p>
      <p class="mt-3 max-w-3xl leading-relaxed">{project.summary}</p>
      {project.highlights.length > 0 && (
        <ul class="mt-3 max-w-3xl space-y-2 text-sm leading-relaxed">
          {project.highlights.map((h) => (
            <li class="flex gap-3"><span aria-hidden="true" class="mt-2 h-px w-4 shrink-0 bg-(--color-accent)"></span>{h}</li>
          ))}
        </ul>
      )}
      <p class="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-(--color-muted)">
        {project.stack.map((s) => <span class="tabular">{s}</span>)}
        {project.note && <span class="italic">{project.note}</span>}
      </p>
    </div>
  </div>
</article>
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `npm run build && npx playwright test tests/e2e/projects-images.spec.ts`
Expected: PASS.

- [ ] **Step 7: Run the full non-visual suite**

Run: `npx playwright test --grep-invert "visual:"`
Expected: PASS (includes the existing `smoke.spec.ts` "home loads with hero and featured projects" — unaffected since home isn't touched).

- [ ] **Step 8: Regenerate the projects page's visual baselines**

Run: `npx playwright test --update-snapshots --grep "visual: projects"`
Expected: updated `projects-*-linux.png`.

- [ ] **Step 9: Commit**

```bash
git add src/assets/projects/robodk src/assets/projects/lattice
git add src/data/projects.ts src/components/ProjectCard.astro
git add tests/e2e/projects-images.spec.ts
git add tests/e2e/visual.spec.ts-snapshots/projects-*-linux.png
git commit -m "feat: add project thumbnails to /projects cards"
```

---

### Task 5: Full regression sweep

**Files:** none expected — verification only. If any step below fails, fix inline in the relevant file and commit as a `fix:` before moving on.

- [ ] **Step 1: Full build**

Run: `npm run build`
Expected: succeeds, now 7 pages (added `/blog/fred-factory-station-design`).

- [ ] **Step 2: Full unit suite**

Run: `npm run test:unit`
Expected: PASS (unchanged — no new pure-function utilities were added by this plan).

- [ ] **Step 3: Full Playwright suite, including visual and axe**

Run: `npx playwright test`
Expected: PASS — every test in `smoke.spec.ts`, `blog.spec.ts`, `blog-figures.spec.ts`, `projects-images.spec.ts`, `a11y.spec.ts`, `cv.spec.ts`, and `visual.spec.ts` green.

- [ ] **Step 4: Manual visual check of the two new-content pages**

Run: `npm run preview` and open `http://localhost:4321/projects` and `http://localhost:4321/blog/fred-factory-station-design` in a browser at 375px, 768px, 1440px widths. Confirm: no layout overflow, captions readable, images not upscaled/blurry, focus outline visible when tabbing through card links.

- [ ] **Step 5: Push**

Run: `git push origin main`

---

### Task 6: Deploy to production

**Files:** none — this task ships what Tasks 1–5 already committed.

- [ ] **Step 1: Build**

Run: `npm run build`

- [ ] **Step 2: Deploy via the universal Workers token**

Run:
```bash
export CLOUDFLARE_API_TOKEN='<value from NOINCLUDE/deploy-credentials.md — "Workers Deploy - Universal (all zones)">'
npx wrangler deploy
```
Expected output includes both custom domains:
```
  pieroscv.com (custom domain)
  www.pieroscv.com (custom domain)
```

- [ ] **Step 3: Live verification**

Run:
```bash
curl -s -o /dev/null -w "HTTP %{http_code}\n" https://pieroscv.com/blog/fred-factory-station-design
curl -s -o /dev/null -w "HTTP %{http_code}\n" https://pieroscv.com/projects
```
Expected: both `HTTP 200`.
