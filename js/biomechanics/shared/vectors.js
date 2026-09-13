/**
 * BIOMECHANICS MODEL LAB — SHARED VECTOR UTILITIES
 * 2D Vector mathematics for kinematics, line of action, and force vectors.
 */

export class Vector2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  set(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }

  clone() {
    return new Vector2(this.x, this.y);
  }

  copy(v) {
    this.x = v.x;
    this.y = v.y;
    return this;
  }

  add(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  static add(v1, v2) {
    return new Vector2(v1.x + v2.x, v1.y + v2.y);
  }

  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  static sub(v1, v2) {
    return new Vector2(v1.x - v2.x, v1.y - v2.y);
  }

  scale(s) {
    this.x *= s;
    this.y *= s;
    return this;
  }

  static scale(v, s) {
    return new Vector2(v.x * s, v.y * s);
  }

  dot(v) {
    return this.x * v.x + this.y * v.y;
  }

  /**
   * 2D scalar cross product (z-component of 3D cross product):
   * v1.x * v2.y - v1.y * v2.x
   */
  cross(v) {
    return this.x * v.y - this.y * v.x;
  }

  static cross(v1, v2) {
    return v1.x * v2.y - v1.y * v2.x;
  }

  lengthSq() {
    return this.x * this.x + this.y * this.y;
  }

  length() {
    return Math.hypot(this.x, this.y);
  }

  normalize() {
    const len = this.length();
    if (len > 1e-12) {
      this.x /= len;
      this.y /= len;
    } else {
      this.x = 0;
      this.y = 0;
    }
    return this;
  }

  dist(v) {
    return Math.hypot(this.x - v.x, this.y - v.y);
  }

  distSq(v) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return dx * dx + dy * dy;
  }

  angle() {
    return Math.atan2(this.y, this.x);
  }

  /**
   * Angle between this vector and another vector in radians.
   */
  angleTo(v) {
    const dot = this.dot(v);
    const lenProduct = this.length() * v.length();
    if (lenProduct < 1e-12) return 0;
    const cosVal = Math.max(-1, Math.min(1, dot / lenProduct));
    return Math.acos(cosVal);
  }

  /**
   * Rotates vector counter-clockwise by radians.
   */
  rotate(rad) {
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const rx = this.x * cos - this.y * sin;
    const ry = this.x * sin + this.y * cos;
    this.x = rx;
    this.y = ry;
    return this;
  }

  /**
   * Returns perpendicular vector (rotated 90 degrees CCW).
   */
  perpendicular() {
    return new Vector2(-this.y, this.x);
  }

  static fromAngle(rad, length = 1) {
    return new Vector2(Math.cos(rad) * length, Math.sin(rad) * length);
  }

  static lerp(v1, v2, t) {
    return new Vector2(
      v1.x + (v2.x - v1.x) * t,
      v1.y + (v2.y - v1.y) * t
    );
  }
}
