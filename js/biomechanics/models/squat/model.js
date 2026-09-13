/**
 * PROTOTYPE 03 — SQUAT (MODEL CONTROLLER & STATE MACHINE)
 * Connects anatomy, biomechanics, and renderer under a single unified state.
 * Portable and framework-agnostic.
 */

import { Vector2 } from '../../shared/vectors.js';
import { SquatAnatomy } from './anatomy.js';
import { SquatBiomechanics } from './biomechanics.js';
import { SquatRenderer } from './renderer.js';
import { SQUAT_DATA } from './data.js';

export class SquatModel {
  /**
   * @param {Object} options
   * @param {HTMLCanvasElement} [options.canvas]
   * @param {number} [options.initialDepth=0]
   * @param {number} [options.initialLean=0]
   * @param {number} [options.loadKg=100]
   * @param {string} [options.barPositionType='HIGH_BAR']
   * @param {Function} [options.onUpdate]
   */
  constructor(options = {}) {
    this.canvas = options.canvas || null;
    this.onUpdate = options.onUpdate || null;

    // Sub-modules
    this.anatomy = new SquatAnatomy();
    this.biomechanics = new SquatBiomechanics();
    this.renderer = this.canvas ? new SquatRenderer(this.canvas) : null;
    this.data = SQUAT_DATA;

    // Unified State
    this.state = {
      depthNorm: options.initialDepth ?? 0, // 0 = standing, 1.0 = deep bottom
      trunkLeanDeg: options.initialLean ?? 0, // -10° upright to +30° forward lean
      barPositionType: options.barPositionType ?? 'HIGH_BAR',
      loadKg: options.loadKg ?? 100,
      includeBodyMass: true,
      isPlaying: false,
      playbackSpeed: 1.0,
      animationDirection: 1, // 1 = descent, -1 = ascent
      targetRepetitionDurationSec: 4.0
    };

    this.pixelsPerMeter = 360;
    this.footBasePos = new Vector2(260, 420);

    this.lastTimestamp = 0;
    this.animationFrameId = null;
    this.listeners = new Set();

    if (this.canvas && this.renderer) {
      this.renderer.resize();
      this.render();
    }
  }

  subscribe(callback) {
    this.listeners.add(callback);
    callback(this.getCurrentState());
    return () => this.listeners.delete(callback);
  }

  notifyListeners(data) {
    if (this.onUpdate) this.onUpdate(data);
    for (const listener of this.listeners) {
      listener(data);
    }
  }

  setDepth(depth) {
    this.state.depthNorm = Math.max(0, Math.min(1.0, depth));
    this.update();
  }

  setTrunkLean(deg) {
    this.state.trunkLeanDeg = Math.max(-15, Math.min(35, deg));
    this.update();
  }

  setBarPosition(type) {
    this.state.barPositionType = type === 'LOW_BAR' ? 'LOW_BAR' : 'HIGH_BAR';
    this.update();
  }

  setLoad(kg) {
    this.state.loadKg = Math.max(0, Math.min(300, kg));
    this.update();
  }

  setIncludeBodyMass(include) {
    this.state.includeBodyMass = Boolean(include);
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
    if (this.state.isPlaying) this.pause();
    else this.play();
  }

  reset() {
    this.pause();
    this.state.depthNorm = 0;
    this.state.animationDirection = 1;
    this.update();
  }

  loop(timestamp) {
    if (!this.state.isPlaying) return;

    const deltaMs = timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;
    const deltaSec = deltaMs / 1000;

    const halfRepTime = this.state.targetRepetitionDurationSec / 2;
    const depthDelta = (deltaSec / halfRepTime) * this.state.playbackSpeed;

    let newDepth = this.state.depthNorm + this.state.animationDirection * depthDelta;

    if (newDepth >= 1.0) {
      newDepth = 1.0;
      this.state.animationDirection = -1; // Reverse to ascent
    } else if (newDepth <= 0.0) {
      newDepth = 0.0;
      this.state.animationDirection = 1; // Reverse to descent
    }

    this.state.depthNorm = newDepth;
    this.update();

    this.animationFrameId = requestAnimationFrame(this.loop);
  }

  getCurrentState() {
    const pose = this.anatomy.getPose(
      this.state.depthNorm,
      this.state.trunkLeanDeg,
      this.state.barPositionType,
      this.footBasePos,
      this.pixelsPerMeter
    );

    const analysis = this.biomechanics.analyze(
      pose,
      this.state.loadKg,
      this.state.includeBodyMass,
      this.pixelsPerMeter
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

    const cw = this.renderer.width;
    const ch = this.renderer.height;
    // Ankle anchored nicely above bottom platform
    this.footBasePos = new Vector2(cw * 0.44, ch * 0.82);
    this.pixelsPerMeter = Math.min(cw, ch) * 0.48;

    this.update();
  }

  setCanvas(canvas) {
    this.canvas = canvas || null;
    if (this.canvas) {
      if (!this.renderer) {
        this.renderer = new SquatRenderer(this.canvas);
      } else {
        this.renderer.canvas = this.canvas;
        this.renderer.ctx = this.canvas.getContext ? this.canvas.getContext('2d') : null;
      }
    } else {
      this.renderer = null;
    }
  }

  destroy() {
    this.pause();
    this.listeners.clear();
    this.canvas = null;
    this.renderer = null;
  }
}
