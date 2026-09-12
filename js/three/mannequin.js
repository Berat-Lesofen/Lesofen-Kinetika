/**
 * LESOFEN KINETIKA - 3D Anatomical Mannequin Rig
 * 28 Fonksiyonel Kas Grubu, İskelet Çerçevesi ve Eklem Eksenleri
 */

import * as THREE from 'three';
import { MUSCLES } from '../data/muscles.js';

export class AnatomicalMannequin {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.name = "AnatomicalMannequin";

    this.muscleMeshes = new Map(); // muscleId -> [Mesh]
    this.interactiveMeshes = [];   // Array for raycasting

    this.layers = {
      skin: new THREE.Group(),
      muscles: new THREE.Group(),
      skeleton: new THREE.Group(),
      joints: new THREE.Group()
    };

    this.group.add(this.layers.skin);
    this.group.add(this.layers.skeleton);
    this.group.add(this.layers.muscles);
    this.group.add(this.layers.joints);

    this.scene.add(this.group);

    this.materials = this.createMaterials();
    this.buildSkeleton();
    this.buildMuscles();
    this.buildSkinSilhouette();
    this.buildJointMarkers();
  }

  createMaterials() {
    return {
      bone: new THREE.MeshStandardMaterial({
        color: 0xd4d4d8,
        roughness: 0.4,
        metalness: 0.1,
        wireframe: false
      }),
      boneAccent: new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        roughness: 0.5,
        wireframe: true
      }),
      skin: new THREE.MeshPhysicalMaterial({
        color: 0x181e29,
        roughness: 0.3,
        transmission: 0.7,
        thickness: 0.5,
        transparent: true,
        opacity: 0.18,
        wireframe: false,
        side: THREE.DoubleSide
      }),
      muscleDefault: (colorHex = 0xef4444) => new THREE.MeshStandardMaterial({
        color: colorHex,
        roughness: 0.45,
        metalness: 0.2,
        emissive: 0x110505,
        emissiveIntensity: 0.3
      }),
      jointPivot: new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        wireframe: true
      })
    };
  }

  buildSkeleton() {
    const sGroup = this.layers.skeleton;

    // 1. Omurga (Spine)
    const spineGeo = new THREE.CylinderGeometry(0.08, 0.09, 2.2, 12);
    const spineMesh = new THREE.Mesh(spineGeo, this.materials.bone);
    spineMesh.position.set(0, 4.4, -0.05);
    sGroup.add(spineMesh);

    // 2. Göğüs Kafesi (Ribcage Silhouette)
    const ribGeo = new THREE.CylinderGeometry(0.75, 0.65, 1.4, 16, 4, true);
    const ribMesh = new THREE.Mesh(ribGeo, this.materials.boneAccent);
    ribMesh.position.set(0, 4.7, 0);
    sGroup.add(ribMesh);

    // 3. Klavikulalar (Köprücük Kemikleri)
    const clavicleGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.5, 8);
    const clavicleMesh = new THREE.Mesh(clavicleGeo, this.materials.bone);
    clavicleMesh.rotation.z = Math.PI / 2;
    clavicleMesh.position.set(0, 5.45, 0.15);
    sGroup.add(clavicleMesh);

    // 4. Pelvis (Leğen Kemiği)
    const pelvisGeo = new THREE.TorusGeometry(0.65, 0.14, 8, 20);
    const pelvisMesh = new THREE.Mesh(pelvisGeo, this.materials.bone);
    pelvisMesh.rotation.x = Math.PI / 2;
    pelvisMesh.position.set(0, 3.4, 0);
    sGroup.add(pelvisMesh);

    // 5. Kafatası (Cranium)
    const skullGeo = new THREE.SphereGeometry(0.45, 16, 16);
    const skullMesh = new THREE.Mesh(skullGeo, this.materials.bone);
    skullMesh.position.set(0, 6.2, 0);
    skullMesh.scale.set(0.9, 1.1, 1.0);
    sGroup.add(skullMesh);

    // 6. Kollar (Humerus, Radius, Ulna)
    [-1, 1].forEach(side => {
      // Humerus
      const humerusGeo = new THREE.CylinderGeometry(0.06, 0.05, 1.4, 8);
      const humerus = new THREE.Mesh(humerusGeo, this.materials.bone);
      humerus.position.set(side * 1.05, 4.6, 0);
      sGroup.add(humerus);

      // Önkol kemikleri
      const forearmGeo = new THREE.CylinderGeometry(0.05, 0.04, 1.3, 8);
      const forearm = new THREE.Mesh(forearmGeo, this.materials.bone);
      forearm.position.set(side * 1.15, 3.2, 0.05);
      sGroup.add(forearm);
    });

    // 7. Bacaklar (Femur, Tibia)
    [-1, 1].forEach(side => {
      // Femur
      const femurGeo = new THREE.CylinderGeometry(0.08, 0.07, 1.8, 8);
      const femur = new THREE.Mesh(femurGeo, this.materials.bone);
      femur.position.set(side * 0.45, 2.3, 0);
      sGroup.add(femur);

      // Tibia / Fibula
      const tibiaGeo = new THREE.CylinderGeometry(0.07, 0.06, 1.8, 8);
      const tibia = new THREE.Mesh(tibiaGeo, this.materials.bone);
      tibia.position.set(side * 0.45, 0.9, 0);
      sGroup.add(tibia);
    });
  }

  buildMuscles() {
    const mGroup = this.layers.muscles;

    const addMuscleMesh = (muscleId, geometry, pos, rot = [0, 0, 0], scale = [1, 1, 1]) => {
      const muscleData = MUSCLES.find(m => m.id === muscleId);
      const color = muscleData ? parseInt(muscleData.color.replace("#", "0x")) : 0xef4444;

      const mat = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.35,
        metalness: 0.25,
        emissive: color,
        emissiveIntensity: 0.15
      });

      const mesh = new THREE.Mesh(geometry, mat);
      mesh.position.set(...pos);
      mesh.rotation.set(...rot);
      mesh.scale.set(...scale);

      mesh.userData = {
        muscleId,
        baseColor: color,
        name: muscleData ? muscleData.name : muscleId,
        latinName: muscleData ? muscleData.latinName : ""
      };

      mGroup.add(mesh);
      this.interactiveMeshes.push(mesh);

      if (!this.muscleMeshes.has(muscleId)) {
        this.muscleMeshes.set(muscleId, []);
      }
      this.muscleMeshes.get(muscleId).push(mesh);
      return mesh;
    };

    // ==========================================
    // 1. OMUZ (DELTOID 3 BAŞ + ROTATOR CUFF)
    // ==========================================
    [-1, 1].forEach(side => {
      // Anterior Deltoid (Ön)
      const antDeltGeo = new THREE.ConeGeometry(0.24, 0.55, 12);
      addMuscleMesh("deltoid_anterior", antDeltGeo, [side * 1.0, 5.3, 0.25], [0.3, 0, -side * 0.4]);

      // Lateral Deltoid (Yan)
      const latDeltGeo = new THREE.ConeGeometry(0.26, 0.62, 12);
      addMuscleMesh("deltoid_lateral", latDeltGeo, [side * 1.14, 5.25, 0], [0, 0, -side * 0.3]);

      // Posterior Deltoid (Arka)
      const postDeltGeo = new THREE.ConeGeometry(0.24, 0.55, 12);
      addMuscleMesh("deltoid_posterior", postDeltGeo, [side * 1.0, 5.3, -0.25], [-0.3, 0, -side * 0.4]);

      // Supraspinatus
      const supraGeo = new THREE.BoxGeometry(0.35, 0.12, 0.15);
      addMuscleMesh("supraspinatus", supraGeo, [side * 0.6, 5.4, -0.15], [0, 0, -side * 0.2]);

      // Infraspinatus & Teres Minor
      const infraGeo = new THREE.BoxGeometry(0.35, 0.35, 0.12);
      addMuscleMesh("infraspinatus_teres_minor", infraGeo, [side * 0.65, 4.85, -0.32], [0, side * 0.2, -side * 0.1]);
    });

    // ==========================================
    // 2. GÖĞÜS (PECTORALIS MAJOR)
    // ==========================================
    [-1, 1].forEach(side => {
      // Pectoralis Major - Clavicular (Üst Göğüs)
      const pecClavGeo = new THREE.BoxGeometry(0.52, 0.25, 0.16);
      addMuscleMesh("pectoralis_major_clavicular", pecClavGeo, [side * 0.36, 5.15, 0.38], [0.1, -side * 0.25, side * 0.15]);

      // Pectoralis Major - Sternal (Orta & Alt Göğüs)
      const pecSternGeo = new THREE.BoxGeometry(0.56, 0.45, 0.18);
      addMuscleMesh("pectoralis_major_sternal", pecSternGeo, [side * 0.4, 4.75, 0.38], [0.15, -side * 0.25, -side * 0.1]);
    });

    // ==========================================
    // 3. SIRT (LATS, TRAPS, RHOMBOIDS)
    // ==========================================
    // Üst Trapez (Superior)
    [-1, 1].forEach(side => {
      const trapUpGeo = new THREE.ConeGeometry(0.28, 0.7, 10);
      addMuscleMesh("trapezius_upper", trapUpGeo, [side * 0.4, 5.5, -0.2], [-0.2, 0, -side * 0.4]);
    });

    // Orta ve Alt Trapez (Transversa & Ascendens)
    const trapMidLowerGeo = new THREE.ConeGeometry(0.65, 1.2, 4);
    addMuscleMesh("trapezius_middle_lower", trapMidLowerGeo, [0, 4.5, -0.35], [Math.PI, 0, 0], [1, 1, 0.4]);

    // Rhomboids
    [-1, 1].forEach(side => {
      const rhombGeo = new THREE.BoxGeometry(0.3, 0.4, 0.08);
      addMuscleMesh("rhomboids", rhombGeo, [side * 0.4, 4.75, -0.32], [0, 0, side * 0.4]);
    });

    // Latissimus Dorsi (Kanat)
    [-1, 1].forEach(side => {
      const latGeo = new THREE.BoxGeometry(0.6, 1.3, 0.2);
      addMuscleMesh("latissimus_dorsi", latGeo, [side * 0.62, 4.2, -0.28], [0, side * 0.35, -side * 0.25]);

      // Teres Major
      const teresGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.45, 8);
      addMuscleMesh("teres_major", teresGeo, [side * 0.82, 4.9, -0.22], [0, 0, side * 0.7]);
    });

    // ==========================================
    // 4. KOLLAR (BICEPS, TRICEPS, BRACHIALIS, ÖNKOL)
    // ==========================================
    [-1, 1].forEach(side => {
      // Biceps Brachii (Pazu)
      const bicepsGeo = new THREE.CapsuleGeometry(0.14, 0.55, 8, 12);
      addMuscleMesh("biceps_brachii", bicepsGeo, [side * 1.05, 4.6, 0.16], [0, 0, 0]);

      // Brachialis
      const brachGeo = new THREE.CapsuleGeometry(0.12, 0.4, 8, 12);
      addMuscleMesh("brachialis_brachioradialis", brachGeo, [side * 1.12, 4.35, 0.06], [0, 0, -side * 0.1]);

      // Triceps Brachii (Arka Kol)
      const tricepsGeo = new THREE.CapsuleGeometry(0.16, 0.65, 8, 12);
      addMuscleMesh("triceps_brachii", tricepsGeo, [side * 1.05, 4.6, -0.16], [0, 0, 0]);

      // Forearms (Önkol)
      const forearmGeo = new THREE.CylinderGeometry(0.14, 0.09, 1.1, 12);
      addMuscleMesh("forearm_flexors_extensors", forearmGeo, [side * 1.16, 3.2, 0.06], [0, 0, -side * 0.05]);
    });

    // ==========================================
    // 5. CORE (RECTUS ABDOMINIS, OBLIQUES, ERECTOR SPINAE)
    // ==========================================
    // Rectus Abdominis (Six Pack)
    const absGeo = new THREE.BoxGeometry(0.55, 1.1, 0.16);
    addMuscleMesh("rectus_abdominis", absGeo, [0, 4.15, 0.36], [0, 0, 0]);

    // Obliques (Yan Karın)
    [-1, 1].forEach(side => {
      const obliquesGeo = new THREE.BoxGeometry(0.3, 0.95, 0.22);
      addMuscleMesh("obliques", obliquesGeo, [side * 0.52, 4.1, 0.25], [0, side * 0.4, -side * 0.1]);
    });

    // Erector Spinae (Bel / Omurga Doğrultucuları)
    [-1, 1].forEach(side => {
      const erectorGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.6, 8);
      addMuscleMesh("erector_spinae", erectorGeo, [side * 0.22, 4.1, -0.3], [0, 0, 0]);
    });

    // ==========================================
    // 6. KALÇA (GLUTEUS MAXIMUS & MEDIUS)
    // ==========================================
    [-1, 1].forEach(side => {
      // Gluteus Maximus (Büyük Kalça)
      const gluteMaxGeo = new THREE.SphereGeometry(0.42, 14, 14);
      addMuscleMesh("gluteus_maximus", gluteMaxGeo, [side * 0.4, 3.3, -0.32], [0.2, 0, 0], [1.1, 1.1, 0.9]);

      // Gluteus Medius (Yan Kalça)
      const gluteMedGeo = new THREE.BoxGeometry(0.32, 0.35, 0.3);
      addMuscleMesh("gluteus_medius", gluteMedGeo, [side * 0.65, 3.45, -0.1], [0, 0, -side * 0.25]);
    });

    // ==========================================
    // 7. ÖN & ARKA BACAK (QUADS & HAMSTRINGS)
    // ==========================================
    [-1, 1].forEach(side => {
      // Rectus Femoris (Ön Bacak Orta)
      const recFemGeo = new THREE.CapsuleGeometry(0.15, 0.95, 8, 12);
      addMuscleMesh("quadriceps_rectus_femoris", recFemGeo, [side * 0.45, 2.3, 0.24], [0, 0, 0]);

      // Vasti Grubu (Lateralis & Medialis)
      const vastusLatGeo = new THREE.CapsuleGeometry(0.16, 0.9, 8, 12);
      addMuscleMesh("quadriceps_vasti", vastusLatGeo, [side * 0.64, 2.25, 0.12], [0, 0, -side * 0.1]);

      // Hamstrings (Arka Bacak)
      const hamsGeo = new THREE.CapsuleGeometry(0.18, 1.05, 8, 12);
      addMuscleMesh("hamstrings", hamsGeo, [side * 0.45, 2.25, -0.22], [0, 0, 0]);
    });

    // ==========================================
    // 8. BALDIR (GASTROCNEMIUS & SOLEUS)
    // ==========================================
    [-1, 1].forEach(side => {
      // Gastrocnemius (İki Başlı Üst Baldır)
      const gastrocGeo = new THREE.SphereGeometry(0.24, 12, 12);
      addMuscleMesh("gastrocnemius", gastrocGeo, [side * 0.45, 1.15, -0.2], [0, 0, 0], [1.0, 1.4, 0.9]);

      // Soleus (Derin Düz Baldır)
      const soleusGeo = new THREE.CylinderGeometry(0.15, 0.1, 0.9, 10);
      addMuscleMesh("soleus", soleusGeo, [side * 0.45, 0.75, -0.12], [0, 0, 0]);
    });
  }

  buildSkinSilhouette() {
    const skinGeo = new THREE.CylinderGeometry(0.85, 0.7, 4.8, 18, 6, true);
    const skinMesh = new THREE.Mesh(skinGeo, this.materials.skin);
    skinMesh.position.set(0, 3.6, 0);
    this.layers.skin.add(skinMesh);
  }

  buildJointMarkers() {
    const jGroup = this.layers.joints;

    const addJoint = (name, pos, axisRadius = 0.2) => {
      const ringGeo = new THREE.TorusGeometry(axisRadius, 0.015, 8, 24);
      const ring = new THREE.Mesh(ringGeo, this.materials.jointPivot);
      ring.position.set(...pos);
      ring.name = name;
      jGroup.add(ring);
    };

    // Omuz Eklemleri
    addJoint("joint_shoulder_left", [-1.05, 5.3, 0]);
    addJoint("joint_shoulder_right", [1.05, 5.3, 0]);

    // Dirsek Eklemleri
    addJoint("joint_elbow_left", [-1.15, 3.9, 0]);
    addJoint("joint_elbow_right", [1.15, 3.9, 0]);

    // Kalça Eklemleri
    addJoint("joint_hip_left", [-0.5, 3.2, 0]);
    addJoint("joint_hip_right", [0.5, 3.2, 0]);

    // Diz Eklemleri
    addJoint("joint_knee_left", [-0.45, 1.5, 0]);
    addJoint("joint_knee_right", [0.45, 1.5, 0]);
  }

  setLayerOpacities({ skin = 0.18, muscle = 1.0, skeleton = 0.35 }) {
    this.materials.skin.opacity = skin;
    this.layers.skin.visible = skin > 0.02;

    this.layers.skeleton.visible = skeleton > 0.05;
    this.materials.bone.opacity = skeleton;
    this.materials.bone.transparent = skeleton < 0.95;

    this.layers.muscles.visible = muscle > 0.05;
    this.muscleMeshes.forEach(meshArr => {
      meshArr.forEach(m => {
        m.material.opacity = muscle;
        m.material.transparent = muscle < 0.95;
      });
    });
  }

  highlightMuscle(muscleId, isSelected = false) {
    this.muscleMeshes.forEach((meshArr, id) => {
      const match = id === muscleId;
      meshArr.forEach(m => {
        if (match) {
          m.material.emissiveIntensity = isSelected ? 0.85 : 0.55;
          m.material.emissive.set(isSelected ? 0x00f2fe : 0xff9f1c);
          m.scale.set(1.08, 1.08, 1.08);
        } else {
          m.material.emissiveIntensity = 0.1;
          m.material.emissive.set(m.userData.baseColor);
          m.scale.set(1.0, 1.0, 1.0);
        }
      });
    });
  }

  getMuscleCenterPosition(muscleId) {
    const meshes = this.muscleMeshes.get(muscleId);
    if (!meshes || meshes.length === 0) return new THREE.Vector3(0, 4.0, 0);

    const center = new THREE.Vector3();
    meshes.forEach(m => center.add(m.position));
    center.divideScalar(meshes.length);
    return center;
  }
}
