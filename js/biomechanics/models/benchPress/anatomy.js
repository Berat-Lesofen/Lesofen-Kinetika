/**
 * PROTOTYPE 04 — BENCH PRESS (ANATOMY & KINEMATICS)
 * Sagittal view of supine lifter on flat bench, solving shoulder, elbow, forearm, and barbell trajectory.
 * Supports comparison between Straight Vertical and Curved J-Curve bar paths.
 */

import { Vector2 } from '../../shared/vectors.js';
import { degToRad, radToDeg, clamp, lerp } from '../../shared/math.js';
import { ANTHROPOMETRY } from '../../shared/constants.js';

export class BenchPressAnatomy {
  constructor(config = {}) {
    this.userHeight = config.height || ANTHROPOMETRY.DEFAULT_HEIGHT; // ~1.75 m
    this.userMass = config.mass || ANTHROPOMETRY.DEFAULT_MASS;       // ~75 kg

    // Segment lengths (Winter 2009)
    this.humerusLength = this.userHeight * ANTHROPOMETRY.RATIOS.HUMERUS;       // ~0.301 m
    this.forearmLength = this.userHeight * ANTHROPOMETRY.RATIOS.FOREARM;       // ~0.275 m
    this.trunkLength = this.userHeight * ANTHROPOMETRY.RATIOS.TRUNK * 1.4;     // ~0.70 m
    this.chestDepth = 0.22; // Thoracic anterior-posterior depth (~0.22 m)
  }

  /**
   * Computes 2D landmark coordinates for supine lifter on bench given the descent phase and bar path type.
   * @param {number} phaseNorm - 0 = Full lockout (arms extended), 1.0 = Chest touch (bottom)
   * @param {string} barPathType - 'CURVED_J_CURVE' or 'STRAIGHT_VERTICAL'
   * @param {Vector2} benchBasePos - Coordinates of head-end of bench on canvas
   * @param {number} pixelsPerMeter - Scale factor
   * @returns {Object} Landmarks, angles, and segment metrics
   */
  getPose(phaseNorm, barPathType = 'CURVED_J_CURVE', benchBasePos, pixelsPerMeter) {
    const phase = clamp(phaseNorm, 0, 1.0);
    const isJCurve = barPathType === 'CURVED_J_CURVE';

    const humerusPx = this.humerusLength * pixelsPerMeter;
    const forearmPx = this.forearmLength * pixelsPerMeter;
    const trunkPx = this.trunkLength * pixelsPerMeter;
    const chestDepthPx = this.chestDepth * pixelsPerMeter;

    // 1. Bench and Torso Orientation (Horizontal)
    // Head on left, Torso extends to right
    const benchY = benchBasePos.y;
    const headX = benchBasePos.x;
    const shoulderX = headX + 70;
    const hipX = shoulderX + trunkPx * 0.75;

    const shoulderJoint = new Vector2(shoulderX, benchY - chestDepthPx * 0.45);
    const touchPointX = shoulderX + 0.16 * pixelsPerMeter; // Nipple / lower sternum touch line

    // 2. Barbell Position based on Phase and Path Type:
    // Vertical reach: Full extension reaches ~(Humerus + Forearm) above shoulder
    const lockoutHeightY = shoulderJoint.y - (humerusPx + forearmPx) * 0.995;
    const bottomHeightY = shoulderJoint.y - (humerusPx + forearmPx) * 0.61;
    const chestSurfaceY = bottomHeightY + 10;

    // Bar vertical height: linear interpolation between lockout and bottom
    const barY = lerp(lockoutHeightY, bottomHeightY, phase);

    // Bar horizontal position:
    let barX = touchPointX;
    if (isJCurve) {
      // J-Curve / Natural path:
      // At lockout (phase = 0), bar is aligned over shoulder joint (+15px safety)
      // At bottom (phase = 1), bar is forward over lower sternum (touchPointX)
      // Non-linear curve: flares backwards rapidly during early press (phase 0 to 0.4)
      const t = Math.pow(phase, 1.6); // smooth cubic-like J-curve
      barX = lerp(shoulderJoint.x + 10, touchPointX, t);
    } else {
      // Straight Vertical path: stays strictly over touchPointX throughout
      barX = touchPointX;
    }

    const barbell = new Vector2(barX, barY);

    // 3. Inverse Kinematics for Arm (Shoulder -> Elbow -> Hand/Bar):
    // Find elbow position between shoulderJoint and barbell
    const distToBar = shoulderJoint.dist(barbell);
    const maxReach = humerusPx + forearmPx;
    const clampedDist = Math.min(distToBar, maxReach * 0.999);

    // Law of cosines for elbow interior angle
    const cosElbow = (humerusPx * humerusPx + forearmPx * forearmPx - clampedDist * clampedDist) / (2 * humerusPx * forearmPx);
    const elbowInteriorRad = Math.acos(clamp(cosElbow, -1, 1));

    // Direction vector from shoulder to bar
    const barDir = Vector2.sub(barbell, shoulderJoint).normalize();
    // Angle of shoulder-to-bar vector
    const baseAngle = barDir.angle();

    // Triangle angle at shoulder
    const cosShoulder = (humerusPx * humerusPx + clampedDist * clampedDist - forearmPx * forearmPx) / (2 * humerusPx * clampedDist);
    const shoulderAngleOffset = Math.acos(clamp(cosShoulder, -1, 1));

    // Elbow flares downwards / towards bench (negative angle in canvas coords)
    const humerusAngle = baseAngle + shoulderAngleOffset;
    const elbowJoint = shoulderJoint.clone().add(new Vector2(
      Math.cos(humerusAngle) * humerusPx,
      Math.sin(humerusAngle) * humerusPx
    ));

    // Elbow flexion angle (0° = straight arm at lockout, ~90° at bottom)
    const elbowFlexionDeg = Math.round((180 - radToDeg(elbowInteriorRad)) * 10) / 10;

    // Humerus angle relative to horizontal trunk
    const humerusTrunkAngleDeg = Math.round(radToDeg(humerusAngle) * 10) / 10;

    return {
      phaseNorm: phase,
      barPathType: isJCurve ? 'CURVED_J_CURVE' : 'STRAIGHT_VERTICAL',
      angles: {
        elbowFlexionDeg,
        humerusTrunkAngleDeg
      },
      landmarks: {
        benchStart: new Vector2(headX - 40, benchY),
        benchEnd: new Vector2(hipX + 80, benchY),
        head: new Vector2(headX, benchY - 25),
        shoulderJoint,
        chestSurfaceY,
        touchPointX,
        elbowJoint,
        barbell,
        hip: new Vector2(hipX, benchY - chestDepthPx * 0.3)
      },
      metrics: {
        humerusLength: this.humerusLength,
        forearmLength: this.forearmLength,
        trunkLength: this.trunkLength,
        chestDepth: this.chestDepth
      }
    };
  }
}
