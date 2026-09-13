/**
 * PROTOTYPE 01 — LATERAL RAISE (BIOMECHANICAL CALCULATIONS)
 * Rigorous kinematic and kinetic calculations.
 * Equation: τ = F * r
 */

import { PHYSICS, ANTHROPOMETRY } from '../../shared/constants.js';
import { degToRad, calculateTorque, pointToLineDistance, calculateMechanicalAdvantage, roundTo } from '../../shared/math.js';
import { LATERAL_RAISE_DATA } from './data.js';

export class LateralRaiseBiomechanics {
  constructor(config = {}) {
    this.gravity = config.gravity || PHYSICS.GRAVITY; // 9.80665 m/s²
  }

  /**
   * Computes the external moment arm of the load (dumbbell) relative to the shoulder joint center.
   * r_ext = L_arm * sin(elevationAngle)
   * At 0°: r_ext = 0 m
   * At 90°: r_ext = L_arm
   * At 180°: r_ext = 0 m
   * @param {number} elevationAngleDeg - Angle from vertical (0° to 180°)
   * @param {number} totalArmLengthMeters - Total distance from GH joint center to dumbbell grip (m)
   * @returns {number} External moment arm in meters
   */
  calculateExternalMomentArm(elevationAngleDeg, totalArmLengthMeters) {
    const angleRad = degToRad(elevationAngleDeg);
    const arm = totalArmLengthMeters * Math.sin(angleRad);
    return Math.max(0, arm);
  }

  /**
   * Computes the internal moment arm of the middle deltoid based on empirical literature (Kuechle 1997, Murray 2006).
   * NOTE: Reference/model curve — actual values vary with individual 3D shoulder geometry.
   * @param {number} elevationAngleDeg - Elevation angle (0° to 180°)
   * @returns {number} Internal moment arm in meters (m)
   */
  calculateInternalMomentArm(elevationAngleDeg) {
    const clampedAngle = Math.max(0, Math.min(180, elevationAngleDeg));
    const table = LATERAL_RAISE_DATA.empiricalMomentArms;

    for (let i = 0; i < table.length - 1; i++) {
      const p1 = table[i];
      const p2 = table[i + 1];
      if (clampedAngle >= p1.angle && clampedAngle <= p2.angle) {
        const t = (clampedAngle - p1.angle) / (p2.angle - p1.angle);
        const momentArmCm = p1.momentArmCm + t * (p2.momentArmCm - p1.momentArmCm);
        return momentArmCm / 100; // Convert cm to meters
      }
    }
    return table[table.length - 1].momentArmCm / 100;
  }

  /**
   * Computes geometric moment arm directly from 2D landmark coordinates.
   */
  calculateGeometricMomentArm(ghCenter, acromion, deltoidInsertion, pixelsPerMeter) {
    const distPx = pointToLineDistance(
      ghCenter.x, ghCenter.y,
      acromion.x, acromion.y,
      deltoidInsertion.x, deltoidInsertion.y
    );
    return distPx / pixelsPerMeter;
  }

  /**
   * Performs complete biomechanical analysis for a given pose and dumbbell load.
   * Explicitly separates External Torque demand from Modelled Deltoid Force demand.
   * @param {Object} pose - Output from LateralRaiseAnatomy.getPose()
   * @param {number} loadKg - Dumbbell mass in kg
   * @param {boolean} includeLimbMass - Whether to include segment masses in torque calculation
   * @returns {Object} Complete kinetic and kinematic state
   */
  analyze(pose, loadKg = 10, includeLimbMass = true) {
    const angle = pose.totalAngleDeg;
    const { humerusLength, forearmLength, handGripOffset, totalArmLength, armMass, forearmMass } = pose.metrics;

    // 1. External Gravitational Forces (N)
    const dumbbellWeightN = loadKg * this.gravity;
    const armWeightN = armMass * this.gravity;
    const forearmWeightN = forearmMass * this.gravity;

    // 2. External Moment Arms (m)
    const dumbbellMomentArm = this.calculateExternalMomentArm(angle, totalArmLength);
    
    const armComDist = humerusLength * ANTHROPOMETRY.COM_PROXIMAL_RATIOS.UPPER_ARM;
    const armMomentArm = this.calculateExternalMomentArm(angle, armComDist);

    const forearmComDist = humerusLength + (forearmLength + handGripOffset) * ANTHROPOMETRY.COM_PROXIMAL_RATIOS.FOREARM;
    const forearmMomentArm = this.calculateExternalMomentArm(angle, forearmComDist);

    // 3. External Torques (N·m): τ = F * r
    const dumbbellTorque = calculateTorque(dumbbellWeightN, dumbbellMomentArm);
    const armTorque = calculateTorque(armWeightN, armMomentArm);
    const forearmTorque = calculateTorque(forearmWeightN, forearmMomentArm);

    const limbTorque = armTorque + forearmTorque;
    const totalExternalTorque = includeLimbMass ? (dumbbellTorque + limbTorque) : dumbbellTorque;

    // 4. Internal Moment Arm (m) — Model/Reference Curve
    const deltoidMomentArm = this.calculateInternalMomentArm(angle);

    // 5. Modelled Deltoid Force Demand under quasi-static equilibrium (∑τ = 0):
    // NOTE: Represents single-muscle isolated theoretical demand. In vivo, synergists share load.
    let deltoidForceN = 0;
    if (deltoidMomentArm > 0.001) {
      deltoidForceN = totalExternalTorque / deltoidMomentArm;
    }

    // 6. Mechanical Advantage: MA = r_int / r_ext
    const mechanicalAdvantage = calculateMechanicalAdvantage(deltoidMomentArm, dumbbellMomentArm);

    return {
      jointAngleDeg: roundTo(angle, 1),
      ghAngleDeg: roundTo(pose.ghAngleDeg, 1),
      scapulaAngleDeg: roundTo(pose.scapulaAngleDeg, 1),
      
      forces: {
        loadMassKg: roundTo(loadKg, 1),
        dumbbellWeightN: roundTo(dumbbellWeightN, 1),
        limbWeightN: roundTo(armWeightN + forearmWeightN, 1),
        // Modelled theoretical isolated muscle demand:
        deltoidForceN: roundTo(deltoidForceN, 1),
        deltoidForceKgEquivalent: roundTo(deltoidForceN / this.gravity, 1),
        deltoidForceLabel: 'Modelled deltoid force demand under quasi-static assumptions'
      },

      momentArms: {
        externalLoadM: roundTo(dumbbellMomentArm, 4),
        externalLoadCm: roundTo(dumbbellMomentArm * 100, 2),
        deltoidInternalM: roundTo(deltoidMomentArm, 4),
        deltoidInternalCm: roundTo(deltoidMomentArm * 100, 2),
        deltoidCurveType: 'Model / Reference curve (Kuechle 1997 / Murray 2006)'
      },

      torques: {
        loadTorqueNm: roundTo(dumbbellTorque, 2),
        limbTorqueNm: roundTo(limbTorque, 2),
        totalExternalTorqueNm: roundTo(totalExternalTorque, 2),
        torqueLabel: 'External Torque Demand on Glenohumeral Joint (τ_ext)'
      },

      mechanicalAdvantage: roundTo(mechanicalAdvantage, 4),
      modelAssumptionsNotes: {
        scapulohumeralRhythm: angle > 30 
          ? 'Baseline simplified model (2:1 classic linear approximation)' 
          : 'Setting phase baseline (Scapula = 0°)',
        equilibriumCondition: 'Quasi-static equilibrium (∑τ = 0; inertial forces I·α not included)',
        forceDistribution: 'Single equivalent deltoid force line; in vivo synergists (supraspinatus, upper traps) share loads'
      }
    };
  }
}
