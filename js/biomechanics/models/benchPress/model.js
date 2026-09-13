/**
 * PROTOTYPE 04 — BENCH PRESS (MODEL CONTROLLER & STATE MACHINE)
 * Connects anatomy, biomechanics, and renderer under a single unified state.
 * Portable and framework-agnostic.
 */

import { Vector2 } from '../../shared/vectors.js';
import { BenchPressAnatomy } from './anatomy.js';
import { BenchPressBiomechanics } from './biomechanics.js';
import { BenchPressRenderer } from './renderer.js';
import { BENCH_PRESS_DATA } from './data.js';

export class BenchPressModel {
  /**
   * @param {Object} options
   * @param {HTMLCanvasElement} [options.canvas]
   * @param {number} [options.initialPhase=0]
   * @param {string} [options.barPathType='CURVED_J_CURVE']
   * @param {number} [options.loadKg=100]
   * @param {Function} [options.onUpdate]
   */
  constructor(options = {}) {
    this.canvas = options.canvas || null;
    this.onUpdate = options.onUpdate || null;

    // Sub-modules
    this.anatomy = new BenchPressAnatomy();
    this.biomechanics = new BenchPressBiomechanics();
    this.renderer = this.canvas ? new BenchPressRenderer(this.canvas) : null;
    this.data = BENCH_PRESS_DATA;

    // Unified State
    this.state = {
      phaseNorm: options.initialPhase ?? 0, // 0 = lockout, 1 = bottom
      barPathType: options.barPathType ?? 'CURVED_J_CURVE',
      loadKg: options.loadKg ?? 100,
      isPlaying: false,
      playbackSpeed: 1.0,
      animationDirection: 1, // 1 = descent, -1 = press
      targetRepetitionDurationSec: 4.0
    };

    this.pixelsPerMeter = 360;
    this.benchBasePos = new Vector2(160, 360);

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

  setPhase(phase) {
    this.state.phaseNorm = Math.max(0, Math.min(1.0, phase));
    this.update();
  }

  setBarPath(type) {
    this.state.barPathType = type === 'STRAIGHT_VERTICAL' ? 'STRAIGHT_VERTICAL' : 'CURVED_J_CURVE';
    this.update();
  }

  setLoad(kg) {
    this.state.loadKg = Math.max(0, Math.min(300, kg));
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
    this.state.phaseNorm = 0;
    this.state.animationDirection = 1;
    this.update();
  }

  loop(timestamp) {
    if (!this.state.isPlaying) return;

    const deltaMs = timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;
    const deltaSec = deltaMs / 1000;

    const halfRepTime = this.state.targetRepetitionDurationSec / 2;
    const phaseDelta = (deltaSec / halfRepTime) * this.state.playbackSpeed;

    let newPhase = this.state.phaseNorm + this.state.animationDirection * phaseDelta;

    if (newPhase >= 1.0) {
      newPhase = 1.0;
      this.state.animationDirection = -1; // Reverse to press
    } else if (newPhase <= 0.0) {
      newPhase = 0.0;
      this.state.animationDirection = 1; // Reverse to descent
    }

    this.state.phaseNorm = newPhase;
    this.update();

    this.animationFrameId = requestAnimationFrame(this.loop);
  }

  /**
   * Samples points along bar path trajectory.
   */
  getPathTracePoints() {
    const points = [];
    const steps = 24;
    for (let i = 0; i <= steps; i++) {
      const p = i / steps;
      const samplePose = this.anatomy.getPose(
        p,
        this.state.barPathType,
        this.benchBasePos,
        this.pixelsPerMeter
      );
      points.push(samplePose.landmarks.barbell);
    }
    return points;
  }

  getCurrentState() {
    const pose = this.anatomy.getPose(
      this.state.phaseNorm,
      this.state.barPathType,
      this.benchBasePos,
      this.pixelsPerMeter
    );

    const analysis = this.biomechanics.analyze(
      pose,
      this.state.loadKg,
      this.pixelsPerMeter
    );

    return {
      state: { ...this.state },
      pose,
      analysis,
      data: this.data,
      pathTracePoints: this.getPathTracePoints()
    };
  }

  update() {
    const currentState = this.getCurrentState();
    if (this.renderer) {
      this.renderer.render(currentState.pose, currentState.analysis, currentState.pathTracePoints);
    }
    this.notifyListeners(currentState);
  }

  render() {
    if (!this.renderer) return;
    const { pose, analysis, pathTracePoints } = this.getCurrentState();
    this.renderer.render(pose, analysis, pathTracePoints);
  }

  resize() {
    if (!this.renderer || !this.canvas) return;
    this.renderer.resize();

    const cw = this.renderer.width;
    const ch = this.renderer.height;
    // Bench horizontal plane positioned in middle-lower third
    this.benchBasePos = new Vector2(cw * 0.20, ch * 0.65);
    this.pixelsPerMeter = Math.min(cw, ch) * 0.50;

    this.update();
  }

  setCanvas(canvas) {
    this.canvas = canvas || null;
    if (this.canvas) {
      if (!this.renderer) {
        this.renderer = new BenchPressRenderer(this.canvas);
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
