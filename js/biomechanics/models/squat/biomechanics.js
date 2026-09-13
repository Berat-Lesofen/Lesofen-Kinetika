/**
 * PROTOTYPE 03 — SQUAT (BIOMECHANICAL CALCULATIONS)
 * Rigorous calculation of external moment arms, net extensor moment demands,
 * and the mechanical trade-off between Knee and Hip driven by trunk lean and bar position.
 * Equation: τ = F * r
 */

import { PHYSICS } from '../../shared/constants.js';
import { calculateTorque, roundTo, calculateCenterOfMass } from '../../shared/math.js';

export class SquatBiomechanics {
  constructor(config = {}) {
    this.gravity = config.gravity || PHYSICS.GRAVITY; // 9.80665 m/s²
  }

  /**
   * Calculates external horizontal moment arm from a joint center to the vertical barbell line.
   * r_ext = |x_joint - x_bar|
   * @param {number} jointX 
   * @param {number} barX 
   * @param {number} pixelsPerMeter 
   * @returns {number} Distance in meters
   */
  calculateExternalMomentArm(jointX, barX, pixelsPerMeter) {
    return Math.abs(jointX - barX) / pixelsPerMeter;
  }

  /**
   * Performs complete kinetic and moment demand analysis for a given squat pose.
   * @param {Object} pose - Output from SquatAnatomy.getPose()
   * @param {number} barMassKg - Barbell mass in kg
   * @param {boolean} includeBodyMass - Whether to include segment masses in torque demands
   * @param {number} pixelsPerMeter - Scale factor
   * @returns {Object} Kinetic parameters and net joint moment demands
   */
  analyze(pose, barMassKg = 100, includeBodyMass = true, pixelsPerMeter = 360) {
    const { landmarks, angles, metrics, barPositionType } = pose;

    // 1. External Forces (N)
    const barbellWeightN = barMassKg * this.gravity;
    const trunkWeightN = metrics.trunkMass * this.gravity;
    const thighWeightN = metrics.thighMass * this.gravity;
    const shankWeightN = metrics.shankMass * this.gravity;

    // 2. Barbell Vertical Line of Gravity X-coordinate
    const barX = landmarks.barbell.x;

    // 3. External Moment Arms (m) relative to Barbell Gravity Line:
    const kneeMomentArmM = this.calculateExternalMomentArm(landmarks.knee.x, barX, pixelsPerMeter);
    const hipMomentArmM = this.calculateExternalMomentArm(landmarks.hip.x, barX, pixelsPerMeter);
    const ankleMomentArmM = this.calculateExternalMomentArm(landmarks.ankle.x, barX, pixelsPerMeter);

    // 4. System Center of Mass (COM)
    const massElements = [
      { mass: barMassKg, x: landmarks.barbell.x, y: landmarks.barbell.y },
      { mass: metrics.trunkMass, x: landmarks.trunkCom.x, y: landmarks.trunkCom.y },
      { mass: metrics.thighMass, x: landmarks.thighCom.x, y: landmarks.thighCom.y },
      { mass: metrics.shankMass, x: landmarks.shankCom.x, y: landmarks.shankCom.y }
    ];
    const systemCom = calculateCenterOfMass(massElements);
    const comMomentArmKneeM = this.calculateExternalMomentArm(landmarks.knee.x, systemCom.x, pixelsPerMeter);
    const comMomentArmHipM = this.calculateExternalMomentArm(landmarks.hip.x, systemCom.x, pixelsPerMeter);

    // 5. External Moment Demands (N·m)
    // Barbell Contribution
    const barKneeTorqueNm = calculateTorque(barbellWeightN, kneeMomentArmM);
    const barHipTorqueNm = calculateTorque(barbellWeightN, hipMomentArmM);

    // Body Weight Segment Contributions
    const trunkHipTorqueNm = calculateTorque(trunkWeightN, this.calculateExternalMomentArm(landmarks.hip.x, landmarks.trunkCom.x, pixelsPerMeter));
    const trunkKneeTorqueNm = calculateTorque(trunkWeightN, this.calculateExternalMomentArm(landmarks.knee.x, landmarks.trunkCom.x, pixelsPerMeter));
    const thighKneeTorqueNm = calculateTorque(thighWeightN, this.calculateExternalMomentArm(landmarks.knee.x, landmarks.thighCom.x, pixelsPerMeter));

    // Total Net Extensor Moment Demands:
    const totalKneeDemandNm = includeBodyMass
      ? (barKneeTorqueNm + trunkKneeTorqueNm + thighKneeTorqueNm)
      : barKneeTorqueNm;

    const totalHipDemandNm = includeBodyMass
      ? (barHipTorqueNm + trunkHipTorqueNm)
      : barHipTorqueNm;

    // 6. Mechanical Ratio: Hip-to-Knee Moment Demand Ratio
    const hipToKneeRatio = totalKneeDemandNm > 1 ? (totalHipDemandNm / totalKneeDemandNm) : 1.0;

    return {
      depthPercent: roundTo(pose.depthNorm * 100, 1),
      angles: {
        kneeFlexionDeg: angles.kneeFlexionDeg,
        hipFlexionDeg: angles.hipFlexionDeg,
        ankleDorsiflexionDeg: angles.ankleDorsiflexionDeg,
        trunkLeanDeg: angles.trunkLeanDeg
      },
      barPositionType,

      forces: {
        barMassKg: roundTo(barMassKg, 1),
        barbellWeightN: roundTo(barbellWeightN, 1),
        systemWeightN: roundTo(barbellWeightN + trunkWeightN + thighWeightN + shankWeightN, 1)
      },

      momentArms: {
        kneeExternalM: roundTo(kneeMomentArmM, 4),
        kneeExternalCm: roundTo(kneeMomentArmM * 100, 2),

        hipExternalM: roundTo(hipMomentArmM, 4),
        hipExternalCm: roundTo(hipMomentArmM * 100, 2),

        ankleExternalM: roundTo(ankleMomentArmM, 4),
        ankleExternalCm: roundTo(ankleMomentArmM * 100, 2)
      },

      torques: {
        kneeExtensorDemandNm: roundTo(totalKneeDemandNm, 1),
        hipExtensorDemandNm: roundTo(totalHipDemandNm, 1),
        barOnlyKneeNm: roundTo(barKneeTorqueNm, 1),
        barOnlyHipNm: roundTo(barHipTorqueNm, 1),
        hipToKneeRatio: roundTo(hipToKneeRatio, 2),
        labelKnee: 'Modelled External Knee Extension Moment Demand',
        labelHip: 'Modelled External Hip Extension Moment Demand'
      },

      com: {
        x: systemCom.x,
        y: systemCom.y,
        midfootDeltaCm: roundTo((landmarks.midfootX - barX) / pixelsPerMeter * 100, 1)
      },

      assumptionsSummary: {
        isQuasiStatic: true,
        planarModel: 'Sagittal 2D closed chain',
        scientificNote: 'Fry et al. (2003) — Trunk inclination directly governs knee vs hip moment arm distribution.'
      }
    };
  }
}
