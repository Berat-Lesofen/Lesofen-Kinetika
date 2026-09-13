/**
 * BIOMECHANICS MODEL LAB — SHARED GEOMETRY & RENDERING HELPERS
 * Canvas drawing helpers for bones, joints, force arrows, and moment arms.
 */

import { COLORS } from './constants.js';

/**
 * Draws a technical grid background.
 */
export function drawGrid(ctx, width, height, spacing = 40) {
  ctx.save();
  ctx.strokeStyle = COLORS.GRID;
  ctx.lineWidth = 0.75;

  for (let x = 0; x <= width; x += spacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for (let y = 0; y <= height; y += spacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  ctx.restore();
}

/**
 * Draws a bone segment with rounded anatomical condyles at each end.
 */
export function drawBone(ctx, p1, p2, thickness = 14, color = COLORS.BONE, outlineColor = COLORS.BONE_OUTLINE) {
  ctx.save();
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const len = Math.hypot(dx, dy);
  if (len < 1) {
    ctx.restore();
    return;
  }
  const angle = Math.atan2(dy, dx);

  ctx.translate(p1.x, p1.y);
  ctx.rotate(angle);

  ctx.fillStyle = color;
  ctx.strokeStyle = outlineColor;
  ctx.lineWidth = 2;

  // Draw rounded bone shape with slightly wider ends (epiphyses) and narrower shaft (diaphysis)
  const shaftThickness = thickness * 0.7;
  const endRadius = thickness * 0.65;

  ctx.beginPath();
  // Epiphysis at p1
  ctx.arc(0, 0, endRadius, Math.PI * 0.5, Math.PI * 1.5);
  // Upper shaft taper
  ctx.bezierCurveTo(len * 0.2, -shaftThickness, len * 0.8, -shaftThickness, len, -endRadius);
  // Epiphysis at p2
  ctx.arc(len, 0, endRadius, -Math.PI * 0.5, Math.PI * 0.5);
  // Lower shaft taper
  ctx.bezierCurveTo(len * 0.8, shaftThickness, len * 0.2, shaftThickness, 0, endRadius);
  ctx.closePath();

  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

/**
 * Draws a circular joint center marker with an inner pivot dot.
 */
export function drawJoint(ctx, p, radius = 7, fillColor = COLORS.JOINT_CENTER, outlineColor = COLORS.JOINT_OUTLINE) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
  ctx.fillStyle = fillColor;
  ctx.fill();
  ctx.strokeStyle = outlineColor;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Center pivot pin
  ctx.beginPath();
  ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.restore();
}

/**
 * Draws a force vector arrow with arrowhead and optional label.
 */
export function drawArrow(ctx, from, to, color = COLORS.EXTERNAL_FORCE, lineWidth = 3, label = '', labelPos = 'end') {
  ctx.save();
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy);
  if (length < 2) {
    ctx.restore();
    return;
  }

  const angle = Math.atan2(dy, dx);
  const headLength = Math.min(14, Math.max(8, length * 0.2));

  // Shaft
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x - Math.cos(angle) * (headLength * 0.7), to.y - Math.sin(angle) * (headLength * 0.7));
  ctx.stroke();

  // Arrowhead
  ctx.beginPath();
  ctx.moveTo(to.x, to.y);
  ctx.lineTo(
    to.x - headLength * Math.cos(angle - Math.PI / 6),
    to.y - headLength * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    to.x - (headLength * 0.6) * Math.cos(angle),
    to.y - (headLength * 0.6) * Math.sin(angle)
  );
  ctx.lineTo(
    to.x - headLength * Math.cos(angle + Math.PI / 6),
    to.y - headLength * Math.sin(angle + Math.PI / 6)
  );
  ctx.closePath();
  ctx.fill();

  // Label
  if (label) {
    ctx.font = 'bold 12px monospace';
    ctx.fillStyle = color;
    const textOffset = 16;
    if (labelPos === 'end') {
      ctx.fillText(label, to.x + 8, to.y + 4);
    } else if (labelPos === 'mid') {
      const midX = (from.x + to.x) / 2;
      const midY = (from.y + to.y) / 2;
      ctx.fillText(label, midX + textOffset, midY);
    }
  }

  ctx.restore();
}

/**
 * Draws a dashed line between two points.
 */
export function drawDashedLine(ctx, from, to, color = COLORS.REFERENCE_LINE, dashPattern = [4, 4], lineWidth = 1.5) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.setLineDash(dashPattern);
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
  ctx.restore();
}

/**
 * Draws a moment arm line with perpendicular tick marks and a distance label.
 */
export function drawMomentArmLine(ctx, from, to, color = COLORS.EXTERNAL_MOMENT_ARM, label = '') {
  ctx.save();
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy);
  if (len < 1) {
    ctx.restore();
    return;
  }

  const angle = Math.atan2(dy, dx);
  const perpX = -Math.sin(angle) * 5;
  const perpY = Math.cos(angle) * 5;

  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.setLineDash([5, 3]);

  // Main moment arm line
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();

  // End ticks (brackets)
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(from.x - perpX, from.y - perpY);
  ctx.lineTo(from.x + perpX, from.y + perpY);
  ctx.moveTo(to.x - perpX, to.y - perpY);
  ctx.lineTo(to.x + perpX, to.y + perpY);
  ctx.stroke();

  // Label
  if (label) {
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;
    ctx.fillStyle = color;
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(label, midX, midY - 6);
  }

  ctx.restore();
}

/**
 * Draws an angle arc with degree text.
 */
export function drawAngleArc(ctx, center, radius, startAngle, endAngle, color = COLORS.ANGLE_ARC, label = '') {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, startAngle, endAngle, false);
  ctx.stroke();

  if (label) {
    const midAngle = (startAngle + endAngle) / 2;
    const textRadius = radius + 14;
    const tx = center.x + Math.cos(midAngle) * textRadius;
    const ty = center.y + Math.sin(midAngle) * textRadius;
    ctx.fillStyle = color;
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, tx, ty);
  }
  ctx.restore();
}

/**
 * Draws a spindle-shaped muscle belly between origin and insertion with muscle tension color gradient.
 */
export function drawMuscleBelly(ctx, origin, insertion, thickness = 16, tension = 0.5) {
  ctx.save();
  const dx = insertion.x - origin.x;
  const dy = insertion.y - origin.y;
  const len = Math.hypot(dx, dy);
  if (len < 2) {
    ctx.restore();
    return;
  }
  const angle = Math.atan2(dy, dx);

  ctx.translate(origin.x, origin.y);
  ctx.rotate(angle);

  // Tendon at origin (white/silvery)
  ctx.strokeStyle = COLORS.TENDON;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(len * 0.15, 0);
  ctx.stroke();

  // Muscle belly
  const bellyStart = len * 0.15;
  const bellyEnd = len * 0.85;
  const bellyMid = (bellyStart + bellyEnd) / 2;
  const halfThick = (thickness / 2) * (1 + tension * 0.4); // bulge on contraction

  // Muscle gradient (deep red to active pink-red under tension)
  const grad = ctx.createLinearGradient(0, -halfThick, 0, halfThick);
  grad.addColorStop(0, '#991b1b');
  grad.addColorStop(0.5, tension > 0.6 ? '#f87171' : '#dc2626');
  grad.addColorStop(1, '#991b1b');

  ctx.fillStyle = grad;
  ctx.strokeStyle = '#7f1d1d';
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.moveTo(bellyStart, 0);
  ctx.bezierCurveTo(bellyMid - len * 0.1, -halfThick, bellyMid + len * 0.1, -halfThick, bellyEnd, 0);
  ctx.bezierCurveTo(bellyMid + len * 0.1, halfThick, bellyMid - len * 0.1, halfThick, bellyStart, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Tendon at insertion
  ctx.strokeStyle = COLORS.TENDON;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(bellyEnd, 0);
  ctx.lineTo(len, 0);
  ctx.stroke();

  ctx.restore();
}
