/**
 * PROTOTYPE 04 — BENCH PRESS (BIOMECHANICAL CALCULATIONS)
 * Rigorous calculation of external moment arms to Shoulder and Elbow,
 * joint torque demands, and bar path comparison (Curved J-Curve vs Straight Vertical).
 * Equation: τ = F * r
 */

import { PHYSICS } from '../../shared/constants.js';
import { calculateTorque, roundTo } from '../../shared/math.js';

export class BenchPressBiomechanics {
  constructor(config = {}) {
    this.gravity = config.gravity || PHYSICS.GRAVITY; // 9.80665 m/s²
  }

  /**
   * Computes horizontal perpendicular moment arm between joint center and vertical bar line.
   * @param {number} jointX 
   * @param {number} barX 
   * @param {number} pixelsPerMeter 
   * @returns {number} Distance in meters
   */
  calculateExternalMomentArm(jointX, barX, pixelsPerMeter) {
    return Math.abs(jointX - barX) / pixelsPerMeter;
  }

  /**
   * Performs complete kinetic analysis of Bench Press pose.
   * @param {Object} pose - Output from BenchPressAnatomy.getPose()
   * @param {number} barMassKg - Barbell mass in kg
   * @param {number} pixelsPerMeter - Scale factor
   * @returns {Object} Kinetic parameters and torque demands
   */
  analyze(pose, barMassKg = 100, pixelsPerMeter = 360) {
    const { landmarks, angles, barPathType } = pose;

    // 1. External Force (N)
    const barWeightN = barMassKg * this.gravity;
    const barX = landmarks.barbell.x;

    // 2. External Moment Arms (m)
    // Distance from vertical bar line to shoulder joint axis
    const shoulderMomentArmM = this.calculateExternalMomentArm(landmarks.shoulderJoint.x, barX, pixelsPerMeter);
    // Distance from vertical bar line to elbow joint axis
    const elbowMomentArmM = this.calculateExternalMomentArm(landmarks.elbowJoint.x, barX, pixelsPerMeter);

    // 3. External Joint Torque Demands (N·m)
    const shoulderTorqueNm = calculateTorque(barWeightN, shoulderMomentArmM);
    const elbowTorqueNm = calculateTorque(barWeightN, elbowMomentArmM);

    return {
      phasePercent: roundTo(pose.phaseNorm * 100, 1),
      barPathType,
      angles: {
        elbowFlexionDeg: angles.elbowFlexionDeg,
        humerusTrunkAngleDeg: angles.humerusTrunkAngleDeg
      },

      forces: {
        barMassKg: roundTo(barMassKg, 1),
        barWeightN: roundTo(barWeightN, 1)
      },

      momentArms: {
        shoulderExternalM: roundTo(shoulderMomentArmM, 4),
        shoulderExternalCm: roundTo(shoulderMomentArmM * 100, 2),

        elbowExternalM: roundTo(elbowMomentArmM, 4),
        elbowExternalCm: roundTo(elbowMomentArmM * 100, 2)
      },

      torques: {
        shoulderTorqueDemandNm: roundTo(shoulderTorqueNm, 1),
        elbowTorqueDemandNm: roundTo(elbowTorqueNm, 1),
        labelShoulder: 'Shoulder Horizontal Flexion/Adduction Moment Demand (τ_shoulder)',
        labelElbow: 'Elbow Extension Moment Demand (τ_elbow)'
      },

      pathComparisonNote: barPathType === 'CURVED_J_CURVE'
        ? 'Curved J-Curve: Bar flares backward over shoulder axis, reducing shoulder moment arm at lockout.'
        : 'Straight Vertical: Bar stays over chest touch line, leaving an unnecessary external moment arm at lockout.'
    };
  }
}
