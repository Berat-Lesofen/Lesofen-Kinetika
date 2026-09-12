/**
 * LESOFEN KINETIKA - Relational Anatomy & Biomechanics Graph
 * Kas ↔ Eklem ↔ Hareket ↔ Egzersiz arasındaki çift yönlü köprü
 */

import { MUSCLES } from '../data/muscles.js';
import { MOVEMENTS } from '../data/movements.js';
import { EXERCISES } from '../data/exercises.js';
import { INSIGHTS } from '../data/insights.js';

class AnatomyGraph {
  constructor() {
    this.muscles = MUSCLES;
    this.movements = MOVEMENTS;
    this.exercises = EXERCISES;
    this.insights = INSIGHTS;

    this.muscleMap = new Map(this.muscles.map(m => [m.id, m]));
    this.movementMap = new Map(this.movements.map(m => [m.id, m]));
    this.exerciseMap = new Map(this.exercises.map(e => [e.id, e]));
    this.insightMap = new Map(this.insights.map(i => [i.id, i]));
  }

  getMuscle(id) {
    return this.muscleMap.get(id);
  }

  getMovement(id) {
    return this.movementMap.get(id);
  }

  getExercise(id) {
    return this.exerciseMap.get(id);
  }

  getInsight(id) {
    return this.insightMap.get(id);
  }

  getAllMuscles() {
    return this.muscles;
  }

  getAllMovements() {
    return this.movements;
  }

  getAllExercises() {
    return this.exercises;
  }

  getAllInsights() {
    return this.insights;
  }

  /**
   * Dinamik Bölgesel Gruplar ve Kas Sayımları (Progressive Disclosure)
   */
  getRegionalGroups() {
    const allMuscles = this.getAllMuscles();
    const groups = [
      {
        title: "Üst Gövde (Upper Body)",
        regions: [
          { id: "Omuz", icon: "🛡️", name: "Omuz", desc: "Deltoid başları ve Rotator Cuff stabilizatörleri", categories: ["Omuz", "Omuz Derin"] },
          { id: "Göğüs", icon: "📐", name: "Göğüs", desc: "Pectoralis major (klaviküler ve sternal lifler)", categories: ["Göğüs"] },
          { id: "Sırt", icon: "🦅", name: "Sırt & Üst Gövde", desc: "Latissimus dorsi, trapez, romboidler ve teres major", categories: ["Sırt"] },
          { id: "Kol", icon: "💪", name: "Kol (Pazu & Arka Kol)", desc: "Biceps brachii, brachialis ve triceps brachii", categories: ["Kol"] },
          { id: "Önkol", icon: "✊", name: "Önkol", desc: "El bileği fleksör ve ekstansör zinciri", categories: ["Önkol"] }
        ]
      },
      {
        title: "Gövde & Merkez (Core)",
        regions: [
          { id: "Core", icon: "🧱", name: "Karın & Core", desc: "Rectus abdominis, internal ve eksternal oblikler", categories: ["Core"] },
          { id: "Omurga", icon: "🏛️", name: "Omurga Doğrultucuları", desc: "Erector spinae ve spinal stabilizatörler", categories: ["Omurga"] }
        ]
      },
      {
        title: "Alt Gövde (Lower Body)",
        regions: [
          { id: "Kalça", icon: "⚡", name: "Kalça (Glutes)", desc: "Gluteus maximus ve gluteus medius", categories: ["Kalça"] },
          { id: "Ön Bacak", icon: "🦵", name: "Quadriceps (Ön Bacak)", desc: "Rectus femoris ve vasti grubu", categories: ["Ön Bacak"] },
          { id: "Arka Bacak", icon: "🏃", name: "Hamstring (Arka Bacak)", desc: "Biceps femoris, semitendinosus, semimembranosus", categories: ["Arka Bacak"] },
          { id: "Baldır", icon: "🦶", name: "Baldır & Kaval", desc: "Gastrocnemius, soleus ve tibialis anterior", categories: ["Baldır"] }
        ]
      }
    ];

    return groups.map(g => ({
      ...g,
      regions: g.regions.map(r => {
        const muscles = allMuscles.filter(m => r.categories.includes(m.category));
        return {
          ...r,
          muscles,
          count: muscles.length
        };
      })
    }));
  }

  /**
   * Belirtilen bölgeye ait kasları döner
   */
  getMusclesForRegion(regionId) {
    if (!regionId) return [];
    const groups = this.getRegionalGroups();
    for (const g of groups) {
      const found = g.regions.find(r => 
        r.id.toLowerCase() === regionId.toLowerCase() || 
        r.name.toLowerCase() === regionId.toLowerCase()
      );
      if (found) return found.muscles;
    }
    return this.getAllMuscles().filter(m => m.category.toLowerCase() === regionId.toLowerCase());
  }

  /**
   * Tanımlı toplam bölge sayısını dinamik hesaplar
   */
  getTotalRegionsCount() {
    const groups = this.getRegionalGroups();
    return groups.reduce((sum, g) => sum + g.regions.length, 0);
  }


  /**
   * Bir kasın rol aldığı tüm hareketleri ve detaylarını getirir
   */
  getMovementsForMuscle(muscleId) {
    const muscle = this.getMuscle(muscleId);
    if (!muscle) return [];

    return muscle.actions.map(act => {
      const movement = this.getMovement(act.movement);
      return {
        ...act,
        movementDetails: movement || { name: act.movement, plane: "Bilinmiyor", axis: "-" }
      };
    });
  }

  /**
   * Bir kası hedefleyen egzersizleri ve ilişkilerini getirir
   */
  getExercisesForMuscle(muscleId) {
    const matchingExercises = [];

    for (const ex of this.exercises) {
      const isPrime = ex.targetMuscles.primeMovers.includes(muscleId);
      const isSynergist = ex.targetMuscles.synergists?.includes(muscleId);
      const isStabilizer = ex.targetMuscles.stabilizers?.includes(muscleId);

      if (isPrime || isSynergist || isStabilizer) {
        matchingExercises.push({
          exercise: ex,
          role: isPrime ? "prime_mover" : (isSynergist ? "synergist" : "stabilizer")
        });
      }
    }

    return matchingExercises;
  }

  /**
   * Bir hareket seçildiğinde çalışan kasları (Primer, Sinerjist) getirir
   */
  getMusclesForMovement(movementId) {
    const movement = this.getMovement(movementId);
    if (!movement) return { primeMovers: [], synergists: [], antagonists: [] };

    return {
      primeMovers: movement.primeMovers.map(id => this.getMuscle(id)).filter(Boolean),
      synergists: movement.synergists ? movement.synergists.map(id => this.getMuscle(id)).filter(Boolean) : [],
      antagonists: movement.antagonists ? movement.antagonists.map(id => this.getMuscle(id)).filter(Boolean) : []
    };
  }

  /**
   * Bir kas ile ilgili klinik/mekanik 'Neden hissediyorum?' içgörülerini getirir
   */
  getInsightsForMuscle(muscleId) {
    return this.insights.filter(ins => ins.relatedMuscles && ins.relatedMuscles.includes(muscleId));
  }

  /**
   * Global akıllı arama
   */
  search(query) {
    if (!query || query.trim().length === 0) return { muscles: [], movements: [], exercises: [], insights: [] };

    const q = query.toLowerCase().trim();

    const muscles = this.muscles.filter(m => 
      m.name.toLowerCase().includes(q) || 
      m.latinName.toLowerCase().includes(q) || 
      m.category.toLowerCase().includes(q)
    );

    const movements = this.movements.filter(m => 
      m.name.toLowerCase().includes(q) || 
      m.joint.toLowerCase().includes(q) || 
      m.plane.toLowerCase().includes(q)
    );

    const exercises = this.exercises.filter(e => 
      e.name.toLowerCase().includes(q) || 
      e.category.toLowerCase().includes(q)
    );

    const insights = this.insights.filter(i => 
      i.question.toLowerCase().includes(q) || 
      i.summary.toLowerCase().includes(q)
    );

    return { muscles, movements, exercises, insights };
  }
}

export const graph = new AnatomyGraph();
