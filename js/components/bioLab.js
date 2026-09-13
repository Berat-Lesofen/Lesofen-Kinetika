/**
 * LESOFEN KINETIKA - Interactive Biomechanics Laboratory
 * Dinamik Moment Kolu (External vs Internal Moment Arm) ve Tork Simülatörü
 * 4 Gelişmiş Matematiksel Biyomekanik Model Entegrasyonu:
 * 1. Dumbbell Lateral Raise (Omuz Dış Moment Kolu & Deltoid Referans Tork Talebi)
 * 2. Biceps Curl (Dirsek Fleksiyonu & Önkol Rotasyonu: Biceps, Brachialis, Brachioradialis 3 Ayrı Kas)
 * 3. Squat Kaldıracı (Midfoot Denge Hattı, High-Bar vs Low-Bar & Fry 2003 Diz/Kalça Moment Kolu Takası)
 * 4. Bench Press (McLaughlin 1984 Elit J-Curve vs Düz Dikey Bar Yolu & Omuz/Dirsek Tork Analizi)
 */

import { state } from '../core/state.js';
import { LateralRaiseModel } from '../biomechanics/models/lateralRaise/model.js';
import { BicepsCurlModel } from '../biomechanics/models/bicepsCurl/model.js';
import { SquatModel } from '../biomechanics/models/squat/model.js';
import { BenchPressModel } from '../biomechanics/models/benchPress/model.js';
import { LateralRaiseRenderer } from '../biomechanics/models/lateralRaise/renderer.js';
import { BicepsCurlRenderer } from '../biomechanics/models/bicepsCurl/renderer.js';
import { SquatRenderer } from '../biomechanics/models/squat/renderer.js';
import { BenchPressRenderer } from '../biomechanics/models/benchPress/renderer.js';
import { COLORS } from '../biomechanics/shared/constants.js';

export class BiomechanicsLab {
  constructor(containerElement) {
    this.container = containerElement;

    // Independent Biomechanical Models (Cross-Model State Isolation)
    this.models = {
      lateral_raise: new LateralRaiseModel({ initialAngle: 60, loadKg: 10 }),
      biceps_curl: new BicepsCurlModel({ initialFlexion: 75, initialRotation: 80, loadKg: 15 }),
      squat_lever: new SquatModel({ initialDepth: 0.75, initialLean: 0, loadKg: 100, barPositionType: 'HIGH_BAR' }),
      bench_mechanics: new BenchPressModel({ initialPhase: 0.50, loadKg: 100, barPathType: 'CURVED_J_CURVE' })
    };

    const initialSim = this.normalizeSimKey(state?.getState()?.activeBioSim) || 'lateral_raise';
    this.state = {
      activeSim: initialSim
    };

    this.activeModel = this.models[this.state.activeSim];
    this.unsubscribeActiveModel = null;

    this.render = this.render.bind(this);
    this.handleResize = this.handleResize.bind(this);

    if (state && typeof state.subscribe === 'function') {
      state.subscribe((s) => {
        if (s.activeTab === 'biolab') {
          if (s.activeBioSim) {
            this.state.activeSim = this.normalizeSimKey(s.activeBioSim);
          }
          this.render();
          if (typeof window !== 'undefined') {
            setTimeout(() => this.handleResize(), 50);
          }
        }
      });
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.handleResize);
    }

    this.render();
  }

  normalizeSimKey(key) {
    if (!key) return 'lateral_raise';
    if (key === 'lateral_raise' || key === 'lateral-raise') return 'lateral_raise';
    if (key === 'biceps_curl' || key === 'biceps-curl') return 'biceps_curl';
    if (key === 'squat_lever' || key === 'squat' || key === 'squat-lever') return 'squat_lever';
    if (key === 'bench_mechanics' || key === 'bench-press' || key === 'bench_press') return 'bench_mechanics';
    return 'lateral_raise';
  }

  render() {
    if (!this.container) return;

    if (this.activeModel && typeof this.activeModel.pause === 'function') {
      this.activeModel.pause();
    }

    const currentBioSim = state?.getState()?.activeBioSim;
    if (currentBioSim) {
      this.state.activeSim = this.normalizeSimKey(currentBioSim);
    }
    this.activeModel = this.models[this.state.activeSim];

    this.container.innerHTML = `
      <div class="biolab-container max-w-6xl mx-auto p-4 md:p-6 animate-fadeIn text-slate-200">
        <!-- Üst Başlık & Simülatör Seçici -->
        <div class="border-b border-slate-800 pb-5 mb-6">
          <div class="flex flex-wrap items-center justify-between gap-3 mb-2">
            <div class="flex items-center gap-2.5">
              <span class="text-xs text-amber-400 font-bold uppercase tracking-wider">BİYOMEKANİK LABORATUVARI</span>
              <span class="text-slate-600">·</span>
              <span class="text-xs text-slate-400">Vektör & Tork Motoru</span>
              <span class="text-slate-600">·</span>
              <span class="text-xs text-slate-400">4 Model</span>
            </div>
            <button id="btnOpenAssumptions" class="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 border border-slate-700/80 hover:border-amber-400/60 text-slate-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer">
              Metodoloji & Varsayımlar
            </button>
          </div>
          <h2 class="text-2xl md:text-3xl font-black text-white tracking-tight">Kuvvet, Moment Kolu ve Eklem Torku</h2>
          <p class="text-xs md:text-sm text-slate-400 mt-1 max-w-3xl">
            "Ağırlık neden bazı açılarda daha zor hissedilir?" sorusunun yanıtı dambılın kütlesinde değil; 
            eklem dönme ekseni ile yerçekimi hattı arasındaki dik mesafede (<span class="text-amber-400 font-semibold font-mono">External Moment Arm, r_ext</span>) ve kasın eklemdeki iç kaldıracında (<span class="text-emerald-400 font-semibold font-mono">Internal Moment Arm, r_int</span>) yatar.
          </p>

          <!-- 4 Simülatör Sekmesi -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-2.5 mt-5">
            <button id="simTabLateral" class="p-3 rounded-xl text-xs font-semibold border transition text-left cursor-pointer ${
              this.state.activeSim === 'lateral_raise' 
                ? 'bg-slate-800 border-amber-500/80 text-amber-300 shadow-sm' 
                : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }">
              <div class="flex items-center justify-between mb-1">
                <span class="text-[10px] text-amber-400/80 font-bold uppercase tracking-wider">01 · Omuz</span>
              </div>
              <span class="block font-bold text-sm text-white">Lateral Raise</span>
              <span class="block text-[10px] text-slate-400 truncate mt-0.5">Omuz Elevasyonu & Deltoid</span>
            </button>

            <button id="simTabBiceps" class="p-3 rounded-xl text-xs font-semibold border transition text-left cursor-pointer ${
              this.state.activeSim === 'biceps_curl' 
                ? 'bg-slate-800 border-cyan-500/80 text-cyan-300 shadow-sm' 
                : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }">
              <div class="flex items-center justify-between mb-1">
                <span class="text-[10px] text-cyan-400/80 font-bold uppercase tracking-wider">02 · Dirsek</span>
              </div>
              <span class="block font-bold text-sm text-white">Biceps Curl</span>
              <span class="block text-[10px] text-slate-400 truncate mt-0.5">3 Kas & Önkol Rotasyonu</span>
            </button>

            <button id="simTabSquat" class="p-3 rounded-xl text-xs font-semibold border transition text-left cursor-pointer ${
              this.state.activeSim === 'squat_lever' 
                ? 'bg-slate-800 border-emerald-500/80 text-emerald-300 shadow-sm' 
                : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }">
              <div class="flex items-center justify-between mb-1">
                <span class="text-[10px] text-emerald-400/80 font-bold uppercase tracking-wider">03 · Kalça & Diz</span>
              </div>
              <span class="block font-bold text-sm text-white">Squat Kaldıracı</span>
              <span class="block text-[10px] text-slate-400 truncate mt-0.5">Fry 2003 Diz/Kalça Takası</span>
            </button>

            <button id="simTabBench" class="p-3 rounded-xl text-xs font-semibold border transition text-left cursor-pointer ${
              this.state.activeSim === 'bench_mechanics' 
                ? 'bg-slate-800 border-rose-500/80 text-rose-300 shadow-sm' 
                : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }">
              <div class="flex items-center justify-between mb-1">
                <span class="text-[10px] text-rose-400/80 font-bold uppercase tracking-wider">04 · Göğüs & İtiş</span>
              </div>
              <span class="block font-bold text-sm text-white">Bench Press</span>
              <span class="block text-[10px] text-slate-400 truncate mt-0.5">McLaughlin 1984 J-Curve</span>
            </button>
          </div>
        </div>

        <!-- Seçili Simülatör Alanı -->
        <div id="simContentArea">
          ${this.renderActiveSimulator()}
        </div>

        <!-- Metodoloji ve Kaynaklar Modal -->
        <div id="assumptionsModal" class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm hidden flex items-center justify-center p-4">
          <div class="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-5 md:p-6 shadow-2xl relative">
            <div class="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 id="modalTitle" class="text-base md:text-lg font-bold text-white font-mono flex items-center gap-2">
                <span class="text-amber-400">📋</span> Model Varsayımları ve Bilimsel Metodoloji
              </h3>
              <button id="btnCloseAssumptions" class="text-slate-400 hover:text-white text-xl font-bold p-1 cursor-pointer">&times;</button>
            </div>
            <div id="modalContent" class="space-y-4 text-xs md:text-sm text-slate-300 leading-relaxed font-sans">
              <!-- Dinamik doldurulur -->
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachEventListeners();
    this.initActiveSimulator();
  }

  renderActiveSimulator() {
    switch (this.state.activeSim) {
      case 'lateral_raise':
        return this.renderLateralRaiseSim();
      case 'biceps_curl':
        return this.renderBicepsCurlSim();
      case 'squat_lever':
        return this.renderSquatLeverSim();
      case 'bench_mechanics':
        return this.renderBenchMechanicsSim();
      default:
        return this.renderLateralRaiseSim();
    }
  }

  // ==========================================
  // 1. LATERAL RAISE SIMULATOR VIEW
  // ==========================================
  renderLateralRaiseSim() {
    const m = this.models.lateral_raise;
    const s = m.state;
    const d = m.data;

    return `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div class="lg:col-span-7 space-y-4">
          <div class="bg-slate-950 border border-slate-800 rounded-2xl p-3 sm:p-5 shadow-2xl relative overflow-hidden">
            <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3 mb-3">
              <div class="min-w-0">
                <span class="text-[10px] text-amber-400/90 font-bold uppercase tracking-wider">Model 01 · Omuz Elevasyonu</span>
                <h3 class="text-sm sm:text-base font-bold text-white break-words">Lateral Raise — Moment Kolu Zinciri</h3>
              </div>
              <div class="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-mono text-slate-400">
                <label class="flex items-center gap-1 cursor-pointer hover:text-white">
                  <input type="checkbox" id="toggleGrid" checked class="accent-amber-500 rounded"> Izgara
                </label>
                <label class="flex items-center gap-1 cursor-pointer hover:text-white">
                  <input type="checkbox" id="toggleArms" checked class="accent-amber-500 rounded"> Moment Kolu
                </label>
                <label class="flex items-center gap-1 cursor-pointer hover:text-white">
                  <input type="checkbox" id="toggleForces" checked class="accent-amber-500 rounded"> Kuvvet
                </label>
                <label class="flex items-center gap-1 cursor-pointer hover:text-white">
                  <input type="checkbox" id="toggleMuscles" checked class="accent-amber-500 rounded"> Kas Doku
                </label>
              </div>
            </div>

            <div class="relative w-full aspect-[4/3] bg-slate-950 rounded-xl overflow-hidden border border-slate-800/60 flex items-center justify-center">
              <canvas id="model-canvas" class="w-full h-full block"></canvas>
            </div>

            <!-- Mobil Responsive Model Lejantı (lg ekranda canvas içi lejant kullanılır) -->
            <div class="mobile-canvas-legend lg:hidden mt-3 p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono space-y-2 animate-fadeIn">
              <div class="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <span class="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Model Lejantı
                </span>
                <span class="text-[9px] text-slate-500">Görsel Rehber</span>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1.5 text-[11px]">
                <div class="flex items-center gap-2 text-slate-300">
                  <span class="w-3.5 h-1 rounded-full bg-rose-500 shrink-0"></span>
                  <span class="truncate">Dış Yerçekimi Kuvveti (F_g)</span>
                </div>
                <div class="flex items-center gap-2 text-slate-300">
                  <span class="w-3.5 h-1 rounded-full bg-cyan-400 shrink-0"></span>
                  <span class="truncate">External Moment Kolu (r_ext)</span>
                </div>
                <div class="flex items-center gap-2 text-slate-300">
                  <span class="w-3.5 h-1 rounded-full bg-red-700 shrink-0"></span>
                  <span class="truncate">Deltoid Çekiş Hattı</span>
                </div>
                <div class="flex items-center gap-2 text-slate-300">
                  <span class="w-3.5 h-1 rounded-full bg-emerald-500 shrink-0"></span>
                  <span class="truncate">Internal Moment Kolu (r_int)</span>
                </div>
                <div class="flex items-center gap-2 text-slate-300">
                  <span class="w-3.5 h-1 rounded-full bg-sky-400 shrink-0"></span>
                  <span class="truncate">Glenohumeral Eklem Ekseni</span>
                </div>
              </div>
            </div>

            <div class="mt-4 pt-3 border-t border-slate-800/80 space-y-3">
              <div class="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <button id="btnPlay" class="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-mono text-xs font-bold hover:bg-amber-400 transition flex items-center gap-1 cursor-pointer">
                    <span id="playIcon">▶</span> <span id="playText">Oynat</span>
                  </button>
                  <button id="btnReset" class="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 font-mono text-xs hover:text-white transition cursor-pointer">
                    ↺ Sıfırla
                  </button>
                  <select id="selectSpeed" class="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs font-mono text-slate-300 cursor-pointer">
                    <option value="0.5">0.5x</option>
                    <option value="1.0" selected>1.0x</option>
                    <option value="1.5">1.5x</option>
                  </select>
                </div>
                <div class="text-right shrink-0">
                  <span class="text-[10px] font-mono text-slate-400 block leading-none mb-0.5">Kol Elevasyon Açısı (θ)</span>
                  <span id="angleDisplay" class="text-sm sm:text-base font-mono font-bold text-amber-400">${s.elevationAngleDeg.toFixed(1)}°</span>
                </div>
              </div>

              <div>
                <input type="range" id="sliderScrub" min="0" max="180" step="0.5" value="${s.elevationAngleDeg}" class="w-full accent-amber-500 cursor-pointer">
                <div class="flex justify-between text-[10px] font-mono text-slate-500 mt-1 gap-1 overflow-x-auto custom-scrollbar pb-0.5">
                  <button class="tick-btn hover:text-amber-400 cursor-pointer whitespace-nowrap" data-val="0">0°<span class="hidden sm:inline"> (Sarkık)</span></button>
                  <button class="tick-btn hover:text-amber-400 cursor-pointer whitespace-nowrap" data-val="30">30°<span class="hidden sm:inline"> (Setting)</span></button>
                  <button class="tick-btn hover:text-amber-400 cursor-pointer whitespace-nowrap" data-val="60">60°<span class="hidden sm:inline"> (Pik r_int)</span></button>
                  <button class="tick-btn hover:text-amber-400 cursor-pointer whitespace-nowrap" data-val="90">90°<span class="hidden sm:inline"> (Maks Tork)</span></button>
                  <button class="tick-btn hover:text-amber-400 cursor-pointer whitespace-nowrap" data-val="120">120°</button>
                  <button class="tick-btn hover:text-amber-400 cursor-pointer whitespace-nowrap" data-val="180">180°</button>
                </div>
              </div>

              <div class="flex flex-wrap items-center justify-between gap-2 sm:gap-3 pt-2 border-t border-slate-900">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-mono text-slate-400">Dambıl Yükü:</span>
                  <div class="flex items-center gap-1">
                    ${[6, 8, 10, 14].map(w => `
                      <button class="weight-btn px-2.5 py-1 rounded text-xs font-mono font-bold border transition cursor-pointer ${
                        s.loadKg === w ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                      }" data-weight="${w}">${w} kg</button>
                    `).join('')}
                  </div>
                </div>
                <label class="flex items-center gap-1.5 text-xs font-mono text-slate-400 cursor-pointer hover:text-white">
                  <input type="checkbox" id="toggleLimbMass" ${s.includeLimbMass ? 'checked' : ''} class="accent-amber-500 rounded">
                  Kol Kütlesi Dahil
                </label>
              </div>
            </div>
          </div>

          <div class="bg-slate-950 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-xl">
            <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
              <h4 class="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">Mekanik Değişim Eğrisi (0° - 180°)</h4>
              <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-mono">
                <span class="flex items-center gap-1 text-cyan-400"><span class="w-2.5 h-0.5 bg-cyan-400 inline-block"></span> r_ext (Dış Moment)</span>
                <span class="flex items-center gap-1 text-emerald-400"><span class="w-2.5 h-0.5 bg-emerald-400 inline-block"></span> r_int (Deltoid Moment)</span>
                <span class="flex items-center gap-1 text-rose-400"><span class="w-2.5 h-0.5 bg-rose-400 inline-block"></span> τ_ext (Omuz Torku)</span>
              </div>
            </div>
            <div class="w-full h-32 bg-slate-900/50 rounded-xl overflow-hidden border border-slate-800/60 relative">
              <canvas id="curve-canvas" class="w-full h-full block"></canvas>
            </div>
          </div>

          <div class="bg-slate-950 border border-slate-800/70 rounded-2xl p-3 sm:p-4">
            <div class="flex flex-wrap items-center justify-between gap-1 mb-2">
              <span class="text-xs font-mono text-slate-400">Kinematik Serbest Cisim Şeması (Frontal Düzlem)</span>
              <span class="text-xs font-mono text-amber-400 font-bold shrink-0">2:1 Skapulohumeral Ritim</span>
            </div>
            ${this.renderLateralRaiseSvgVisual()}
          </div>
        </div>

        <div class="lg:col-span-5 space-y-4">
          <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 sm:p-4 space-y-3">
            <div class="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 class="text-xs font-semibold text-cyan-400">Canlı Biyomekanik Telemetri</h4>
              <span class="text-xs font-mono text-cyan-400/80">τ = F × r</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              <div class="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5">
                <span class="text-[10px] text-slate-400 block">External Moment Arm (r_ext):</span>
                <span id="metricRExt" class="text-base font-bold text-cyan-400">0.0 cm</span>
                <span class="text-[10px] text-slate-500 block">L × sin(θ) (90°'de pik)</span>
              </div>
              <div class="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5">
                <span class="text-[10px] text-slate-400 block">Internal Deltoid Arm (r_int):</span>
                <span id="metricRInt" class="text-base font-bold text-emerald-400">0.0 cm</span>
                <span class="text-[10px] text-slate-500 block">Kuechle (1997) ~3.3 cm pik</span>
              </div>
              <div class="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5">
                <span class="text-[10px] text-slate-400 block">External Torque (τ_ext):</span>
                <span id="metricTorque" class="text-base font-bold text-amber-400">0.0 N·m</span>
                <span class="text-[10px] text-slate-500 block">Yük + Kol net döndürme momenti</span>
              </div>
              <div class="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5">
                <span class="text-[10px] text-slate-400 block">Mekanik Avantaj (MA):</span>
                <span id="metricMA" class="text-base font-bold text-rose-400">0.000</span>
                <span class="text-[10px] text-slate-500 block">r_int / r_ext (3. Sınıf Kaldıraç)</span>
              </div>
            </div>

            <div class="bg-slate-950/90 border border-rose-500/30 rounded-xl p-3 space-y-1">
              <div class="flex flex-wrap items-center justify-between gap-1">
                <span class="text-[11px] font-semibold text-rose-300">Modelled Deltoid Force Demand</span>
                <span class="text-[10px] text-rose-400/80 shrink-0">Model varsayımı</span>
              </div>
              <div id="metricDeltoidDemand" class="text-base sm:text-lg font-mono font-black text-rose-400">0 N (0.0 kgf)</div>
              <p class="text-[10px] text-slate-400 leading-tight">
                <strong>Formül:</strong> <code>F_deltoid = τ_ext / r_int</code>. Bu hesaplama yarı-statik dengede tek kas varsayımıdır; canlıda supraspinatus ve rotator manşet yükü paylaşır.
              </p>
            </div>
          </div>

          <div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-2 text-xs leading-relaxed text-slate-300">
            <span class="font-mono font-bold text-amber-400 block uppercase tracking-wider text-[11px]">Kinetik Analiz & Çıkarım:</span>
            <p>
              Kol aşağıdayken (0°) yerçekimi çizgisi omuz ekleminden geçtiği için dış moment kolu <strong>0 cm</strong>'dir ve omuza binen dış tork sıfırdır.
            </p>
            <p>
              Kol 90°'ye yaklaştıkça yerçekimi hattı ile omuz eklemi arasındaki dik mesafe maksimuma ($L_{\\text{kol}} \\approx 62\\text{ cm}$) ulaşır; 
              bu nedenle dambıl hafif olsa bile en yüksek deltoid torku 90° civarında talep edilir.
            </p>
          </div>

          ${this.renderAssumptionsAccordion(d.assumptions)}
        </div>
      </div>
    `;
  }

  // ==========================================
  // 2. BICEPS CURL SIMULATOR VIEW
  // ==========================================
  renderBicepsCurlSim() {
    const m = this.models.biceps_curl;
    const s = m.state;
    const d = m.data;

    return `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div class="lg:col-span-7 space-y-4">
          <div class="bg-slate-950 border border-slate-800 rounded-2xl p-3 sm:p-5 shadow-2xl relative overflow-hidden">
            <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3 mb-3">
              <div class="min-w-0">
                <span class="text-[10px] text-cyan-400/90 font-bold uppercase tracking-wider">Model 02 · Dirsek Fleksiyonu & Rotasyon</span>
                <h3 class="text-sm sm:text-base font-bold text-white break-words">Biceps Curl — 3 Ayrı Kas Anatomisi</h3>
              </div>
              <div class="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-mono text-slate-400">
                <label class="flex items-center gap-1 cursor-pointer hover:text-white">
                  <input type="checkbox" id="toggleGrid" checked class="accent-cyan-500 rounded"> Izgara
                </label>
                <label class="flex items-center gap-1 cursor-pointer hover:text-white">
                  <input type="checkbox" id="toggleArms" checked class="accent-cyan-500 rounded"> Moment Kolu
                </label>
                <label class="flex items-center gap-1 cursor-pointer hover:text-white">
                  <input type="checkbox" id="toggleForces" checked class="accent-cyan-500 rounded"> Kuvvet
                </label>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-x-3 gap-y-1.5 py-1.5 px-3 bg-slate-900/60 rounded-lg border border-slate-800/60 mb-3 text-xs font-mono">
              <span class="text-slate-400 text-[11px]">Kas Vurguları:</span>
              <label class="flex items-center gap-1 text-rose-400 cursor-pointer">
                <input type="checkbox" id="toggleBiceps" checked class="accent-rose-500 rounded"> Biceps Brachii
              </label>
              <label class="flex items-center gap-1 text-orange-400 cursor-pointer">
                <input type="checkbox" id="toggleBrachialis" checked class="accent-orange-500 rounded"> Brachialis
              </label>
              <label class="flex items-center gap-1 text-pink-400 cursor-pointer">
                <input type="checkbox" id="toggleBrachioradialis" checked class="accent-pink-500 rounded"> Brachioradialis
              </label>
            </div>

            <div class="relative w-full aspect-[4/3] bg-slate-950 rounded-xl overflow-hidden border border-slate-800/60 flex items-center justify-center">
              <canvas id="model-canvas" class="w-full h-full block"></canvas>
            </div>

            <!-- Mobil Responsive Model Lejantı (lg ekranda canvas içi lejant kullanılır) -->
            <div class="mobile-canvas-legend lg:hidden mt-3 p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono space-y-2 animate-fadeIn">
              <div class="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <span class="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> Model Lejantı
                </span>
                <span class="text-[9px] text-slate-500">Görsel Rehber</span>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1.5 text-[11px]">
                <div class="flex items-center gap-2 text-slate-300">
                  <span class="w-3.5 h-1 rounded-full bg-rose-500 shrink-0"></span>
                  <span class="truncate">Biceps Brachii (Supinasyon Duyarlı)</span>
                </div>
                <div class="flex items-center gap-2 text-slate-300">
                  <span class="w-3.5 h-1 rounded-full bg-orange-500 shrink-0"></span>
                  <span class="truncate">Brachialis (Ulna Bağlantılı)</span>
                </div>
                <div class="flex items-center gap-2 text-slate-300">
                  <span class="w-3.5 h-1 rounded-full bg-pink-500 shrink-0"></span>
                  <span class="truncate">Brachioradialis (Uzun Kol)</span>
                </div>
                <div class="flex items-center gap-2 text-slate-300">
                  <span class="w-3.5 h-1 rounded-full bg-cyan-400 shrink-0"></span>
                  <span class="truncate">Dış Moment Kolu (r_ext)</span>
                </div>
                <div class="flex items-center gap-2 text-slate-300">
                  <span class="w-3.5 h-1 rounded-full bg-rose-400 shrink-0"></span>
                  <span class="truncate">Dış Ağırlık / Yerçekimi (F_g)</span>
                </div>
                <div class="flex items-center gap-2 text-slate-300">
                  <span class="w-3.5 h-1 rounded-full bg-sky-400 shrink-0"></span>
                  <span class="truncate">Dirsek Eklem Merkezi</span>
                </div>
              </div>
            </div>

            <div class="mt-4 pt-3 border-t border-slate-800/80 space-y-3">
              <div class="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <button id="btnPlay" class="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-mono text-xs font-bold hover:bg-cyan-400 transition flex items-center gap-1 cursor-pointer">
                    <span id="playIcon">▶</span> <span id="playText">Oynat</span>
                  </button>
                  <button id="btnReset" class="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 font-mono text-xs hover:text-white transition cursor-pointer">
                    ↺ Sıfırla
                  </button>
                </div>
                <div class="text-right shrink-0">
                  <span class="text-[10px] font-mono text-slate-400 block leading-none mb-0.5">Dirsek Fleksiyon Açısı</span>
                  <span id="angleDisplay" class="text-sm sm:text-base font-mono font-bold text-cyan-400">${s.flexionAngleDeg.toFixed(1)}°</span>
                </div>
              </div>

              <div>
                <input type="range" id="sliderScrub" min="0" max="150" step="0.5" value="${s.flexionAngleDeg}" class="w-full accent-cyan-500 cursor-pointer">
                <div class="flex justify-between text-[10px] font-mono text-slate-500 mt-1 gap-1 overflow-x-auto custom-scrollbar pb-0.5">
                  <button class="tick-btn hover:text-cyan-400 cursor-pointer whitespace-nowrap" data-val="0">0°<span class="hidden sm:inline"> (Tam Açık)</span></button>
                  <button class="tick-btn hover:text-cyan-400 cursor-pointer whitespace-nowrap" data-val="45">45°</button>
                  <button class="tick-btn hover:text-cyan-400 cursor-pointer whitespace-nowrap" data-val="90">90°<span class="hidden sm:inline"> (Maks r_ext)</span></button>
                  <button class="tick-btn hover:text-cyan-400 cursor-pointer whitespace-nowrap" data-val="120">120°</button>
                  <button class="tick-btn hover:text-cyan-400 cursor-pointer whitespace-nowrap" data-val="145">145°<span class="hidden sm:inline"> (Tepe)</span></button>
                </div>
              </div>

              <div class="bg-slate-900/80 border border-slate-800 rounded-xl p-3 space-y-2">
                <div class="flex flex-wrap items-center justify-between gap-1 text-xs font-mono">
                  <span class="text-slate-300">Önkol Rotasyonu (Radius Hareketi):</span>
                  <span id="rotBadge" class="text-cyan-400 font-bold">${s.forearmRotationDeg >= 30 ? 'SUPINATED (+80°)' : s.forearmRotationDeg <= -30 ? 'PRONATED (-80°)' : 'NEUTRAL (0° Hammer)'}</span>
                </div>
                <div class="grid grid-cols-3 gap-1 sm:gap-1.5 text-[10px] sm:text-xs">
                  <button class="btn-rot py-1.5 px-1 rounded font-mono font-bold border transition cursor-pointer truncate ${
                    s.forearmRotationDeg <= -30 ? 'bg-cyan-500 text-slate-950 border-cyan-400' : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }" data-rot="-80">PRONATED<span class="hidden sm:inline"> (-80°)</span></button>
                  <button class="btn-rot py-1.5 px-1 rounded font-mono font-bold border transition cursor-pointer truncate ${
                    s.forearmRotationDeg > -30 && s.forearmRotationDeg < 30 ? 'bg-cyan-500 text-slate-950 border-cyan-400' : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }" data-rot="0">NEUTRAL<span class="hidden sm:inline"> (0°)</span></button>
                  <button class="btn-rot py-1.5 px-1 rounded font-mono font-bold border transition cursor-pointer truncate ${
                    s.forearmRotationDeg >= 30 ? 'bg-cyan-500 text-slate-950 border-cyan-400' : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }" data-rot="80">SUPINATED<span class="hidden sm:inline"> (+80°)</span></button>
                </div>
                <input type="range" id="sliderForearmRot" min="-80" max="80" step="5" value="${s.forearmRotationDeg}" class="w-full accent-cyan-500 cursor-pointer">
              </div>

              <div class="flex flex-wrap items-center justify-between gap-2 sm:gap-3 pt-2 border-t border-slate-900">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-mono text-slate-400">Dambıl Yükü:</span>
                  <div class="flex items-center gap-1">
                    ${[8, 12, 15, 20].map(w => `
                      <button class="weight-btn px-2.5 py-1 rounded text-xs font-mono font-bold border transition cursor-pointer ${
                        s.loadKg === w ? 'bg-cyan-500 text-slate-950 border-cyan-400' : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                      }" data-weight="${w}">${w} kg</button>
                    `).join('')}
                  </div>
                </div>
                <label class="flex items-center gap-1.5 text-xs font-mono text-slate-400 cursor-pointer hover:text-white">
                  <input type="checkbox" id="toggleLimbMass" ${s.includeLimbMass ? 'checked' : ''} class="accent-cyan-500 rounded">
                  Önkol Kütlesi Dahil
                </label>
              </div>
            </div>
          </div>

          <div class="bg-slate-950 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-xl">
            <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
              <h4 class="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">Fleksör Moment Kolları & Dış Yük Eğrileri</h4>
              <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-mono">
                <span class="flex items-center gap-1 text-cyan-400"><span class="w-2.5 h-0.5 bg-cyan-400 inline-block"></span> r_ext (Dış Yük)</span>
                <span class="flex items-center gap-1 text-rose-400"><span class="w-2.5 h-0.5 bg-rose-400 inline-block"></span> Biceps r_int</span>
                <span class="flex items-center gap-1 text-orange-400"><span class="w-2.5 h-0.5 bg-orange-400 inline-block"></span> Brachialis r_int</span>
                <span class="flex items-center gap-1 text-pink-400"><span class="w-2.5 h-0.5 bg-pink-400 inline-block"></span> Brachioradialis r_int</span>
              </div>
            </div>
            <div class="w-full h-32 bg-slate-900/50 rounded-xl overflow-hidden border border-slate-800/60 relative">
              <canvas id="curve-canvas" class="w-full h-full block"></canvas>
            </div>
          </div>

          <div class="bg-slate-950 border border-slate-800/70 rounded-2xl p-3 sm:p-4">
            <div class="flex flex-wrap items-center justify-between gap-1 mb-2">
              <span class="text-xs font-mono text-slate-400">Dirsek Fleksiyon & Kaldıraç Çakışması</span>
              <span class="text-xs font-mono text-cyan-400 font-bold shrink-0">Önkol Biyomekaniği</span>
            </div>
            ${this.renderBicepsCurlSvgVisual()}
          </div>
        </div>

        <div class="lg:col-span-5 space-y-4">
          <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 sm:p-4 space-y-3">
            <div class="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 class="text-xs font-semibold text-cyan-400">Canlı Dirsek Telemetrisi</h4>
              <span class="text-xs font-mono text-cyan-400/80">3 Kas Çözünürlüğü</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              <div class="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5">
                <span class="text-[10px] text-slate-400 block">External Moment Arm (r_ext):</span>
                <span id="metricRExt" class="text-base font-bold text-cyan-400">0.0 cm</span>
                <span class="text-[10px] text-slate-500 block">L × sin(θ) (~35 cm pik)</span>
              </div>
              <div class="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5">
                <span class="text-[10px] text-slate-400 block">External Torque (τ_ext):</span>
                <span id="metricTorque" class="text-base font-bold text-amber-400">0.0 N·m</span>
                <span class="text-[10px] text-slate-500 block">Yük + Önkol torku</span>
              </div>
            </div>

            <div class="space-y-1.5 pt-1">
              <div class="p-2 rounded-xl bg-slate-950/70 border border-rose-500/30 flex flex-wrap sm:flex-nowrap items-center justify-between gap-1 text-xs font-mono">
                <div class="min-w-0">
                  <span class="text-rose-400 font-bold block truncate">1. Biceps Brachii (r_int):</span>
                  <span class="text-[10px] text-slate-500 block">Radius tüberozitesi · Pronasyonda tendon sarılır</span>
                </div>
                <span id="metricBicepsArm" class="text-sm font-bold text-rose-400 shrink-0">0.00 cm</span>
              </div>
              <div class="p-2 rounded-xl bg-slate-950/70 border border-orange-500/30 flex flex-wrap sm:flex-nowrap items-center justify-between gap-1 text-xs font-mono">
                <div class="min-w-0">
                  <span class="text-orange-400 font-bold block truncate">2. Brachialis (r_int):</span>
                  <span class="text-[10px] text-slate-500 block">Ulna tüberozitesi · Rotasyondan TAMAMEN bağımsız</span>
                </div>
                <span id="metricBrachialisArm" class="text-sm font-bold text-orange-400 shrink-0">0.00 cm</span>
              </div>
              <div class="p-2 rounded-xl bg-slate-950/70 border border-pink-500/30 flex flex-wrap sm:flex-nowrap items-center justify-between gap-1 text-xs font-mono">
                <div class="min-w-0">
                  <span class="text-pink-400 font-bold block truncate">3. Brachioradialis (r_int):</span>
                  <span class="text-[10px] text-slate-500 block">Distal radius styloid proses · Şant stabilizatör</span>
                </div>
                <span id="metricBrachioradialisArm" class="text-sm font-bold text-pink-400 shrink-0">0.00 cm</span>
              </div>
            </div>
          </div>

          <div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-3 sm:p-4 space-y-2 text-xs leading-relaxed text-slate-300">
            <span class="font-mono font-bold text-cyan-400 block uppercase tracking-wider text-[11px]">Biyomekanik Çıkarım & Kas Dinamiği:</span>
            <p>
              Biceps tendonunun iç moment kolu dirsek yaklaşık 80°-100° bükülüyken zirveye ulaşır. 
              Aynı zamanda önkol yere paralelken dambılın dış moment kolu da zirveye ulaşır.
            </p>
            <p>
              <strong>Önkol Pronasyonu:</strong> Radius kemiği ulnanın üzerine çaprazlandığında biceps tendonu radius boynuna sarılır ve etkin moment kolu düşer. 
              Buna karşılık <strong>Brachialis</strong> ulnaya bağlandığı için tutuş açısı (pronasyon/supinasyon) ne olursa olsun gücünü ve kaldıraç avantajını korur.
            </p>
          </div>

          ${this.renderAssumptionsAccordion(d.assumptions)}
        </div>
      </div>
    `;
  }

  // ==========================================
  // 3. SQUAT LEVER SIMULATOR VIEW
  // ==========================================
  renderSquatLeverSim() {
    const m = this.models.squat_lever;
    const s = m.state;
    const d = m.data;

    return `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div class="lg:col-span-7 space-y-4">
          <div class="bg-slate-950 border border-slate-800 rounded-2xl p-3 sm:p-5 shadow-2xl relative overflow-hidden">
            <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3 mb-3">
              <div class="min-w-0">
                <span class="text-[10px] text-emerald-400/90 font-bold uppercase tracking-wider">Model 03 · Kapalı Kinetik Zincir</span>
                <h3 class="text-sm sm:text-base font-bold text-white break-words">Squat — Diz/Kalça Moment Kolu Takası (Fry 2003)</h3>
              </div>
              <div class="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-mono text-slate-400">
                <label class="flex items-center gap-1 cursor-pointer hover:text-white">
                  <input type="checkbox" id="toggleGrid" checked class="accent-emerald-500 rounded"> Izgara
                </label>
                <label class="flex items-center gap-1 cursor-pointer hover:text-white">
                  <input type="checkbox" id="toggleArms" checked class="accent-emerald-500 rounded"> Moment Kolu
                </label>
                <label class="flex items-center gap-1 cursor-pointer hover:text-white">
                  <input type="checkbox" id="toggleForces" checked class="accent-emerald-500 rounded"> Midfoot Hattı
                </label>
              </div>
            </div>

            <div class="relative w-full aspect-[4/3] bg-slate-950 rounded-xl overflow-hidden border border-slate-800/60 flex items-center justify-center">
              <canvas id="model-canvas" class="w-full h-full block"></canvas>
            </div>

            <!-- Mobil Responsive Model Lejantı (lg ekranda canvas içi lejant kullanılır) -->
            <div class="mobile-canvas-legend lg:hidden mt-3 p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono space-y-2 animate-fadeIn">
              <div class="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <span class="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Model Lejantı
                </span>
                <span class="text-[9px] text-slate-500">Görsel Rehber</span>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1.5 text-[11px]">
                <div class="flex items-center gap-2 text-slate-300">
                  <span class="w-3.5 h-1 rounded-full bg-rose-500 shrink-0"></span>
                  <span class="truncate">Midfoot Yerçekimi Hattı (F_bar)</span>
                </div>
                <div class="flex items-center gap-2 text-slate-300">
                  <span class="w-3.5 h-1 rounded-full bg-sky-400 shrink-0"></span>
                  <span class="truncate">Diz Moment Kolu (r_knee)</span>
                </div>
                <div class="flex items-center gap-2 text-slate-300">
                  <span class="w-3.5 h-1 rounded-full bg-amber-400 shrink-0"></span>
                  <span class="truncate">Kalça Moment Kolu (r_hip)</span>
                </div>
                <div class="flex items-center gap-2 text-slate-300">
                  <span class="w-3.5 h-1 rounded-full bg-emerald-400 shrink-0"></span>
                  <span class="truncate">Femur & Tibia Segmentleri</span>
                </div>
                <div class="flex items-center gap-2 text-slate-300">
                  <span class="w-3.5 h-1 rounded-full bg-slate-400 shrink-0"></span>
                  <span class="truncate">Eklem Merkezleri (Kalça, Diz, Ayak)</span>
                </div>
              </div>
            </div>

            <div class="mt-4 pt-3 border-t border-slate-800/80 space-y-3">
              <div class="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <button id="btnPlay" class="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-mono text-xs font-bold hover:bg-emerald-400 transition flex items-center gap-1 cursor-pointer">
                    <span id="playIcon">▶</span> <span id="playText">Oynat</span>
                  </button>
                  <button id="btnReset" class="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 font-mono text-xs hover:text-white transition cursor-pointer">
                    ↺ Sıfırla
                  </button>
                </div>
                <div class="text-right shrink-0">
                  <span class="text-[10px] font-mono text-slate-400 block leading-none mb-0.5">Çöküş Derinliği</span>
                  <span id="angleDisplay" class="text-sm sm:text-base font-mono font-bold text-emerald-400">${Math.round(s.depthNorm * 100)}%</span>
                </div>
              </div>

              <div>
                <input type="range" id="sliderScrub" min="0" max="100" step="1" value="${Math.round(s.depthNorm * 100)}" class="w-full accent-emerald-500 cursor-pointer">
                <div class="flex justify-between text-[10px] font-mono text-slate-500 mt-1 gap-1 overflow-x-auto custom-scrollbar pb-0.5">
                  <button class="tick-btn hover:text-emerald-400 cursor-pointer whitespace-nowrap" data-val="0">0%<span class="hidden sm:inline"> (Ayakta)</span></button>
                  <button class="tick-btn hover:text-emerald-400 cursor-pointer whitespace-nowrap" data-val="25">25%<span class="hidden sm:inline"> (Çeyrek)</span></button>
                  <button class="tick-btn hover:text-emerald-400 cursor-pointer whitespace-nowrap" data-val="50">50%<span class="hidden sm:inline"> (Yarım)</span></button>
                  <button class="tick-btn hover:text-emerald-400 cursor-pointer whitespace-nowrap" data-val="75">75%<span class="hidden sm:inline"> (Paralel)</span></button>
                  <button class="tick-btn hover:text-emerald-400 cursor-pointer whitespace-nowrap" data-val="100">100%<span class="hidden sm:inline"> (Derin/ATG)</span></button>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div class="bg-slate-900/80 border border-slate-800 rounded-xl p-3 space-y-1.5">
                  <span class="text-[11px] font-mono text-slate-400 block">Barbell Konumu:</span>
                  <div class="grid grid-cols-2 gap-1.5">
                    <button id="btnSquatHigh" class="btn-bar py-1.5 rounded text-xs font-mono font-bold border transition cursor-pointer ${
                      s.barPositionType === 'HIGH_BAR' ? 'bg-emerald-500 text-slate-950 border-emerald-400' : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }" data-bar="HIGH_BAR">High-Bar</button>
                    <button id="btnSquatLow" class="btn-bar py-1.5 rounded text-xs font-mono font-bold border transition cursor-pointer ${
                      s.barPositionType === 'LOW_BAR' ? 'bg-emerald-500 text-slate-950 border-emerald-400' : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }" data-bar="LOW_BAR">Low-Bar</button>
                  </div>
                </div>

                <div class="bg-slate-900/80 border border-slate-800 rounded-xl p-3 space-y-1">
                  <div class="flex flex-wrap items-center justify-between gap-1 text-[11px] font-mono">
                    <span class="text-slate-400">Gövde Eğimi:</span>
                    <span id="trunkLeanDisplay" class="text-emerald-400 font-bold">0° (Doğal Ritim)</span>
                  </div>
                  <input type="range" id="sliderTrunkLean" min="-15" max="35" step="1" value="${s.trunkLeanDeg}" class="w-full accent-emerald-500 cursor-pointer">
                  <div class="flex justify-between text-[9px] font-mono text-slate-500">
                    <span>-15° (Dik/Diz Odaklı)</span>
                    <span>+35° (Kalça/Fry 2003)</span>
                  </div>
                </div>
              </div>

              <div class="flex flex-wrap items-center justify-between gap-2 sm:gap-3 pt-2 border-t border-slate-900">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-mono text-slate-400">Barbell Ağırlığı:</span>
                  <div class="flex items-center gap-1">
                    ${[60, 100, 140, 180].map(w => `
                      <button class="weight-btn px-2.5 py-1 rounded text-xs font-mono font-bold border transition cursor-pointer ${
                        s.loadKg === w ? 'bg-emerald-500 text-slate-950 border-emerald-400' : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                      }" data-weight="${w}">${w} kg</button>
                    `).join('')}
                  </div>
                </div>
                <label class="flex items-center gap-1.5 text-xs font-mono text-slate-400 cursor-pointer hover:text-white">
                  <input type="checkbox" id="toggleLimbMass" ${s.includeBodyMass ? 'checked' : ''} class="accent-emerald-500 rounded">
                  Vücut Kütlesi Dahil
                </label>
              </div>
            </div>
          </div>

          <div class="bg-slate-950 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-xl">
            <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
              <h4 class="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">Diz/Kalça Moment Kolu Takas Eğrisi</h4>
              <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-mono">
                <span class="flex items-center gap-1 text-sky-400"><span class="w-2.5 h-0.5 bg-sky-400 inline-block"></span> Diz r_ext</span>
                <span class="flex items-center gap-1 text-amber-400"><span class="w-2.5 h-0.5 bg-amber-400 inline-block"></span> Kalça r_ext</span>
                <span class="flex items-center gap-1 text-rose-400"><span class="w-2.5 h-0.5 bg-rose-400 inline-block"></span> Kalça/Diz Tork Oranı</span>
              </div>
            </div>
            <div class="w-full h-32 bg-slate-900/50 rounded-xl overflow-hidden border border-slate-800/60 relative">
              <canvas id="curve-canvas" class="w-full h-full block"></canvas>
            </div>
          </div>

          <div class="bg-slate-950 border border-slate-800/70 rounded-2xl p-3 sm:p-4">
            <div class="flex flex-wrap items-center justify-between gap-1 mb-2">
              <span class="text-xs font-mono text-slate-400">Squat Eklem Kaldıracı (Sagital Düzlem)</span>
              <span class="text-xs font-mono text-emerald-400 font-bold shrink-0">Midfoot Yerçekimi Hattı</span>
            </div>
            ${this.renderSquatLeverSvgVisual()}
          </div>
        </div>

        <div class="lg:col-span-5 space-y-4">
          <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 sm:p-4 space-y-3">
            <div class="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 class="text-xs font-semibold text-emerald-400">Squat Kinetik Telemetrisi</h4>
              <span class="text-xs font-mono text-emerald-400/80">Kapalı Zincir</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              <div class="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5">
                <span class="text-[10px] text-slate-400 block">Diz Moment Kolu (r_knee):</span>
                <span id="metricKneeArm" class="text-base font-bold text-sky-400">0.0 cm</span>
                <span class="text-[10px] text-slate-500 block">|x_knee - x_bar|</span>
              </div>
              <div class="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5">
                <span class="text-[10px] text-slate-400 block">Kalça Moment Kolu (r_hip):</span>
                <span id="metricHipArm" class="text-base font-bold text-amber-400">0.0 cm</span>
                <span class="text-[10px] text-slate-500 block">|x_hip - x_bar|</span>
              </div>
              <div class="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5">
                <span class="text-[10px] text-slate-400 block">Diz Ekstansör Torku:</span>
                <span id="metricKneeTorque" class="text-base font-bold text-sky-400">0.0 N·m</span>
                <span class="text-[10px] text-slate-500 block">Quadriceps yük talebi</span>
              </div>
              <div class="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5">
                <span class="text-[10px] text-slate-400 block">Kalça Ekstansör Torku:</span>
                <span id="metricHipTorque" class="text-base font-bold text-amber-400">0.0 N·m</span>
                <span class="text-[10px] text-slate-500 block">Gluteus & Hamstrings</span>
              </div>
            </div>

            <div class="bg-slate-950/90 border border-emerald-500/30 rounded-xl p-3 space-y-1">
              <div class="flex flex-wrap items-center justify-between gap-1">
                <span class="text-[11px] font-mono font-bold text-emerald-300">Kalça / Diz Tork Oranı (Fry et al. 2003)</span>
                <span id="ratioDominancePill" class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 shrink-0">DENGELİ</span>
              </div>
              <div id="metricHipKneeRatio" class="text-lg font-mono font-black text-emerald-400">1.00x</div>
              <p class="text-[10px] text-slate-400 leading-tight">
                Gövde öne eğildikçe diz moment kolu küçülür, ancak kalça moment kolu ve omurga yükü katlanarak artar.
              </p>
            </div>
          </div>

          <div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-3 sm:p-4 space-y-2 text-xs leading-relaxed text-slate-300">
            <span class="font-mono font-bold text-emerald-400 block uppercase tracking-wider text-[11px]">Kaldıraç Mekaniği & Barbell Pozisyonu:</span>
            <p>
              Barbell squat'ta ağırlık daima ayak ortası (mid-foot) hattında dengelenmek zorundadır.
            </p>
            <p>
              <strong>High-Bar:</strong> Bar trapezius üzerinde durur; gövde daha dik kaldığı için dizler öne doğru kayar. Bu durum dizdeki moment kolunu uzatarak <em>Quadriceps</em> yükünü artırır.
            </p>
            <p>
              <strong>Low-Bar:</strong> Bar arka omuz üzerine oturur; gövde öne daha fazla eğilmek zorunda kalır ve kalça geriye uzar. Bu durum kalçadaki moment kolunu büyüterek <em>Gluteus Maximus</em> ve kalça ekstansörlerini ön plana çıkarır.
            </p>
          </div>

          ${this.renderAssumptionsAccordion(d.assumptions)}
        </div>
      </div>
    `;
  }

  // ==========================================
  // 4. BENCH PRESS SIMULATOR VIEW
  // ==========================================
  renderBenchMechanicsSim() {
    const m = this.models.bench_mechanics;
    const s = m.state;
    const d = m.data;

    return `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div class="lg:col-span-7 space-y-4">
          <div class="bg-slate-950 border border-slate-800 rounded-2xl p-3 sm:p-5 shadow-2xl relative overflow-hidden">
            <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3 mb-3">
              <div class="min-w-0">
                <span class="text-[10px] text-rose-400/90 font-bold uppercase tracking-wider">Model 04 · Bar Yolu Trajektorisi</span>
                <h3 class="text-sm sm:text-base font-bold text-white break-words">Bench Press — McLaughlin 1984 Elit J-Curve</h3>
              </div>
              <div class="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-mono text-slate-400">
                <label class="flex items-center gap-1 cursor-pointer hover:text-white">
                  <input type="checkbox" id="toggleGrid" checked class="accent-rose-500 rounded"> Izgara
                </label>
                <label class="flex items-center gap-1 cursor-pointer hover:text-white">
                  <input type="checkbox" id="toggleArms" checked class="accent-rose-500 rounded"> Moment Kolu
                </label>
                <label class="flex items-center gap-1 cursor-pointer hover:text-white">
                  <input type="checkbox" id="toggleForces" checked class="accent-rose-500 rounded"> Bar Hattı
                </label>
              </div>
            </div>

            <div class="relative w-full aspect-[4/3] bg-slate-950 rounded-xl overflow-hidden border border-slate-800/60 flex items-center justify-center">
              <canvas id="model-canvas" class="w-full h-full block"></canvas>
            </div>

            <!-- Mobil Responsive Model Lejantı (lg ekranda canvas içi lejant kullanılır) -->
            <div class="mobile-canvas-legend lg:hidden mt-3 p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono space-y-2 animate-fadeIn">
              <div class="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <span class="text-[10px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-rose-400"></span> Model Lejantı
                </span>
                <span class="text-[9px] text-slate-500">Görsel Rehber</span>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1.5 text-[11px]">
                <div class="flex items-center gap-2 text-slate-300">
                  <span class="w-3.5 h-1 rounded-full bg-rose-500 shrink-0"></span>
                  <span class="truncate">Dış Bar Yükü & Vektörü (F_bar)</span>
                </div>
                <div class="flex items-center gap-2 text-slate-300">
                  <span class="w-3.5 h-1 rounded-full bg-sky-400 shrink-0"></span>
                  <span class="truncate">Omuz Moment Kolu (r_shoulder)</span>
                </div>
                <div class="flex items-center gap-2 text-slate-300">
                  <span class="w-3.5 h-1 rounded-full bg-amber-400 shrink-0"></span>
                  <span class="truncate">Dirsek Moment Kolu (r_elbow)</span>
                </div>
                <div class="flex items-center gap-2 text-slate-300">
                  <span class="w-3.5 h-1 rounded-full bg-emerald-400 shrink-0"></span>
                  <span class="truncate">J-Curve / Trajektori Hattı</span>
                </div>
                <div class="flex items-center gap-2 text-slate-300">
                  <span class="w-3.5 h-1 rounded-full bg-slate-400 shrink-0"></span>
                  <span class="truncate">Omuz & Dirsek Eklem Merkezleri</span>
                </div>
              </div>
            </div>

            <div class="mt-4 pt-3 border-t border-slate-800/80 space-y-3">
              <div class="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <button id="btnPlay" class="px-3 py-1.5 rounded-lg bg-rose-500 text-slate-950 font-mono text-xs font-bold hover:bg-rose-400 transition flex items-center gap-1 cursor-pointer">
                    <span id="playIcon">▶</span> <span id="playText">Oynat</span>
                  </button>
                  <button id="btnReset" class="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 font-mono text-xs hover:text-white transition cursor-pointer">
                    ↺ Sıfırla
                  </button>
                </div>
                <div class="text-right shrink-0">
                  <span class="text-[10px] font-mono text-slate-400 block leading-none mb-0.5">İtiş Fazı (0% Lockout → 100% Göğüs)</span>
                  <span id="angleDisplay" class="text-sm sm:text-base font-mono font-bold text-rose-400">${Math.round(s.phaseNorm * 100)}%</span>
                </div>
              </div>

              <div>
                <input type="range" id="sliderScrub" min="0" max="100" step="1" value="${Math.round(s.phaseNorm * 100)}" class="w-full accent-rose-500 cursor-pointer">
                <div class="flex justify-between text-[10px] font-mono text-slate-500 mt-1 gap-1 overflow-x-auto custom-scrollbar pb-0.5">
                  <button class="tick-btn hover:text-rose-400 cursor-pointer whitespace-nowrap" data-val="0">0%<span class="hidden sm:inline"> (Kilitlenme)</span></button>
                  <button class="tick-btn hover:text-rose-400 cursor-pointer whitespace-nowrap" data-val="25">25%<span class="hidden sm:inline"> (Üst İtiş)</span></button>
                  <button class="tick-btn hover:text-rose-400 cursor-pointer whitespace-nowrap" data-val="50">50%<span class="hidden sm:inline"> (Sticking Point)</span></button>
                  <button class="tick-btn hover:text-rose-400 cursor-pointer whitespace-nowrap" data-val="75">75%<span class="hidden sm:inline"> (Alt İtiş)</span></button>
                  <button class="tick-btn hover:text-rose-400 cursor-pointer whitespace-nowrap" data-val="100">100%<span class="hidden sm:inline"> (Göğüs Temas)</span></button>
                </div>
              </div>

              <div class="bg-slate-900/80 border border-slate-800 rounded-xl p-3 space-y-2">
                <div class="flex flex-wrap items-center justify-between gap-1 text-xs font-mono">
                  <span class="text-slate-300">Bar Trajektorisi (Bar Path):</span>
                  <span id="barPathBadge" class="text-rose-400 font-bold">${s.barPathType === 'CURVED_J_CURVE' ? 'J-CURVE (McLaughlin 1984)' : 'STRAIGHT VERTICAL'}</span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <button id="btnBenchJCurve" class="btn-path py-2 px-2 rounded-xl font-mono font-bold border transition cursor-pointer text-center ${
                    s.barPathType === 'CURVED_J_CURVE' ? 'bg-rose-500 text-slate-950 border-rose-400' : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }" data-path="CURVED_J_CURVE">Elit J-Curve (Geriye Kavis)</button>
                  <button id="btnBenchStraight" class="btn-path py-2 px-2 rounded-xl font-mono font-bold border transition cursor-pointer text-center ${
                    s.barPathType === 'STRAIGHT_VERTICAL' ? 'bg-rose-500 text-slate-950 border-rose-400' : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }" data-path="STRAIGHT_VERTICAL">Düz Dikey (Straight Vertical)</button>
                </div>
              </div>

              <div class="flex flex-wrap items-center justify-between gap-2 sm:gap-3 pt-2 border-t border-slate-900">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-mono text-slate-400">Barbell Ağırlığı:</span>
                  <div class="flex items-center gap-1">
                    ${[60, 80, 100, 120].map(w => `
                      <button class="weight-btn px-2.5 py-1 rounded text-xs font-mono font-bold border transition cursor-pointer ${
                        s.loadKg === w ? 'bg-rose-500 text-slate-950 border-rose-400' : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                      }" data-weight="${w}">${w} kg</button>
                    `).join('')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-slate-950 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-xl">
            <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
              <h4 class="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">Omuz ve Dirsek Dış Moment Kolları</h4>
              <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-mono">
                <span class="flex items-center gap-1 text-sky-400"><span class="w-2.5 h-0.5 bg-sky-400 inline-block"></span> Omuz r_ext</span>
                <span class="flex items-center gap-1 text-amber-400"><span class="w-2.5 h-0.5 bg-amber-400 inline-block"></span> Dirsek r_ext</span>
                <span class="flex items-center gap-1 text-rose-400"><span class="w-2.5 h-0.5 bg-rose-400 inline-block"></span> Omuz Tork Talebi</span>
              </div>
            </div>
            <div class="w-full h-32 bg-slate-900/50 rounded-xl overflow-hidden border border-slate-800/60 relative">
              <canvas id="curve-canvas" class="w-full h-full block"></canvas>
            </div>
          </div>

          <div class="bg-slate-950 border border-slate-800/70 rounded-2xl p-3 sm:p-4">
            <div class="flex flex-wrap items-center justify-between gap-1 mb-2">
              <span class="text-xs font-mono text-slate-400">Üstten Bakış Mekanik Modeli</span>
              <span class="text-xs font-mono text-rose-400 font-bold shrink-0">Skapular Düzlem & Dirsek Açısı</span>
            </div>
            ${this.renderBenchMechanicsSvgVisual()}
          </div>
        </div>

        <div class="lg:col-span-5 space-y-4">
          <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 sm:p-4 space-y-3">
            <div class="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 class="text-xs font-semibold text-rose-400">Bench Press Telemetrisi</h4>
              <span class="text-xs font-mono text-rose-400/80">Sagital & Transvers</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              <div class="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5">
                <span class="text-[10px] text-slate-400 block">Omuz Dış Moment Kolu:</span>
                <span id="metricShoulderArm" class="text-base font-bold text-sky-400">0.0 cm</span>
                <span class="text-[10px] text-slate-500 block">|x_shoulder - x_bar|</span>
              </div>
              <div class="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5">
                <span class="text-[10px] text-slate-400 block">Dirsek Dış Moment Kolu:</span>
                <span id="metricElbowArm" class="text-base font-bold text-amber-400">0.0 cm</span>
                <span class="text-[10px] text-slate-500 block">|x_elbow - x_bar|</span>
              </div>
              <div class="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5">
                <span class="text-[10px] text-slate-400 block">Omuz Tork Talebi:</span>
                <span id="metricShoulderTorque" class="text-base font-bold text-rose-400">0.0 N·m</span>
                <span class="text-[10px] text-slate-500 block">F_bar × r_shoulder</span>
              </div>
              <div class="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5">
                <span class="text-[10px] text-slate-400 block">Dirsek Tork Talebi:</span>
                <span id="metricElbowTorque" class="text-base font-bold text-amber-400">0.0 N·m</span>
                <span class="text-[10px] text-slate-500 block">Triceps ekstansör talebi</span>
              </div>
            </div>

            <div class="bg-slate-950/90 border border-rose-500/30 rounded-xl p-3 space-y-1">
              <div class="flex flex-wrap items-center justify-between gap-1">
                <span class="text-[11px] font-semibold text-rose-300">McLaughlin (1984) Bar Yolu Kinematiği</span>
                <span class="text-[10px] text-rose-400/80 shrink-0">Elit sporcu bulgusu</span>
              </div>
              <p class="text-[10px] text-slate-400 leading-tight">
                Elit sporcular barı göğüsten iterken hızla geriye omuz eklemine doğru yönlendirir (J-Curve). Bu sayede kritik takılma noktasında (sticking region) ve kilitlenmede omuz moment kolu sıfıra yaklaşır.
              </p>
            </div>
          </div>

          <div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-3 sm:p-4 space-y-2 text-xs leading-relaxed text-slate-300">
            <span class="font-mono font-bold text-rose-400 block uppercase tracking-wider text-[11px]">Kinetik Mekanizma & Dirsek Açıklığı:</span>
            <p>
              Dirsekler gövdeye 90° dik açıldığında (T-pozisyonu), humerus horizontal planda geriye açılır; bu açı omuz anterior kapsül stresi ve subakromiyal baskıyı artırabilir.
            </p>
            <p>
              Dirseklerin yaklaşık 45°-60° açı yaptığı 'ok ucu' formu, pektoralis majör liflerinin çekiş yönüyle uyumludur ve triceps ile omuz eklemi arasında daha dengeli bir yük dağılımı sağlar.
            </p>
          </div>

          ${this.renderAssumptionsAccordion(d.assumptions)}
        </div>
      </div>
    `;
  }

  // ==========================================
  // 4-KADEMELİ METODOLOJİ & VARSAYIMLAR BİLEŞENİ
  // ==========================================
  renderAssumptionsAccordion(assumptions) {
    if (!assumptions) return '';

    return `
      <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div class="flex items-center justify-between border-b border-slate-800 pb-2">
          <h4 class="text-xs font-semibold text-white tracking-tight">4-Kademeli Bilimsel Metodoloji</h4>
          <span class="text-[11px] text-slate-400">Metodoloji Sınıflandırması</span>
        </div>

        <div class="space-y-2 text-xs">
          <details class="group bg-slate-950/70 border border-emerald-500/20 rounded-xl overflow-hidden" open>
            <summary class="px-3 py-2 cursor-pointer font-mono font-bold text-emerald-400 flex items-center justify-between hover:bg-slate-800/40">
              <span class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-emerald-400"></span> 1. Kaynak Değeri (Source Value)
              </span>
              <span class="text-[10px] text-slate-500 group-open:rotate-180 transition">▼</span>
            </summary>
            <div class="p-3 pt-1 space-y-1.5 text-[11px] text-slate-300 font-sans border-t border-slate-800/50">
              ${assumptions.sourceBacked?.map(s => `<div class="flex items-start gap-1.5"><span class="text-emerald-400">✓</span><span>${s.replace(/\[SOURCE VALUE\]\s*/, '')}</span></div>`).join('') || ''}
            </div>
          </details>

          <details class="group bg-slate-950/70 border border-cyan-500/20 rounded-xl overflow-hidden" open>
            <summary class="px-3 py-2 cursor-pointer font-mono font-bold text-cyan-400 flex items-center justify-between hover:bg-slate-800/40">
              <span class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-cyan-400"></span> 2. Türetilmiş Model Değeri (Derived Model Value)
              </span>
              <span class="text-[10px] text-slate-500 group-open:rotate-180 transition">▼</span>
            </summary>
            <div class="p-3 pt-1 space-y-1.5 text-[11px] text-slate-300 font-sans border-t border-slate-800/50">
              ${assumptions.derivedModelValues?.map(s => `<div class="flex items-start gap-1.5"><span class="text-cyan-400">fx</span><span>${s.replace(/\[DERIVED MODEL VALUE\]\s*/, '')}</span></div>`).join('') || ''}
            </div>
          </details>

          <details class="group bg-slate-950/70 border border-amber-500/20 rounded-xl overflow-hidden">
            <summary class="px-3 py-2 cursor-pointer font-mono font-bold text-amber-400 flex items-center justify-between hover:bg-slate-800/40">
              <span class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-amber-400"></span> 3. Model Varsayımı (Model Assumption)
              </span>
              <span class="text-[10px] text-slate-500 group-open:rotate-180 transition">▼</span>
            </summary>
            <div class="p-3 pt-1 space-y-1.5 text-[11px] text-slate-300 font-sans border-t border-slate-800/50">
              ${assumptions.modelAssumptions?.map(s => `<div class="flex items-start gap-1.5"><span class="text-amber-400">ℹ</span><span>${s.replace(/\[MODEL ASSUMPTION\]\s*/, '')}</span></div>`).join('') || ''}
            </div>
          </details>

          <details class="group bg-slate-950/70 border border-rose-500/20 rounded-xl overflow-hidden">
            <summary class="px-3 py-2 cursor-pointer font-mono font-bold text-rose-400 flex items-center justify-between hover:bg-slate-800/40">
              <span class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-rose-400"></span> 4. Bilinen Sınırlama (Known Limitation)
              </span>
              <span class="text-[10px] text-slate-500 group-open:rotate-180 transition">▼</span>
            </summary>
            <div class="p-3 pt-1 space-y-1.5 text-[11px] text-slate-300 font-sans border-t border-slate-800/50">
              ${assumptions.limitations?.map(s => `<div class="flex items-start gap-1.5"><span class="text-rose-400">⚠</span><span>${s.replace(/\[KNOWN LIMITATION\]\s*/, '')}</span></div>`).join('') || ''}
            </div>
          </details>
        </div>
      </div>
    `;
  }

  // ==========================================
  // RESPONSIVE SVG SCHEMATICS (Node Test & Visual Fallback)
  // ==========================================
  renderLateralRaiseSvgVisual() {
    return `
      <svg viewBox="0 0 380 400" class="w-full max-w-[380px] h-auto aspect-[380/400] select-none mx-auto">
        <defs>
          <pattern id="gridPatternLR" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1" />
          </pattern>
          <marker id="arrowRedLR" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M 0 0 L 6 3 L 0 6 z" fill="#ef4444" />
          </marker>
          <marker id="arrowCyanLR" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M 0 0 L 6 3 L 0 6 z" fill="#00f2fe" />
          </marker>
        </defs>
        <rect width="380" height="400" fill="url(#gridPatternLR)" />
        <line x1="120" y1="60" x2="120" y2="380" stroke="#1e2433" stroke-width="2" stroke-dasharray="4,4" />
        <text x="110" y="390" fill="#64748b" font-size="9" font-family="monospace" text-anchor="end">Kinematik Gövde Ekseni</text>
        <circle cx="120" cy="240" r="10" fill="#0f172a" stroke="#00f2fe" stroke-width="3" />
        <circle cx="120" cy="240" r="4" fill="#00f2fe" />
        <line x1="120" y1="240" x2="267" y2="155" stroke="#e2e8f0" stroke-width="7" stroke-linecap="round" />
        <line x1="120" y1="240" x2="267" y2="155" stroke="#ff9f1c" stroke-width="2" stroke-linecap="round" />
        <line x1="120" y1="155" x2="267" y2="155" stroke="#00f2fe" stroke-width="2" marker-end="url(#arrowCyanLR)" />
        <text x="193" y="148" fill="#00f2fe" font-size="10" font-family="monospace" text-anchor="middle" font-weight="bold">r_ext: 53.7 cm</text>
        <line x1="267" y1="155" x2="267" y2="280" stroke="#ef4444" stroke-width="2" marker-end="url(#arrowRedLR)" />
        <text x="275" y="220" fill="#ef4444" font-size="10" font-family="monospace" font-weight="bold">F_yük = 98.1 N</text>
        <circle cx="267" cy="155" r="12" fill="#ff9f1c" stroke="#fff" stroke-width="2" />
        <text x="267" y="159" fill="#08090c" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">10k</text>
      </svg>
    `;
  }

  renderBicepsCurlSvgVisual() {
    return `
      <svg viewBox="0 0 380 380" class="w-full max-w-[380px] h-auto aspect-[1/1] select-none mx-auto">
        <defs>
          <pattern id="gridCurlSVG" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1" />
          </pattern>
        </defs>
        <rect width="380" height="380" fill="url(#gridCurlSVG)" />
        <line x1="140" y1="80" x2="140" y2="240" stroke="#475569" stroke-width="12" stroke-linecap="round" />
        <text x="125" y="140" fill="#64748b" font-size="10" font-family="monospace" text-anchor="end">Humerus (Dirsek Fleksiyon)</text>
        <line x1="140" y1="240" x2="295" y2="198" stroke="#e2e8f0" stroke-width="8" stroke-linecap="round" />
        <line x1="140" y1="240" x2="295" y2="198" stroke="#00f2fe" stroke-width="2" stroke-linecap="round" />
        <circle cx="140" cy="240" r="11" fill="#0f172a" stroke="#00f2fe" stroke-width="3" />
        <circle cx="140" cy="240" r="4" fill="#00f2fe" />
        <circle cx="295" cy="198" r="14" fill="#ff9f1c" stroke="#fff" stroke-width="2" />
        <text x="295" y="202" fill="#08090c" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">15k</text>
      </svg>
    `;
  }

  renderSquatLeverSvgVisual() {
    return `
      <svg viewBox="0 0 380 360" class="w-full max-w-[380px] h-auto aspect-[380/360] select-none mx-auto">
        <defs>
          <pattern id="gridSquatSVG" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1" />
          </pattern>
        </defs>
        <rect width="380" height="360" fill="url(#gridSquatSVG)" />
        <line x1="190" y1="30" x2="190" y2="340" stroke="#475569" stroke-width="2" stroke-dasharray="4,4" />
        <text x="195" y="345" fill="#64748b" font-size="9" font-family="monospace">Squat Eklem Midfoot Hattı</text>
        <line x1="140" y1="320" x2="230" y2="320" stroke="#94a3b8" stroke-width="6" stroke-linecap="round" />
        <line x1="175" y1="320" x2="245" y2="240" stroke="#e2e8f0" stroke-width="6" stroke-linecap="round" />
        <line x1="245" y1="240" x2="120" y2="230" stroke="#e2e8f0" stroke-width="7" stroke-linecap="round" />
        <line x1="120" y1="230" x2="190" y2="85" stroke="#e2e8f0" stroke-width="8" stroke-linecap="round" />
        <circle cx="245" cy="240" r="7" fill="#00f2fe" />
        <circle cx="120" cy="230" r="8" fill="#10b981" />
        <circle cx="190" cy="85" r="12" fill="#ef4444" stroke="#fff" stroke-width="2" />
        <text x="190" y="89" fill="#fff" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">BAR</text>
      </svg>
    `;
  }

  renderBenchMechanicsSvgVisual() {
    return `
      <svg viewBox="0 0 380 340" class="w-full max-w-[380px] h-auto aspect-[380/340] select-none mx-auto">
        <defs>
          <pattern id="gridBenchSVG" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1" />
          </pattern>
        </defs>
        <rect width="380" height="340" fill="url(#gridBenchSVG)" />
        <rect x="150" y="80" width="80" height="200" rx="20" fill="#1e2433" stroke="#334155" stroke-width="2" />
        <text x="190" y="190" fill="#475569" font-size="10" font-family="monospace" text-anchor="middle">Mekanik Modeli (Gövde)</text>
        <circle cx="150" cy="110" r="10" fill="#0f172a" stroke="#ef4444" stroke-width="2" />
        <circle cx="230" cy="110" r="10" fill="#0f172a" stroke="#ef4444" stroke-width="2" />
        <line x1="150" y1="110" x2="85" y2="147" stroke="#e2e8f0" stroke-width="7" stroke-linecap="round" />
        <line x1="230" y1="110" x2="295" y2="147" stroke="#e2e8f0" stroke-width="7" stroke-linecap="round" />
        <line x1="40" y1="147" x2="340" y2="147" stroke="#ef4444" stroke-width="3" stroke-linecap="round" />
        <circle cx="85" cy="147" r="7" fill="#00f2fe" />
        <circle cx="295" cy="147" r="7" fill="#00f2fe" />
      </svg>
    `;
  }

  // ==========================================
  // ATTACH EVENT LISTENERS & DOM BINDINGS
  // ==========================================
  attachEventListeners() {
    if (!this.container) return;

    // 1. Simülatör Sekmeleri (Global State Entegrasyonu)
    const tabLateral = this.container.querySelector('#simTabLateral');
    const tabBiceps = this.container.querySelector('#simTabBiceps');
    const tabSquat = this.container.querySelector('#simTabSquat');
    const tabBench = this.container.querySelector('#simTabBench');

    if (tabLateral) {
      tabLateral.addEventListener('click', () => {
        state.openBioLab('lateral_raise', 'Lateral Raise Mekaniği');
      });
    }
    if (tabBiceps) {
      tabBiceps.addEventListener('click', () => {
        state.openBioLab('biceps_curl', 'Biceps Curl Mekaniği');
      });
    }
    if (tabSquat) {
      tabSquat.addEventListener('click', () => {
        state.openBioLab('squat_lever', 'Squat Kaldıracı');
      });
    }
    if (tabBench) {
      tabBench.addEventListener('click', () => {
        state.openBioLab('bench_mechanics', 'Bench Press Mekaniği');
      });
    }

    // 2. Metodoloji Modal Kontrolü
    const btnOpenAssumptions = this.container.querySelector('#btnOpenAssumptions');
    const modal = this.container.querySelector('#assumptionsModal');
    const btnCloseAssumptions = this.container.querySelector('#btnCloseAssumptions');
    const modalContent = this.container.querySelector('#modalContent');

    if (btnOpenAssumptions && modal) {
      btnOpenAssumptions.addEventListener('click', () => {
        const d = this.activeModel?.data;
        if (modalContent && d) {
          modalContent.innerHTML = `
            <div class="space-y-4">
              <div>
                <h4 class="font-bold text-amber-400 font-mono text-sm">${d.title}</h4>
                <p class="text-xs text-slate-400 mt-1">${d.description}</p>
              </div>
              <div class="border-t border-slate-800 pt-3">
                <h5 class="font-bold text-white text-xs uppercase font-mono mb-2">Bilimsel Literatür Kaynakları:</h5>
                <ul class="space-y-2 text-xs">
                  ${d.sources?.map(src => `
                    <li class="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      <strong class="text-cyan-400">${src.author} (${src.year})</strong><br>
                      <span class="text-slate-300 italic">${src.title}</span><br>
                      <span class="text-slate-500 text-[11px]">${src.journal}</span>
                      ${src.note ? `<div class="text-[10px] text-amber-300/80 mt-1">Not: ${src.note}</div>` : ''}
                    </li>
                  `).join('') || ''}
                </ul>
              </div>
            </div>
          `;
        }
        modal.classList.remove('hidden');
      });
    }

    if (btnCloseAssumptions && modal) {
      btnCloseAssumptions.addEventListener('click', () => modal.classList.add('hidden'));
    }
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.add('hidden');
      });
    }

    // 3. Transport & Playback Kontrolleri
    const btnPlay = this.container.querySelector('#btnPlay');
    const btnReset = this.container.querySelector('#btnReset');
    const selectSpeed = this.container.querySelector('#selectSpeed');

    if (btnPlay) {
      btnPlay.addEventListener('click', () => {
        if (this.activeModel) {
          this.activeModel.togglePlay();
          this.updatePlayButton();
        }
      });
    }

    if (btnReset) {
      btnReset.addEventListener('click', () => {
        if (this.activeModel) {
          this.activeModel.reset();
          this.updatePlayButton();
        }
      });
    }

    if (selectSpeed) {
      selectSpeed.addEventListener('change', (e) => {
        if (this.activeModel) {
          this.activeModel.setPlaybackSpeed(parseFloat(e.target.value));
        }
      });
    }

    // 4. Ana Zaman Çizgisi / Scrubber (Hedefli Güncelleme - DOM Wiping YOK)
    const sliderScrub = this.container.querySelector('#sliderScrub');
    if (sliderScrub) {
      sliderScrub.addEventListener('input', (e) => {
        if (this.activeModel.state.isPlaying) {
          this.activeModel.pause();
          this.updatePlayButton();
        }
        const val = parseFloat(e.target.value);
        if (this.state.activeSim === 'lateral_raise') {
          this.activeModel.setElevationAngle(val);
        } else if (this.state.activeSim === 'biceps_curl') {
          this.activeModel.setFlexionAngle(val);
        } else if (this.state.activeSim === 'squat_lever') {
          this.activeModel.setDepth(val / 100);
        } else if (this.state.activeSim === 'bench_mechanics') {
          this.activeModel.setPhase(val / 100);
        }
      });
    }

    // Hızlı Adım / Tick Butonları
    this.container.querySelectorAll('.tick-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = parseFloat(btn.dataset.val);
        if (sliderScrub) sliderScrub.value = val;
        if (this.state.activeSim === 'lateral_raise') {
          this.activeModel.setElevationAngle(val);
        } else if (this.state.activeSim === 'biceps_curl') {
          this.activeModel.setFlexionAngle(val);
        } else if (this.state.activeSim === 'squat_lever') {
          this.activeModel.setDepth(val / 100);
        } else if (this.state.activeSim === 'bench_mechanics') {
          this.activeModel.setPhase(val / 100);
        }
      });
    });

    // 5. Yük Ağırlığı Butonları
    this.container.querySelectorAll('.weight-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const w = parseFloat(btn.dataset.weight);
        if (this.activeModel) {
          this.activeModel.setLoad(w);
          this.container.querySelectorAll('.weight-btn').forEach(b => {
            const isSel = parseFloat(b.dataset.weight) === w;
            b.className = `weight-btn px-2.5 py-1 rounded text-xs font-mono font-bold border transition cursor-pointer ${
              isSel 
                ? (this.state.activeSim === 'lateral_raise' ? 'bg-amber-500 text-slate-950 border-amber-400' :
                   this.state.activeSim === 'biceps_curl' ? 'bg-cyan-500 text-slate-950 border-cyan-400' :
                   this.state.activeSim === 'squat_lever' ? 'bg-emerald-500 text-slate-950 border-emerald-400' :
                   'bg-rose-500 text-slate-950 border-rose-400')
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`;
          });
        }
      });
    });

    // Kütle Dahil Toggle
    const toggleLimbMass = this.container.querySelector('#toggleLimbMass');
    if (toggleLimbMass) {
      toggleLimbMass.addEventListener('change', (e) => {
        if (typeof this.activeModel.setIncludeLimbMass === 'function') {
          this.activeModel.setIncludeLimbMass(e.target.checked);
        } else if (typeof this.activeModel.setIncludeBodyMass === 'function') {
          this.activeModel.setIncludeBodyMass(e.target.checked);
        }
      });
    }

    // 6. Görsel Katman Toggle'ları
    const toggleGrid = this.container.querySelector('#toggleGrid');
    const toggleArms = this.container.querySelector('#toggleArms');
    const toggleForces = this.container.querySelector('#toggleForces');
    const toggleMuscles = this.container.querySelector('#toggleMuscles');

    if (toggleGrid) {
      toggleGrid.addEventListener('change', (e) => {
        if (this.activeModel.renderer) {
          this.activeModel.renderer.showGrid = e.target.checked;
          this.activeModel.render();
        }
      });
    }
    if (toggleArms) {
      toggleArms.addEventListener('change', (e) => {
        if (this.activeModel.renderer) {
          this.activeModel.renderer.showMomentArms = e.target.checked;
          this.activeModel.render();
        }
      });
    }
    if (toggleForces) {
      toggleForces.addEventListener('change', (e) => {
        if (this.activeModel.renderer) {
          this.activeModel.renderer.showForces = e.target.checked;
          if ('showBarPath' in this.activeModel.renderer) {
            this.activeModel.renderer.showBarPath = e.target.checked;
          }
          this.activeModel.render();
        }
      });
    }
    if (toggleMuscles) {
      toggleMuscles.addEventListener('change', (e) => {
        if (this.activeModel.renderer && 'showMuscles' in this.activeModel.renderer) {
          this.activeModel.renderer.showMuscles = e.target.checked;
          this.activeModel.render();
        }
      });
    }

    // 7. Modele Özel Alt Kontroller
    // Biceps Rotasyonu
    this.container.querySelectorAll('.btn-rot').forEach(btn => {
      btn.addEventListener('click', () => {
        const rot = parseFloat(btn.dataset.rot);
        this.models.biceps_curl.setForearmRotation(rot);
        const sliderRot = this.container.querySelector('#sliderForearmRot');
        if (sliderRot) sliderRot.value = rot;
        this.container.querySelectorAll('.btn-rot').forEach(b => {
          const isSel = parseFloat(b.dataset.rot) === rot;
          b.className = `btn-rot py-1.5 rounded text-xs font-mono font-bold border transition cursor-pointer ${
            isSel ? 'bg-cyan-500 text-slate-950 border-cyan-400' : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
          }`;
        });
      });
    });

    const sliderForearmRot = this.container.querySelector('#sliderForearmRot');
    if (sliderForearmRot) {
      sliderForearmRot.addEventListener('input', (e) => {
        const rot = parseFloat(e.target.value);
        this.models.biceps_curl.setForearmRotation(rot);
      });
    }

    // Biceps Ayrı Kas Toggle'ları
    const toggleBiceps = this.container.querySelector('#toggleBiceps');
    const toggleBrachialis = this.container.querySelector('#toggleBrachialis');
    const toggleBrachioradialis = this.container.querySelector('#toggleBrachioradialis');

    if (toggleBiceps) {
      toggleBiceps.addEventListener('change', (e) => {
        if (this.models.biceps_curl.renderer) {
          this.models.biceps_curl.renderer.showBiceps = e.target.checked;
          this.models.biceps_curl.render();
        }
      });
    }
    if (toggleBrachialis) {
      toggleBrachialis.addEventListener('change', (e) => {
        if (this.models.biceps_curl.renderer) {
          this.models.biceps_curl.renderer.showBrachialis = e.target.checked;
          this.models.biceps_curl.render();
        }
      });
    }
    if (toggleBrachioradialis) {
      toggleBrachioradialis.addEventListener('change', (e) => {
        if (this.models.biceps_curl.renderer) {
          this.models.biceps_curl.renderer.showBrachioradialis = e.target.checked;
          this.models.biceps_curl.render();
        }
      });
    }

    // Squat Bar Konumu & Eğim
    const btnSquatHigh = this.container.querySelector('#btnSquatHigh');
    const btnSquatLow = this.container.querySelector('#btnSquatLow');
    if (btnSquatHigh) {
      btnSquatHigh.addEventListener('click', () => {
        this.models.squat_lever.setBarPosition('HIGH_BAR');
        btnSquatHigh.className = 'btn-bar py-1.5 rounded text-xs font-mono font-bold border transition cursor-pointer bg-emerald-500 text-slate-950 border-emerald-400';
        if (btnSquatLow) btnSquatLow.className = 'btn-bar py-1.5 rounded text-xs font-mono font-bold border transition cursor-pointer bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800';
      });
    }
    if (btnSquatLow) {
      btnSquatLow.addEventListener('click', () => {
        this.models.squat_lever.setBarPosition('LOW_BAR');
        btnSquatLow.className = 'btn-bar py-1.5 rounded text-xs font-mono font-bold border transition cursor-pointer bg-emerald-500 text-slate-950 border-emerald-400';
        if (btnSquatHigh) btnSquatHigh.className = 'btn-bar py-1.5 rounded text-xs font-mono font-bold border transition cursor-pointer bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800';
      });
    }

    const sliderTrunkLean = this.container.querySelector('#sliderTrunkLean');
    if (sliderTrunkLean) {
      sliderTrunkLean.addEventListener('input', (e) => {
        const lean = parseFloat(e.target.value);
        this.models.squat_lever.setTrunkLean(lean);
        const leanDisplay = this.container.querySelector('#trunkLeanDisplay');
        if (leanDisplay) {
          let txt = `${lean > 0 ? '+' : ''}${lean}°`;
          if (lean === 0) txt += ' (Doğal Ritim)';
          else if (lean < 0) txt += ' (Dik Gövde / Diz Baskın)';
          else txt += ' (İleri Eğim / Fry 2003)';
          leanDisplay.textContent = txt;
        }
      });
    }

    // Bench Press Bar Yolu (J-Curve vs Straight)
    const btnBenchJCurve = this.container.querySelector('#btnBenchJCurve');
    const btnBenchStraight = this.container.querySelector('#btnBenchStraight');
    if (btnBenchJCurve) {
      btnBenchJCurve.addEventListener('click', () => {
        this.models.bench_mechanics.setBarPath('CURVED_J_CURVE');
        btnBenchJCurve.className = 'btn-path py-2 rounded-xl text-xs font-mono font-bold border transition cursor-pointer bg-rose-500 text-slate-950 border-rose-400';
        if (btnBenchStraight) btnBenchStraight.className = 'btn-path py-2 rounded-xl text-xs font-mono font-bold border transition cursor-pointer bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800';
        const badge = this.container.querySelector('#barPathBadge');
        if (badge) badge.textContent = 'J-CURVE (McLaughlin 1984)';
      });
    }
    if (btnBenchStraight) {
      btnBenchStraight.addEventListener('click', () => {
        this.models.bench_mechanics.setBarPath('STRAIGHT_VERTICAL');
        btnBenchStraight.className = 'btn-path py-2 rounded-xl text-xs font-mono font-bold border transition cursor-pointer bg-rose-500 text-slate-950 border-rose-400';
        if (btnBenchJCurve) btnBenchJCurve.className = 'btn-path py-2 rounded-xl text-xs font-mono font-bold border transition cursor-pointer bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800';
        const badge = this.container.querySelector('#barPathBadge');
        if (badge) badge.textContent = 'DÜZ DİKEY (Straight Vertical)';
      });
    }
  }

  updatePlayButton() {
    const btnPlay = this.container?.querySelector('#btnPlay');
    const playIcon = this.container?.querySelector('#playIcon');
    const playText = this.container?.querySelector('#playText');
    if (!btnPlay || !this.activeModel) return;

    if (this.activeModel.state.isPlaying) {
      if (playIcon) playIcon.textContent = '⏸';
      if (playText) playText.textContent = 'Durdur';
    } else {
      if (playIcon) playIcon.textContent = '▶';
      if (playText) playText.textContent = 'Oynat';
    }
  }

  // ==========================================
  // INITIALIZE ACTIVE SIMULATOR & CANVAS
  // ==========================================
  initActiveSimulator() {
    if (!this.container) return;

    const canvas = this.container.querySelector('#model-canvas');
    const curveCanvas = this.container.querySelector('#curve-canvas');

    if (this.unsubscribeActiveModel) {
      this.unsubscribeActiveModel();
      this.unsubscribeActiveModel = null;
    }

    if (canvas && this.activeModel) {
      if (typeof this.activeModel.setCanvas === 'function') {
        this.activeModel.setCanvas(canvas);
      } else {
        this.activeModel.canvas = canvas;
      }

      if (!this.activeModel.renderer) {
        if (this.state.activeSim === 'lateral_raise') {
          this.activeModel.renderer = new LateralRaiseRenderer(canvas);
        } else if (this.state.activeSim === 'biceps_curl') {
          this.activeModel.renderer = new BicepsCurlRenderer(canvas);
        } else if (this.state.activeSim === 'squat_lever') {
          this.activeModel.renderer = new SquatRenderer(canvas);
        } else if (this.state.activeSim === 'bench_mechanics') {
          this.activeModel.renderer = new BenchPressRenderer(canvas);
        }
      } else {
        this.activeModel.renderer.canvas = canvas;
        this.activeModel.renderer.ctx = canvas.getContext ? canvas.getContext('2d') : null;
      }
    }

    this.curveCanvas = curveCanvas;
    this.curveCtx = curveCanvas && curveCanvas.getContext ? curveCanvas.getContext('2d') : null;

    if (this.activeModel) {
      this.activeModel.resize();
      this.activeModel.render();

      this.unsubscribeActiveModel = this.activeModel.subscribe((data) => {
        this.onModelUpdate(data);
      });

      // İlk yükleme telemetrisini ve eğri çizimini hemen tetikle
      this.onModelUpdate(this.activeModel.getCurrentState());
    }

    this.handleResize();

    // DOM yerleşimi ve bounding box tamamlandıktan sonra hassas DPR render
    if (typeof window !== 'undefined') {
      requestAnimationFrame(() => {
        this.handleResize();
        if (this.activeModel) {
          this.activeModel.render();
        }
      });
    }
  }

  handleResize() {
    if (!this.container) return;
    if (this.activeModel) {
      this.activeModel.resize();
      this.activeModel.render();
    }
    if (this.curveCanvas && this.curveCtx) {
      const rect = typeof this.curveCanvas.getBoundingClientRect === 'function' ? this.curveCanvas.getBoundingClientRect() : null;
      const dpr = window.devicePixelRatio || 1;
      this.curveWidth = (rect && rect.width > 0) ? rect.width : (this.curveCanvas.parentElement?.clientWidth || 500);
      this.curveHeight = (rect && rect.height > 0) ? rect.height : 128;
      this.curveCanvas.width = this.curveWidth * dpr;
      this.curveCanvas.height = this.curveHeight * dpr;
      if (this.curveCtx.scale) {
        this.curveCtx.scale(dpr, dpr);
      }
      if (this.activeModel) {
        this.drawCurves(this.activeModel.getCurrentState());
      }
    }
  }

  // ==========================================
  // HEDEFLEŞTİRİLMİŞ TELEMETRİ GÜNCELLEMESİ (DOM WIPING YOK!)
  // ==========================================
  onModelUpdate(data) {
    if (!this.container) return;

    const { state: s, analysis: an } = data;
    const sim = this.state.activeSim;

    // 1. Açı / Faz Göstergesi
    const angleDisplay = this.container.querySelector('#angleDisplay');
    const sliderScrub = this.container.querySelector('#sliderScrub');

    if (sim === 'lateral_raise') {
      if (angleDisplay) angleDisplay.textContent = `${s.elevationAngleDeg.toFixed(1)}°`;
      if (sliderScrub && document.activeElement !== sliderScrub) sliderScrub.value = s.elevationAngleDeg;

      const rExtEl = this.container.querySelector('#metricRExt');
      const rIntEl = this.container.querySelector('#metricRInt');
      const torqueEl = this.container.querySelector('#metricTorque');
      const maEl = this.container.querySelector('#metricMA');
      const deltoidEl = this.container.querySelector('#metricDeltoidDemand');

      if (rExtEl) rExtEl.textContent = `${an.momentArms.externalLoadCm.toFixed(1)} cm`;
      if (rIntEl) rIntEl.textContent = `${an.momentArms.deltoidInternalCm.toFixed(2)} cm`;
      if (torqueEl) torqueEl.textContent = `${an.torques.totalExternalTorqueNm.toFixed(1)} N·m`;
      if (maEl) maEl.textContent = an.mechanicalAdvantage.toFixed(4);
      if (deltoidEl) {
        deltoidEl.textContent = `${Math.round(an.forces.deltoidForceN)} N (${an.forces.deltoidForceKgEquivalent.toFixed(1)} kgf)`;
      }
    } else if (sim === 'biceps_curl') {
      if (angleDisplay) angleDisplay.textContent = `${s.flexionAngleDeg.toFixed(1)}°`;
      if (sliderScrub && document.activeElement !== sliderScrub) sliderScrub.value = s.flexionAngleDeg;

      const rotBadge = this.container.querySelector('#rotBadge');
      if (rotBadge) {
        const rotState = s.forearmRotationDeg > 30 ? 'SUPINATED (+80°)' : (s.forearmRotationDeg < -30 ? 'PRONATED (-80°)' : 'NEUTRAL (0°)');
        rotBadge.textContent = `${rotState} (${s.forearmRotationDeg > 0 ? '+' : ''}${s.forearmRotationDeg.toFixed(0)}°)`;
      }

      const rExtEl = this.container.querySelector('#metricRExt');
      const torqueEl = this.container.querySelector('#metricTorque');
      const bicepsArmEl = this.container.querySelector('#metricBicepsArm');
      const brachialisArmEl = this.container.querySelector('#metricBrachialisArm');
      const brachioradialisArmEl = this.container.querySelector('#metricBrachioradialisArm');

      if (rExtEl) rExtEl.textContent = `${an.momentArms.externalLoadCm.toFixed(1)} cm`;
      if (torqueEl) torqueEl.textContent = `${an.torques.totalExternalTorqueNm.toFixed(1)} N·m`;
      if (bicepsArmEl) bicepsArmEl.textContent = `${an.momentArms.bicepsInternalCm.toFixed(2)} cm`;
      if (brachialisArmEl) brachialisArmEl.textContent = `${an.momentArms.brachialisInternalCm.toFixed(2)} cm`;
      if (brachioradialisArmEl) brachioradialisArmEl.textContent = `${an.momentArms.brachioradialisInternalCm.toFixed(2)} cm`;
    } else if (sim === 'squat_lever') {
      const depthPercent = Math.round(s.depthNorm * 100);
      if (angleDisplay) angleDisplay.textContent = `${depthPercent}% (Derinlik)`;
      if (sliderScrub && document.activeElement !== sliderScrub) sliderScrub.value = depthPercent;

      const kneeArmEl = this.container.querySelector('#metricKneeArm');
      const hipArmEl = this.container.querySelector('#metricHipArm');
      const kneeTorqueEl = this.container.querySelector('#metricKneeTorque');
      const hipTorqueEl = this.container.querySelector('#metricHipTorque');
      const ratioEl = this.container.querySelector('#metricHipKneeRatio');
      const pill = this.container.querySelector('#ratioDominancePill');

      if (kneeArmEl) kneeArmEl.textContent = `${an.momentArms.kneeExternalCm.toFixed(1)} cm`;
      if (hipArmEl) hipArmEl.textContent = `${an.momentArms.hipExternalCm.toFixed(1)} cm`;
      if (kneeTorqueEl) kneeTorqueEl.textContent = `${an.torques.kneeExtensorDemandNm.toFixed(1)} N·m`;
      if (hipTorqueEl) hipTorqueEl.textContent = `${an.torques.hipExtensorDemandNm.toFixed(1)} N·m`;

      const r = an.torques.hipToKneeRatio;
      if (ratioEl) ratioEl.textContent = `${r.toFixed(2)}x`;
      if (pill) {
        pill.textContent = r > 2.0 ? 'KALÇA BASKIN' : (r < 0.9 ? 'DİZ BASKIN' : 'DENGELİ');
        pill.className = `text-[9px] font-mono px-1.5 py-0.5 rounded ${
          r > 2.0 ? 'bg-amber-500/20 text-amber-300' : (r < 0.9 ? 'bg-sky-500/20 text-sky-300' : 'bg-emerald-500/20 text-emerald-300')
        }`;
      }
    } else if (sim === 'bench_mechanics') {
      const phasePercent = Math.round(s.phaseNorm * 100);
      if (angleDisplay) {
        angleDisplay.textContent = `${phasePercent}% (${phasePercent === 0 ? 'Kilitlenme' : (phasePercent === 100 ? 'Göğüs Temas' : 'İtiş/İniş')})`;
      }
      if (sliderScrub && document.activeElement !== sliderScrub) sliderScrub.value = phasePercent;

      const shoulderArmEl = this.container.querySelector('#metricShoulderArm');
      const elbowArmEl = this.container.querySelector('#metricElbowArm');
      const shoulderTorqueEl = this.container.querySelector('#metricShoulderTorque');
      const elbowTorqueEl = this.container.querySelector('#metricElbowTorque');

      if (shoulderArmEl) shoulderArmEl.textContent = `${an.momentArms.shoulderExternalCm.toFixed(1)} cm`;
      if (elbowArmEl) elbowArmEl.textContent = `${an.momentArms.elbowExternalCm.toFixed(1)} cm`;
      if (shoulderTorqueEl) shoulderTorqueEl.textContent = `${an.torques.shoulderTorqueDemandNm.toFixed(1)} N·m`;
      if (elbowTorqueEl) elbowTorqueEl.textContent = `${an.torques.elbowTorqueDemandNm.toFixed(1)} N·m`;
    }

    // 2. Eğri Tuvalini Güncelle
    this.drawCurves(data);
  }

  // ==========================================
  // GERÇEK ZAMANLI EĞRİ VE İMLEÇ ÇİZİMİ
  // ==========================================
  drawCurves(data) {
    if (!this.curveCtx || !this.curveWidth || !this.curveHeight) return;

    const ctx = this.curveCtx;
    const w = this.curveWidth;
    const h = this.curveHeight;

    ctx.fillStyle = '#0b0f19';
    ctx.fillRect(0, 0, w, h);

    const padLeft = 35;
    const padRight = 15;
    const padTop = 10;
    const padBottom = 20;
    const graphW = w - padLeft - padRight;
    const graphH = h - padTop - padBottom;

    const sim = this.state.activeSim;
    const isAngleBased = sim === 'lateral_raise' || sim === 'biceps_curl';
    const maxX = isAngleBased ? (sim === 'lateral_raise' ? 180 : 150) : 100;
    const stepX = isAngleBased ? 30 : 25;
    const unitX = isAngleBased ? '°' : '%';

    // Izgara çizgileri
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let xVal = 0; xVal <= maxX; xVal += stepX) {
      const gx = padLeft + (xVal / maxX) * graphW;
      ctx.beginPath();
      ctx.moveTo(gx, padTop);
      ctx.lineTo(gx, padTop + graphH);
      ctx.stroke();

      ctx.font = '9px monospace';
      ctx.fillStyle = '#64748b';
      ctx.textAlign = 'center';
      ctx.fillText(`${xVal}${unitX}`, gx, h - 6);
    }

    // Taban çizgisi
    ctx.strokeStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(padLeft, padTop + graphH);
    ctx.lineTo(padLeft + graphW, padTop + graphH);
    ctx.stroke();

    if (sim === 'lateral_raise') {
      const m = this.models.lateral_raise;
      const totalArmLength = m.anatomy.totalArmLength;
      const dumbbellN = m.state.loadKg * m.biomechanics.gravity;

      const extPoints = [];
      const intPoints = [];
      const torquePoints = [];

      for (let a = 0; a <= maxX; a += 2) {
        const rExt = m.biomechanics.calculateExternalMomentArm(a, totalArmLength);
        const rInt = m.biomechanics.calculateInternalMomentArm(a);
        const tau = rExt * dumbbellN;
        extPoints.push({ a, val: rExt });
        intPoints.push({ a, val: rInt });
        torquePoints.push({ a, val: tau });
      }

      const maxRExt = totalArmLength * 1.05;
      this.renderCurvePath(ctx, extPoints, maxRExt, padLeft, padTop, graphW, graphH, maxX, '#38bdf8', 2);
      this.renderCurvePath(ctx, intPoints, 0.045, padLeft, padTop, graphW, graphH, maxX, '#10b981', 1.5, [3, 2]);
      this.renderCurvePath(ctx, torquePoints, (dumbbellN * totalArmLength) * 1.1, padLeft, padTop, graphW, graphH, maxX, '#ef4444', 1.5);

      const curAngle = data.state.elevationAngleDeg;
      this.drawCurveCursor(ctx, curAngle, maxX, padLeft, padTop, graphW, graphH, () => {
        const r = m.biomechanics.calculateExternalMomentArm(curAngle, totalArmLength);
        return padTop + graphH - (r / maxRExt) * graphH;
      });
    } else if (sim === 'biceps_curl') {
      const m = this.models.biceps_curl;
      const lever = m.anatomy.totalForearmLever;
      const curRot = data.state.forearmRotationDeg;

      const extPoints = [];
      const bicepsPoints = [];
      const brachialisPoints = [];
      const brachioradialisPoints = [];

      for (let a = 0; a <= maxX; a += 2) {
        extPoints.push({ a, val: m.biomechanics.calculateExternalMomentArm(a, lever) });
        bicepsPoints.push({ a, val: m.biomechanics.calculateBicepsMomentArm(a, curRot) });
        brachialisPoints.push({ a, val: m.biomechanics.calculateBrachialisMomentArm(a) });
        brachioradialisPoints.push({ a, val: m.biomechanics.calculateBrachioradialisMomentArm(a, curRot) });
      }

      const maxVal = lever * 1.05;
      const muscleScale = 0.085;

      this.renderCurvePath(ctx, extPoints, maxVal, padLeft, padTop, graphW, graphH, maxX, '#38bdf8', 2);
      this.renderCurvePath(ctx, bicepsPoints, muscleScale, padLeft, padTop, graphW, graphH, maxX, '#ef4444', 1.5);
      this.renderCurvePath(ctx, brachialisPoints, muscleScale, padLeft, padTop, graphW, graphH, maxX, '#f97316', 1.5, [3, 2]);
      this.renderCurvePath(ctx, brachioradialisPoints, muscleScale, padLeft, padTop, graphW, graphH, maxX, '#ec4899', 1.5);

      const curAngle = data.state.flexionAngleDeg;
      this.drawCurveCursor(ctx, curAngle, maxX, padLeft, padTop, graphW, graphH, () => {
        const r = m.biomechanics.calculateExternalMomentArm(curAngle, lever);
        return padTop + graphH - (r / maxVal) * graphH;
      });
    } else if (sim === 'squat_lever') {
      const m = this.models.squat_lever;
      const kneePoints = [];
      const hipPoints = [];
      const ratioPoints = [];

      for (let d = 0; d <= 1.0; d += 0.02) {
        const p = m.anatomy.getPose(d, m.state.trunkLeanDeg, m.state.barPositionType, m.footBasePos, m.pixelsPerMeter);
        const an = m.biomechanics.analyze(p, m.state.loadKg, m.state.includeBodyMass, m.pixelsPerMeter);
        const dPercent = d * 100;
        kneePoints.push({ a: dPercent, val: an.momentArms.kneeExternalM });
        hipPoints.push({ a: dPercent, val: an.momentArms.hipExternalM });
        ratioPoints.push({ a: dPercent, val: Math.min(10, an.torques.hipToKneeRatio) * 0.05 });
      }

      const maxM = 0.60;
      this.renderCurvePath(ctx, kneePoints, maxM, padLeft, padTop, graphW, graphH, maxX, '#38bdf8', 2);
      this.renderCurvePath(ctx, hipPoints, maxM, padLeft, padTop, graphW, graphH, maxX, '#f59e0b', 2);
      this.renderCurvePath(ctx, ratioPoints, maxM, padLeft, padTop, graphW, graphH, maxX, '#ef4444', 1.5, [3, 2]);

      const curPercent = data.state.depthNorm * 100;
      this.drawCurveCursor(ctx, curPercent, maxX, padLeft, padTop, graphW, graphH, () => {
        const r = data.analysis.momentArms.kneeExternalM;
        return padTop + graphH - (r / maxM) * graphH;
      });
    } else if (sim === 'bench_mechanics') {
      const m = this.models.bench_mechanics;
      const shoulderPoints = [];
      const elbowPoints = [];
      const torquePoints = [];

      for (let p = 0; p <= 1.0; p += 0.02) {
        const pose = m.anatomy.getPose(p, m.state.barPathType, m.benchBasePos, m.pixelsPerMeter);
        const an = m.biomechanics.analyze(pose, m.state.loadKg, m.pixelsPerMeter);
        const pPercent = p * 100;
        shoulderPoints.push({ a: pPercent, val: an.momentArms.shoulderExternalM });
        elbowPoints.push({ a: pPercent, val: an.momentArms.elbowExternalM });
        torquePoints.push({ a: pPercent, val: an.torques.shoulderTorqueDemandNm * 0.001 });
      }

      const maxM = 0.25;
      this.renderCurvePath(ctx, shoulderPoints, maxM, padLeft, padTop, graphW, graphH, maxX, '#38bdf8', 2);
      this.renderCurvePath(ctx, elbowPoints, maxM, padLeft, padTop, graphW, graphH, maxX, '#f59e0b', 2);
      this.renderCurvePath(ctx, torquePoints, maxM, padLeft, padTop, graphW, graphH, maxX, '#ef4444', 1.5, [3, 2]);

      const curPercent = data.state.phaseNorm * 100;
      this.drawCurveCursor(ctx, curPercent, maxX, padLeft, padTop, graphW, graphH, () => {
        const r = data.analysis.momentArms.shoulderExternalM;
        return padTop + graphH - (r / maxM) * graphH;
      });
    }
  }

  drawCurveCursor(ctx, angle, maxAngle, padLeft, padTop, graphW, graphH, getY) {
    const cursorX = padLeft + (angle / maxAngle) * graphW;

    ctx.save();
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 2]);
    ctx.beginPath();
    ctx.moveTo(cursorX, padTop);
    ctx.lineTo(cursorX, padTop + graphH);
    ctx.stroke();

    const cursorY = getY();
    ctx.setLineDash([]);
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(cursorX, cursorY, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  renderCurvePath(ctx, points, maxVal, padLeft, padTop, graphW, graphH, maxAngle, color, lineWidth = 2, dash = []) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.setLineDash(dash);
    ctx.beginPath();

    points.forEach((p, idx) => {
      const gx = padLeft + (p.a / maxAngle) * graphW;
      const gy = padTop + graphH - (p.val / maxVal) * graphH;
      if (idx === 0) ctx.moveTo(gx, gy);
      else ctx.lineTo(gx, gy);
    });

    ctx.stroke();
    ctx.restore();
  }
}
