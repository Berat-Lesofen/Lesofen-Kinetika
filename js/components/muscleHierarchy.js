/**
 * LESOFEN KINETIKA - Hierarchical Muscle System Component (Kas Sistemi)
 * Progressive Disclosure:
 * Level 1: Bölge Seçimi (Üst Gövde / Gövde / Alt Gövde)
 * Level 2: Bölge Hub'ı (Kaslar / Hareketler / Egzersizler)
 * Level 3: Kas Künyesi (Sade Anatomi & Fonksiyon + İleri Biyomekanik CTA)
 */

import { graph } from '../core/graph.js';
import { state } from '../core/state.js';

export class MuscleHierarchy {
  constructor(containerElement) {
    this.container = containerElement;
    this.render = this.render.bind(this);
    state.subscribe(() => {
      if (state.getState().activeTab === "anatomy") {
        this.render();
      }
    });
    this.render();
  }

  render() {
    const s = state.getState();
    const flowLevel = s.muscleFlowLevel || 1;

    if (flowLevel === 1 || !s.selectedRegion) {
      this.renderLevel1Regions();
    } else if (flowLevel === 2) {
      this.renderLevel2RegionHub(s.selectedRegion);
    } else if (flowLevel === 3 && s.selectedMuscleId) {
      this.renderLevel3MuscleDetail(s.selectedMuscleId);
    } else {
      this.renderLevel1Regions();
    }
  }

  // ==========================================
  // LEVEL 1: BÖLGE SEÇİMİ (Üst / Gövde / Alt)
  // ==========================================
  renderLevel1Regions() {
    const regionalGroups = graph.getRegionalGroups();

    this.container.innerHTML = `
      <div class="muscle-hierarchy-level1 max-w-4xl mx-auto p-4 md:p-6 space-y-8 animate-fadeIn">
        <!-- Başlık -->
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xs text-cyan-400 font-bold uppercase tracking-wider">KAS SİSTEMİ</span>
            <span class="text-slate-600">·</span>
            <span class="text-xs text-slate-400">Bölge Seçimi</span>
          </div>
          <h2 class="text-2xl md:text-3xl font-black text-white tracking-tight">Hangi bölgeyi incelemek istiyorsunuz?</h2>
          <p class="text-xs md:text-sm text-slate-400 mt-1 max-w-xl">
            Aşağıdan bir anatomik bölge seçin. O bölgeye ait kasları, hareketleri ve biyomekanik bağlantıları adım adım keşfedin.
          </p>
        </div>

        <!-- 3 Bölge Grubu -->
        <div class="space-y-6">
          ${regionalGroups.map(group => `
            <div class="space-y-3">
              <h3 class="text-xs font-semibold text-slate-400 tracking-wider flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                ${group.title}
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                ${group.regions.map(r => `
                  <div class="region-card p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900/90 transition-all duration-150 cursor-pointer group shadow-sm hover:shadow-cyan-500/5 hover:-translate-y-0.5" data-region="${r.id}">
                    <div class="flex items-center justify-between mb-2">
                      <h4 class="text-sm font-bold text-white group-hover:text-cyan-300 transition">${r.name}</h4>
                      <span class="text-[11px] text-slate-500">${r.count} Kas</span>
                    </div>
                    <p class="text-[11px] text-slate-400 leading-snug">${r.desc}</p>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // Bölge kartı dinleyicileri
    this.container.querySelectorAll('.region-card').forEach(card => {
      card.addEventListener('click', () => {
        const regionId = card.dataset.region;
        state.selectMuscleRegion(regionId);
      });
    });
  }

  // ==========================================
  // LEVEL 2: BÖLGE HUB'I (Örn: Omuz)
  // ==========================================
  renderLevel2RegionHub(regionName) {
    const regionMuscles = graph.getMusclesForRegion(regionName);

    // Bölgeye ait hareketleri ve egzersizleri bul
    const muscleIds = new Set(regionMuscles.map(m => m.id));
    const allMovements = graph.getAllMovements();
    const relatedMovements = allMovements.filter(mov => {
      const p = mov.primeMovers || [];
      const s = mov.synergists || [];
      return p.some(id => muscleIds.has(id)) || s.some(id => muscleIds.has(id));
    });

    const allExercises = graph.getAllExercises();
    const relatedExercises = allExercises.filter(ex => {
      const p = ex.targetMuscles?.primary || [];
      const s = ex.targetMuscles?.secondary || [];
      return p.some(id => muscleIds.has(id)) || s.some(id => muscleIds.has(id));
    });

    this.container.innerHTML = `
      <div class="muscle-hierarchy-level2 max-w-4xl mx-auto p-4 md:p-6 space-y-6 animate-fadeIn">
        <!-- Üst Başlık & Geri Dönüş -->
        <div class="border-b border-slate-800 pb-4">
          <div class="flex items-center justify-between mb-2">
            <button id="btnBackToRegions" class="text-xs font-medium text-slate-400 hover:text-cyan-400 transition flex items-center gap-1">
              ← Tüm Bölgelere Dön
            </button>
            <span class="text-xs text-slate-400">
              ${regionName} Bölgesi · ${regionMuscles.length} Kas
            </span>
          </div>
          <h2 class="text-2xl md:text-3xl font-black text-white tracking-tight">${regionName} Bölgesi</h2>
          <p class="text-xs md:text-sm text-slate-400 mt-1">
            İncelemek istediğiniz kası seçin veya bu bölgenin temel hareket ve egzersiz haritasına göz atın.
          </p>
        </div>

        <!-- 1. KASLAR BÖLÜMÜ -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              Bu Bölgedeki Kaslar (${regionMuscles.length})
            </h3>
            <span class="text-[10px] font-mono text-slate-500">Detay için kasa tıklayın</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            ${regionMuscles.map(m => {
              const isDeep = m.depthLayer === 'deep';
              return `
                <div class="muscle-card p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/60 hover:bg-slate-900 transition-all cursor-pointer flex flex-col justify-between group" data-id="${m.id}" data-name="${m.name}">
                  <div>
                    <div class="flex items-center justify-between mb-1.5">
                      <span class="text-[10px] font-mono px-2 py-0.5 rounded border ${
                        isDeep ? 'border-purple-500/40 text-purple-300 bg-purple-500/10' : 'border-cyan-500/40 text-cyan-300 bg-cyan-500/10'
                      }">
                        ${isDeep ? 'Derin Katman' : 'Yüzeyel Katman'}
                      </span>
                      <span class="text-[10px] font-mono text-slate-500">${m.actions?.length || 0} Eylem</span>
                    </div>
                    <h4 class="text-sm font-bold text-white group-hover:text-cyan-300 transition mb-0.5">${m.name}</h4>
                    <p class="text-[11px] font-serif italic text-slate-400 mb-2">${m.latinName}</p>
                    <p class="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      ${m.actions[0]?.description || m.biomechanics.momentArmType}
                    </p>
                  </div>
                  <div class="pt-2.5 mt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-cyan-400 font-bold group-hover:translate-x-1 transition">
                    <span>Künyeyi İncele</span>
                    <span>→</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- 2. HAREKETLER & EGZERSİZLER (HIZLI GEÇİŞ ÇEKMECESİ) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800/80">
          <!-- İlgili Hareketler -->
          <div class="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2.5">
            <h4 class="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>🔄</span> Bu Bölgenin Hareketleri (${relatedMovements.length})
            </h4>
            <div class="space-y-1.5">
              ${relatedMovements.slice(0, 4).map(mov => `
                <div class="hub-jump-mov p-2 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-indigo-500/40 transition cursor-pointer flex items-center justify-between text-xs" data-id="${mov.id}">
                  <span class="text-slate-200">${mov.name}</span>
                  <span class="text-[10px] font-mono text-indigo-400">Atlasa Git →</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- İlgili Egzersizler -->
          <div class="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2.5">
            <h4 class="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>🏋️</span> Bu Bölgenin Egzersizleri (${relatedExercises.length})
            </h4>
            <div class="space-y-1.5">
              ${relatedExercises.slice(0, 4).map(ex => `
                <div class="hub-jump-ex p-2 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-amber-500/40 transition cursor-pointer flex items-center justify-between text-xs" data-id="${ex.id}">
                  <span class="text-slate-200">${ex.name}</span>
                  <span class="text-[10px] font-mono text-amber-400">Analize Git →</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    // Event Listeners
    const backBtn = this.container.querySelector('#btnBackToRegions');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        state.openMuscles();
      });
    }

    this.container.querySelectorAll('.muscle-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        const name = card.dataset.name;
        state.selectMuscle(id, name);
      });
    });

    this.container.querySelectorAll('.hub-jump-mov').forEach(card => {
      card.addEventListener('click', () => {
        state.selectMovement(card.dataset.id);
      });
    });

    this.container.querySelectorAll('.hub-jump-ex').forEach(card => {
      card.addEventListener('click', () => {
        state.selectExercise(card.dataset.id);
      });
    });
  }

  // ==========================================
  // LEVEL 3: KAS KÜNYESİ & İLERİ DERİNLİK (Örn: Lateral Deltoid)
  // ==========================================
  renderLevel3MuscleDetail(muscleId) {
    const muscle = graph.getMuscle(muscleId);
    if (!muscle) {
      this.renderLevel1Regions();
      return;
    }

    const movements = graph.getMovementsForMuscle(muscle.id);
    const exercises = graph.getExercisesForMuscle(muscle.id);
    const isDeep = muscle.depthLayer === 'deep';

    const regionalGroups = graph.getRegionalGroups();
    let parentRegion = muscle.category;
    for (const g of regionalGroups) {
      const reg = g.regions.find(r => r.categories?.includes(muscle.category) || r.id === muscle.category || r.name === muscle.category);
      if (reg) {
        parentRegion = reg.id;
        break;
      }
    }

    this.container.innerHTML = `
      <div class="muscle-hierarchy-level3 max-w-4xl mx-auto p-4 md:p-6 space-y-6 animate-fadeIn">
        <!-- Geri Butonu & Başlık -->
        <div class="border-b border-slate-800 pb-4">
          <div class="flex items-center justify-between mb-2">
            <button id="btnBackToHub" class="text-xs font-mono text-slate-400 hover:text-cyan-400 transition flex items-center gap-1">
              ← ${parentRegion} Bölgesine Dön
            </button>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded border ${
              isDeep ? 'border-purple-500/40 text-purple-300 bg-purple-500/10' : 'border-cyan-500/40 text-cyan-300 bg-cyan-500/10'
            }">
              ${isDeep ? 'Derin Katman (İç Doku)' : 'Yüzeyel Katman'}
            </span>
          </div>

          <h2 class="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <span class="w-3 h-3 rounded-full shrink-0" style="background-color: ${muscle.color || '#00f2fe'};"></span>
            ${muscle.name}
          </h2>
          <p class="text-sm font-serif italic text-slate-400 mt-0.5">${muscle.latinName}</p>
        </div>

        <!-- 1. ANATOMİK KÜNYE (SADE & NET) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Yapışma Noktaları -->
          <div class="p-4 rounded-xl bg-slate-900/70 border border-slate-800/90 space-y-3">
            <h3 class="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>🦴</span> Anatomik Yapışma Noktaları
            </h3>
            <div class="space-y-2 text-xs">
              <div>
                <span class="font-mono text-slate-400 block text-[10px] uppercase">Orijin (Başlangıç):</span>
                <span class="text-slate-200 leading-snug">${muscle.attachments.origin}</span>
              </div>
              <div class="pt-2 border-t border-slate-800/80">
                <span class="font-mono text-slate-400 block text-[10px] uppercase">İnsersiyo (Sonlanış):</span>
                <span class="text-slate-200 leading-snug">${muscle.attachments.insertion}</span>
              </div>
            </div>
          </div>

          <!-- İnnervasyon & Sinir -->
          <div class="p-4 rounded-xl bg-slate-900/70 border border-slate-800/90 space-y-3">
            <h3 class="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>⚡</span> Nöromüsküler İnnervasyon
            </h3>
            <div class="space-y-2 text-xs">
              <div>
                <span class="font-mono text-slate-400 block text-[10px] uppercase">Ana Sinir:</span>
                <span class="text-slate-200 font-bold text-sm">${muscle.innervation.nerve}</span>
              </div>
              <div class="pt-2 border-t border-slate-800/80">
                <span class="font-mono text-slate-400 block text-[10px] uppercase">Omurilik Kökleri:</span>
                <span class="text-amber-400 font-mono font-bold">${muscle.innervation.roots}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. TEMEL FONKSİYONLAR & HAREKETLER -->
        <div class="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h3 class="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <span>🔄</span> Temel Fonksiyon & Rol Dağılımı
          </h3>
          <div class="space-y-2">
            ${movements.map(m => {
              const d = m.movementDetails;
              return `
                <div class="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div class="flex items-center gap-2 mb-1">
                      <span class="font-bold text-xs text-white">${d.name || m.movement}</span>
                      <span class="text-[9px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                        m.role === 'prime_mover' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-300'
                      }">
                        ${m.role === 'prime_mover' ? 'Primer Motor' : 'Sinerjist'}
                      </span>
                    </div>
                    <p class="text-xs text-slate-300 leading-relaxed">${m.description}</p>
                  </div>
                  <button class="jump-mov-btn px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-mono text-cyan-400 shrink-0 self-start sm:self-center transition" data-id="${m.movement}">
                    Hareketi Gör →
                  </button>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- 3. İLERİ DERİNLİK BUTONLARI (PROGRESSIVE CALL TO ACTIONS) -->
        <div class="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950 border border-cyan-500/30 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-mono text-cyan-400 uppercase font-bold tracking-wider">İleri Düzey İnceleme</span>
            <span class="text-[10px] font-mono text-slate-400">Merak ediyorsanız derinleşin</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <!-- Biyomekanik Simülatörü Aç -->
            <button id="ctaOpenBiolab" class="p-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-left transition group">
              <span class="block text-[10px] font-mono text-amber-400 uppercase font-bold mb-1">⚡ Biyomekanik</span>
              <span class="text-xs font-bold text-white group-hover:text-amber-300 block mb-1">Moment & Açı Simülatörü</span>
              <span class="text-[10px] text-slate-400">Kaldıraç açısı ve tork değişimi →</span>
            </button>

            <!-- Egzersiz Analizi -->
            <button id="ctaOpenExercise" class="p-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 text-left transition group">
              <span class="block text-[10px] font-mono text-cyan-400 uppercase font-bold mb-1">🏋️ Egzersiz</span>
              <span class="text-xs font-bold text-white group-hover:text-cyan-300 block mb-1">Kaldırış & Varyasyon</span>
              <span class="text-[10px] text-slate-400">${exercises[0]?.name || 'İlgili Egzersizler'} →</span>
            </button>

            <!-- Hareket Atlası -->
            <button id="ctaOpenMovement" class="p-3 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/40 text-left transition group">
              <span class="block text-[10px] font-mono text-indigo-400 uppercase font-bold mb-1">🔄 Hareket</span>
              <span class="text-xs font-bold text-white group-hover:text-indigo-300 block mb-1">Kinematik Eksen</span>
              <span class="text-[10px] text-slate-400">Antagonist & sinerji zinciri →</span>
            </button>
          </div>
        </div>
      </div>
    `;

    // Event Listeners
    const backBtn = this.container.querySelector('#btnBackToHub');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        state.selectMuscleRegion(parentRegion);
      });
    }

    this.container.querySelectorAll('.jump-mov-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.selectMovement(btn.dataset.id);
      });
    });

    // CTA Butonları
    const ctaBio = this.container.querySelector('#ctaOpenBiolab');
    if (ctaBio) {
      ctaBio.addEventListener('click', () => {
        // İlgili simülasyonu seç
        let sim = "lateral_raise";
        if (muscle.id.includes('biceps') || muscle.id.includes('brachialis') || muscle.id.includes('forearm')) {
          sim = "biceps_curl";
        } else if (muscle.id.includes('quadriceps') || muscle.id.includes('gluteus') || muscle.id.includes('hamstring') || muscle.id.includes('calves') || muscle.id.includes('gastrocnemius') || muscle.id.includes('soleus') || muscle.id.includes('tibialis') || muscle.id.includes('erector')) {
          sim = "squat_lever";
        } else if (muscle.id.includes('pectoralis') || muscle.id.includes('triceps')) {
          sim = "bench_mechanics";
        } else {
          sim = "lateral_raise";
        }
        state.openBioLab(sim, `${muscle.name} Mekaniği`);
      });
    }

    const ctaEx = this.container.querySelector('#ctaOpenExercise');
    if (ctaEx) {
      ctaEx.addEventListener('click', () => {
        if (exercises.length > 0) {
          state.selectExercise(exercises[0].id, exercises[0].name);
        } else {
          state.openExercises();
        }
      });
    }

    const ctaMov = this.container.querySelector('#ctaOpenMovement');
    if (ctaMov) {
      ctaMov.addEventListener('click', () => {
        if (movements.length > 0) {
          state.selectMovement(movements[0].movement);
        } else {
          state.openMovements();
        }
      });
    }
  }
}
