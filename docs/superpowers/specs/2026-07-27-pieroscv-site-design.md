# pieroscv.com — Personal CV/Portfolio Site — Design Spec

**Fecha:** 2026-07-27
**Estado:** Aprobado en brainstorming + grilling (forging pipeline)
**Siguiente paso:** superpowers:writing-plans

## Propósito

Sitio personal de Piero Jesus Flores Lopez en `pieroscv.com`: CV/portfolio de fácil acceso
para recruiters (objetivo: graduate robotics/automation/metrology/AI roles, UK), con blog
técnico secundario. Idioma: inglés.

## Fuentes de contenido

- CV: `Piero CV July.pdf` (texto extraído; perfil, educación, skills, 4 proyectos clave,
  experiencia, idiomas).
- GitHub: github.com/PieroJF (repos públicos para /projects; READMEs como base de
  descripciones e imágenes).
- Facts verificados: `piero_project_facts.md` (números duros: 25 µm, 0.0002 mm IK,
  reglas de honestidad: A* fue de teammate, EKF sí es suyo).

## Arquitectura

- **Framework:** Astro (última estable), salida 100% estática. Content collections para
  blog (`src/content/blog/*.md`) y proyectos (`src/content/projects/*.md` o data file).
- **Estilos:** Tailwind CSS v4.
- **Hosting:** Cloudflare Workers con static assets. Dominio `pieroscv.com` (zona ya
  existente en la cuenta Cloudflare del usuario) + redirect `www` → apex.
- **Deploy:** Cloudflare Workers Builds conectado al repo GitHub `PieroJF/pieroscv`
  (público). Push a `main` = build + deploy; previews por PR. Sin tokens en GitHub.
- **Analytics:** Cloudflare Web Analytics (snippet, sin cookies).

## Páginas

1. **Home (`/`)** — hero tipográfico (sin foto): nombre, titular "Mechatronics & Robotics
   Engineer", una línea de posicionamiento; 4 proyectos destacados (cards con números
   duros); CTA a /cv y contacto.
2. **`/projects`** — todos los proyectos públicos con detalle: Tesis metrología (sin link
   a repo, "details withheld pending IP review"), QArm fruit sorting, Moose autonomous
   nav, FrED xArm station, lattice-motion-planning-ros2, robodk-fiab-assembly-cell,
   Atelier, panoptes/skills como secundarios. Bora PMS como experiencia profesional
   (sin repo, descripción).
3. **`/blog`** — índice de posts Markdown; lanza con 1 post semilla: write-up técnico del
   QArm fruit sorting (IK analítica + Newton-Raphson, adaptado del README, revisado por
   el usuario). URL propia por post.
4. **`/cv`** — CV web (secciones espejo del PDF) + botón de descarga del **July PDF
   completo tal cual** (override del usuario; se sirve el archivo íntegro desde el repo).
5. **404** — página propia con link a Home.

## Diseño visual

- **Dirección:** Swiss / precisión ingenieril, tema claro único.
- Grid estricto, jerarquía por escala tipográfica, un color acento (naranja ingenieril),
  detalles de plano técnico (líneas de cota, reglas finas, numeración de secciones).
- Tipografía: pareja display/texto (p. ej. Space Grotesk + Inter), máx. 2 familias,
  `font-display: swap`, subset + preload del peso crítico.
- WCAG 2.2 AA; `prefers-reduced-motion` respetado; motion solo compositor-friendly.
- Cumple anti-template policy (rules/web/design-quality.md): ≥4 required qualities.

## Contacto

Email (`pierojesus14@gmail.com`, mailto) + GitHub + LinkedIn. **Sin teléfono en la web**
(solo dentro del PDF). Sin formulario.

## SEO / metadatos (estándar, sin decisión abierta)

Meta títulos/descripciones por página, Open Graph + imagen OG estática diseñada,
`sitemap.xml`, `robots.txt`, canonical, JSON-LD `Person`.

## Testing (override del usuario: suite completa)

- Unit (Vitest): utilidades (formateo fechas, helpers de contenido).
- E2E (Playwright): carga de páginas, links clave, descarga del PDF, navegación blog.
- Visual regression (Playwright screenshots): breakpoints 320/768/1024/1440, baselines
  versionadas en el repo.
- Accesibilidad automatizada (axe via Playwright).
- Gate de CI: `astro build` + suite en cada PR (GitHub Actions para tests; deploy sigue
  siendo Workers Builds).

## Decision-log (grilling)

### 1 Hosting — infra
Elegido: Cloudflare Workers static assets, no VPS [recomendado]
Por qué: sitio estático; VPS Hetzner es infra de negocio; cero mantenimiento.
Abre: pipeline deploy (6), DNS (7).

### 2 Propósito — scope
Elegido: CV/portfolio primero, blog secundario [recomendado]
Por qué: objetivo inmediato = recruiters.
Abre: estructura (4), proyectos (5).

### 3 Dominio — infra
Elegido: pieroscv.com (ya propiedad del usuario) [dato del usuario]
Por qué: ya comprado.
Abre: DNS (7).

### 4 Estructura — scope
Elegido: multi-página Home + /projects + /blog + /cv [recomendado]
Por qué: URLs compartibles, blog escala sin tocar el resto.
Abre: hoja.

### 5 Proyectos destacados en Home — contenido
Elegido: Tesis + QArm + Moose + FrED [recomendado]
Por qué: alineado a graduate robotics roles, números duros.
Abre: hoja.

### 6 Deploy — rollout
Elegido: Cloudflare Workers Builds git-connected [recomendado]
Por qué: cero secrets, previews por PR.
Abre: hoja.

### 7 DNS — infra
Elegido: zona ya en Cloudflare; solo custom domain al Worker [dato del usuario]
Por qué: sin migración.
Abre: hoja.

### 8 Idioma y flujo blog — contenido
Elegido: inglés, Markdown en repo [recomendado]
Por qué: audiencia UK; push = publicado.
Abre: post semilla (10).

### 9 Enfoque técnico — arquitectura
Elegido: Astro + Tailwind v4 estático [recomendado]
Por qué: stack por defecto del usuario; cero JS por defecto.
Abre: hoja.

### 10 Blog inicial — contenido
Elegido: 1 post semilla (QArm write-up) [recomendado]
Por qué: blog vacío se ve abandonado.
Abre: hoja.

### 11 CV PDF — contenido
Elegido: July PDF completo tal cual (7 págs, 1.4 MB) [override]
Por qué: decisión del usuario; cero trabajo de edición.
Abre: hoja.

### 12 Repo — infra
Elegido: público, `PieroJF/pieroscv` [recomendado]
Por qué: el sitio es pieza de portfolio.
Abre: hoja.

### 13 Analytics — observabilidad
Elegido: Cloudflare Web Analytics [recomendado]
Por qué: gratis, sin cookies, sin banner.
Abre: hoja.

### 14 Foto — diseño
Elegido: hero tipográfico sin foto [recomendado]
Por qué: Swiss + estándar UK; añadible después.
Abre: hoja.

### 15 Contacto — seguridad/privacidad
Elegido: email + GitHub + LinkedIn, sin teléfono en web [recomendado]
Por qué: teléfono público = spam scraping.
Abre: hoja.

### 16 Tema — diseño
Elegido: solo claro [recomendado]
Por qué: un tema pulido > dos a medias.
Abre: hoja.

### 17 Testing — testing
Elegido: suite completa unit + E2E + visual regression + axe [override]
Por qué: decisión del usuario (protección ante rediseños).
Abre: CI de tests en GitHub Actions (separado del deploy).

### 18 Dirección visual — diseño
Elegido: Swiss / precisión ingenieril, claro [recomendado]
Por qué: comunica marca de metrología/precisión.
Abre: hoja.

### 19 Fuente de datos de proyectos — datos
Elegido: content collection estática en repo [⚠ supuesto: convención]
Por qué: sin dependencia runtime de GitHub API; contenido curado con honestidad
(reglas del facts file).
Abre: hoja.

### 20 Package manager / tooling menor — arquitectura
Elegido: npm, Node LTS [⚠ supuesto]
Por qué: default de Workers Builds, cero config.
Abre: hoja.

## No-goals

- Sin CMS, sin base de datos, sin formulario de contacto, sin dark mode, sin i18n ES,
  sin generación automática de PDF, sin foto.
- Sin claims fuera de `piero_project_facts.md` (A* no es suyo; EKF sí).
