# pieroscv.com — Integración de imágenes (blog + projects) — Design Spec

**Fecha:** 2026-07-28
**Estado:** Aprobado en brainstorming (forging pipeline)
**Extiende:** `docs/superpowers/specs/2026-07-27-pieroscv-site-design.md` — no reabre
decisiones ya cerradas ahí. El home hero sigue tipográfico sin foto (decisión #14 y
no-goal "sin foto" de ese spec siguen vigentes; este documento es aditivo).
**Siguiente paso:** superpowers:writing-plans

## Propósito

Hacer el CV/portfolio más interactivo y fácil de digerir incorporando imágenes reales
de los repos públicos de GitHub del usuario (PieroJF) en el blog y en `/projects`, sin
romper la identidad Swiss tipográfica ya aprobada (papel crema, un solo acento naranja,
detalles de plano técnico).

## Alcance

- **Páginas afectadas:** `/blog` (post existente QArm + 1 post nuevo Fred-Factory),
  `/projects` (cards).
- **Sin cambios:** Home (`/`) mantiene el hero tipográfico sin foto. `/cv` no cambia.

## Fuentes de imágenes (verificado contenido real de cada repo, no solo nombres de archivo)

| Repo | Material disponible | Uso |
|---|---|---|
| `Fred-Factory-xArm-robot-assembly-line` | Foto real de la estación + CAD (fixtures, station 3D) + diagramas PLC/HMI + stats Plant Simulation | Hero del post nuevo + card + 2 figuras inline |
| `Robot-qarm-ruit-sorting` | Gráficas MATLAB (fondo negro): top view, trayectoria 3D, joint angles, calibración | 2 figuras inline en el post existente + card |
| `robodk-fiab-assembly-cell` | Renders CAD (fondo oscuro) + GIFs de simulación, ya curados en su README | 1 imagen en card (sin GIFs) |
| `lattice-motion-planning-ros2` | Gráficas matplotlib (fondo claro), ya curadas en su README | 1 imagen en card |
| `Autonomous-Navigation...Moose` | Sin material visual committeado (solo mundo Webots) | Ninguna — card queda como hoy |
| `AAAAA-Thesis` (privado) | Material visual existe pero el proyecto ya está marcado "details withheld pending IP review" | Ninguna — reserva de IP se extiende a imágenes |
| Bora PMS | Privado, sin repo | Ninguna — sin cambio |

## Arquitectura / componentes nuevos

- **`Figure.astro`**: componente reutilizable — borde fino (`--color-hairline`),
  caption tabular `Fig. 0X — <descripción>` (mismo lenguaje de "líneas de cota" del
  spec original). Se usa igual sin importar si la imagen fuente tiene fondo oscuro
  (MATLAB/CAD) o claro (foto real, matplotlib) — el marco normaliza, no hay tratamiento
  diferenciado por tipo de imagen.
- **`astro:assets`**: `<Image>` para optimización build-time (responsive, formatos
  modernos). `loading="eager" fetchpriority="high"` solo en el hero de cada página con
  uno; `loading="lazy"` en el resto.
- **Almacenamiento**: imágenes copiadas a `src/assets/projects/<slug>/*.png` (no
  referencias runtime a GitHub — coherente con la decisión #19 del spec original de no
  depender de la API de GitHub en runtime).
- **`@astrojs/mdx`**: se añade para poder usar `<Figure>` dentro del cuerpo de los
  posts. Hoy los posts son `.md` plano, que no soporta componentes Astro embebidos.
  Los posts siguen siendo Markdown + frontmatter; MDX solo habilita componentes
  puntuales dentro del cuerpo.
- **Schema de `blog` collection**: se agrega `heroImage` (opcional, vía `image()` de
  `astro:content`) + `heroImageAlt` (string opcional). El post QArm no lleva
  `heroImage` (su mejor material son 2 figuras inline, no una portada); el post
  Fred-Factory sí.
- **`ProjectCard.astro`**: layout de fila — imagen a la izquierda (~30–35% ancho),
  texto a la derecha — **solo** en proyectos con imagen asignada. Los proyectos sin
  imagen (Moose, tesis, bora-pms) mantienen exactamente el layout vertical actual, sin
  lógica especial.

## Curación concreta por proyecto

| Proyecto | Imagen(es) elegidas | Excluidas y por qué |
|---|---|---|
| Fred-Factory (post nuevo + card) | `station-photo.png` (hero), `station-3d.png`, `gripper-cad.png` | `station-photo-closeup.png`: persona (pierna/pie) parcialmente visible de fondo — descartada por privacidad de terceros. `plant-simulation-stats.png`: captura cruda con chrome de la app (Tecnomatix); los números (245 u., 41 TPH, 81.45%) ya están en el texto del proyecto — no aporta proporcional al ruido visual. Diagramas PLC/HMI/vision: fuera del ángulo elegido para este post (quedan disponibles para un post futuro). |
| QArm (post existente + card) | `trajectory_3D.png`, `joint_angles_time.png` | El resto de `figures/` (chessboard, gripper_state, ee_position_time, top_view) no aporta más que estas dos para la narrativa ya escrita (IK + FSM). |
| robodk (card) | `cad_iso.png` | GIFs excluidos por presupuesto de performance — el CAD estático ya cuenta la historia. |
| lattice (card) | `fig1_obstacle_map.png` | — |
| Moose, tesis, bora-pms | Ninguna | Sin material / reserva IP / privado. |

## Post nuevo: Fred-Factory — Diseño de estación + gemelo digital

- **Ángulo** (elegido por el usuario): mecánica del workcell — BOM/fixtures, CAD,
  layout — y el gemelo digital en Plant Simulation (245 unidades, 41 TPH, 81.45%
  valor agregado). Diferenciado del post QArm (puramente control/visión).
- **Fuentes**: `README.md` + `docs/station-design.md` del repo
  `Fred-Factory-xArm-robot-assembly-line`.
- **Flujo de redacción**: Claude redacta adaptando el material ya escrito en el repo
  (mismo patrón que el post QArm), el usuario revisa por precisión técnica antes de
  publicar.
- **Imágenes**: ver tabla de curación arriba.

## Tratamiento visual

- Marco técnico unificado (`Figure.astro`) para toda imagen, sin excepción.
- Sin GIFs animados (peso/performance).
- Fotos reales: recortadas si es necesario para eliminar ruido del entorno o personas
  no relacionadas (aplica a Fred-Factory, ver exclusión de `station-photo-closeup.png`).
- Home hero: sin cambios.

## Testing

- La suite de visual regression existente (Playwright, breakpoints 320/768/1024/1440,
  baselines versionadas) se extiende con capturas de `/projects` (nuevo layout de card)
  y del post nuevo — no requiere framework nuevo, solo sumar casos.
- Accesibilidad (axe): verificar `alt` text en todas las imágenes nuevas, contraste del
  caption sobre `--color-paper`.

## Decision-log (grilling)

### 21 Alcance de páginas — scope
Elegido: Blog + /projects; home excluido (ya decidido) [recomendado]
Por qué: maximiza el impacto "CV interactivo" sin reabrir la decisión del hero.
Abre: layout de card (22).

### 22 Layout de card en /projects — diseño
Elegido: imagen al costado (fila), solo en cards con imagen [override del usuario]
Por qué: preferencia visual tipo catálogo, pese al tradeoff advertido (filas mixtas
ancho mixto en la misma lista).
Abre: hoja.

### 23 Tratamiento visual — diseño
Elegido: marco técnico unificado vía componente `Figure` [recomendado]
Por qué: normaliza fondo-negro MATLAB / foto real / CAD claro bajo un mismo lenguaje
visual sin duplicar componentes por tipo de imagen.
Abre: hoja.

### 24 Contenido nuevo — scope
Elegido: también post nuevo de Fred-Factory, además de enriquecer lo existente [override del usuario]
Por qué: Fred-Factory tiene el mejor material (única foto real de hardware) y el blog
solo tenía 1 post.
Abre: ángulo (25).

### 25 Ángulo post Fred-Factory — contenido
Elegido: diseño de estación + gemelo digital [elegido por el usuario tras ver opciones]
Por qué: mejor material visual disponible, encaja con la marca de precisión/metrología,
diferenciado de QArm.
Abre: hoja.

### 26 Redacción post Fred-Factory — proceso
Elegido: Claude redacta adaptando README + docs, usuario revisa antes de publicar
[mismo patrón que QArm, confirmado por el usuario]
Por qué: consistencia con flujo ya validado; honestidad de contenido según
`piero_project_facts.md`.
Abre: hoja.

### 27 Imágenes de la tesis (AAAAA-Thesis, privado) — privacidad/IP
Elegido: mantener reserva total, cero imágenes por ahora [recomendado]
Por qué: coherente con la nota ya aprobada "details withheld pending IP review";
aditivo después si se resuelve el review de IP.
Abre: hoja.

### 28 Fuente/almacenamiento de imágenes — arquitectura
Elegido: copiar a `src/assets/projects/<slug>/`, sin dependencia runtime de GitHub
[recomendado, consistente con decisión #19 del spec original]
Por qué: `astro:assets` optimiza en build time y requiere imports locales; evita
acoplamiento a disponibilidad/rate-limit de la API de GitHub.
Abre: hoja.

### 29 GIFs de robodk — performance
Elegido: excluir, solo estáticos PNG [recomendado]
Por qué: presupuesto de performance (`rules/web/performance.md`); el CAD estático ya
cuenta la historia sin el peso de un GIF en loop.
Abre: hoja.

### 30 Contenido inline en Markdown — arquitectura
Elegido: agregar `@astrojs/mdx` para poder usar `<Figure>` dentro del cuerpo de los
posts [⚠ supuesto técnico]
Por qué: `.md` plano no soporta componentes Astro embebidos; MDX es el camino
estándar/soportado y no cambia la autoría (sigue siendo Markdown + frontmatter).
Abre: hoja.

### 31 Curación de imágenes sensibles — privacidad/calidad
Elegido: excluir `station-photo-closeup.png` (persona parcialmente visible) y
`plant-simulation-stats.png` (screenshot con chrome de app, datos ya en texto)
[recomendado]
Por qué: privacidad de terceros no relacionados con el proyecto; calidad visual
(evitar el "screenshot dump").
Abre: hoja.

### 32 Testing — testing
Elegido: extender la suite de visual regression existente a `/projects` y al post
nuevo; sin framework nuevo [recomendado]
Por qué: la suite ya cubre los breakpoints necesarios, solo suma casos.
Abre: hoja.

## No-goals (adicionales a los del spec original, que siguen vigentes)

- Sin imágenes de la tesis/Atelier por ahora (reserva de IP).
- Sin GIFs animados.
- Sin cambios al home hero.
- Sin post sobre PLC/visión/programación del robot de Fred-Factory en este alcance
  (ángulos disponibles para un post futuro).
