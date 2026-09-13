/**
 * PROTOTYPE 02 — BICEPS CURL (ANATOMY & KINEMATICS)
 * Independent kinematic modeling of Humerus, Radius, Ulna, and 3 distinct flexor muscles:
 * 1. Biceps brachii (inserts on radial tuberosity, affected by pronation/supination)
 * 2. Brachialis (inserts on ulnar tuberosity, completely independent of pronation/supination)
 * 3. Brachioradialis (origin on lateral supracondylar ridge, inserts on radial styloid process)
 */

import { Vector2 } from '../../shared/vectors.js';
import { degToRad } from '../../shared/math.js';
import { ANTHROPOMETRY } from '../../shared/constants.js';

export class BicepsCurlAnatomy {
  constructor(config = {}) {
    this.userHeight = config.height || ANTHROPOMETRY.DEFAULT_HEIGHT; // meters (~1.75 m)
    this.userMass = config.mass || ANTHROPOMETRY.DEFAULT_MASS;       // kg (~75 kg)

    // Segment lengths in meters
    this.humerusLength = this.userHeight * ANTHROPOMETRY.RATIOS.HUMERUS;       // ~0.301 m
    this.forearmLength = this.userHeight * ANTHROPOMETRY.RATIOS.FOREARM;       // ~0.275 m
    this.handGripOffset = this.userHeight * ANTHROPOMETRY.RATIOS.HAND_GRIP;    // ~0.075 m
    this.totalForearmLever = this.forearmLength + this.handGripOffset;         // ~0.350 m

    // Segment mass
    this.forearmMass = this.userMass * ANTHROPOMETRY.MASS_FRACTIONS.FOREARM_HAND; // ~1.65 kg
  }

  /**
   * Computes 2D landmark coordinates for Humerus, Ulna, Radius, and the 3 muscles.
   * @param {number} flexionAngleDeg - Elbow flexion (0° = full extension, 90° = horizontal, 150° = deep flexion)
   * @param {number} forearmRotationDeg - Forearm rotation (-80° = Full Pronation, 0° = Neutral/Hammer, +80° = Full Supination)
   * @param {Vector2} elbowBasePos - Coordinates of elbow joint center on canvas
   * @param {number} pixelsPerMeter - Scale factor
   * @returns {Object} Landmark coordinates and segment properties
   */
  getPose(flexionAngleDeg, forearmRotationDeg, elbowBasePos, pixelsPerMeter) {
    const flexion = Math.max(0, Math.min(150, flexionAngleDeg));
    const rotation = Math.max(-80, Math.min(80, forearmRotationDeg));

    const humerusPx = this.humerusLength * pixelsPerMeter;
    const forearmPx = this.forearmLength * pixelsPerMeter;
    const handPx = this.handGripOffset * pixelsPerMeter;
    const totalLeverPx = forearmPx + handPx;

    // 1. Joint Centers
    const elbowCenter = elbowBasePos.clone();
    
    // Shoulder anchor (Humerus hangs vertically downward in standard curl pose)
    // Shoulder is directly above elbow
    const shoulderCenter = elbowCenter.clone().add(new Vector2(0, -humerusPx));

    // 2. Forearm Direction Vector:
    // At 0° flexion (extension): points straight down (0, 1)
    // At 90° flexion: points horizontal forward/right (1, 0)
    // At 150° flexion: points upwards/backwards towards shoulder
    const flexionRad = degToRad(flexion);
    const forearmDir = new Vector2(Math.sin(flexionRad), Math.cos(flexionRad));
    // Perpendicular vector to forearm (pointing anteriorly)
    const forearmPerp = new Vector2(-Math.cos(flexionRad), Math.sin(flexionRad));

    // Wrist and Hand Grip Center (Load point)
    const wristCenter = elbowCenter.clone().add(Vector2.scale(forearmDir, forearmPx));
    const handGrip = elbowCenter.clone().add(Vector2.scale(forearmDir, totalLeverPx));

    // Forearm Center of Mass
    const forearmCom = elbowCenter.clone().add(
      Vector2.scale(forearmDir, totalLeverPx * ANTHROPOMETRY.COM_PROXIMAL_RATIOS.FOREARM)
    );

    // 3. Pronation / Supination Geometric Modeling of Radius and Ulna:
    // - Ulna does NOT rotate around its axis; it articulates with the trochlea.
    // - Radius articulates with capitulum proximally and rotates around the ulna.
    // In Neutral (0°): Radius and Ulna run parallel with slight separation.
    // In Full Supination (+80°): Radius is fully on the lateral/anterior side.
    // In Full Pronation (-80°): Radius crosses diagonally over the ulna.
    const rotRad = degToRad(rotation);
    const normRot = rotation / 80; // -1 (pronated) to +1 (supinated)

    // Ulna segment (medial/posterior bone)
    const ulnaOffsetPx = 6;
    const ulnaProximal = elbowCenter.clone().add(Vector2.scale(forearmPerp, -ulnaOffsetPx));
    const ulnaDistal = wristCenter.clone().add(Vector2.scale(forearmPerp, -ulnaOffsetPx));
    const olecranon = elbowCenter.clone().add(new Vector2(0, -14).rotate(degToRad(flexion * 0.4)));

    // Radius segment (lateral/anterior bone)
    // Distal radius crosses over towards ulna when pronated (normRot < 0)
    const radiusProximal = elbowCenter.clone().add(Vector2.scale(forearmPerp, 7));
    const radiusDistalShift = 10 * normRot; // +10px in supination, -10px (crossing) in pronation
    const radiusDistal = wristCenter.clone().add(Vector2.scale(forearmPerp, radiusDistalShift));

    // 4. Muscle Attachments — 3 SEPARATE STRUCTURES:

    // A. BICEPS BRACHII:
    // Origin: Proximal humerus / anterior shoulder
    const bicepsOrigin = shoulderCenter.clone().add(new Vector2(10, 20));
    // Insertion: Radial Tuberosity (tuberculum radii, ~3.5 cm distal to elbow on the radius)
    // When supinated (normRot > 0): tuberosity points anterior/medial, maximum lever arm.
    // When pronated (normRot < 0): tuberosity wraps posteriorly/laterally, reducing flexor lever arm.
    const radialTuberosityDistPx = 0.035 * pixelsPerMeter;
    const tuberosityWrapOffset = 8 * normRot; // Shifts along anterior/posterior axis with rotation
    const radialTuberosity = radiusProximal.clone()
      .add(Vector2.scale(forearmDir, radialTuberosityDistPx))
      .add(Vector2.scale(forearmPerp, tuberosityWrapOffset));

    // B. BRACHIALIS:
    // Origin: Mid-anterior shaft of humerus
    const brachialisOrigin = shoulderCenter.clone().add(new Vector2(8, humerusPx * 0.55));
    // Insertion: Ulnar Tuberosity (tuberositas ulnae, ~2.5 cm distal to elbow on coronoid process of ULNA)
    // NOTE: Invariant to forearm rotation! Ulna does not rotate!
    const ulnarTuberosityDistPx = 0.028 * pixelsPerMeter;
    const ulnarTuberosity = ulnaProximal.clone()
      .add(Vector2.scale(forearmDir, ulnarTuberosityDistPx))
      .add(Vector2.scale(forearmPerp, 3)); // slightly anterior on coronoid

    // C. BRACHIORADIALIS:
    // Origin: Lateral supracondylar ridge of humerus (just proximal to lateral epicondyle)
    const brachioradialisOrigin = shoulderCenter.clone().add(new Vector2(14, humerusPx * 0.82));
    // Insertion: Radial Styloid Process (distal radius near wrist)
    const radialStyloid = radiusDistal.clone().add(Vector2.scale(forearmPerp, 4));

    return {
      flexionAngleDeg: flexion,
      forearmRotationDeg: rotation,
      forearmRotationState: rotation > 30 ? 'SUPINATED' : (rotation < -30 ? 'PRONATED' : 'NEUTRAL'),
      landmarks: {
        shoulderCenter,
        elbowCenter,
        wristCenter,
        handGrip,
        forearmCom,
        // Bones
        olecranon,
        ulnaProximal,
        ulnaDistal,
        radiusProximal,
        radiusDistal,
        // Muscle Attachments
        bicepsOrigin,
        radialTuberosity,
        brachialisOrigin,
        ulnarTuberosity,
        brachioradialisOrigin,
        radialStyloid
      },
      metrics: {
        humerusLength: this.humerusLength,
        forearmLength: this.forearmLength,
        handGripOffset: this.handGripOffset,
        totalForearmLever: this.totalForearmLever,
        forearmMass: this.forearmMass
      }
    };
  }
}
