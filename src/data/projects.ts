import type { ImageMetadata } from 'astro';
import qarmTrajectory from '../assets/projects/qarm/trajectory-3d.png';
import fredStationPhoto from '../assets/projects/fred-factory/station-photo.png';
import robodkCadIso from '../assets/projects/robodk/cad-iso.png';
import latticeObstacleMap from '../assets/projects/lattice/obstacle-map.png';
import mooseArchitecture from '../assets/projects/moose/architecture.png';

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

export const projects: Project[] = [
  {
    slug: 'atelier-metrology',
    title: 'Laser Triangulation Metrology Machine (OD/ID)',
    period: '2026',
    role: 'MSc Thesis · Individual project · University of Birmingham',
    stack: ['Python', 'SolidWorks', 'Laser profilers', 'GUM/NIST', 'Gage R&R'],
    summary:
      'Non-contact optical inspection machine measuring OD, ID, roundness and wall thickness of machined steel cylinders (bores from 127 mm, OD to 203 mm, length 610 mm) with automated pass/fail QC reporting.',
    highlights: [
      'GUM/NIST uncertainty budget targeting expanded uncertainty U(k=2) ≤ 25 µm against a 254 µm tolerance (U/T ≤ 10%), validated with Gage R&R',
      '160-item engineering BOM and 43-part CAD assembly with collision resolution; direct vendor engagement for laser profilers, encoders and linear drives',
      'Architecture aligned to a ~US$25,000 BOM for affordable deployment in machine shops',
    ],
    repo: 'https://github.com/PieroJF/Atelier-Project---Optical-metrology-3D-laser-scanning',
    featured: true,
    note: 'Full design withheld pending IP review — public foundations & uncertainty demos in the repo.',
  },
  {
    slug: 'qarm-fruit-sorting',
    title: 'Autonomous Fruit Sorting — Quanser QArm + RealSense D415',
    period: '2025–2026',
    role: 'Applied Robotics · Team of 4 · University of Birmingham — my role: camera-arm calibration, fruit-detector tuning, voice control, GUI concurrency (70/185 commits)',
    stack: ['Python 3.13', 'NumPy', 'OpenCV', 'Quanser SDK (HIL)', 'MATLAB/Simulink'],
    summary:
      'End-to-end pick-and-place on a 4-DOF QArm with an RGB-D camera, sorting 14 fruits into 3 baskets in autonomous and teleoperated modes.',
    highlights: [
      'Analytical inverse kinematics with Newton-Raphson refinement: 0.0002 mm max round-trip error across four solution branches',
      '13-state finite-state-machine controller with cubic rest-to-rest spline trajectories and Z-height collision safeguards',
      'Hand-eye calibration via closed-form Umeyama SVD; HSV + circularity classifier with pixel-to-world back-projection',
    ],
    repo: 'https://github.com/PieroJF/Robot-qarm-fruit-sorting',
    featured: true,
    image: {
      src: qarmTrajectory,
      alt: '3D plot of the QArm end-effector trajectory during a sorting cycle, showing pick-and-place paths to three color-coded fruit baskets.',
    },
  },
  {
    slug: 'moose-navigation',
    title: 'Autonomous Navigation for an All-Terrain Robot',
    period: '2025–2026',
    role: 'Team of 4 · University of Birmingham — my role: 3D mapping & EKF sensor fusion (13/18 commits)',
    stack: ['C (2,600 lines)', 'Webots', 'EKF', 'OctoMap', 'ICP'],
    summary:
      'Mapping and perception for a Clearpath Moose 8-wheel grass-cutting robot on hilly terrain with slope hazard avoidance (>20°).',
    highlights: [
      'Wrote the Extended Kalman Filter — 6-state [x, y, z, roll, pitch, yaw] fusing GPS, IMU and compass — for drift-free localization on slopes (RMSE 4 mm)',
      'OctoMap probabilistic occupancy (depth 12) with dynamic recentring, plus a 200×200 elevation grid (86.6% coverage) with slope/roughness traversability costs',
      "LiDAR pipeline: range filtering (0.3–50 m), voxel downsampling (0.1 m), ICP scan matching over 4,735+ frames (800K+ points); integrated with the team's A* planner",
    ],
    repo: 'https://github.com/PieroJF/Autonomous-Navigation-and-3D-Mapping-for-Grass-Cutting-Robots-on-Inclined-Terrains',
    featured: true,
    image: {
      src: mooseArchitecture,
      alt: 'System architecture map of the Moose navigation stack: four color-coded workstreams (robot setup, EKF fusion, 3D mapping, slope-aware navigation) with labeled data handoffs between subtasks.',
    },
  },
  {
    slug: 'fred-factory',
    title: 'Automated Manufacturing Station — xArm 6 (with MIT)',
    period: '2023',
    role: 'Team of 4 · Tecnológico de Monterrey in partnership with MIT',
    stack: ['Python', 'xArm SDK', 'Siemens TIA Portal', 'Datalogic vision', 'Plant Simulation'],
    summary:
      'Semi-autonomous assembly station for MIT’s FrED device: cobot pick-and-place, PLC coordination, machine vision QC and a digital twin.',
    highlights: [
      'Siemens PLC (7 Ladder Logic networks): conveyor control, photoelectric sensors, robot–PLC bidirectional signaling, HMI status',
      'Datalogic machine vision over a TCP/IP vision link for real-time coordinate transfer and camera-to-gripper offset compensation',
      '125.9 s measured phase cycle on real hardware (target ≤2 min)',
      'Digital twin in Siemens Plant Simulation: 245 units, 41 TPH, 81.45% value-added; meets the ≤2 min/station target',
    ],
    repo: 'https://github.com/PieroJF/Fred-Factory-xArm-robot-assembly-line',
    featured: true,
    image: {
      src: fredStationPhoto,
      alt: 'FrED Factory Station 1: a white UFACTORY xArm 6 cobot with a Datalogic vision gripper over a conveyor, HMI panel and PLC-driven fixtures on a lab bench.',
    },
  },
  {
    slug: 'lattice-planning',
    title: 'State-Lattice Motion Planning (ROS 2)',
    period: '2026',
    role: 'Individual project',
    stack: ['Python', 'ROS 2', 'A*', 'RRT', 'PRM'],
    summary:
      'State-lattice A* vs RRT vs PRM path planning with time-optimal trapezoidal trajectory generation for a TurtleBot3-class diff-drive robot.',
    highlights: [],
    repo: 'https://github.com/PieroJF/lattice-motion-planning-ros2',
    featured: false,
    image: {
      src: latticeObstacleMap,
      alt: '2D environment map with start and goal poses and four rectangular obstacles, used for the state-lattice path planning comparison.',
    },
  },
  {
    slug: 'robodk-fiab',
    title: 'RoboDK Factory-in-a-Box Assembly Cell',
    period: '2026',
    role: 'Individual project',
    stack: ['Python', 'RoboDK API', 'ABB GoFa'],
    summary:
      '4× ABB GoFa cobot cell assembling a custom XY stage — simulation-as-code with the RoboDK Python API.',
    highlights: [
      'Custom binary parser recovered 146 station items and 131 bit-exact poses (max element error 0.0) from the graded .rdk binary, cross-checked against the RoboDK API',
      '66 taught targets organized by task frame across the four arms',
    ],
    repo: 'https://github.com/PieroJF/fiab-assembly-cell-original',
    featured: false,
    image: {
      src: robodkCadIso,
      alt: 'CAD isometric render of the RoboDK Factory-in-a-Box XY stage assembly.',
    },
  },
  {
    slug: 'bora-pms',
    title: 'Hotel PMS/CRM in Production',
    period: '2025–present',
    role: 'Sole engineer · Bora Hotel Iquitos, Peru',
    stack: ['PHP 8.3', 'MySQL', 'JavaScript', 'WhatsApp Cloud API', 'Cloudflare', 'Linux'],
    summary:
      'Custom PMS/CRM running the hotel’s daily operation: reservations, multi-currency billing, finance, payroll and guest messaging. ~160k lines of code, 75 domain models, 60+ versioned migrations with zero data loss.',
    highlights: [
      'Integrations: WhatsApp Cloud API two-way inbox, OpenPay payments with automatic reconciliation, receipt OCR, regulatory reports',
      '28 scheduled automations; TOTP 2FA, Cloudflare Zero Trust, full audit logging, role-based access control',
    ],
    repo: null,
    featured: false,
    note: 'Private production system.',
  },
  {
    slug: 'hotel-saas',
    title: 'Recepcion.app — Multi-Tenant Hotel PMS SaaS',
    period: '2026–present',
    role: 'Sole engineer · SaaS product',
    stack: ['PHP 8.3', 'Laravel 12', 'Livewire 3', 'PostgreSQL 16', 'Redis', 'Docker'],
    summary:
      'Multi-tenant Laravel PMS deployed on production infrastructure: database-per-tenant isolation, per-tenant encrypted guest PII with blind-index search, electronic invoicing and regulatory reporting for small hotels.',
    highlights: [
      '1,927 commits in 119 days — 48% of the PHP codebase is test code',
      '1,472 tests green on the last documented full run; 205 versioned migrations',
    ],
    repo: null,
    featured: false,
    note: 'Private production system.',
  },
  {
    slug: 'hotel-ai-chatbot',
    title: 'AI Hotel Operations Chatbot',
    period: '2026–present',
    role: 'Sole engineer · Internal operations copilot',
    stack: ['PHP 8.3', 'Laravel 11', 'PostgreSQL 16 + pgvector', 'Redis', 'Anthropic API', 'VoyageAI'],
    summary:
      'AI copilot microservice for hotel staff in production: answers over internal documentation via hybrid RAG and acts on the live PMS through signed, schema-validated tools.',
    highlights: [
      'Hybrid RAG retrieval: pgvector (HNSW) + Spanish full-text search, fused with Reciprocal Rank Fusion',
      '16 PMS tools with human-in-the-loop confirmation for writes; hand-written Anthropic and Voyage API clients — 0 AI SDKs in composer.json',
      'Prompt-injection defenses (fenced retrieved context, schema-validated tool inputs) and per-tenant daily cost budgets against denial-of-wallet',
    ],
    repo: null,
    featured: false,
    note: 'Private production system.',
  },
  {
    slug: 'atenas-erp',
    title: 'Atenas — Cloud ERP/POS',
    period: '2026',
    role: 'Sole engineer · Retail client project',
    stack: ['PHP', 'Laravel', 'PostgreSQL', 'Redis', 'Playwright', 'Docker'],
    summary:
      'Cloud ERP/POS for a retail SME client, built phase-by-phase: barcode inventory, tiered retail/wholesale pricing, point of sale and queued electronic invoicing.',
    highlights: [
      'Test-to-application code ratio of 1.7:1 with an 80% coverage gate enforced in CI',
      'Scripted operations: one-command deploy with rollback and encrypted backups with verified restores',
    ],
    repo: null,
    featured: false,
    note: 'Private client project.',
  },
];

export const oss: Project[] = [
  {
    slug: 'dr-joe',
    title: 'Dr. Joe — Academic Report Evaluator',
    period: '2026',
    role: 'Claude Code skill · MIT',
    stack: ['Claude Code skill', 'Markdown', 'Prompt engineering'],
    summary:
      'A rigorous academic evaluator skill for Claude Code: grades coursework against a real rubric with calibrated marks and actionable feedback instead of default LLM praise.',
    highlights: [
      '11 evaluation protocols covering 11 academic document types, with 3 worked examples spanning the grade range (71/100 First to 38/100 Marginal Fail)',
      '7 LLM anti-patterns explicitly blocked — prompt engineering shipped as a product, 0 lines of source code',
    ],
    repo: 'https://github.com/PieroJF/dr-joe',
    featured: false,
  },
  {
    slug: 'dr-pavlov',
    title: 'Dr. Pavlov — Thesis Examiner',
    period: '2026',
    role: 'Claude Code skill',
    stack: ['Claude Code skill', 'Markdown'],
    summary:
      'A veteran thesis-examiner skill for Claude Code that assesses dissertations, papers and thesis chapters against a user-supplied marking rubric.',
    highlights: [
      'Entire product in 107 lines of Markdown (<10 KB): a 5-section report contract with a claims register and an anti-rationalization rubric gate',
    ],
    repo: 'https://github.com/PieroJF/dr-pavlov',
    featured: false,
  },
  {
    slug: 'forging-skill',
    title: 'Forging — Pre-Planning Router',
    period: '2026',
    role: 'Claude Code skill',
    stack: ['Claude Code skill', 'Markdown', 'TDD'],
    summary:
      'A pre-planning router skill that decides whether an idea needs open exploration, decision grilling, or reuse of an existing spec — before any implementation plan is written.',
    highlights: [
      'Built test-first on prompts: 5 adversarial scenarios, 3/4 passing at baseline → 4/4 with the skill, with the TDD evidence log published in the repo',
    ],
    repo: 'https://github.com/PieroJF/forging-skill',
    featured: false,
  },
  {
    slug: 'claude-handoff-skill',
    title: 'Handoff — Session Relay for Claude Code',
    period: '2026',
    role: 'Claude Code skill · MIT',
    stack: ['Claude Code skill', 'Markdown'],
    summary:
      'Session closure and relay for multi-workstream AI-agent projects: append-only handoff records that parallel sessions can consume without destroying each other’s state.',
    highlights: [
      'Close → resume → purge formalized as a one-way state machine over append-only artifacts',
      '11 hard rules and 7 banned rationalizations captured from adversarial baseline testing',
    ],
    repo: 'https://github.com/PieroJF/claude-handoff-skill',
    featured: false,
  },
  {
    slug: 'panoptes',
    title: 'Panoptes — Single-File Gym Tracker',
    period: '2026',
    role: 'Single-file web app · MIT',
    stack: ['HTML', 'CSS', 'JavaScript'],
    summary:
      'Minimalist gym routine tracker shipped as one self-contained HTML file — offline-first, no build step, no dependencies.',
    highlights: [
      '945 lines of hand-written HTML/CSS/JS in a single ~33 KB file — 0 dependencies, 0 build tools',
      '78 trackable exercises across a 7-day routine; 27 CSS custom properties as the design-token system',
    ],
    repo: 'https://github.com/PieroJF/panoptes',
    featured: false,
  },
  {
    slug: 'fiab-assembly-cell-original',
    title: 'FIAB Assembly Cell — Original Coursework',
    period: '2025–2026',
    role: 'Coursework as submitted · MIT',
    stack: ['Python', 'RoboDK', 'SolidWorks'],
    summary:
      'The as-submitted coursework behind the FIAB cell: full mechanical design, the graded RoboDK station, and control logic recovered from the station binary.',
    highlights: [
      '41 CAD files (SolidWorks/STEP/STL), the graded station and 656 lines of recovered Python, published with 784 lines of forensic recovery documentation',
    ],
    repo: 'https://github.com/PieroJF/fiab-assembly-cell-original',
    featured: false,
  },
];
