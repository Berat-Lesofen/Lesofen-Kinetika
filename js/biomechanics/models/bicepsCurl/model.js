/**
 * PROTOTYPE 02 — BICEPS CURL (MODEL CONTROLLER & STATE MACHINE)
 * Connects anatomy, biomechanics, and renderer under a single unified state.
 * Independent and fully portable.
 */

import { Vector2 } from '../../shared/vectors.js';
import { BicepsCurlAnatomy } from './anatomy.js';
import { BicepsCurlBiomechanics } from './biomechanics.js';
import { BicepsCurlRenderer } from './renderer.js';
import { BICEPS_CURL_DATA } from './data.js';

export class BicepsCurlModel {
  /**
   * @param {Object} options
   * @param {HTMLCanvasElement} [options.canvas]
   * @param {number} [options.initialFlexion=0]
   * @param {number} [options.initialRotation=80] - +80° Supinated by default for classic curl
   * @param {number} [options.loadKg=10]
   * @param {Function} [options.onUpdate]
   */
  constructor(options = {}) {
    this.canvas = options.canvas || null;
    this.onUpdate = options.onUpdate || null;

    // Sub-modules
    this.anatomy = new BicepsCurlAnatomy();
    this.biomechanics = new BicepsCurlBiomechanics();
    this.renderer = this.canvas ? new BicepsCurlRenderer(this.canvas) : null;
    this.data = BICEPS_CURL_DATA;

    // Unified State
    this.state = {
      flexionAngleDeg: options.initialFlexion ?? 0,
      forearmRotationDeg: options.initialRotation ?? 80, // +80° supinated, 0° neutral, -80° pronated
      loadKg: options.loadKg ?? 10,
      includeLimbMass: true,
      isPlaying: false,
      playbackSpeed: 1.0,
      animationDirection: 1, // 1 = curl up, -1 = lower down
      minAngle: 0,
      maxAngle: 145,
      targetRepetitionDurationSec: 4.0 // 2s concentric + 2s eccentric
    };

    this.pixelsPerMeter = 440;
    this.elbowBasePos = new Vector2(200, 240);

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

  setFlexionAngle(angle) {
    this.state.flexionAngleDeg = Math.max(this.state.minAngle, Math.min(this.state.maxAngle, angle));
    this.update();
  }

  setForearmRotation(deg) {
    this.state.forearmRotationDeg = Math.max(-80, Math.min(80, deg));
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
    this.state.flexionAngleDeg = 0;
    this.state.animationDirection = 1;
    this.update();
  }

  loop(timestamp) {
    if (!this.state.isPlaying) return;

    const deltaMs = timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;
    const deltaSec = deltaMs / 1000;

    const totalSweep = this.state.maxAngle - this.state.minAngle;
    const speedDegPerSec = (totalSweep / (this.state.targetRepetitionDurationSec / 2)) * this.state.playbackSpeed;

    let newAngle = this.state.flexionAngleDeg + this.state.animationDirection * speedDegPerSec * deltaSec;

    if (newAngle >= this.state.maxAngle) {
      newAngle = this.state.maxAngle;
      this.state.animationDirection = -1;
    } else if (newAngle <= this.state.minAngle) {
      newAngle = this.state.minAngle;
      this.state.animationDirection = 1;
    }

    this.state.flexionAngleDeg = newAngle;
    this.update();

    this.animationFrameId = requestAnimationFrame(this.loop);
  }

  getCurrentState() {
    const pose = this.anatomy.getPose(
      this.state.flexionAngleDeg,
      this.state.forearmRotationDeg,
      this.elbowBasePos,
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

    const cw = this.renderer.width;
    const ch = this.renderer.height;
    // Position elbow nicely in canvas
    this.elbowBasePos = new Vector2(cw * 0.40, ch * 0.60);
    this.pixelsPerMeter = Math.min(cw, ch) * 0.70;

    this.update();
  }

  setCanvas(canvas) {
    this.canvas = canvas || null;
    if (this.canvas) {
      if (!this.renderer) {
        this.renderer = new BicepsCurlRenderer(this.canvas);
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
