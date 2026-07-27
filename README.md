# pieroscv.com

Personal CV/portfolio and technical blog of **Piero Jesus Flores Lopez** — Mechatronics & Robotics Engineer.

Live at [pieroscv.com](https://pieroscv.com).

## Stack

- [Astro](https://astro.build) — fully static output, zero JS by default
- [Tailwind CSS v4](https://tailwindcss.com) with a custom Swiss/engineering design-token system
- Blog as a Markdown content collection (`src/content/blog/`)
- Hosted on Cloudflare Workers (static assets), deployed via git-connected Workers Builds

## Development

```bash
npm install
npm run dev       # local dev server
npm run build     # static build to dist/
npm run test      # unit (Vitest) + E2E/a11y/visual (Playwright)
```

## Testing

- Unit tests: Vitest (`tests/unit/`)
- E2E, accessibility (axe, WCAG 2.2 AA) and visual regression at 4 breakpoints: Playwright (`tests/e2e/`)
- CI runs the full suite on every push and PR (GitHub Actions)

## Writing a post

Add a Markdown file to `src/content/blog/` with `title`, `description`, `pubDate` and optional `tags` frontmatter, then push. The build validates frontmatter and generates the route.
