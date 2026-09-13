/**
 * PROTOTYPE 01 — LATERAL RAISE (SCIENTIFIC CANVAS RENDERER)
 * Renders technical anatomical bones, joints, muscles, force vectors,
 * and external/internal moment arms on HTML5 Canvas.
 */

import { COLORS } from '../../shared/constants.js';
import { Vector2 } from '../../shared/vectors.js';
import { drawBone, drawJoint, drawArrow, drawDashedLine, drawMomentArmLine, drawAngleArc, drawGrid } from '../../shared/geometry.js';
import { projectPointOntoLine } from '../../shared/math.js';

export class LateralRaiseRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    // Display options
    this.showGrid = true;
    this.showMomentArms = true;
    this.showForces = true;
    this.showAngles = true;
    this.showMuscles = true;
    this.showBones = true;

    // Scaling
    this.dpr = window.devicePixelRatio || 1;
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
      ghCenter,
      acromion,
      scapulaPivot,
      scapulaInferiorAngle,
      scapulaMedialBorder,
      clavicleSternum,
      deltoidInsertion,
      elbow,
      wrist,
      hand
    } = pose.landmarks;

    // 1. Thorax & Ribcage Reference
    this.drawThoraxReference(ctx, ghCenter, clavicleSternum);

    // 2. Scapula Body & Glenoid Rim
    this.drawScapula(ctx, ghCenter, acromion, scapulaPivot, scapulaInferiorAngle, scapulaMedialBorder);

    // 3. Clavicle
    if (this.showBones) {
      drawBone(ctx, clavicleSternum, acromion, 10, '#cbd5e1', '#64748b');
    }

    // 4. Joint Elevation Angle Arc
    if (this.showAngles) {
      const startAngle = Math.PI * 0.5; // straight down (0°)
      const currentAngle = startAngle - (pose.totalAngleDeg * Math.PI / 180);
      drawAngleArc(
        ctx,
        ghCenter,
        50,
        Math.min(startAngle, currentAngle),
        Math.max(startAngle, currentAngle),
        COLORS.ANGLE_ARC,
        `${analysis.jointAngleDeg}°`
      );

      // Vertical 0° reference line
      drawDashedLine(ctx, ghCenter, new Vector2(ghCenter.x, ghCenter.y + 140), COLORS.REFERENCE_LINE, [3, 3], 1.5);
    }

    // 5. Middle Deltoid Muscle Belly
    if (this.showMuscles) {
      this.drawDeltoidMuscle(ctx, acromion, deltoidInsertion, ghCenter, analysis);
    }

    // 6. Bones (Humerus, Forearm, Hand)
    if (this.showBones) {
      drawBone(ctx, ghCenter, elbow, 18, COLORS.BONE, COLORS.BONE_OUTLINE);
      drawBone(ctx, elbow, wrist, 14, COLORS.BONE, COLORS.BONE_OUTLINE);
      drawBone(ctx, wrist, hand, 11, '#cbd5e1', COLORS.BONE_OUTLINE);
    }

    // 7. Dumbbell
    this.drawDumbbell(ctx, hand, pose.totalAngleDeg, analysis.forces.loadMassKg);

    // 8. Joint Pivots
    drawJoint(ctx, ghCenter, 8, COLORS.JOINT_CENTER, COLORS.JOINT_OUTLINE);
    drawJoint(ctx, elbow, 6, COLORS.JOINT_CENTER, COLORS.JOINT_OUTLINE);
    drawJoint(ctx, wrist, 4, COLORS.JOINT_CENTER, COLORS.JOINT_OUTLINE);

    // 9. Forces & Moment Arms
    if (this.showForces || this.showMomentArms) {
      this.drawMechanics(ctx, ghCenter, hand, acromion, deltoidInsertion, analysis);
    }

    // 10. Technical Legend
    this.drawLegend(ctx, w, h);
  }

  drawThoraxReference(ctx, ghCenter, sternum) {
    ctx.save();
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);

    const spineX = ghCenter.x - 90;
    ctx.beginPath();
    ctx.moveTo(spineX, ghCenter.y - 60);
    ctx.lineTo(spineX, ghCenter.y + 260);
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(spineX, ghCenter.y - 20);
    ctx.bezierCurveTo(ghCenter.x - 20, ghCenter.y + 30, ghCenter.x - 30, ghCenter.y + 180, spineX, ghCenter.y + 220);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#1e293b';
    ctx.stroke();

    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.arc(sternum.x, sternum.y, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  drawScapula(ctx, ghCenter, acromion, pivot, inferiorAngle, medialBorder) {
    ctx.save();
    ctx.fillStyle = '#334155';
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(acromion.x - 5, acromion.y + 5);
    ctx.lineTo(medialBorder.x, medialBorder.y);
    ctx.lineTo(inferiorAngle.x, inferiorAngle.y);
    ctx.lineTo(ghCenter.x - 10, ghCenter.y + 15);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(ghCenter.x - 4, ghCenter.y, 10, -Math.PI * 0.4, Math.PI * 0.4);
    ctx.stroke();

    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(medialBorder.x, medialBorder.y);
    ctx.lineTo(acromion.x, acromion.y);
    ctx.stroke();

    ctx.restore();
  }

  drawDeltoidMuscle(ctx, acromion, insertion, ghCenter, analysis) {
    ctx.save();
    const normalizedTension = Math.min(1, analysis.forces.deltoidForceN / 2000);

    const dx = insertion.x - acromion.x;
    const dy = insertion.y - acromion.y;
    const len = Math.hypot(dx, dy);
    if (len < 5) {
      ctx.restore();
      return;
    }

    const angle = Math.atan2(dy, dx);
    ctx.translate(acromion.x, acromion.y);
    ctx.rotate(angle);

    ctx.strokeStyle = COLORS.TENDON;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(len * 0.12, 0);
    ctx.stroke();

    const bStart = len * 0.12;
    const bEnd = len * 0.88;
    const bMid = (bStart + bEnd) / 2;
    const thickness = 22 * (1 + normalizedTension * 0.35);

    const grad = ctx.createLinearGradient(0, -thickness / 2, 0, thickness / 2);
    if (normalizedTension > 0.6) {
      grad.addColorStop(0, '#b91c1c');
      grad.addColorStop(0.5, '#f87171');
      grad.addColorStop(1, '#b91c1c');
    } else {
      grad.addColorStop(0, '#991b1b');
      grad.addColorStop(0.5, '#dc2626');
      grad.addColorStop(1, '#991b1b');
    }

    ctx.fillStyle = grad;
    ctx.strokeStyle = '#7f1d1d';
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.moveTo(bStart, 0);
    ctx.bezierCurveTo(bMid - len * 0.15, -thickness / 2, bMid + len * 0.15, -thickness / 2, bEnd, 0);
    ctx.bezierCurveTo(bMid + len * 0.15, thickness / 2, bMid - len * 0.15, thickness / 2, bStart, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = COLORS.TENDON;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(bEnd, 0);
    ctx.lineTo(len, 0);
    ctx.stroke();

    ctx.restore();

    // Muscle line of action arrow
    if (this.showForces) {
      drawArrow(ctx, insertion, acromion, COLORS.MUSCLE_FORCE, 2.5, `Deltoid Demand: ${Math.round(analysis.forces.deltoidForceN)} N`, 'mid');
    }
  }

  drawDumbbell(ctx, handPos, angleDeg, massKg) {
    ctx.save();
    ctx.translate(handPos.x, handPos.y);
    const rad = (angleDeg * Math.PI) / 180;
    ctx.rotate(rad);

    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(-18, -4, 36, 8);

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

  drawMechanics(ctx, ghCenter, handPos, acromion, deltoidInsertion, analysis) {
    const gravityArrowLength = 70;
    const gravityEnd = new Vector2(handPos.x, handPos.y + gravityArrowLength);
    
    if (this.showForces) {
      drawArrow(ctx, handPos, gravityEnd, COLORS.EXTERNAL_FORCE, 3, `F_g = ${analysis.forces.dumbbellWeightN} N`, 'end');
    }

    const lineTopY = Math.min(ghCenter.y - 30, handPos.y - 30);
    const lineBottomY = Math.max(ghCenter.y + 30, gravityEnd.y + 20);
    drawDashedLine(ctx, new Vector2(handPos.x, lineTopY), new Vector2(handPos.x, lineBottomY), '#64748b', [4, 4], 1.5);

    if (this.showMomentArms && analysis.momentArms.externalLoadCm > 0.5) {
      const projPoint = new Vector2(handPos.x, ghCenter.y);

      drawMomentArmLine(
        ctx,
        ghCenter,
        projPoint,
        COLORS.EXTERNAL_MOMENT_ARM,
        `r_ext = ${analysis.momentArms.externalLoadCm} cm (${analysis.momentArms.externalLoadM} m)`
      );

      const sqSize = 8;
      const dir = handPos.x >= ghCenter.x ? -1 : 1;
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

    if (this.showMomentArms) {
      const projDeltoid = projectPointOntoLine(
        ghCenter.x, ghCenter.y,
        acromion.x, acromion.y,
        deltoidInsertion.x, deltoidInsertion.y
      );

      drawMomentArmLine(
        ctx,
        ghCenter,
        new Vector2(projDeltoid.x, projDeltoid.y),
        COLORS.INTERNAL_MOMENT_ARM,
        `r_int (ref) = ${analysis.momentArms.deltoidInternalCm} cm`
      );
    }
  }

  drawLegend(ctx, w, h) {
    ctx.save();
    const legendX = 20;
    const legendY = 20;
    const boxW = 275;
    const boxH = 138;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    ctx.strokeStyle = COLORS.BORDER;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(legendX, legendY, boxW, boxH, 8);
    ctx.fill();
    ctx.stroke();

    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = COLORS.TEXT;
    ctx.fillText('LEJANT / BİYOMEKANİK GÖSTERGELER', legendX + 12, legendY + 20);

    const items = [
      { color: COLORS.EXTERNAL_FORCE, text: 'Dış Yerçekimi Kuvveti (F_g)' },
      { color: COLORS.EXTERNAL_MOMENT_ARM, text: 'External Moment Kolu (r_ext)' },
      { color: COLORS.MUSCLE_FORCE, text: 'Deltoid Çekiş Hattı (Modelled Demand)' },
      { color: COLORS.INTERNAL_MOMENT_ARM, text: 'Internal Moment Kolu (Referans Eğrisi)' },
      { color: COLORS.JOINT_CENTER, text: 'Glenohumeral Eklem Ekseni' }
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
