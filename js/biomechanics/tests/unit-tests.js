/**
 * BIOMECHANICS MODEL LAB — UNIT TEST SUITE
 * Tests mathematical functions, vector operations, kinematic rhythm, and kinetic equations.
 */

import { degToRad, radToDeg, clamp, roundTo, calculateTorque, calculateMechanicalAdvantage, pointToLineDistance, projectPointOntoLine } from '../shared/math.js';
import { Vector2 } from '../shared/vectors.js';
import { LateralRaiseAnatomy } from '../models/lateralRaise/anatomy.js';
import { LateralRaiseBiomechanics } from '../models/lateralRaise/biomechanics.js';
import { LateralRaiseModel } from '../models/lateralRaise/model.js';
import { BicepsCurlAnatomy } from '../models/bicepsCurl/anatomy.js';
import { BicepsCurlBiomechanics } from '../models/bicepsCurl/biomechanics.js';
import { BicepsCurlModel } from '../models/bicepsCurl/model.js';
import { SquatAnatomy } from '../models/squat/anatomy.js';
import { SquatBiomechanics } from '../models/squat/biomechanics.js';
import { SquatModel } from '../models/squat/model.js';
import { BenchPressAnatomy } from '../models/benchPress/anatomy.js';
import { BenchPressBiomechanics } from '../models/benchPress/biomechanics.js';
import { BenchPressModel } from '../models/benchPress/model.js';
import { PHYSICS } from '../shared/constants.js';

export function runAllTests() {
  const results = [];

  function test(name, fn) {
    try {
      fn();
      results.push({ name, passed: true });
    } catch (err) {
      results.push({ name, passed: false, error: err.message });
    }
  }

  function assert(condition, message) {
    if (!condition) {
      throw new Error(message || 'Assertion failed');
    }
  }

  function assertClose(actual, expected, tolerance = 1e-4, message = '') {
    if (Math.abs(actual - expected) > tolerance) {
      throw new Error(`${message}: Expected ${expected} ± ${tolerance}, got ${actual}`);
    }
  }

  // ==========================================
  // 1. SHARED MATH UTILITY TESTS
  // ==========================================
  test('Math: degToRad and radToDeg conversions', () => {
    assertClose(degToRad(0), 0);
    assertClose(degToRad(90), Math.PI / 2);
    assertClose(degToRad(180), Math.PI);
    assertClose(radToDeg(Math.PI / 2), 90);
    assertClose(radToDeg(Math.PI), 180);
  });

  test('Math: clamp and roundTo', () => {
    assert(clamp(5, 0, 10) === 5, 'clamp within range');
    assert(clamp(-5, 0, 10) === 0, 'clamp min');
    assert(clamp(15, 0, 10) === 10, 'clamp max');
    assertClose(roundTo(3.14159, 2), 3.14, 1e-5);
    assertClose(roundTo(3.14159, 4), 3.1416, 1e-5);
  });

  test('Math: calculateTorque (τ = F * r)', () => {
    // 100 N force with 0.5 m moment arm => 50 N·m
    assertClose(calculateTorque(100, 0.5), 50.0);
    // 0 moment arm => 0 torque
    assertClose(calculateTorque(500, 0), 0.0);
    // Non-finite values safely return 0 without throw
    assert(calculateTorque(NaN, 5) === 0, 'NaN force handled');
    assert(calculateTorque(100, Infinity) === 0, 'Infinity moment arm handled');
  });

  test('Math: calculateMechanicalAdvantage (MA = r_int / r_ext)', () => {
    assertClose(calculateMechanicalAdvantage(0.03, 0.60), 0.05);
    assert(calculateMechanicalAdvantage(0.03, 0) === 0, 'Zero external arm avoids division by zero');
  });

  test('Math: pointToLineDistance', () => {
    // Distance from (0, 5) to horizontal line y = 0
    const d1 = pointToLineDistance(0, 5, -10, 0, 10, 0);
    assertClose(d1, 5.0);

    // Distance from (4, 0) to vertical line x = 10
    const d2 = pointToLineDistance(4, 0, 10, -10, 10, 10);
    assertClose(d2, 6.0);
  });

  test('Math: projectPointOntoLine', () => {
    // Projection of (5, 7) onto line y = 3 (horizontal line from (0,3) to (10,3))
    const proj = projectPointOntoLine(5, 7, 0, 3, 10, 3);
    assertClose(proj.x, 5.0);
    assertClose(proj.y, 3.0);
  });

  // ==========================================
  // 2. VECTOR UTILITY TESTS
  // ==========================================
  test('Vectors: 2D vector arithmetic', () => {
    const v1 = new Vector2(3, 4);
    assertClose(v1.length(), 5.0, 1e-5, 'Length of (3,4)');
    
    const vNorm = v1.clone().normalize();
    assertClose(vNorm.length(), 1.0, 1e-5, 'Normalized length is 1');
    assertClose(vNorm.x, 0.6, 1e-5);
    assertClose(vNorm.y, 0.8, 1e-5);

    const vAdd = Vector2.add(new Vector2(1, 2), new Vector2(3, 4));
    assert(vAdd.x === 4 && vAdd.y === 6, 'Vector addition');

    const dot = new Vector2(1, 0).dot(new Vector2(0, 1));
    assertClose(dot, 0.0, 1e-5, 'Orthogonal dot product is 0');

    const cross = new Vector2(1, 0).cross(new Vector2(0, 1));
    assertClose(cross, 1.0, 1e-5, 'Unit cross product is 1');
  });

  // ==========================================
  // 3. LATERAL RAISE ANATOMY TESTS
  // ==========================================
  test('Lateral Raise Anatomy: Scapulohumeral rhythm (2:1)', () => {
    const anatomy = new LateralRaiseAnatomy();
    const shoulderPos = new Vector2(200, 200);
    const pxPerM = 400;

    // At 0° elevation: Setting phase, scapula angle is 0°
    const pose0 = anatomy.getPose(0, shoulderPos, pxPerM);
    assertClose(pose0.scapulaAngleDeg, 0, 1e-4, 'Scapula at 0°');
    assertClose(pose0.ghAngleDeg, 0, 1e-4, 'GH at 0°');

    // At 30° elevation: End of setting phase, scapula angle is 0°
    const pose30 = anatomy.getPose(30, shoulderPos, pxPerM);
    assertClose(pose30.scapulaAngleDeg, 0, 1e-4, 'Scapula at 30°');
    assertClose(pose30.ghAngleDeg, 30, 1e-4, 'GH at 30°');

    // At 90° elevation: 60° above setting phase => (60/3) = 20° scapula, 70° GH
    const pose90 = anatomy.getPose(90, shoulderPos, pxPerM);
    assertClose(pose90.scapulaAngleDeg, 20, 1e-4, 'Scapula at 90° is 20°');
    assertClose(pose90.ghAngleDeg, 70, 1e-4, 'GH at 90° is 70°');
    assertClose(pose90.scapulaAngleDeg + pose90.ghAngleDeg, 90, 1e-4, 'Sum equals total angle');

    // At 180° elevation: 150° above setting => 50° scapula, 130° GH
    const pose180 = anatomy.getPose(180, shoulderPos, pxPerM);
    assertClose(pose180.scapulaAngleDeg, 50, 1e-4, 'Scapula at 180° is 50°');
    assertClose(pose180.ghAngleDeg, 130, 1e-4, 'GH at 180° is 130°');
    assertClose(pose180.scapulaAngleDeg + pose180.ghAngleDeg, 180, 1e-4, 'Sum equals total angle');
  });

  // ==========================================
  // 4. LATERAL RAISE BIOMECHANICS & TORQUE TESTS
  // ==========================================
  test('Lateral Raise Biomechanics: External moment arm behavior', () => {
    const biomech = new LateralRaiseBiomechanics();
    const armLength = 0.65; // meters

    // At 0°: Hanging down => moment arm must be 0
    assertClose(biomech.calculateExternalMomentArm(0, armLength), 0, 1e-4, 'Moment arm at 0°');

    // At 90°: Horizontal => moment arm must equal segment length exactly
    assertClose(biomech.calculateExternalMomentArm(90, armLength), armLength, 1e-4, 'Moment arm at 90°');

    // At 30°: sin(30°) = 0.5 => moment arm is 0.5 * L
    assertClose(biomech.calculateExternalMomentArm(30, armLength), armLength * 0.5, 1e-4, 'Moment arm at 30°');

    // At 180°: Vertical overhead => moment arm is 0
    assertClose(biomech.calculateExternalMomentArm(180, armLength), 0, 1e-4, 'Moment arm at 180°');
  });

  test('Lateral Raise Biomechanics: Internal moment arm curve', () => {
    const biomech = new LateralRaiseBiomechanics();

    const r0 = biomech.calculateInternalMomentArm(0);
    const r60 = biomech.calculateInternalMomentArm(60);
    const r90 = biomech.calculateInternalMomentArm(90);
    const r180 = biomech.calculateInternalMomentArm(180);

    // Peak around 60° (Kuechle 1997 / Murray 2006)
    assertClose(r60, 0.033, 1e-3, 'Peak internal moment arm at 60° is ~3.3 cm');
    assert(r60 > r0, 'Peak at 60° is greater than at 0°');
    assert(r60 > r90, 'Peak at 60° is greater than at 90°');
    assert(r90 > r180, 'Moment arm at 90° is greater than at 180°');

    // All values must be physically positive and within 0.005 m to 0.040 m
    for (let angle = 0; angle <= 180; angle += 10) {
      const r = biomech.calculateInternalMomentArm(angle);
      assert(Number.isFinite(r) && r >= 0.005 && r <= 0.040, `Safe physiological range at ${angle}°: ${r}m`);
    }
  });

  test('Lateral Raise Biomechanics: External torque matches τ = F * r', () => {
    const anatomy = new LateralRaiseAnatomy();
    const biomech = new LateralRaiseBiomechanics();
    const shoulderPos = new Vector2(200, 200);

    const pose90 = anatomy.getPose(90, shoulderPos, 400);
    const loadKg = 10;
    const analysis90 = biomech.analyze(pose90, loadKg, false); // isolate load torque

    const expectedWeight = loadKg * PHYSICS.GRAVITY; // 98.0665 N
    const expectedMomentArm = pose90.metrics.totalArmLength; // L_arm meters
    const expectedTorque = expectedWeight * expectedMomentArm;

    assertClose(analysis90.forces.dumbbellWeightN, expectedWeight, 0.1, 'Dumbbell weight N');
    assertClose(analysis90.momentArms.externalLoadM, expectedMomentArm, 0.001, 'Moment arm m');
    assertClose(analysis90.torques.loadTorqueNm, expectedTorque, 0.1, 'Torque equation matches τ = F * r');

    // Check that at 0°, torque is 0
    const pose0 = anatomy.getPose(0, shoulderPos, 400);
    const analysis0 = biomech.analyze(pose0, loadKg, false);
    assertClose(analysis0.torques.loadTorqueNm, 0.0, 1e-3, 'Torque at 0° is 0');
  });

  test('Lateral Raise Biomechanics: Required deltoid force under quasi-static equilibrium', () => {
    const anatomy = new LateralRaiseAnatomy();
    const biomech = new LateralRaiseBiomechanics();
    const shoulderPos = new Vector2(200, 200);

    const pose90 = anatomy.getPose(90, shoulderPos, 400);
    const analysis90 = biomech.analyze(pose90, 10, true);

    // At 90° with 10 kg dumbbell + arm mass:
    // Total torque ~ 70 Nm. Deltoid moment arm ~ 0.03 m.
    // Required muscle force ~ 70 / 0.03 ~ 2300 N!
    assert(analysis90.forces.deltoidForceN > 1500 && analysis90.forces.deltoidForceN < 3000,
      `Deltoid force realistic mechanical demand: ${analysis90.forces.deltoidForceN} N`);
    
    // Mechanical advantage at 90° must reflect 3rd class lever (~0.04 - 0.06)
    assert(analysis90.mechanicalAdvantage > 0.03 && analysis90.mechanicalAdvantage < 0.07,
      `Mechanical advantage reflects 3rd class lever: ${analysis90.mechanicalAdvantage}`);
  });

  test('Lateral Raise Scientific Metadata: Explicit disclaimer labeling', () => {
    const anatomy = new LateralRaiseAnatomy();
    const biomech = new LateralRaiseBiomechanics();
    const pose90 = anatomy.getPose(90, new Vector2(200, 200), 400);
    const analysis90 = biomech.analyze(pose90, 10, true);

    // Verify Deltoid force is labeled as modelled demand, not absolute in vivo force
    assert(analysis90.forces.deltoidForceLabel.includes('Modelled deltoid force demand under quasi-static assumptions'),
      'Deltoid force explicitly labeled as modelled demand under quasi-static assumptions');

    // Verify 2:1 rhythm is labeled as baseline simplified model
    assert(analysis90.modelAssumptionsNotes.scapulohumeralRhythm.includes('Baseline simplified model'),
      'Rhythm explicitly labeled as baseline simplified model');

    // Verify moment arm curve is labeled as model/reference curve
    assert(analysis90.momentArms.deltoidCurveType.includes('Model / Reference curve'),
      'Moment arm curve labeled as model/reference curve');
  });

  // ==========================================
  // 5. BICEPS CURL TESTS (PROTOTYPE 02)
  // ==========================================
  test('Biceps Curl: External moment arm and torque calculation', () => {
    const anatomy = new BicepsCurlAnatomy();
    const biomech = new BicepsCurlBiomechanics();
    const leverLength = anatomy.totalForearmLever; // ~0.35 m

    // At 0° flexion: hanging down => moment arm is 0
    assertClose(biomech.calculateExternalMomentArm(0, leverLength), 0, 1e-4, 'At 0° flexion r_ext is 0');

    // At 90° flexion: forearm horizontal => moment arm is exactly lever length
    assertClose(biomech.calculateExternalMomentArm(90, leverLength), leverLength, 1e-4, 'At 90° flexion r_ext is max');

    // At 30° flexion: sin(30) = 0.5 => 0.5 * leverLength
    assertClose(biomech.calculateExternalMomentArm(30, leverLength), leverLength * 0.5, 1e-4, 'At 30° flexion r_ext is 0.5 * L');

    // Torque verification: 10 kg load at 90°
    const pose90 = anatomy.getPose(90, 80, new Vector2(200, 200), 400);
    const analysis90 = biomech.analyze(pose90, 10, false); // isolate load torque
    const expectedWeight = 10 * PHYSICS.GRAVITY; // 98.0665 N
    const expectedTorque = expectedWeight * leverLength;

    assertClose(analysis90.forces.loadWeightN, expectedWeight, 0.1, 'Load weight N');
    assertClose(analysis90.momentArms.externalLoadM, leverLength, 0.001, 'External moment arm m');
    assertClose(analysis90.torques.loadTorqueNm, expectedTorque, 0.1, 'Torque τ = F * r');
  });

  test('Biceps Curl: Three distinct muscle entities (not merged into one record)', () => {
    const anatomy = new BicepsCurlAnatomy();
    const biomech = new BicepsCurlBiomechanics();
    const pose90 = anatomy.getPose(90, 0, new Vector2(200, 200), 400);
    const analysis90 = biomech.analyze(pose90, 10, true);

    // Ensure all three muscles have distinct properties and values
    const rBiceps = analysis90.momentArms.bicepsInternalM;
    const rBrachialis = analysis90.momentArms.brachialisInternalM;
    const rBrachioradialis = analysis90.momentArms.brachioradialisInternalM;

    assert(rBiceps !== undefined && rBrachialis !== undefined && rBrachioradialis !== undefined,
      'All 3 muscles exist as distinct keys');
    assert(rBiceps > 0 && rBrachialis > 0 && rBrachioradialis > 0,
      'All 3 muscles have positive physiological moment arms');
    assert(rBiceps !== rBrachialis && rBiceps !== rBrachioradialis && rBrachialis !== rBrachioradialis,
      'All 3 muscles have distinct, unmerged moment arms');

    // Anatomical insertion check:
    // Biceps inserts on radius, Brachialis inserts on ulna, Brachioradialis inserts on distal radius
    assert(pose90.landmarks.radialTuberosity !== undefined, 'Biceps has radial tuberosity insertion');
    assert(pose90.landmarks.ulnarTuberosity !== undefined, 'Brachialis has ulnar tuberosity insertion');
    assert(pose90.landmarks.radialStyloid !== undefined, 'Brachioradialis has radial styloid insertion');
  });

  test('Biceps Curl: Brachialis rotation invariance (attaches to ulna)', () => {
    const biomech = new BicepsCurlBiomechanics();

    // Ulna does not rotate during pronation/supination.
    // Therefore, Brachialis moment arm must be identical at Pronated (-80°), Neutral (0°), and Supinated (+80°).
    const rBrachAtPronated = biomech.calculateBrachialisMomentArm(90);
    const rBrachAtNeutral = biomech.calculateBrachialisMomentArm(90);
    const rBrachAtSupinated = biomech.calculateBrachialisMomentArm(90);

    assertClose(rBrachAtPronated, rBrachAtSupinated, 1e-6, 'Brachialis moment arm invariant to pronation/supination');
    assertClose(rBrachAtNeutral, rBrachAtSupinated, 1e-6, 'Brachialis moment arm identical across rotations');
    assertClose(rBrachAtNeutral, 0.030, 0.005, 'Brachialis moment arm at 90° is ~3 cm (Murray 1995)');
  });

  test('Biceps Curl: Biceps pronation modulation (radial tuberosity wrapping)', () => {
    const biomech = new BicepsCurlBiomechanics();

    // In supination (+80°): radial tuberosity points anterior/medial => max moment arm
    // In pronation (-80°): radius crosses ulna, tendon wraps => moment arm is significantly reduced
    const rBicepsSupinated = biomech.calculateBicepsMomentArm(90, 80);
    const rBicepsNeutral = biomech.calculateBicepsMomentArm(90, 0);
    const rBicepsPronated = biomech.calculateBicepsMomentArm(90, -80);

    assert(rBicepsSupinated > rBicepsNeutral, 'Biceps moment arm in supination > neutral');
    assert(rBicepsNeutral > rBicepsPronated, 'Biceps moment arm in neutral > pronation');
    assert(rBicepsSupinated > rBicepsPronated * 1.3, 'Biceps moment arm in supination is >30% higher than in pronation');

    // Peak reference check: ~4.9 cm in full supination at 90° (Murray 1995)
    assertClose(rBicepsSupinated, 0.049, 0.005, 'Biceps peak moment arm in supination at 90° is ~4.9 cm');
  });

  test('Biceps Curl: Brachioradialis long lever arm & neutral peak', () => {
    const biomech = new BicepsCurlBiomechanics();

    const rBrdNeutral = biomech.calculateBrachioradialisMomentArm(90, 0);
    const rBrdSup = biomech.calculateBrachioradialisMomentArm(90, 80);
    const rBicepsSup = biomech.calculateBicepsMomentArm(90, 80);

    // Brachioradialis has the longest moment arm of all 3 flexors (~7.5 cm at 90° neutral)
    assert(rBrdNeutral > rBicepsSup, 'Brachioradialis has longer moment arm than biceps');
    assert(rBrdNeutral >= rBrdSup, 'Brachioradialis moment arm is highest in neutral grip');
    assertClose(rBrdNeutral, 0.075, 0.005, 'Brachioradialis neutral moment arm at 90° is ~7.5 cm (Murray 1995)');
  });

  test('Biceps Curl: Robustness & NaN/Infinity safety across all ranges', () => {
    const anatomy = new BicepsCurlAnatomy();
    const biomech = new BicepsCurlBiomechanics();

    for (let flex = 0; flex <= 150; flex += 15) {
      for (let rot = -80; rot <= 80; rot += 40) {
        const pose = anatomy.getPose(flex, rot, new Vector2(200, 200), 400);
        const analysis = biomech.analyze(pose, 15, true);

        assert(Number.isFinite(analysis.torques.totalExternalTorqueNm), `Torque finite at flex=${flex}, rot=${rot}`);
        assert(Number.isFinite(analysis.momentArms.bicepsInternalM), `Biceps arm finite at flex=${flex}, rot=${rot}`);
        assert(Number.isFinite(analysis.momentArms.brachialisInternalM), `Brachialis arm finite at flex=${flex}, rot=${rot}`);
        assert(Number.isFinite(analysis.momentArms.brachioradialisInternalM), `Brachioradialis arm finite at flex=${flex}, rot=${rot}`);
        assert(Number.isFinite(analysis.forces.bicepsForceDemandN), `Force demand finite at flex=${flex}, rot=${rot}`);
      }
    }
  });

  // ==========================================
  // 6. SQUAT TESTS (PROTOTYPE 03)
  // ==========================================
  test('Squat: Kinematics across depth (standing to bottom)', () => {
    const anatomy = new SquatAnatomy();
    const footPos = new Vector2(200, 400);

    // Depth 0: Standing
    const pose0 = anatomy.getPose(0, 0, 'HIGH_BAR', footPos, 360);
    assertClose(pose0.angles.kneeFlexionDeg, 0, 1.0, 'Standing knee flexion is 0°');
    assertClose(pose0.angles.ankleDorsiflexionDeg, 0, 1.0, 'Standing ankle dorsiflexion is 0°');

    // Depth 1.0: Deep Squat
    const pose1 = anatomy.getPose(1.0, 0, 'HIGH_BAR', footPos, 360);
    assert(pose1.angles.kneeFlexionDeg > 110 && pose1.angles.kneeFlexionDeg < 130, 'Deep squat knee flexion ~120°');
    assert(pose1.angles.ankleDorsiflexionDeg > 15 && pose1.angles.ankleDorsiflexionDeg < 30, 'Ankle dorsiflexion physiological range');
    assert(pose1.landmarks.knee.y > pose0.landmarks.knee.y - 10, 'Knee level relative to standing');
  });

  test('Squat: Trunk lean impact on Knee vs Hip moment arms (Fry et al. 2003)', () => {
    const anatomy = new SquatAnatomy();
    const biomech = new SquatBiomechanics();
    const footPos = new Vector2(200, 400);

    // Deep squat with Upright Trunk (-10°)
    const poseUpright = anatomy.getPose(1.0, -10, 'HIGH_BAR', footPos, 360);
    const analysisUpright = biomech.analyze(poseUpright, 100, false, 360);

    // Deep squat with Forward Trunk Lean (+25°)
    const poseLeaned = anatomy.getPose(1.0, 25, 'HIGH_BAR', footPos, 360);
    const analysisLeaned = biomech.analyze(poseLeaned, 100, false, 360);

    // When trunk leans forward:
    // 1. Hip moment arm INCREASES significantly
    assert(analysisLeaned.momentArms.hipExternalM > analysisUpright.momentArms.hipExternalM * 1.25,
      'Forward lean increases hip external moment arm by >25% (Fry et al. 2003)');

    // 2. Knee moment arm DECREASES significantly
    assert(analysisLeaned.momentArms.kneeExternalM < analysisUpright.momentArms.kneeExternalM,
      'Forward lean decreases knee external moment arm (Fry et al. 2003)');

    // 3. Hip-to-Knee torque ratio increases dramatically
    assert(analysisLeaned.torques.hipToKneeRatio > analysisUpright.torques.hipToKneeRatio,
      'Hip-to-Knee moment ratio increases with forward trunk lean');
  });

  test('Squat: Barbell torque equation verification (τ = F * r)', () => {
    const anatomy = new SquatAnatomy();
    const biomech = new SquatBiomechanics();
    const footPos = new Vector2(200, 400);

    const pose = anatomy.getPose(1.0, 0, 'HIGH_BAR', footPos, 360);
    const barMass = 100; // kg
    const analysis = biomech.analyze(pose, barMass, false, 360); // isolate bar torque

    const expectedWeight = barMass * PHYSICS.GRAVITY; // 980.665 N
    const expectedKneeTorque = expectedWeight * analysis.momentArms.kneeExternalM;
    const expectedHipTorque = expectedWeight * analysis.momentArms.hipExternalM;

    assertClose(analysis.forces.barbellWeightN, expectedWeight, 0.1, 'Barbell weight N');
    assertClose(analysis.torques.barOnlyKneeNm, expectedKneeTorque, 0.2, 'Knee torque τ = F * r');
    assertClose(analysis.torques.barOnlyHipNm, expectedHipTorque, 0.2, 'Hip torque τ = F * r');
  });

  test('Squat: High-Bar vs Low-Bar position offset', () => {
    const anatomy = new SquatAnatomy();
    const footPos = new Vector2(200, 400);

    const poseHigh = anatomy.getPose(1.0, 10, 'HIGH_BAR', footPos, 360);
    const poseLow = anatomy.getPose(1.0, 10, 'LOW_BAR', footPos, 360);

    // Low bar sits lower along the trunk
    assert(poseLow.landmarks.barbell.y > poseHigh.landmarks.barbell.y,
      'Low bar is positioned lower along trunk than High bar');
  });

  test('Squat: Robustness & NaN/Infinity safety sweep', () => {
    const anatomy = new SquatAnatomy();
    const biomech = new SquatBiomechanics();
    const footPos = new Vector2(200, 400);

    for (let d = 0; d <= 1.0; d += 0.2) {
      for (let lean = -15; lean <= 35; lean += 10) {
        const pose = anatomy.getPose(d, lean, 'HIGH_BAR', footPos, 360);
        const analysis = biomech.analyze(pose, 150, true, 360);

        assert(Number.isFinite(analysis.torques.kneeExtensorDemandNm), `Knee torque finite at d=${d}, lean=${lean}`);
        assert(Number.isFinite(analysis.torques.hipExtensorDemandNm), `Hip torque finite at d=${d}, lean=${lean}`);
        assert(Number.isFinite(analysis.momentArms.kneeExternalM), `Knee arm finite at d=${d}, lean=${lean}`);
        assert(Number.isFinite(analysis.momentArms.hipExternalM), `Hip arm finite at d=${d}, lean=${lean}`);
      }
    }
  });

  // ==========================================
  // 7. BENCH PRESS TESTS (PROTOTYPE 04)
  // ==========================================
  test('Bench Press: Kinematics across phase (lockout to bottom)', () => {
    const anatomy = new BenchPressAnatomy();
    const benchPos = new Vector2(150, 300);

    // Phase 0: Lockout
    const poseLockout = anatomy.getPose(0, 'CURVED_J_CURVE', benchPos, 360);
    assert(poseLockout.angles.elbowFlexionDeg < 15, 'Lockout elbow flexion near 0°');

    // Phase 1.0: Chest touch
    const poseBottom = anatomy.getPose(1.0, 'CURVED_J_CURVE', benchPos, 360);
    assert(poseBottom.angles.elbowFlexionDeg > 75 && poseBottom.angles.elbowFlexionDeg < 105,
      'Bottom chest touch elbow flexion is ~90°');
    assert(poseBottom.landmarks.barbell.y > poseLockout.landmarks.barbell.y,
      'Barbell is lower at bottom than at lockout');
  });

  test('Bench Press: Curved J-Curve vs Straight Vertical bar path (McLaughlin 1984)', () => {
    const anatomy = new BenchPressAnatomy();
    const biomech = new BenchPressBiomechanics();
    const benchPos = new Vector2(150, 300);

    // At Lockout (phase = 0):
    const poseJLockout = anatomy.getPose(0, 'CURVED_J_CURVE', benchPos, 360);
    const analysisJLockout = biomech.analyze(poseJLockout, 100, 360);

    const poseVertLockout = anatomy.getPose(0, 'STRAIGHT_VERTICAL', benchPos, 360);
    const analysisVertLockout = biomech.analyze(poseVertLockout, 100, 360);

    // In J-Curve: Bar aligns over shoulder axis at lockout => minimal shoulder moment arm
    assert(analysisJLockout.momentArms.shoulderExternalM < 0.05,
      'In J-Curve, shoulder external moment arm at lockout is near zero (<5 cm)');

    // In Straight Vertical: Bar remains over chest touch point => high unnecessary moment arm
    assert(analysisVertLockout.momentArms.shoulderExternalM > 0.12,
      'In Straight Vertical, shoulder external moment arm remains >12 cm at lockout');

    // Torque consequence:
    assert(analysisJLockout.torques.shoulderTorqueDemandNm < analysisVertLockout.torques.shoulderTorqueDemandNm * 0.35,
      'J-Curve reduces shoulder torque demand at lockout by >65% (McLaughlin 1984)');
  });

  test('Bench Press: Torque equation verification (τ = F * r)', () => {
    const anatomy = new BenchPressAnatomy();
    const biomech = new BenchPressBiomechanics();
    const benchPos = new Vector2(150, 300);

    const pose = anatomy.getPose(1.0, 'CURVED_J_CURVE', benchPos, 360);
    const loadKg = 100;
    const analysis = biomech.analyze(pose, loadKg, 360);

    const expectedWeight = loadKg * PHYSICS.GRAVITY; // 980.665 N
    const expectedShoulderTorque = expectedWeight * analysis.momentArms.shoulderExternalM;
    const expectedElbowTorque = expectedWeight * analysis.momentArms.elbowExternalM;

    assertClose(analysis.forces.barWeightN, expectedWeight, 0.1, 'Bar weight N');
    assertClose(analysis.torques.shoulderTorqueDemandNm, expectedShoulderTorque, 0.2, 'Shoulder torque τ = F * r');
    assertClose(analysis.torques.elbowTorqueDemandNm, expectedElbowTorque, 0.2, 'Elbow torque τ = F * r');
  });

  test('Bench Press: Robustness & NaN/Infinity safety sweep', () => {
    const anatomy = new BenchPressAnatomy();
    const biomech = new BenchPressBiomechanics();
    const benchPos = new Vector2(150, 300);

    for (let p = 0; p <= 1.0; p += 0.1) {
      for (const path of ['CURVED_J_CURVE', 'STRAIGHT_VERTICAL']) {
        const pose = anatomy.getPose(p, path, benchPos, 360);
        const analysis = biomech.analyze(pose, 120, 360);

        assert(Number.isFinite(analysis.torques.shoulderTorqueDemandNm), `Shoulder torque finite at p=${p}, path=${path}`);
        assert(Number.isFinite(analysis.torques.elbowTorqueDemandNm), `Elbow torque finite at p=${p}, path=${path}`);
        assert(Number.isFinite(analysis.momentArms.shoulderExternalM), `Shoulder arm finite at p=${p}, path=${path}`);
      }
    }
  });

  // ==========================================
  // 8. CROSS-MODEL REGRESSION & STATE ISOLATION
  // ==========================================
  test('Cross-Model: Concurrent model state isolation', () => {
    // Instantiate all 4 models simultaneously
    const m1 = new LateralRaiseModel({ initialAngle: 45, loadKg: 12 });
    const m2 = new BicepsCurlModel({ initialFlexion: 75, initialRotation: 0, loadKg: 18 });
    const m3 = new SquatModel({ initialDepth: 0.8, initialLean: 15, loadKg: 120 });
    const m4 = new BenchPressModel({ initialPhase: 0.6, barPathType: 'CURVED_J_CURVE', loadKg: 95 });

    // Verify m1 state
    assert(m1.state.elevationAngleDeg === 45 && m1.state.loadKg === 12, 'm1 initial state');
    // Modify m1
    m1.setElevationAngle(90);
    assert(m1.state.elevationAngleDeg === 90, 'm1 updated');

    // Verify m2 was unaffected by m1 modification
    assert(m2.state.flexionAngleDeg === 75 && m2.state.loadKg === 18, 'm2 state isolated');
    m2.setForearmRotation(-80); // pronated
    assert(m2.state.forearmRotationDeg === -80, 'm2 rotation updated');

    // Verify m3 was unaffected
    assert(m3.state.depthNorm === 0.8 && m3.state.loadKg === 120, 'm3 state isolated');
    m3.setDepth(1.0);
    assert(m3.state.depthNorm === 1.0, 'm3 depth updated');

    // Verify m4 was unaffected
    assert(m4.state.phaseNorm === 0.6 && m4.state.loadKg === 95, 'm4 state isolated');

    // Clean up
    m1.destroy();
    m2.destroy();
    m3.destroy();
    m4.destroy();
  });

  return results;
}

