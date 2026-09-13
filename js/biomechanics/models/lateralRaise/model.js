/**
 * PROTOTYPE 01 — LATERAL RAISE (MODEL CONTROLLER & STATE MACHINE)
 * Connects anatomy, biomechanics, and renderer under a single unified state.
 * Portable and framework-agnostic.
 */

import { Vector2 } from '../../shared/vectors.js';
import { LateralRaiseAnatomy } from './anatomy.js';
import { LateralRaiseBiomechanics } from './biomechanics.js';
import { LateralRaiseRenderer } from './renderer.js';
import { LATERAL_RAISE_DATA } from './data.js';

export class LateralRaiseModel {
  /**
   * @param {Object} options
   * @param {HTMLCanvasElement} [options.canvas]
   * @param {number} [options.initialAngle=0]
   * @param {number} [options.loadKg=10]
   * @param {Function} [options.onUpdate] - Callback receiving analysis on state change
   */
  constructor(options = {}) {
    this.canvas = options.canvas || null;
    this.onUpdate = options.onUpdate || null;

    // Sub-modules
    this.anatomy = new LateralRaiseAnatomy();
    this.biomechanics = new LateralRaiseBiomechanics();
    this.renderer = this.canvas ? new LateralRaiseRenderer(this.canvas) : null;
    this.data = LATERAL_RAISE_DATA;

    // Unified State
    this.state = {
      elevationAngleDeg: options.initialAngle ?? 0,
      loadKg: options.loadKg ?? 10,
      includeLimbMass: true,
      isPlaying: false,
      playbackSpeed: 1.0,
      animationDirection: 1, // 1 = concentric (raise), -1 = eccentric (lower)
      minAngle: 0,
      maxAngle: 180,
      targetRepetitionDurationSec: 4.0 // 2s raise + 2s lower standard tempo
    };

    // Shoulder anchor position on canvas (relative or computed during resize)
    this.pixelsPerMeter = 420;
    this.shoulderBasePos = new Vector2(180, 190);

    // Animation loop binding
    this.lastTimestamp = 0;
    this.animationFrameId = null;
    this.listeners = new Set();

    if (this.canvas && this.renderer) {
      this.renderer.resize();
      this.render();
    }
  }

  /**
   * Subscribes a listener function to state/analysis updates.
   */
  subscribe(callback) {
    this.listeners.add(callback);
    // Send immediate update
    callback(this.getCurrentState());
    return () => this.listeners.delete(callback);
  }

  notifyListeners(data) {
    if (this.onUpdate) this.onUpdate(data);
    for (const listener of this.listeners) {
      listener(data);
    }
  }

  setElevationAngle(angle) {
    this.state.elevationAngleDeg = Math.max(this.state.minAngle, Math.min(this.state.maxAngle, angle));
    this.update();
  }

  setLoad(kg) {
    this.state.loadKg = Math.max(0, Math.min(100, kg));
    this.update();
  }

  setIncludeLimbMass(include) {
    this.state.includeLimbMass = Boolean(include);
    this.update();
  }

  setPlaybackSpeed(speed) {
    this.state.playbackSpeed = Math.max(0.1, Math.min(3.0, speed));
  }

  play() {
    if (this.state.isPlaying) return;
    this.state.isPlaying = true;
    this.lastTimestamp = performance.now();
    this.loop = this.loop.bind(this);
    this.animationFrameId = requestAnimationFrame(this.loop);
  }

  pause() {
    this.state.isPlaying = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  togglePlay() {
    if (this.state.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  reset() {
    this.pause();
    this.state.elevationAngleDeg = 0;
    this.state.animationDirection = 1;
    this.update();
  }

  loop(timestamp) {
    if (!this.state.isPlaying) return;

    const deltaMs = timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;

    const deltaSec = deltaMs / 1000;
    // Typical range: 0° to 90° or 120° for standard lateral raise, up to 180° for full elevation
    const standardMaxAngle = 120; // Natural practical max for dumbbell raise
    const totalSweep = standardMaxAngle - this.state.minAngle;
    const speedDegPerSec = (totalSweep / (this.state.targetRepetitionDurationSec / 2)) * this.state.playbackSpeed;

    let newAngle = this.state.elevationAngleDeg + this.state.animationDirection * speedDegPerSec * deltaSec;

    if (newAngle >= standardMaxAngle) {
      newAngle = standardMaxAngle;
      this.state.animationDirection = -1; // Reverse to eccentric lowering
    } else if (newAngle <= this.state.minAngle) {
      newAngle = this.state.minAngle;
      this.state.animationDirection = 1; // Reverse to concentric raise
    }

    this.state.elevationAngleDeg = newAngle;
    this.update();

    this.animationFrameId = requestAnimationFrame(this.loop);
  }

  /**
   * Computes current pose and biomechanics from unified state.
   */
  getCurrentState() {
    const pose = this.anatomy.getPose(
      this.state.elevationAngleDeg,
      this.shoulderBasePos,
      this.pixelsPerMeter
    );

    const analysis = this.biomechanics.analyze(
      pose,
      this.state.loadKg,
      this.state.includeLimbMass
    );

    return {
      state: { ...this.state },
      pose,
      analysis,
      data: this.data
    };
  }

  update() {
    const currentState = this.getCurrentState();
    if (this.renderer) {
      this.renderer.render(currentState.pose, currentState.analysis);
    }
    this.notifyListeners(currentState);
  }

  render() {
    if (!this.renderer) return;
    const { pose, analysis } = this.getCurrentState();
    this.renderer.render(pose, analysis);
  }

  resize() {
    if (!this.renderer || !this.canvas) return;
    this.renderer.resize();

    // Dynamically place shoulder joint based on canvas aspect ratio
    const cw = this.renderer.width;
    const ch = this.renderer.height;
    this.shoulderBasePos = new Vector2(cw * 0.32, ch * 0.38);
    this.pixelsPerMeter = Math.min(cw, ch) * 0.65;

    this.update();
  }

  destroy() {
    this.pause();
    this.listeners.clear();
    this.canvas = null;
    this.renderer = null;
  }
}
