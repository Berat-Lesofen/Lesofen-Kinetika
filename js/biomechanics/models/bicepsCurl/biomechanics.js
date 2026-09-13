/**
 * PROTOTYPE 02 — BICEPS CURL (BIOMECHANICAL CALCULATIONS)
 * Rigorous kinetic and kinematic calculations for elbow flexors.
 * Distinct moment arms for Biceps brachii, Brachialis, and Brachioradialis.
 * Equation: τ = F * r
 */

import { PHYSICS, ANTHROPOMETRY } from '../../shared/constants.js';
import { degToRad, calculateTorque, calculateMechanicalAdvantage, roundTo, lerp } from '../../shared/math.js';
import { BICEPS_CURL_DATA } from './data.js';

export class BicepsCurlBiomechanics {
  constructor(config = {}) {
    this.gravity = config.gravity || PHYSICS.GRAVITY; // 9.80665 m/s²
  }

  /**
   * Computes the external moment arm of the load relative to the elbow joint center.
   * With upper arm vertical: r_ext = L_forearm * sin(flexionAngle)
   * @param {number} flexionAngleDeg - Elbow flexion angle (0° to 150°)
   * @param {number} leverLengthMeters - Distance from elbow axis to load/mass center (m)
   * @returns {number} External moment arm in meters
   */
  calculateExternalMomentArm(flexionAngleDeg, leverLengthMeters) {
    const angleRad = degToRad(flexionAngleDeg);
    const arm = leverLengthMeters * Math.sin(angleRad);
    return Math.max(0, arm);
  }

  /**
   * Computes Biceps Brachii internal moment arm as a function of both flexion angle and forearm rotation.
   * Radius tüberozitesine yapıştığından pronasyonda radial sarılma nedeniyle moment kolu azalır.
   * @param {number} flexionAngleDeg - 0° to 150°
   * @param {number} forearmRotationDeg - -80° (pronation) to +80° (supination)
   * @returns {number} Moment arm in meters (m)
   */
  calculateBicepsMomentArm(flexionAngleDeg, forearmRotationDeg) {
    const angle = Math.max(0, Math.min(150, flexionAngleDeg));
    const rot = Math.max(-80, Math.min(80, forearmRotationDeg));
    const table = BICEPS_CURL_DATA.bicepsMomentArms;

    // 1. Interpolate across flexion angle
    let p1 = table[0], p2 = table[table.length - 1];
    for (let i = 0; i < table.length - 1; i++) {
      if (angle >= table[i].angle && angle <= table[i + 1].angle) {
        p1 = table[i];
        p2 = table[i + 1];
        break;
      }
    }
    const t = (angle - p1.angle) / (p2.angle - p1.angle || 1);

    const supinatedCm = lerp(p1.supinatedCm, p2.supinatedCm, t);
    const neutralCm = lerp(p1.neutralCm, p2.neutralCm, t);
    const pronatedCm = lerp(p1.pronatedCm, p2.pronatedCm, t);

    // 2. Interpolate across forearm rotation
    let momentArmCm = neutralCm;
    if (rot > 0) {
      // Neutral (0) to Supinated (+80)
      const rotT = rot / 80;
      momentArmCm = lerp(neutralCm, supinatedCm, rotT);
    } else if (rot < 0) {
      // Neutral (0) to Pronated (-80)
      const rotT = Math.abs(rot) / 80;
      momentArmCm = lerp(neutralCm, pronatedCm, rotT);
    }

    return momentArmCm / 100; // Convert cm to meters
  }

  /**
   * Computes Brachialis internal moment arm.
   * NOTE: Invariant to forearm rotation because it attaches to the ulna!
   * @param {number} flexionAngleDeg - 0° to 150°
   * @returns {number} Moment arm in meters (m)
   */
  calculateBrachialisMomentArm(flexionAngleDeg) {
    const angle = Math.max(0, Math.min(150, flexionAngleDeg));
    const table = BICEPS_CURL_DATA.brachialisMomentArms;

    let p1 = table[0], p2 = table[table.length - 1];
    for (let i = 0; i < table.length - 1; i++) {
      if (angle >= table[i].angle && angle <= table[i + 1].angle) {
        p1 = table[i];
        p2 = table[i + 1];
        break;
      }
    }
    const t = (angle - p1.angle) / (p2.angle - p1.angle || 1);
    const momentArmCm = lerp(p1.momentArmCm, p2.momentArmCm, t);
    return momentArmCm / 100; // Convert cm to meters
  }

  /**
   * Computes Brachioradialis internal moment arm.
   * Inserts into distal radius (styloid process); long lever arm, optimal in mid-pronation (neutral).
   * @param {number} flexionAngleDeg - 0° to 150°
   * @param {number} forearmRotationDeg - -80° to +80°
   * @returns {number} Moment arm in meters (m)
   */
  calculateBrachioradialisMomentArm(flexionAngleDeg, forearmRotationDeg) {
    const angle = Math.max(0, Math.min(150, flexionAngleDeg));
    const rot = Math.max(-80, Math.min(80, forearmRotationDeg));
    const table = BICEPS_CURL_DATA.brachioradialisMomentArms;

    let p1 = table[0], p2 = table[table.length - 1];
    for (let i = 0; i < table.length - 1; i++) {
      if (angle >= table[i].angle && angle <= table[i + 1].angle) {
        p1 = table[i];
        p2 = table[i + 1];
        break;
      }
    }
    const t = (angle - p1.angle) / (p2.angle - p1.angle || 1);

    const neutralCm = lerp(p1.neutralCm, p2.neutralCm, t);
    const supinatedCm = lerp(p1.supinatedCm, p2.supinatedCm, t);
    const pronatedCm = lerp(p1.pronatedCm, p2.pronatedCm, t);

    let momentArmCm = neutralCm;
    if (rot > 0) {
      const rotT = rot / 80;
      momentArmCm = lerp(neutralCm, supinatedCm, rotT);
    } else if (rot < 0) {
      const rotT = Math.abs(rot) / 80;
      momentArmCm = lerp(neutralCm, pronatedCm, rotT);
    }

    return momentArmCm / 100;
  }

  /**
   * Performs comprehensive kinetic and kinematic analysis of elbow flexion.
   * @param {Object} pose - Anatomical pose landmarks
   * @param {number} loadKg - Dumbbell mass in kg
   * @param {boolean} includeLimbMass - Whether to include forearm segment mass
   * @returns {Object} Complete biomechanical analysis
   */
  analyze(pose, loadKg = 10, includeLimbMass = true) {
    const angle = pose.flexionAngleDeg;
    const rotation = pose.forearmRotationDeg;
    const { totalForearmLever, forearmMass, forearmLength, handGripOffset } = pose.metrics;

    // 1. External Gravitational Forces
    const loadWeightN = loadKg * this.gravity;
    const forearmWeightN = forearmMass * this.gravity;

    // 2. External Moment Arms (m)
    const loadMomentArm = this.calculateExternalMomentArm(angle, totalForearmLever);
    const forearmComDist = (forearmLength + handGripOffset) * ANTHROPOMETRY.COM_PROXIMAL_RATIOS.FOREARM;
    const forearmMomentArm = this.calculateExternalMomentArm(angle, forearmComDist);

    // 3. External Torques (N·m)
    const loadTorque = calculateTorque(loadWeightN, loadMomentArm);
    const forearmTorque = calculateTorque(forearmWeightN, forearmMomentArm);
    const totalExternalTorque = includeLimbMass ? (loadTorque + forearmTorque) : loadTorque;

    // 4. Internal Moment Arms for the 3 Muscles (m)
    const bicepsMomentArm = this.calculateBicepsMomentArm(angle, rotation);
    const brachialisMomentArm = this.calculateBrachialisMomentArm(angle);
    const brachioradialisMomentArm = this.calculateBrachioradialisMomentArm(angle, rotation);

    // 5. Modelled Theoretical Force Demand (Quasi-Static Equilibrium, single muscle isolation)
    // NOTE: In vivo, the 3 flexors share this load according to neuromuscular recruitment strategy.
    const bicepsForceDemandN = bicepsMomentArm > 0.001 ? totalExternalTorque / bicepsMomentArm : 0;
    const brachialisForceDemandN = brachialisMomentArm > 0.001 ? totalExternalTorque / brachialisMomentArm : 0;
    const brachioradialisForceDemandN = brachioradialisMomentArm > 0.001 ? totalExternalTorque / brachioradialisMomentArm : 0;

    // 6. Mechanical Advantages (MA = r_int / r_ext)
    const bicepsMA = calculateMechanicalAdvantage(bicepsMomentArm, loadMomentArm);
    const brachialisMA = calculateMechanicalAdvantage(brachialisMomentArm, loadMomentArm);
    const brachioradialisMA = calculateMechanicalAdvantage(brachioradialisMomentArm, loadMomentArm);

    return {
      flexionAngleDeg: roundTo(angle, 1),
      forearmRotationDeg: roundTo(rotation, 1),
      forearmRotationState: pose.forearmRotationState,

      forces: {
        loadMassKg: roundTo(loadKg, 1),
        loadWeightN: roundTo(loadWeightN, 1),
        forearmWeightN: roundTo(forearmWeightN, 1),
        // Isolated theoretical force demands under quasi-static equilibrium:
        bicepsForceDemandN: roundTo(bicepsForceDemandN, 1),
        brachialisForceDemandN: roundTo(brachialisForceDemandN, 1),
        brachioradialisForceDemandN: roundTo(brachioradialisForceDemandN, 1),
        forceDemandDisclaimer: 'Modelled single-muscle theoretical demand; in vivo muscles share load.'
      },

      momentArms: {
        externalLoadM: roundTo(loadMomentArm, 4),
        externalLoadCm: roundTo(loadMomentArm * 100, 2),

        bicepsInternalM: roundTo(bicepsMomentArm, 4),
        bicepsInternalCm: roundTo(bicepsMomentArm * 100, 2),

        brachialisInternalM: roundTo(brachialisMomentArm, 4),
        brachialisInternalCm: roundTo(brachialisMomentArm * 100, 2),

        brachioradialisInternalM: roundTo(brachioradialisMomentArm, 4),
        brachioradialisInternalCm: roundTo(brachioradialisMomentArm * 100, 2)
      },

      torques: {
        loadTorqueNm: roundTo(loadTorque, 2),
        forearmTorqueNm: roundTo(forearmTorque, 2),
        totalExternalTorqueNm: roundTo(totalExternalTorque, 2),
        label: 'External Elbow Flexion Torque Demand (τ_ext)'
      },

      mechanicalAdvantage: {
        biceps: roundTo(bicepsMA, 4),
        brachialis: roundTo(brachialisMA, 4),
        brachioradialis: roundTo(brachioradialisMA, 4)
      },

      assumptionsSummary: {
        brachialisIndependentOfRotation: true,
        bicepsModulatedByRotation: true,
        brachioradialisShuntBehavior: 'Long moment arm, high joint compression at extension',
        isQuasiStatic: true
      }
    };
  }
}
