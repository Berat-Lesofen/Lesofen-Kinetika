/**
 * LESOFEN KINETIKA - Main Application Orchestrator
 * 2D İnteraktif Atlas, Biyomekanik Laboratuvarı ve Antrenman Ajandası
 */

import { state } from './core/state.js';
import { graph } from './core/graph.js';
import { Header } from './components/header.js';
import { BreadcrumbNav } from './components/breadcrumb.js';
import { PortalHome } from './components/portalHome.js';
import { MuscleHierarchy } from './components/muscleHierarchy.js';
import { MovementAtlas } from './components/movementLab.js';
import { BiomechanicsLab } from './components/bioLab.js';
import { ExerciseLab } from './components/exerciseLab.js';
import { ClinicalInsights } from './components/insightsModal.js';
import { FunctionalQuiz } from './components/quizModal.js';
import { TrainingAgenda } from './agenda/calendar.js';

class LesofenKinetikaApp {
  constructor() {
    this.init();
  }

  init() {
    console.log("%cLESOFEN KINETIKA%c — Human Movement · Anatomy · Biomechanics", 
      "background: #00f2fe; color: #08090c; font-weight: bold; padding: 4px 8px; border-radius: 4px;",
      "color: #ff9f1c; font-weight: bold; margin-left: 6px;");

    // 1. Header & Global Nav
    const headerContainer = document.getElementById('siteHeaderContainer');
    this.header = new Header(headerContainer, (muscleId) => {
      this.handleMuscleJump(muscleId);
    });

    // 2. Breadcrumb Navigation Bar (Level & Step Back)
    const breadcrumbContainer = document.getElementById('breadcrumbContainer');
    this.breadcrumb = new BreadcrumbNav(breadcrumbContainer);

    // 3. Portal Home (Level 1 Gateway)
    const portalHomeContainer = document.getElementById('portalHomeContainer');
    this.portalHome = new PortalHome(portalHomeContainer);

    // 4. Kas Sistemi (Progressive Disclosure Hierarchy)
    const muscleHierarchyContainer = document.getElementById('muscleHierarchyContainer');
    this.muscleHierarchy = new MuscleHierarchy(muscleHierarchyContainer);

    // 5. Hareket Atlası
    const movementAtlasContainer = document.getElementById('movementAtlasContainer');
    this.movementAtlas = new MovementAtlas(movementAtlasContainer, (muscleId) => {
      this.handleMuscleJump(muscleId);
    });

    // 6. Biyomekanik Laboratuvarı (Moment Kolu & Tork)
    const bioLabContainer = document.getElementById('bioLabContainer');
    this.bioLab = new BiomechanicsLab(bioLabContainer);

    // 7. Egzersiz Analizi
    const exerciseLabContainer = document.getElementById('exerciseLabContainer');
    this.exerciseLab = new ExerciseLab(exerciseLabContainer, (muscleId) => {
      this.handleMuscleJump(muscleId);
    });

    // 8. Klinik & Hareket Rehberi ("Neden Hissediyorum?")
    const insightsContainer = document.getElementById('insightsContainer');
    this.insights = new ClinicalInsights(insightsContainer, (muscleId) => {
      this.handleMuscleJump(muscleId);
    });

    // 9. Fonksiyonel Quiz
    const quizContainer = document.getElementById('quizContainer');
    this.quiz = new FunctionalQuiz(quizContainer);

    // 10. Antrenman Ajandası (Training Agenda Calendar)
    const agendaContainer = document.getElementById('agendaContainer');
    this.agenda = new TrainingAgenda(agendaContainer);

    // 11. Reaktif Görünüm Yönlendirme (Tab Değişimleri)
    state.subscribe((s) => this.handleTabChange(s.activeTab));

    // Başlangıç tetiklemesi
    this.handleTabChange(state.getState().activeTab);
  }

  handleMuscleJump(muscleId) {
    const muscle = graph.getMuscle(muscleId);
    if (muscle) {
      const groups = graph.getRegionalGroups();
      let parentRegion = muscle.category;
      for (const g of groups) {
        const reg = g.regions.find(r => r.categories?.includes(muscle.category) || r.id === muscle.category || r.name === muscle.category);
        if (reg) {
          parentRegion = reg.id;
          break;
        }
      }
      state.selectMuscleRegion(parentRegion);
      state.selectMuscle(muscleId, muscle.name);
    } else {
      state.selectMuscle(muscleId);
    }
  }

  handleTabChange(activeTab) {
    const views = {
      home: document.getElementById('viewHome'),
      anatomy: document.getElementById('viewAnatomy'),
      movements: document.getElementById('viewMovements'),
      biolab: document.getElementById('viewBioLab'),
      exercises: document.getElementById('viewExercises'),
      insights: document.getElementById('viewInsights'),
      quiz: document.getElementById('viewQuiz'),
      agenda: document.getElementById('viewAgenda')
    };

    Object.entries(views).forEach(([tabName, el]) => {
      if (!el) return;
      if (tabName === activeTab) {
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// Uygulamayı Başlat
window.addEventListener('DOMContentLoaded', () => {
  window.__kinetikaApp = new LesofenKinetikaApp();
});
