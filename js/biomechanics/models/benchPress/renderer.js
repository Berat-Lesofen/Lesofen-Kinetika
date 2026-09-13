/**
 * PROTOTYPE 04 — BENCH PRESS (CANVAS RENDERER)
 * Renders supine lifter on flat bench, bar path trajectory, vertical gravity line,
 * and external moment arms to Shoulder and Elbow.
 */

import { COLORS } from '../../shared/constants.js';
import { Vector2 } from '../../shared/vectors.js';
import { drawBone, drawJoint, drawArrow, drawDashedLine, drawMomentArmLine, drawAngleArc, drawGrid } from '../../shared/geometry.js';

export class BenchPressRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    // Display Toggles
    this.showGrid = true;
    this.showBones = true;
    this.showBarPath = true;
    this.showMomentArms = true;
    this.showForces = true;
    this.showAngles = true;

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

  render(pose, analysis, pathTracePoints = []) {
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
      benchStart,
      benchEnd,
      head,
      shoulderJoint,
      chestSurfaceY,
      touchPointX,
      elbowJoint,
      barbell,
      hip
    } = pose.landmarks;

    // 1. Flat Bench & Support Legs
    this.drawBench(ctx, benchStart, benchEnd);

    // 2. Lifter Torso Profile
    this.drawTorsoProfile(ctx, head, shoulderJoint, hip, chestSurfaceY);

    // 3. Bar Path Trajectory Curve
    if (this.showBarPath && pathTracePoints.length > 1) {
      this.drawBarPathTrace(ctx, pathTracePoints);
    }

    // 4. Arm Bones: Humerus & Forearm
    if (this.showBones) {
      // Humerus (shoulder to elbow)
      drawBone(ctx, shoulderJoint, elbowJoint, 18, COLORS.BONE, COLORS.BONE_OUTLINE);
      // Forearm (elbow to hand/bar)
      drawBone(ctx, elbowJoint, barbell, 14, COLORS.BONE, COLORS.BONE_OUTLINE);
    }

    // 5. Barbell & Olympic Plate
    this.drawBarbell(ctx, barbell, analysis.forces.barMassKg);

    // 6. Joint Pivots
    drawJoint(ctx, shoulderJoint, 8, COLORS.JOINT_CENTER, COLORS.JOINT_OUTLINE);
    drawJoint(ctx, elbowJoint, 7, COLORS.JOINT_CENTER, COLORS.JOINT_OUTLINE);
    drawJoint(ctx, barbell, 5, '#fbbf24', '#d97706');

    // 7. Joint Angles
    if (this.showAngles) {
      drawAngleArc(ctx, elbowJoint, 24, 0, Math.PI * 0.4, '#a855f7', `${analysis.angles.elbowFlexionDeg}°`);
    }

    // 8. Forces and External Moment Arms (Shoulder & Elbow)
    if (this.showForces || this.showMomentArms) {
      this.drawMechanics(ctx, barbell, shoulderJoint, elbowJoint, benchStart.y, analysis);
    }

    // 9. Legend
    this.drawLegend(ctx, w, h, analysis);
  }

  drawBench(ctx, start, end) {
    ctx.save();
    const benchH = 14;
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;

    // Bench pad
    ctx.beginPath();
    ctx.roundRect(start.x, start.y, end.x - start.x, benchH, 4);
    ctx.fill();
    ctx.stroke();

    // Bench steel support posts
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#334155';
    // Head post
    ctx.fillRect(start.x + 30, start.y + benchH, 16, 120);
    ctx.strokeRect(start.x + 30, start.y + benchH, 16, 120);
    // Middle post
    ctx.fillRect(end.x - 50, start.y + benchH, 16, 120);
    ctx.strokeRect(end.x - 50, start.y + benchH, 16, 120);

    ctx.restore();
  }

  drawTorsoProfile(ctx, head, shoulder, hip, chestY) {
    ctx.save();
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;

    // Torso lying with natural slight arch
    ctx.beginPath();
    ctx.moveTo(head.x, head.y);
    ctx.lineTo(shoulder.x - 10, shoulder.y);
    // Chest arch curve up to chestY
    ctx.bezierCurveTo(shoulder.x + 20, chestY, hip.x - 40, chestY + 10, hip.x, hip.y);
    ctx.lineTo(hip.x, shoulder.y + 10);
    ctx.lineTo(head.x, shoulder.y + 10);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Head
    ctx.beginPath();
    ctx.arc(head.x + 10, head.y - 12, 18, 0, Math.PI * 2);
    ctx.fillStyle = '#cbd5e1';
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  drawBarPathTrace(ctx, points) {
    ctx.save();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 3]);

    ctx.beginPath();
    points.forEach((p, idx) => {
      if (idx === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();

    // Path dots
    ctx.fillStyle = '#38bdf8';
    ctx.setLineDash([]);
    points.forEach((p, idx) => {
      if (idx % 3 === 0) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    ctx.restore();
  }

  drawBarbell(ctx, barPos, massKg) {
    ctx.save();
    const plateRadius = 24;

    // Outer Olympic plate
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    ctx.arc(barPos.x, barPos.y, plateRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Center sleeve pin
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.arc(barPos.x, barPos.y, 6, 0, Math.PI * 2);
    ctx.fill();

    // Label
    ctx.font = 'bold 10px monospace';
    ctx.fillStyle = '#fbbf24';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${massKg}kg`, barPos.x, barPos.y);

    ctx.restore();
  }

  drawMechanics(ctx, barbell, shoulder, elbow, benchY, analysis) {
    const barX = barbell.x;

    // 1. Vertical Line of Gravity through Barbell
    const lineTop = barbell.y - 25;
    const lineBottom = benchY + 15;
    drawDashedLine(ctx, new Vector2(barX, lineTop), new Vector2(barX, lineBottom), '#fbbf24', [4, 4], 2);

    if (this.showForces) {
      drawArrow(ctx, barbell, new Vector2(barX, barbell.y + 60), COLORS.EXTERNAL_FORCE, 3, `F_bar = ${analysis.forces.barWeightN} N`, 'end');
    }

    // 2. Shoulder External Moment Arm
    if (this.showMomentArms && analysis.momentArms.shoulderExternalCm > 0.5) {
      const projShoulder = new Vector2(barX, shoulder.y);
      drawMomentArmLine(
        ctx,
        shoulder,
        projShoulder,
        '#f59e0b', // amber
        `r_shoulder = ${analysis.momentArms.shoulderExternalCm} cm`
      );
      this.drawRightAngle(ctx, projShoulder, shoulder.x < barX ? -1 : 1);
    }

    // 3. Elbow External Moment Arm
    if (this.showMomentArms && analysis.momentArms.elbowExternalCm > 0.5) {
      const projElbow = new Vector2(barX, elbow.y);
      drawMomentArmLine(
        ctx,
        elbow,
        projElbow,
        '#38bdf8', // cyan
        `r_elbow = ${analysis.momentArms.elbowExternalCm} cm`
      );
      this.drawRightAngle(ctx, projElbow, elbow.x < barX ? -1 : 1);
    }
  }

  drawRightAngle(ctx, p, dir = 1) {
    const s = 6;
    ctx.save();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(p.x - dir * s, p.y);
    ctx.lineTo(p.x - dir * s, p.y + s);
    ctx.lineTo(p.x, p.y + s);
    ctx.stroke();
    ctx.restore();
  }

  drawLegend(ctx, w, h, analysis) {
    ctx.save();
    const legendX = 20;
    const legendY = 20;
    const boxW = 290;
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
    ctx.fillText('BENCH PRESS BİYOMEKANİK LEJANT', legendX + 12, legendY + 20);

    const items = [
      { color: COLORS.EXTERNAL_FORCE, text: 'Barbell Yerçekimi Doğrultusu' },
      { color: '#f59e0b', text: `Omuz Moment Kolu (r_sh: ${analysis.momentArms.shoulderExternalCm} cm)` },
      { color: '#38bdf8', text: `Dirsek Moment Kolu (r_el: ${analysis.momentArms.elbowExternalCm} cm)` },
      { color: '#38bdf8', text: `Bar Yolu: ${analysis.barPathType === 'CURVED_J_CURVE' ? 'Kavisli (J-Curve)' : 'Düz Dikey'}` },
      { color: '#a855f7', text: `Omuz Tork Talebi: ${analysis.torques.shoulderTorqueDemandNm} N·m` }
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
