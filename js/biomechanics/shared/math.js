/**
 * BIOMECHANICS MODEL LAB — SHARED MATH UTILITIES
 * Pure mathematical functions for biomechanical calculations.
 * Completely independent, zero external dependencies.
 */

/**
 * Converts degrees to radians.
 * @param {number} deg - Angle in degrees
 * @returns {number} Angle in radians
 */
export function degToRad(deg) {
  return (deg * Math.PI) / 180;
}

/**
 * Converts radians to degrees.
 * @param {number} rad - Angle in radians
 * @returns {number} Angle in degrees
 */
export function radToDeg(rad) {
  return (rad * 180) / Math.PI;
}

/**
 * Clamps a value between a minimum and maximum.
 * @param {number} val 
 * @param {number} min 
 * @param {number} max 
 * @returns {number}
 */
export function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

/**
 * Linear interpolation between a and b.
 * @param {number} a 
 * @param {number} b 
 * @param {number} t - Interpolation factor [0, 1]
 * @returns {number}
 */
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Rounds a number to a specific decimal precision.
 * @param {number} val 
 * @param {number} decimals 
 * @returns {number}
 */
export function roundTo(val, decimals = 2) {
  if (!Number.isFinite(val)) return 0;
  const factor = Math.pow(10, decimals);
  return Math.round(val * factor) / factor;
}

/**
 * Calculates torque given a force magnitude (N) and perpendicular moment arm (m).
 * Fundamental relation: τ = F * r
 * @param {number} force - Force magnitude in Newtons (N)
 * @param {number} momentArm - Perpendicular distance in meters (m)
 * @returns {number} Torque in Newton-meters (N·m)
 */
export function calculateTorque(force, momentArm) {
  if (!Number.isFinite(force) || !Number.isFinite(momentArm)) {
    return 0;
  }
  return force * momentArm;
}

/**
 * Calculates mechanical advantage (MA = internal moment arm / external moment arm).
 * @param {number} internalMomentArm - In meters (m)
 * @param {number} externalMomentArm - In meters (m)
 * @returns {number} Mechanical advantage ratio
 */
export function calculateMechanicalAdvantage(internalMomentArm, externalMomentArm) {
  if (!Number.isFinite(internalMomentArm) || !Number.isFinite(externalMomentArm) || externalMomentArm <= 0.0001) {
    return 0;
  }
  return internalMomentArm / externalMomentArm;
}

/**
 * Calculates perpendicular distance from a 2D point (px, py) to a line passing through (lx1, ly1) and (lx2, ly2).
 * r = |(x2 - x1)(y1 - y0) - (x1 - x0)(y2 - y1)| / sqrt((x2 - x1)^2 + (y2 - y1)^2)
 * @param {number} px - Point X
 * @param {number} py - Point Y
 * @param {number} lx1 - Line point 1 X
 * @param {number} ly1 - Line point 1 Y
 * @param {number} lx2 - Line point 2 X
 * @param {number} ly2 - Line point 2 Y
 * @returns {number} Perpendicular distance
 */
export function pointToLineDistance(px, py, lx1, ly1, lx2, ly2) {
  const dx = lx2 - lx1;
  const dy = ly2 - ly1;
  const lineLenSq = dx * dx + dy * dy;
  if (lineLenSq < 1e-12) {
    return Math.hypot(px - lx1, py - ly1);
  }
  const numerator = Math.abs(dx * (ly1 - py) - (lx1 - px) * dy);
  return numerator / Math.sqrt(lineLenSq);
}

/**
 * Projects point P onto line passing through L1 and L2.
 * @returns {{ x: number, y: number }} Closest point on line
 */
export function projectPointOntoLine(px, py, lx1, ly1, lx2, ly2) {
  const dx = lx2 - lx1;
  const dy = ly2 - ly1;
  const lineLenSq = dx * dx + dy * dy;
  if (lineLenSq < 1e-12) {
    return { x: lx1, y: ly1 };
  }
  const t = ((px - lx1) * dx + (py - ly1) * dy) / lineLenSq;
  return {
    x: lx1 + t * dx,
    y: ly1 + t * dy
  };
}

/**
 * Calculates perpendicular horizontal distance from a point to a vertical line passing through x = lineX.
 * @param {number} px 
 * @param {number} lineX 
 * @returns {number}
 */
export function distanceToVerticalLine(px, lineX) {
  return Math.abs(px - lineX);
}

/**
 * Computes composite center of mass for a system of point masses.
 * @param {Array<{ mass: number, x: number, y: number }>} elements 
 * @returns {{ x: number, y: number, totalMass: number }}
 */
export function calculateCenterOfMass(elements) {
  let totalMass = 0;
  let sumX = 0;
  let sumY = 0;

  for (const el of elements) {
    if (el && Number.isFinite(el.mass) && el.mass > 0) {
      totalMass += el.mass;
      sumX += el.mass * (el.x || 0);
      sumY += el.mass * (el.y || 0);
    }
  }

  if (totalMass <= 1e-9) {
    return { x: 0, y: 0, totalMass: 0 };
  }

  return {
    x: sumX / totalMass,
    y: sumY / totalMass,
    totalMass
  };
}

