/**
 * LESOFEN KINETIKA - Three.js Scene Manager
 * Sahne, Aydınlatma, Orbit Kontrolleri, Raycaster ve Pürüzsüz Kamera Animasyonu
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { AnatomicalMannequin } from './mannequin.js';
import { state } from '../core/state.js';

export class SceneManager {
  constructor(containerElement) {
    this.container = containerElement;
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x08090c); // Deep Obsidian Lab

    this.initCamera();
    this.initRenderer();
    this.initControls();
    this.initLights();
    this.initEnvironment();

    this.mannequin = new AnatomicalMannequin(this.scene);
    this.initRaycaster();

    this.targetCameraPos = new THREE.Vector3().copy(this.camera.position);
    this.targetControlsTarget = new THREE.Vector3().copy(this.controls.target);
    this.isTransitioning = false;

    this.animate = this.animate.bind(this);
    this.onResize = this.onResize.bind(this);

    window.addEventListener('resize', this.onResize);
    this.subscribeToState();

    this.animate();
  }

  initCamera() {
    this.camera = new THREE.PerspectiveCamera(42, this.width / this.height, 0.1, 100);
    this.camera.position.set(0, 3.8, 8.5); // Göğüs/omuz seviyesinde başlangıç
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.container.appendChild(this.renderer.domElement);
  }

  initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.target.set(0, 3.6, 0);
    this.controls.minDistance = 2.5;
    this.controls.maxDistance = 14.0;
    this.controls.maxPolarAngle = Math.PI * 0.95;
  }

  initLights() {
    // 1. Derin Medikal Ortam Işığı
    const ambientLight = new THREE.AmbientLight(0x1e293b, 1.2);
    this.scene.add(ambientLight);

    // 2. Ana Işık (Key Light - Cool White)
    const keyLight = new THREE.DirectionalLight(0xf8fafc, 2.0);
    keyLight.position.set(4, 8, 6);
    this.scene.add(keyLight);

    // 3. Dolgu Işığı (Fill Light - Mavi/Cyan)
    const fillLight = new THREE.DirectionalLight(0x0ea5e9, 1.2);
    fillLight.position.set(-6, 4, 3);
    this.scene.add(fillLight);

    // 4. Kenar / Vurgu Işığı (Rim Light - Amber)
    const rimLight = new THREE.DirectionalLight(0xff9f1c, 1.8);
    rimLight.position.set(0, 5, -7);
    this.scene.add(rimLight);
  }

  initEnvironment() {
    // Zemin Grid Izgarası (Teknik Laboratuvar)
    const gridHelper = new THREE.GridHelper(20, 40, 0x00f2fe, 0x1e293b);
    gridHelper.position.y = 0;
    this.scene.add(gridHelper);
  }

  initRaycaster() {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.tooltipEl = document.getElementById("anatomyTooltip");

    const onPointerMove = (e) => {
      const rect = this.renderer.domElement.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.mannequin.interactiveMeshes);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        const muscleId = hit.userData.muscleId;
        this.container.style.cursor = "pointer";

        if (this.tooltipEl) {
          this.tooltipEl.style.display = "block";
          this.tooltipEl.style.left = `${e.clientX + 14}px`;
          this.tooltipEl.style.top = `${e.clientY - 12}px`;
          this.tooltipEl.innerHTML = `
            <div class="font-mono text-xs text-amber-400 font-semibold tracking-wider uppercase">SEÇİLEBİLİR KAS</div>
            <div class="text-sm font-bold text-white">${hit.userData.name}</div>
            <div class="text-xs text-slate-400 italic">${hit.userData.latinName || ""}</div>
          `;
        }
        state.setHoveredMuscle(muscleId);
      } else {
        this.container.style.cursor = "default";
        if (this.tooltipEl) {
          this.tooltipEl.style.display = "none";
        }
        state.setHoveredMuscle(null);
      }
    };

    const onClick = (e) => {
      const rect = this.renderer.domElement.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.mannequin.interactiveMeshes);

      if (intersects.length > 0) {
        const muscleId = intersects[0].object.userData.muscleId;
        state.selectMuscle(muscleId);
        this.focusOnMuscle(muscleId);
      }
    };

    this.renderer.domElement.addEventListener('pointermove', onPointerMove);
    this.renderer.domElement.addEventListener('click', onClick);
  }

  focusOnMuscle(muscleId) {
    const center = this.mannequin.getMuscleCenterPosition(muscleId);
    
    // Kamerayı kasın yüksekliğine ve hafif açısına yönelt
    this.targetControlsTarget.set(0, center.y, 0);

    // Kasın bulunduğu bölgeye göre uygun mesafe hesapla
    let distance = 3.8;
    if (muscleId.includes("deltoid") || muscleId.includes("pectoralis") || muscleId.includes("biceps")) {
      distance = 3.2;
    } else if (muscleId.includes("gluteus") || muscleId.includes("quadriceps")) {
      distance = 4.2;
    }

    const currentAngle = Math.atan2(this.camera.position.x, this.camera.position.z);
    this.targetCameraPos.set(
      Math.sin(currentAngle) * distance,
      center.y + 0.3,
      Math.cos(currentAngle) * distance
    );

    this.isTransitioning = true;
    this.mannequin.highlightMuscle(muscleId, true);
  }

  resetView(angle = "anterior") {
    this.targetControlsTarget.set(0, 3.6, 0);
    if (angle === "anterior") {
      this.targetCameraPos.set(0, 3.8, 8.5);
    } else if (angle === "posterior") {
      this.targetCameraPos.set(0, 3.8, -8.5);
    } else if (angle === "lateral") {
      this.targetCameraPos.set(8.5, 3.8, 0);
    }
    this.isTransitioning = true;
  }

  subscribeToState() {
    state.subscribe((s) => {
      // Katman geçirgenliklerini güncelle
      this.mannequin.setLayerOpacities({
        skin: s.skinOpacity,
        muscle: s.muscleOpacity,
        skeleton: s.skeletonOpacity
      });

      // Seçili kası parlat
      if (s.selectedMuscleId) {
        this.mannequin.highlightMuscle(s.selectedMuscleId, true);
      }
    });
  }

  onResize() {
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }

  animate() {
    requestAnimationFrame(this.animate);

    // Pürüzsüz kamera odaklanması (Lerp interpolation)
    if (this.isTransitioning) {
      this.camera.position.lerp(this.targetCameraPos, 0.06);
      this.controls.target.lerp(this.targetControlsTarget, 0.06);

      if (this.camera.position.distanceTo(this.targetCameraPos) < 0.04 &&
          this.controls.target.distanceTo(this.targetControlsTarget) < 0.04) {
        this.isTransitioning = false;
      }
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}
