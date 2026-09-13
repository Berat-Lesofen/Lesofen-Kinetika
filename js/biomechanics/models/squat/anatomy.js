/**
 * PROTOTYPE 03 — SQUAT (ANATOMY & KINEMATICS)
 * Sagittal plane closed-chain kinematics of Foot, Tibia, Femur, Pelvis, Trunk, and Barbell.
 * Standard anthropometry (Winter 2009).
 */

import { Vector2 } from '../../shared/vectors.js';
import { degToRad, radToDeg, clamp } from '../../shared/math.js';
import { ANTHROPOMETRY } from '../../shared/constants.js';

export class SquatAnatomy {
  constructor(config = {}) {
    this.userHeight = config.height || ANTHROPOMETRY.DEFAULT_HEIGHT; // ~1.75 m
    this.userMass = config.mass || ANTHROPOMETRY.DEFAULT_MASS;       // ~75 kg

    // Segment lengths (Winter 2009)
    this.tibiaLength = this.userHeight * ANTHROPOMETRY.RATIOS.TIBIA;       // ~0.430 m
    this.femurLength = this.userHeight * ANTHROPOMETRY.RATIOS.FEMUR;       // ~0.429 m
    this.footLength = this.userHeight * ANTHROPOMETRY.RATIOS.FOOT_LENGTH;  // ~0.266 m
    this.trunkLength = this.userHeight * ANTHROPOMETRY.RATIOS.TRUNK * 1.5; // ~0.75 m (Trunk + Head/Neck)

    // Segment masses (Winter 2009)
    this.shankMass = this.userMass * ANTHROPOMETRY.MASS_FRACTIONS.SHANK_FOOT; // ~4.6 kg
    this.thighMass = this.userMass * ANTHROPOMETRY.MASS_FRACTIONS.THIGH;      // ~7.5 kg
    this.trunkMass = this.userMass * ANTHROPOMETRY.MASS_FRACTIONS.TRUNK_HEAD_NECK; // ~50.8 kg
  }

  /**
   * Computes sagittal joint landmark coordinates for a given squat pose.
   * @param {number} depthNorm - 0 (standing straight) to 1.0 (deep squat)
   * @param {number} trunkLeanDeg - Additional user-adjusted trunk inclination (-15° upright to +35° forward lean)
   * @param {string} barPositionType - 'HIGH_BAR' or 'LOW_BAR'
   * @param {Vector2} footBasePos - Screen coordinates of ankle/heel base
   * @param {number} pixelsPerMeter - Visual scaling factor
   * @returns {Object} Landmarks, angles, and segment metrics
   */
  getPose(depthNorm, trunkLeanDeg, barPositionType, footBasePos, pixelsPerMeter) {
    const depth = clamp(depthNorm, 0, 1.0);
    const leanOffset = clamp(trunkLeanDeg, -15, 35);

    // Segment lengths in pixels
    const tibiaPx = this.tibiaLength * pixelsPerMeter;
    const femurPx = this.femurLength * pixelsPerMeter;
    const trunkPx = this.trunkLength * pixelsPerMeter;
    const footPx = this.footLength * pixelsPerMeter;

    // 1. Foot planted on ground
    const ankle = footBasePos.clone();
    const heel = ankle.clone().add(new Vector2(-footPx * 0.28, 0));
    const toe = ankle.clone().add(new Vector2(footPx * 0.72, 0));
    const midfootX = ankle.x + footPx * 0.22; // Natural center of balance (midfoot)

    // 2. Kinematic Angles as a function of depth and trunk lean:
    // leanFactor: 0 (upright) to 1 (high lean)
    const leanFactor = (leanOffset + 15) / 50;

    // Ankle dorsiflexion (degrees from vertical forward)
    // Upright style allows higher forward knee travel (~24°),
    // forward lean / restricted style keeps shin more vertical (~8°-10°) per Fry et al. (2003).
    const maxDorsiflexion = 24 - leanFactor * 15;
    const ankleAngleDeg = depth * maxDorsiflexion;
    const ankleAngleRad = degToRad(ankleAngleDeg);

    // Knee joint position
    const knee = ankle.clone().add(new Vector2(
      Math.sin(ankleAngleRad) * tibiaPx,
      -Math.cos(ankleAngleRad) * tibiaPx
    ));

    // Knee flexion angle: from 0° (straight) to ~120°
    const kneeFlexionDeg = depth * (115 + (1 - leanFactor) * 8);

    // Trunk inclination angle from vertical (forward lean)
    const baseTrunkLeanDeg = depth * (18 + leanFactor * 22);
    const totalTrunkLeanDeg = clamp(baseTrunkLeanDeg + leanOffset * 0.4, 0, 75);
    const trunkLeanRad = degToRad(totalTrunkLeanDeg);

    // 3. Barbell Placement & Closed-Chain Balance:
    // In human squatting, balance demands the barbell stays aligned over the midfoot.
    const isLowBar = barPositionType === 'LOW_BAR';
    const barOffsetAlongTrunkPx = isLowBar ? trunkPx * 0.08 : trunkPx * 0.02;

    const shoulderX = midfootX + Math.sin(trunkLeanRad) * barOffsetAlongTrunkPx;
    const hipX = shoulderX - Math.sin(trunkLeanRad) * trunkPx;

    const dx = Math.abs(knee.x - hipX);
    const clampedDx = Math.min(dx, femurPx * 0.96);
    const dyFemur = Math.sqrt(femurPx * femurPx - clampedDx * clampedDx);
    const hipY = knee.y - dyFemur * (1.0 - depth * 0.95);
    const hip = new Vector2(hipX, hipY);

    const shoulder = hip.clone().add(new Vector2(
      Math.sin(trunkLeanRad) * trunkPx,
      -Math.cos(trunkLeanRad) * trunkPx
    ));

    const head = shoulder.clone().add(new Vector2(
      Math.sin(trunkLeanRad) * (trunkPx * 0.22),
      -Math.cos(trunkLeanRad) * (trunkPx * 0.22)
    ));

    const barbell = new Vector2(
      midfootX,
      shoulder.y + Math.cos(trunkLeanRad) * barOffsetAlongTrunkPx
    );

    // 4. Center of Mass of Segments
    const shankCom = ankle.clone().add(Vector2.scale(Vector2.sub(knee, ankle), 0.567));
    const thighCom = knee.clone().add(Vector2.scale(Vector2.sub(hip, knee), 0.567));
    const trunkCom = hip.clone().add(Vector2.scale(Vector2.sub(shoulder, hip), 0.60));

    // Calculated Joint Angles
    const hipFlexionDeg = radToDeg(
      Vector2.sub(knee, hip).angleTo(Vector2.sub(shoulder, hip))
    );

    return {
      depthNorm: depth,
      angles: {
        kneeFlexionDeg: Math.round(kneeFlexionDeg * 10) / 10,
        hipFlexionDeg: Math.round((180 - hipFlexionDeg) * 10) / 10,
        ankleDorsiflexionDeg: Math.round(ankleAngleDeg * 10) / 10,
        trunkLeanDeg: Math.round(totalTrunkLeanDeg * 10) / 10
      },
      landmarks: {
        ankle,
        heel,
        toe,
        midfootX,
        knee,
        hip,
        shoulder,
        head,
        barbell,
        shankCom,
        thighCom,
        trunkCom
      },
      metrics: {
        tibiaLength: this.tibiaLength,
        femurLength: this.femurLength,
        trunkLength: this.trunkLength,
        footLength: this.footLength,
        shankMass: this.shankMass,
        thighMass: this.thighMass,
        trunkMass: this.trunkMass
      },
      barPositionType: isLowBar ? 'LOW_BAR' : 'HIGH_BAR'
    };
  }
}
