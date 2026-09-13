/**
 * PROTOTYPE 01 — LATERAL RAISE (ANATOMY & KINEMATIC GEOMETRY)
 * Computes bone positions, joint centers, muscle origins, and insertions.
 */

import { Vector2 } from '../../shared/vectors.js';
import { degToRad } from '../../shared/math.js';
import { ANTHROPOMETRY } from '../../shared/constants.js';

export class LateralRaiseAnatomy {
  constructor(config = {}) {
    this.userHeight = config.height || ANTHROPOMETRY.DEFAULT_HEIGHT; // meters
    this.userMass = config.mass || ANTHROPOMETRY.DEFAULT_MASS;       // kg

    // Segment lengths in meters
    this.humerusLength = this.userHeight * ANTHROPOMETRY.RATIOS.HUMERUS;       // ~0.301 m
    this.forearmLength = this.userHeight * ANTHROPOMETRY.RATIOS.FOREARM;       // ~0.275 m
    this.handGripOffset = this.userHeight * ANTHROPOMETRY.RATIOS.HAND_GRIP;    // ~0.075 m
    this.totalArmLength = this.humerusLength + this.forearmLength + this.handGripOffset; // ~0.651 m

    // Segment masses in kg
    this.armMass = this.userMass * ANTHROPOMETRY.MASS_FRACTIONS.UPPER_ARM;
    this.forearmMass = this.userMass * ANTHROPOMETRY.MASS_FRACTIONS.FOREARM_HAND;

    // Fixed elbow flexion angle (Model assumption: 12 degrees slight flexion)
    this.elbowFlexionAngleDeg = 12;
  }

  /**
   * Calculates 2D anatomical landmark coordinates given the total arm elevation angle.
   * @param {number} elevationAngleDeg - Total arm elevation from vertical (0° = hanging down, 90° = horizontal, 180° = overhead)
   * @param {Vector2} shoulderBasePos - Pixel coordinates of shoulder rest position on canvas
   * @param {number} pixelsPerMeter - Visual scaling factor
   * @returns {Object} Landmark positions and kinematic angles
   */
  getPose(elevationAngleDeg, shoulderBasePos, pixelsPerMeter) {
    const totalAngle = Math.max(0, Math.min(180, elevationAngleDeg));

    // Scapulohumeral Rhythm:
    // 0° - 30°: Setting phase (scapular rotation = 0)
    // 30° - 180°: 2:1 ratio (every 3° total = 1° scapular + 2° glenohumeral)
    let scapulaAngleDeg = 0;
    if (totalAngle > 30) {
      scapulaAngleDeg = (totalAngle - 30) / 3; // Up to 50° at 180° elevation
    }
    const ghAngleDeg = totalAngle - scapulaAngleDeg;

    // Visual segment lengths in pixels
    const humerusPx = this.humerusLength * pixelsPerMeter;
    const forearmPx = this.forearmLength * pixelsPerMeter;
    const handPx = this.handGripOffset * pixelsPerMeter;

    // Shoulder (Glenohumeral Joint Center)
    const ghCenter = shoulderBasePos.clone();

    // Scapula Landmark Geometry (relative to GH center)
    // Scapula rotates around an effective center of rotation on the posterior thoracic wall
    const scapulaPivotPx = ghCenter.clone().add(new Vector2(-35, 45));
    const scapulaRotRad = degToRad(-scapulaAngleDeg); // upward rotation

    // Acromion (Middle Deltoid Origin): superior and slightly lateral/posterior to GH center
    const acromionLocal = new Vector2(5, -28).rotate(scapulaRotRad);
    const acromion = ghCenter.clone().add(acromionLocal);

    // Scapular Spine and Inferior Angle for anatomical rendering
    const scapulaInferiorAngle = scapulaPivotPx.clone().add(new Vector2(-15, 75).rotate(scapulaRotRad));
    const scapulaMedialBorder = scapulaPivotPx.clone().add(new Vector2(-45, 10).rotate(scapulaRotRad));
    const clavicleSternum = ghCenter.clone().add(new Vector2(-70, -32));

    // Arm Kinematics:
    // Elevation angle: 0° points downwards (towards +Y in screen coords).
    // Angle increases laterally away from torso (towards +X in screen coords).
    const elevationRad = degToRad(totalAngle);

    // Humerus vector: pointing from GH center downwards/laterally
    // At 0°: (sin(0), cos(0)) = (0, 1) [downwards]
    // At 90°: (sin(90), cos(90)) = (1, 0) [horizontal right]
    // At 180°: (sin(180), cos(180)) = (0, -1) [upwards]
    const humerusDir = new Vector2(Math.sin(elevationRad), Math.cos(elevationRad));
    const elbow = ghCenter.clone().add(Vector2.scale(humerusDir, humerusPx));

    // Deltoid Tuberosity (Middle Deltoid Insertion): ~38% down the lateral humerus shaft
    const deltoidInsertionRatio = 0.38;
    const deltoidInsertion = ghCenter.clone().add(Vector2.scale(humerusDir, humerusPx * deltoidInsertionRatio));

    // Forearm direction: with slight fixed elbow flexion
    const forearmAngleRad = degToRad(totalAngle - this.elbowFlexionAngleDeg);
    const forearmDir = new Vector2(Math.sin(forearmAngleRad), Math.cos(forearmAngleRad));
    const wrist = elbow.clone().add(Vector2.scale(forearmDir, forearmPx));
    const hand = wrist.clone().add(Vector2.scale(forearmDir, handPx));

    // Centers of mass of arm segments
    const upperArmCom = ghCenter.clone().add(
      Vector2.scale(humerusDir, humerusPx * ANTHROPOMETRY.COM_PROXIMAL_RATIOS.UPPER_ARM)
    );
    const forearmCom = elbow.clone().add(
      Vector2.scale(forearmDir, (forearmPx + handPx) * ANTHROPOMETRY.COM_PROXIMAL_RATIOS.FOREARM)
    );

    return {
      totalAngleDeg: totalAngle,
      scapulaAngleDeg,
      ghAngleDeg,
      landmarks: {
        ghCenter,
        acromion,
        scapulaPivot: scapulaPivotPx,
        scapulaInferiorAngle,
        scapulaMedialBorder,
        clavicleSternum,
        deltoidInsertion,
        elbow,
        wrist,
        hand,
        upperArmCom,
        forearmCom
      },
      metrics: {
        humerusLength: this.humerusLength,
        forearmLength: this.forearmLength,
        handGripOffset: this.handGripOffset,
        totalArmLength: this.totalArmLength,
        armMass: this.armMass,
        forearmMass: this.forearmMass
      }
    };
  }
}
