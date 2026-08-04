import type { ImageMetadata } from 'astro:assets';
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
      '160-item engineering BOM and 43-part CAD assembly with collision resolution; vendor engagement with RIFTEK, Renishaw and Tecnotion',
      'Architecture aligned to a ~US$25,000 BOM for affordable deployment in machine shops',
    ],
    repo: null,
    featured: true,
    note: 'Details withheld pending IP review.',
  },
  {
    slug: 'qarm-fruit-sorting',
    title: 'Autonomous Fruit Sorting — Quanser QArm + RealSense D415',
    period: '2025–2026',
    role: 'Applied Robotics · Team of 4 · University of Birmingham',
    stack: ['Python 3.13', 'NumPy', 'OpenCV', 'Quanser SDK (HIL)', 'MATLAB/Simulink'],
    summary:
      'End-to-end pick-and-place on a 4-DOF QArm with an RGB-D camera, sorting 14 fruits into 3 baskets in autonomous and teleoperated modes.',
    highlights: [
      'Analytical inverse kinematics with Newton-Raphson refinement: 0.0002 mm max round-trip error across four solution branches',
      '13-state finite-state-machine controller with cubic rest-to-rest spline trajectories and Z-height collision safeguards',
      'Hand-eye calibration via closed-form Umeyama SVD; HSV + circularity classifier with pixel-to-world back-projection',
    ],
    repo: 'https://github.com/PieroJF/Robot-qarm-ruit-sorting',
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
    role: '3D mapping & perception module · Team of 4 · University of Birmingham',
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
      'Datalogic vision over TCP/IP (192.168.1.130:20000) for real-time coordinate transfer and camera-to-gripper offset compensation',
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
    highlights: [],
    repo: 'https://github.com/PieroJF/robodk-fiab-assembly-cell',
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
];
