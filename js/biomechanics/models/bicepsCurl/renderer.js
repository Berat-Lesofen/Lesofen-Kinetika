/**
 * PROTOTYPE 02 — BICEPS CURL (CANVAS RENDERER)
 * Renders technical anatomical bones (Humerus, Radius, Ulna),
 * 3 distinct flexor muscles (Biceps, Brachialis, Brachioradialis),
 * external gravity line, and internal/external moment arms.
 */

import { COLORS } from '../../shared/constants.js';
import { Vector2 } from '../../shared/vectors.js';
import { drawBone, drawJoint, drawArrow, drawDashedLine, drawMomentArmLine, drawAngleArc, drawGrid } from '../../shared/geometry.js';
import { projectPointOntoLine } from '../../shared/math.js';

export class BicepsCurlRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    // Display Toggles
    this.showGrid = true;
    this.showBones = true;
    this.showBiceps = true;
    this.showBrachialis = true;
    this.showBrachioradialis = true;
    this.showForces = true;
    this.showMomentArms = true;
    this.showAngles = true;
    this.showLegend = true;

    this.dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1;
  }

  resize() {
    if (!this.canvas) return;
    const rect = typeof this.canvas.getBoundingClientRect === 'function' ? this.canvas.getBoundingClientRect() : null;
    this.width = (rect && rect.width > 0) ? rect.width : (this.canvas.parentElement?.clientWidth || 600);
    this.height = (rect && rect.height > 0) ? rect.height : (this.canvas.parentElement?.clientHeight || 420);

    this.canvas.width = this.width * (this.dpr || 1);
    this.canvas.height = this.height * (this.dpr || 1);
    if (this.ctx && typeof this.ctx.scale === 'function') {
      this.ctx.scale(this.dpr || 1, this.dpr || 1);
    }
  }

  render(pose, analysis) {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    ctx.fillStyle = COLORS.BACKGROUND;
    ctx.fillRect(0, 0, w, h);

    if (this.showGrid) {
      drawGrid(ctx, w, h, 40);
    }

    const {
      shoulderCenter,
      elbowCenter,
      wristCenter,
      handGrip,
      olecranon,
      ulnaProximal,
      ulnaDistal,
      radiusProximal,
      radiusDistal,
      bicepsOrigin,
      radialTuberosity,
      brachialisOrigin,
      ulnarTuberosity,
      brachioradialisOrigin,
      radialStyloid
    } = pose.landmarks;

    // 1. Angle Arc at Elbow
    if (this.showAngles) {
      const startAngle = Math.PI * 0.5; // straight down (0° flexion)
      const currentAngle = startAngle - (pose.flexionAngleDeg * Math.PI / 180);
      drawAngleArc(
        ctx,
        elbowCenter,
        45,
        Math.min(startAngle, currentAngle),
        Math.max(startAngle, currentAngle),
        COLORS.ANGLE_ARC,
        `${analysis.flexionAngleDeg}°`
      );
      drawDashedLine(ctx, elbowCenter, new Vector2(elbowCenter.x, elbowCenter.y + 110), COLORS.REFERENCE_LINE, [3, 3], 1.5);
    }

    // 2. Deep Muscle: Brachialis (drawn under biceps)
    if (this.showBrachialis) {
      this.drawMuscle(
        ctx,
        brachialisOrigin,
        ulnarTuberosity,
        18,
        '#ea580c', // deep orange/amber
        '#c2410c',
        'Brachialis'
      );
    }

    // 3. Bones: Humerus, Ulna, Radius
    if (this.showBones) {
      // Humerus
      drawBone(ctx, shoulderCenter, elbowCenter, 20, COLORS.BONE, COLORS.BONE_OUTLINE);

      // Ulna (medial bone with olecranon beak)
      this.drawUlnaBone(ctx, olecranon, ulnaProximal, ulnaDistal);

      // Radius (rotates over ulna during pronation)
      this.drawRadiusBone(ctx, radiusProximal, radiusDistal, pose.forearmRotationDeg);

      // Hand segment
      drawBone(ctx, wristCenter, handGrip, 12, '#cbd5e1', COLORS.BONE_OUTLINE);
    }

    // 4. Superficial Muscle: Biceps Brachii (inserts on radial tuberosity)
    if (this.showBiceps) {
      this.drawMuscle(
        ctx,
        bicepsOrigin,
        radialTuberosity,
        22,
        '#dc2626', // crimson red
        '#991b1b',
        'Biceps Brachii'
      );
    }

    // 5. Lateral Muscle: Brachioradialis (inserts on radial styloid)
    if (this.showBrachioradialis) {
      this.drawMuscle(
        ctx,
        brachioradialisOrigin,
        radialStyloid,
        14,
        '#db2777', // rose/pink
        '#9d174d',
        'Brachioradialis'
      );
    }

    // 6. Dumbbell / Load
    this.drawDumbbell(ctx, handGrip, pose.flexionAngleDeg, analysis.forces.loadMassKg);

    // 7. Joint Pivots
    drawJoint(ctx, shoulderCenter, 7, '#64748b', '#475569');
    drawJoint(ctx, elbowCenter, 8, COLORS.JOINT_CENTER, COLORS.JOINT_OUTLINE);
    drawJoint(ctx, wristCenter, 5, COLORS.JOINT_CENTER, COLORS.JOINT_OUTLINE);

    // 8. Forces & Moment Arms
    if (this.showForces || this.showMomentArms) {
      this.drawMechanics(
        ctx,
        elbowCenter,
        handGrip,
        bicepsOrigin,
        radialTuberosity,
        brachialisOrigin,
        ulnarTuberosity,
        brachioradialisOrigin,
        radialStyloid,
        analysis
      );
    }

    // 9. Technical Legend
    this.drawLegend(ctx, w, h);
  }

  drawUlnaBone(ctx, olecranon, proximal, distal) {
    ctx.save();
    // Olecranon process
    ctx.fillStyle = '#94a3b8';
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(olecranon.x, olecranon.y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Ulna shaft (slate tone)
    drawBone(ctx, proximal, distal, 12, '#cbd5e1', '#64748b');

    // Label
    ctx.font = '10px monospace';
    ctx.fillStyle = '#94a3b8';
    const midX = (proximal.x + distal.x) / 2;
    const midY = (proximal.y + distal.y) / 2;
    ctx.fillText('Ulna', midX - 22, midY + 4);

    ctx.restore();
  }

  drawRadiusBone(ctx, proximal, distal, rotationDeg) {
    ctx.save();
    // Radius head & shaft (slightly lighter bone tone)
    drawBone(ctx, proximal, distal, 13, '#f1f5f9', '#94a3b8');

    // Label indicating crossing state
    ctx.font = '10px monospace';
    ctx.fillStyle = '#cbd5e1';
    const midX = (proximal.x + distal.x) / 2;
    const midY = (proximal.y + distal.y) / 2;
    const rotLabel = rotationDeg > 30 ? 'Radius (Sup)' : (rotationDeg < -30 ? 'Radius (Pronated ✕)' : 'Radius (Neutral)');
    ctx.fillText(rotLabel, midX + 10, midY - 6);

    ctx.restore();
  }

  drawMuscle(ctx, origin, insertion, thickness, colorLight, colorDark, name) {
    ctx.save();
    const dx = insertion.x - origin.x;
    const dy = insertion.y - origin.y;
    const len = Math.hypot(dx, dy);
    if (len < 5) {
      ctx.restore();
      return;
    }

    const angle = Math.atan2(dy, dx);
    ctx.translate(origin.x, origin.y);
    ctx.rotate(angle);

    // Tendon at origin
    ctx.strokeStyle = COLORS.TENDON;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(len * 0.12, 0);
    ctx.stroke();

    // Muscle belly
    const bStart = len * 0.12;
    const bEnd = len * 0.88;
    const bMid = (bStart + bEnd) / 2;

    const grad = ctx.createLinearGradient(0, -thickness / 2, 0, thickness / 2);
    grad.addColorStop(0, colorDark);
    grad.addColorStop(0.5, colorLight);
    grad.addColorStop(1, colorDark);

    ctx.fillStyle = grad;
    ctx.strokeStyle = colorDark;
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.moveTo(bStart, 0);
    ctx.bezierCurveTo(bMid - len * 0.15, -thickness / 2, bMid + len * 0.15, -thickness / 2, bEnd, 0);
    ctx.bezierCurveTo(bMid + len * 0.15, thickness / 2, bMid - len * 0.15, thickness / 2, bStart, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Tendon at insertion
    ctx.strokeStyle = COLORS.TENDON;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(bEnd, 0);
    ctx.lineTo(len, 0);
    ctx.stroke();

    ctx.restore();
  }

  drawDumbbell(ctx, handPos, angleDeg, massKg) {
    ctx.save();
    ctx.translate(handPos.x, handPos.y);
    const rad = (angleDeg * Math.PI) / 180;
    ctx.rotate(rad);

    // Grip
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(-18, -4, 36, 8);

    // Plates
    const plateWidth = 14;
    const plateHeight = 32;
    ctx.fillStyle = '#334155';
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;

    ctx.fillRect(-26, -plateHeight / 2, plateWidth, plateHeight);
    ctx.strokeRect(-26, -plateHeight / 2, plateWidth, plateHeight);

    ctx.fillRect(12, -plateHeight / 2, plateWidth, plateHeight);
    ctx.strokeRect(12, -plateHeight / 2, plateWidth, plateHeight);

    ctx.rotate(-rad);
    ctx.font = 'bold 11px monospace';
    ctx.fillStyle = '#fbbf24';
    ctx.textAlign = 'center';
    ctx.fillText(`${massKg} kg`, 0, plateHeight / 2 + 14);

    ctx.restore();
  }

  drawMechanics(ctx, elbowCenter, handPos, bOrig, bIns, brOrig, brIns, brdOrig, brdIns, analysis) {
    // 1. External Force: Dumbbell gravity line
    const gravityEnd = new Vector2(handPos.x, handPos.y + 70);
    if (this.showForces) {
      drawArrow(ctx, handPos, gravityEnd, COLORS.EXTERNAL_FORCE, 3, `F_g = ${analysis.forces.loadWeightN} N`, 'end');
    }

    // Gravity reference dashed vertical line
    const lineTopY = Math.min(elbowCenter.y - 20, handPos.y - 20);
    const lineBottomY = Math.max(elbowCenter.y + 20, gravityEnd.y + 20);
    drawDashedLine(ctx, new Vector2(handPos.x, lineTopY), new Vector2(handPos.x, lineBottomY), '#64748b', [4, 4], 1.5);

    // 2. External Moment Arm (r_ext)
    if (this.showMomentArms && analysis.momentArms.externalLoadCm > 0.5) {
      const projPoint = new Vector2(handPos.x, elbowCenter.y);

      drawMomentArmLine(
        ctx,
        elbowCenter,
        projPoint,
        COLORS.EXTERNAL_MOMENT_ARM,
        `r_ext = ${analysis.momentArms.externalLoadCm} cm`
      );

      // 90° right angle symbol
      const sqSize = 8;
      const dir = handPos.x >= elbowCenter.x ? -1 : 1;
      ctx.save();
      ctx.strokeStyle = COLORS.EXTERNAL_MOMENT_ARM;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(projPoint.x + dir * sqSize, projPoint.y);
      ctx.lineTo(projPoint.x + dir * sqSize, projPoint.y + sqSize);
      ctx.lineTo(projPoint.x, projPoint.y + sqSize);
      ctx.stroke();
      ctx.restore();
    }

    // 3. Internal Moment Arm: Biceps
    if (this.showMomentArms && this.showBiceps) {
      const projBiceps = projectPointOntoLine(
        elbowCenter.x, elbowCenter.y,
        bOrig.x, bOrig.y,
        bIns.x, bIns.y
      );
      drawMomentArmLine(
        ctx,
        elbowCenter,
        new Vector2(projBiceps.x, projBiceps.y),
        '#ef4444',
        `r_biceps = ${analysis.momentArms.bicepsInternalCm} cm`
      );
    }
  }

  drawLegend(ctx, w, h) {
    if (!this.showLegend || w < 600) return;
    ctx.save();
    const legendX = 20;
    const legendY = 20;
    const boxW = 280;
    const boxH = 158;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.90)';
    ctx.strokeStyle = COLORS.BORDER;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(legendX, legendY, boxW, boxH, 8);
    ctx.fill();
    ctx.stroke();

    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = COLORS.TEXT;
    ctx.fillText('BICEPS CURL / ANATOMİK LEJANT', legendX + 12, legendY + 20);

    const items = [
      { color: '#dc2626', text: 'Biceps Brachii (Radius tüberozitesi)' },
      { color: '#ea580c', text: 'Brachialis (Ulna tüberozitesi - Saf fleksör)' },
      { color: '#db2777', text: 'Brachioradialis (Radius stiloid prosesi)' },
      { color: COLORS.EXTERNAL_FORCE, text: 'Dış Yerçekimi Kuvveti (F_g)' },
      { color: COLORS.EXTERNAL_MOMENT_ARM, text: 'External Moment Kolu (r_ext)' },
      { color: COLORS.JOINT_CENTER, text: 'Dirsek Eklem Ekseni' }
    ];

    ctx.font = '10px monospace';
    items.forEach((item, idx) => {
      const y = legendY + 40 + idx * 18;
      ctx.fillStyle = item.color;
      ctx.fillRect(legendX + 12, y - 8, 14, 4);
      ctx.fillStyle = COLORS.TEXT_MUTED;
      ctx.fillText(item.text, legendX + 34, y - 4);
    });

    ctx.restore();
  }
}
