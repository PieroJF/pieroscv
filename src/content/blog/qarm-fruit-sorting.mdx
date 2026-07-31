---
title: "Sub-micrometer IK on a 4-DOF arm: analytical solutions + Newton-Raphson"
description: "How our team's QArm fruit-sorting robot solves inverse kinematics to 0.0002 mm round-trip error, and why we refined closed-form solutions numerically."
pubDate: 2026-07-27
tags: ["robotics", "kinematics", "python"]
---

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

## The rest of the pipeline

The IK sits inside a 13-state finite-state machine (INIT → SCAN → APPROACH → PICK →
BASKET → PLACE, plus recovery states) with cubic rest-to-rest spline trajectories and
Z-height safeguards against table collisions. Perception is HSV color plus circularity
shape classification in OpenCV, back-projected to 3D with the D415 depth stream
(1280×720 @ 30 fps). Hand-eye calibration uses the closed-form Umeyama SVD method, and a
MATLAB/Simulink facade wraps the Python algorithms for an auditable control layer on the
Quanser HIL stack.

Code: [github.com/PieroJF/Robot-qarm-ruit-sorting](https://github.com/PieroJF/Robot-qarm-ruit-sorting).
