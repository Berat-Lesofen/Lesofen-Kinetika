/**
 * LESOFEN KINETIKA - Global Reactive State Manager
 * Progressive Disclosure Navigation & Breadcrumb State
 */

class StateManager {
  constructor() {
    this.state = {
      // Aktif Ana Görünüm: home | anatomy | movements | biolab | exercises | insights | agenda | quiz
      activeTab: "home",
      
      // Kas Sistemi Akışı
      selectedRegion: null,      // örn: "Omuz", "Göğüs", "Kol"
      selectedMuscleId: "deltoid_lateral",
      muscleFlowLevel: 1,        // 1: Bölge Seçimi, 2: Bölge Hub'ı, 3: Kas Detayı

      // Hareket Atlası Akışı
      selectedJoint: null,       // örn: "Omuz", "Dirsek"
      selectedMovementId: "shoulder_abduction",
      movementFlowLevel: 1,      // 1: Eklem Seçimi, 2: Hareket Seçimi & Detayı

      // Egzersiz Analizi Akışı
      selectedExerciseCategory: null, // örn: "Omuz", "Göğüs"
      selectedExerciseId: "flat_barbell_bench_press",
      exerciseFlowLevel: 1,      // 1: Kategori Seçimi, 2: Egzersiz Detayı

      // "Neden Hissediyorum?" Akışı
      selectedInsightRegion: null,    // örn: "Omuz", "Sırt"
      selectedInsightId: "lateral_raise_traps",
      insightFlowLevel: 1,       // 1: Bölge Seçimi, 2: Soru & Mekanik İpucu

      // Biyomekanik Laboratuvarı Akışı
      activeBioSim: "lateral_raise",

      // Dinamik Breadcrumb Yolu: [{ id, label, action }]
      breadcrumbs: [
        { id: "home", label: "Kinetika" }
      ],

      hoveredMuscleId: null,
      searchQuery: ""
    };

    this.listeners = new Set();
  }

  getState() {
    return { ...this.state };
  }

  setState(partialState) {
    this.state = { ...this.state, ...partialState };
    this.notify();
    if (typeof window !== 'undefined' && (partialState.activeTab || partialState.breadcrumbs || partialState.muscleFlowLevel || partialState.movementFlowLevel || partialState.exerciseFlowLevel || partialState.insightFlowLevel || partialState.activeBioSim)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    const currentState = this.getState();
    this.listeners.forEach(fn => {
      try {
        fn(currentState);
      } catch (err) {
        console.error("State listener error:", err);
      }
    });
  }

  // ==========================================
  // PROGRESSIVE NAVIGATION ACTIONS
  // ==========================================

  goHome() {
    this.setState({
      activeTab: "home",
      selectedRegion: null,
      muscleFlowLevel: 1,
      selectedJoint: null,
      movementFlowLevel: 1,
      selectedExerciseCategory: null,
      exerciseFlowLevel: 1,
      selectedInsightRegion: null,
      insightFlowLevel: 1,
      breadcrumbs: [{ id: "home", label: "Kinetika" }]
    });
  }

  setActiveTab(tabName) {
    switch (tabName) {
      case "home":
        this.goHome();
        break;
      case "anatomy":
        this.openMuscles();
        break;
      case "movements":
        this.openMovements();
        break;
      case "biolab":
        this.openBioLab();
        break;
      case "exercises":
        this.openExercises();
        break;
      case "insights":
        this.openInsights();
        break;
      case "agenda":
        this.openAgenda();
        break;
      case "quiz":
        this.openQuiz();
        break;
      default:
        this.setState({ activeTab: tabName });
    }
  }

  // 1. KAS SİSTEMİ AKIŞI
  openMuscles() {
    this.setState({
      activeTab: "anatomy",
      selectedRegion: null,
      muscleFlowLevel: 1,
      breadcrumbs: [
        { id: "home", label: "Kinetika" },
        { id: "anatomy", label: "Kas Sistemi" }
      ]
    });
  }

  selectMuscleRegion(regionName) {
    this.setState({
      activeTab: "anatomy",
      selectedRegion: regionName,
      muscleFlowLevel: 2,
      breadcrumbs: [
        { id: "home", label: "Kinetika" },
        { id: "anatomy", label: "Kas Sistemi" },
        { id: "region", label: regionName }
      ]
    });
  }

  selectMuscle(muscleId, muscleName = null) {
    const currentRegion = this.state.selectedRegion;
    const crumbs = [
      { id: "home", label: "Kinetika" },
      { id: "anatomy", label: "Kas Sistemi" }
    ];
    if (currentRegion) {
      crumbs.push({ id: "region", label: currentRegion });
    }
    crumbs.push({ id: "muscle", label: muscleName || muscleId.replace(/_/g, ' ') });

    this.setState({
      activeTab: "anatomy",
      selectedMuscleId: muscleId,
      muscleFlowLevel: 3,
      breadcrumbs: crumbs
    });
  }

  // 2. HAREKET ATLASI AKIŞI
  openMovements() {
    this.setState({
      activeTab: "movements",
      selectedJoint: null,
      movementFlowLevel: 1,
      breadcrumbs: [
        { id: "home", label: "Kinetika" },
        { id: "movements", label: "Hareket Atlası" }
      ]
    });
  }

  selectJoint(jointName) {
    this.setState({
      activeTab: "movements",
      selectedJoint: jointName,
      movementFlowLevel: 2,
      breadcrumbs: [
        { id: "home", label: "Kinetika" },
        { id: "movements", label: "Hareket Atlası" },
        { id: "joint", label: jointName }
      ]
    });
  }

  selectMovement(movementId, movementName = null) {
    const currentJoint = this.state.selectedJoint;
    const crumbs = [
      { id: "home", label: "Kinetika" },
      { id: "movements", label: "Hareket Atlası" }
    ];
    if (currentJoint) {
      crumbs.push({ id: "joint", label: currentJoint });
    }
    crumbs.push({ id: "movement", label: movementName || movementId.replace(/_/g, ' ') });

    this.setState({
      activeTab: "movements",
      selectedMovementId: movementId,
      movementFlowLevel: 2,
      breadcrumbs: crumbs
    });
  }

  // 3. BİYOMEKANİK LABORATUVARI AKIŞI
  openBioLab(simKey = "lateral_raise", simLabel = null) {
    const crumbs = [
      { id: "home", label: "Kinetika" },
      { id: "biolab", label: "Biyomekanik Lab" }
    ];
    if (simLabel) {
      crumbs.push({ id: "biosim", label: simLabel });
    }

    this.setState({
      activeTab: "biolab",
      activeBioSim: simKey,
      breadcrumbs: crumbs
    });
  }

  // 4. EGZERSİZ ANALİZİ AKIŞI
  openExercises() {
    this.setState({
      activeTab: "exercises",
      selectedExerciseCategory: null,
      exerciseFlowLevel: 1,
      breadcrumbs: [
        { id: "home", label: "Kinetika" },
        { id: "exercises", label: "Egzersiz Analizi" }
      ]
    });
  }

  selectExerciseCategory(catName) {
    this.setState({
      activeTab: "exercises",
      selectedExerciseCategory: catName,
      exerciseFlowLevel: 2,
      breadcrumbs: [
        { id: "home", label: "Kinetika" },
        { id: "exercises", label: "Egzersiz Analizi" },
        { id: "exCat", label: catName }
      ]
    });
  }

  selectExercise(exerciseId, exerciseName = null) {
    const currentCat = this.state.selectedExerciseCategory;
    const crumbs = [
      { id: "home", label: "Kinetika" },
      { id: "exercises", label: "Egzersiz Analizi" }
    ];
    if (currentCat) {
      crumbs.push({ id: "exCat", label: currentCat });
    }
    crumbs.push({ id: "exercise", label: exerciseName || exerciseId.replace(/_/g, ' ') });

    this.setState({
      activeTab: "exercises",
      selectedExerciseId: exerciseId,
      exerciseFlowLevel: 2,
      breadcrumbs: crumbs
    });
  }

  // 5. "NEDEN HİSSEDİYORUM?" AKIŞI
  openInsights() {
    this.setState({
      activeTab: "insights",
      selectedInsightRegion: null,
      insightFlowLevel: 1,
      breadcrumbs: [
        { id: "home", label: "Kinetika" },
        { id: "insights", label: "Neden Hissediyorum?" }
      ]
    });
  }

  selectInsightRegion(regionName) {
    this.setState({
      activeTab: "insights",
      selectedInsightRegion: regionName,
      insightFlowLevel: 2,
      breadcrumbs: [
        { id: "home", label: "Kinetika" },
        { id: "insights", label: "Neden Hissediyorum?" },
        { id: "insRegion", label: regionName }
      ]
    });
  }

  selectInsight(insightId, insightQuestion = null) {
    const currentReg = this.state.selectedInsightRegion;
    const crumbs = [
      { id: "home", label: "Kinetika" },
      { id: "insights", label: "Neden Hissediyorum?" }
    ];
    if (currentReg) {
      crumbs.push({ id: "insRegion", label: currentReg });
    }
    crumbs.push({ id: "insight", label: insightQuestion ? (insightQuestion.substring(0, 30) + '...') : insightId });

    this.setState({
      activeTab: "insights",
      selectedInsightId: insightId,
      insightFlowLevel: 2,
      breadcrumbs: crumbs
    });
  }

  // 6. AJANDA VE QUIZ
  openAgenda() {
    this.setState({
      activeTab: "agenda",
      breadcrumbs: [
        { id: "home", label: "Kinetika" },
        { id: "agenda", label: "Antrenman Ajandası" }
      ]
    });
  }

  openQuiz() {
    this.setState({
      activeTab: "quiz",
      breadcrumbs: [
        { id: "home", label: "Kinetika" },
        { id: "quiz", label: "Fonksiyonel Quiz" }
      ]
    });
  }

  // BREADCRUMB GERİ ADIMI (STEP BACK)
  stepBack() {
    const s = this.state;
    // Eğer kas detayındaysak bölge hub'ına dön
    if (s.activeTab === "anatomy") {
      if (s.muscleFlowLevel === 3) {
        if (s.selectedRegion) {
          this.selectMuscleRegion(s.selectedRegion);
        } else {
          this.openMuscles();
        }
        return;
      }
      if (s.muscleFlowLevel === 2) {
        this.openMuscles();
        return;
      }
      this.goHome();
      return;
    }

    // Hareket Atlası
    if (s.activeTab === "movements") {
      if (s.movementFlowLevel === 2) {
        this.openMovements();
        return;
      }
      this.goHome();
      return;
    }

    // Egzersiz Analizi
    if (s.activeTab === "exercises") {
      if (s.exerciseFlowLevel === 2) {
        this.openExercises();
        return;
      }
      this.goHome();
      return;
    }

    // Neden Hissediyorum
    if (s.activeTab === "insights") {
      if (s.insightFlowLevel === 2) {
        this.openInsights();
        return;
      }
      this.goHome();
      return;
    }

    // Diğerleri
    this.goHome();
  }

  // BREADCRUMB DOĞRUDAN TIKLAMA
  handleBreadcrumbClick(crumbId) {
    if (crumbId === "home") {
      this.goHome();
    } else if (crumbId === "anatomy") {
      this.openMuscles();
    } else if (crumbId === "region") {
      if (this.state.selectedRegion) {
        this.selectMuscleRegion(this.state.selectedRegion);
      }
    } else if (crumbId === "movements") {
      this.openMovements();
    } else if (crumbId === "joint") {
      if (this.state.selectedJoint) {
        this.selectJoint(this.state.selectedJoint);
      }
    } else if (crumbId === "biolab") {
      this.openBioLab();
    } else if (crumbId === "exercises") {
      this.openExercises();
    } else if (crumbId === "exCat") {
      if (this.state.selectedExerciseCategory) {
        this.selectExerciseCategory(this.state.selectedExerciseCategory);
      }
    } else if (crumbId === "insights") {
      this.openInsights();
    } else if (crumbId === "agenda") {
      this.openAgenda();
    } else if (crumbId === "quiz") {
      this.openQuiz();
    }
  }
}

export const state = new StateManager();
