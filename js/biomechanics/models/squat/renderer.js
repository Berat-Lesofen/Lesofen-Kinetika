/**
 * PROTOTYPE 03 — SQUAT (CANVAS RENDERER)
 * Renders sagittal lower extremity multi-link chain (Foot, Tibia, Femur, Pelvis, Trunk, Barbell),
 * vertical line of gravity, and external moment arms to Knee and Hip.
 */

import { COLORS } from '../../shared/constants.js';
import { Vector2 } from '../../shared/vectors.js';
import { drawBone, drawJoint, drawArrow, drawDashedLine, drawMomentArmLine, drawAngleArc, drawGrid } from '../../shared/geometry.js';

export class SquatRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    // Display Toggles
    this.showGrid = true;
    this.showBones = true;
    this.showMomentArms = true;
    this.showForces = true;
    this.showAngles = true;
    this.showCom = true;
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
      ankle,
      heel,
      toe,
      midfootX,
      knee,
      hip,
      shoulder,
      head,
      barbell
    } = pose.landmarks;

    // 1. Ground Platform Reference Line
    this.drawGround(ctx, heel.y, w);

    // 2. Foot Segment & Base of Support
    this.drawFoot(ctx, heel, ankle, toe, midfootX);

    // 3. Bones: Tibia, Femur, Trunk, Head
    if (this.showBones) {
      // Tibia (Shank)
      drawBone(ctx, ankle, knee, 18, COLORS.BONE, COLORS.BONE_OUTLINE);
      // Femur (Thigh)
      drawBone(ctx, knee, hip, 22, COLORS.BONE, COLORS.BONE_OUTLINE);
      // Pelvis subtle wedge
      this.drawPelvis(ctx, hip, shoulder);
      // Trunk / Spine
      drawBone(ctx, hip, shoulder, 26, '#cbd5e1', COLORS.BONE_OUTLINE);
      // Head
      this.drawHead(ctx, head);
    }

    // 4. Barbell
    this.drawBarbell(ctx, barbell, analysis.forces.barMassKg, pose.barPositionType);

    // 5. Joint Pivots
    drawJoint(ctx, ankle, 7, COLORS.JOINT_CENTER, COLORS.JOINT_OUTLINE);
    drawJoint(ctx, knee, 8, COLORS.JOINT_CENTER, COLORS.JOINT_OUTLINE);
    drawJoint(ctx, hip, 9, COLORS.JOINT_CENTER, COLORS.JOINT_OUTLINE);

    // 6. Joint Angle Arcs
    if (this.showAngles) {
      this.drawAngles(ctx, ankle, knee, hip, shoulder, analysis.angles);
    }

    // 7. Gravity Line and External Moment Arms (Knee & Hip)
    if (this.showForces || this.showMomentArms) {
      this.drawMechanics(ctx, barbell, knee, hip, ankle, heel.y, analysis);
    }

    // 8. Legend
    this.drawLegend(ctx, w, h, analysis);
  }

  drawGround(ctx, groundY, w) {
    ctx.save();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(w, groundY);
    ctx.stroke();

    // Ground hatch pattern
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let x = 40; x < w - 40; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, groundY);
      ctx.lineTo(x - 10, groundY + 12);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawFoot(ctx, heel, ankle, toe, midfootX) {
    ctx.save();
    // Foot sole
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(heel.x, heel.y);
    ctx.lineTo(toe.x, toe.y);
    ctx.lineTo(toe.x - 15, toe.y - 12);
    ctx.lineTo(ankle.x + 10, ankle.y - 6);
    ctx.lineTo(heel.x + 5, heel.y - 14);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Midfoot balance target pin
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(midfootX, heel.y - 25);
    ctx.lineTo(midfootX, heel.y + 15);
    ctx.stroke();

    ctx.font = '10px monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.textAlign = 'center';
    ctx.fillText('Midfoot', midfootX, heel.y + 24);

    ctx.restore();
  }

  drawPelvis(ctx, hip, shoulder) {
    ctx.save();
    ctx.fillStyle = '#334155';
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;

    const dx = shoulder.x - hip.x;
    const dy = shoulder.y - hip.y;
    const spineAngle = Math.atan2(dy, dx);

    ctx.translate(hip.x, hip.y);
    ctx.rotate(spineAngle);

    ctx.beginPath();
    ctx.moveTo(-18, -10);
    ctx.lineTo(12, -18);
    ctx.lineTo(18, 12);
    ctx.lineTo(-12, 14);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  drawHead(ctx, headPos) {
    ctx.save();
    ctx.fillStyle = '#cbd5e1';
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(headPos.x, headPos.y, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  drawBarbell(ctx, barPos, massKg, barType) {
    ctx.save();
    const plateRadius = 24;
    const isLowBar = barType === 'LOW_BAR';

    // Barbell sleeve center pin
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.arc(barPos.x, barPos.y, 7, 0, Math.PI * 2);
    ctx.fill();

    // Olympic Plate
    ctx.fillStyle = isLowBar ? '#1e3a8a' : '#1e293b';
    ctx.strokeStyle = isLowBar ? '#3b82f6' : '#64748b';
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    ctx.arc(barPos.x, barPos.y, plateRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Weight label
    ctx.font = 'bold 10px monospace';
    ctx.fillStyle = '#fbbf24';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${massKg}kg`, barPos.x, barPos.y);

    // High/Low bar text
    ctx.font = '9px sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(isLowBar ? 'Low Bar' : 'High Bar', barPos.x, barPos.y - plateRadius - 6);

    ctx.restore();
  }

  drawAngles(ctx, ankle, knee, hip, shoulder, angles) {
    // Knee Flexion Angle Arc
    drawAngleArc(ctx, knee, 30, 0, Math.PI * 0.4, '#a855f7', `${angles.kneeFlexionDeg}°`);
    // Hip Flexion Angle Arc
    drawAngleArc(ctx, hip, 32, -Math.PI * 0.5, -Math.PI * 0.2, '#ec4899', `${angles.hipFlexionDeg}°`);
  }

  drawMechanics(ctx, barbell, knee, hip, ankle, groundY, analysis) {
    const barX = barbell.x;

    // 1. Vertical Line of Gravity through Barbell
    const gravityTopY = barbell.y - 30;
    const gravityBottomY = groundY + 10;
    drawDashedLine(ctx, new Vector2(barX, gravityTopY), new Vector2(barX, gravityBottomY), '#fbbf24', [4, 4], 2);

    // Barbell gravity vector arrow pointing downward
    if (this.showForces) {
      drawArrow(ctx, barbell, new Vector2(barX, barbell.y + 65), COLORS.EXTERNAL_FORCE, 3, `F_bar = ${analysis.forces.barbellWeightN} N`, 'end');
    }

    // 2. Knee External Moment Arm (r_ext,knee)
    // Horizontal distance from knee center to the vertical barbell line x = barX
    if (this.showMomentArms && analysis.momentArms.kneeExternalCm > 0.5) {
      const kneeProj = new Vector2(barX, knee.y);
      drawMomentArmLine(
        ctx,
        knee,
        kneeProj,
        '#38bdf8', // cyan
        `r_knee = ${analysis.momentArms.kneeExternalCm} cm`
      );

      // Right angle marker
      this.drawRightAngle(ctx, kneeProj, knee.x < barX ? -1 : 1);
    }

    // 3. Hip External Moment Arm (r_ext,hip)
    // Horizontal distance from hip center to the vertical barbell line x = barX
    if (this.showMomentArms && analysis.momentArms.hipExternalCm > 0.5) {
      const hipProj = new Vector2(barX, hip.y);
      drawMomentArmLine(
        ctx,
        hip,
        hipProj,
        '#f59e0b', // amber
        `r_hip = ${analysis.momentArms.hipExternalCm} cm`
      );

      this.drawRightAngle(ctx, hipProj, hip.x < barX ? -1 : 1);
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
    if (!this.showLegend || w < 600 || !analysis || !analysis.momentArms) return;
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
    ctx.fillText('SQUAT BİYOMEKANİK LEJANT', legendX + 12, legendY + 20);

    const items = [
      { color: COLORS.EXTERNAL_FORCE, text: 'Barbell Yerçekimi Çizgisi (Line of Action)' },
      { color: '#38bdf8', text: `Diz Moment Kolu (r_knee: ${analysis.momentArms.kneeExternalCm} cm)` },
      { color: '#f59e0b', text: `Kalça Moment Kolu (r_hip: ${analysis.momentArms.hipExternalCm} cm)` },
      { color: COLORS.JOINT_CENTER, text: 'Eklem Merkezleri (Ayak Bileği, Diz, Kalça)' },
      { color: '#a855f7', text: `Diz/Kalça Moment Oranı: ${analysis.torques.hipToKneeRatio}x` }
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
