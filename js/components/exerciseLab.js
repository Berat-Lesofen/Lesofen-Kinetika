/**
 * LESOFEN KINETIKA - Hierarchical Exercise Lab Component (Egzersiz Analizi)
 * Progressive Disclosure:
 * Level 1: Egzersiz Kategorisi (Göğüs, Sırt, Omuz, Bacak, Kol)
 * Level 2: Egzersiz Seçimi ve Tutuş / Direnç Profili Mekaniği
 */

import { graph } from '../core/graph.js';
import { state } from '../core/state.js';

export class ExerciseLab {
  constructor(containerElement, onMuscleSelect) {
    this.container = containerElement;
    this.onMuscleSelect = onMuscleSelect;

    this.render = this.render.bind(this);
    state.subscribe(() => {
      if (state.getState().activeTab === "exercises") {
        this.render();
      }
    });
    this.render();
  }

  render() {
    const s = state.getState();
    const activeCat = s.selectedExerciseCategory;

    // Eğer kategori seçilmemişse kategori seçim ekranını göster
    if (!activeCat && s.exerciseFlowLevel === 1) {
      this.renderCategorySelector();
    } else {
      this.renderCategoryExercises(activeCat || "Omuz & İzolasyon");
    }
  }

  // ==========================================
  // LEVEL 1: KATEGORİ SEÇİCİ
  // ==========================================
  renderCategorySelector() {
    const categories = [
      { id: "Göğüs & İtiş", icon: "📐", name: "Göğüs & Horizontal İtiş", count: "Bench Press", desc: "Dar tutuş, normal ve geniş tutuşta dirsek açısı ve triceps/göğüs moment dağılımı" },
      { id: "Sırt & Çekiş", icon: "🦅", name: "Sırt & Dikey/Yatay Çekiş", count: "Lat Pulldown & Row", desc: "Pronated, nötr ve supinated tutuşta latissimus dorsi ve biceps kaldıraç avantajı" },
      { id: "Omuz & İzolasyon", icon: "🛡️", name: "Omuz & İzolasyon", count: "Lateral Raise", desc: "Dambıl vs kablo açısı; kol elevasyonunda external moment kolu değişimi" },
      { id: "Bacak & Kalça", icon: "🦵", name: "Bacak & Kalça (Squat & Menteşe)", count: "Squat, RDL, Hip Thrust", desc: "High-bar vs Low-bar squat; diz ve kalça moment kollarının yarışması" },
      { id: "Kol & Fleksiyon", icon: "💪", name: "Kol & Dirsek Fleksiyonu", count: "Biceps Curl", desc: "Ayakta bar vs Scott sehpa (Preacher) vs Incline dambıl curl direnç eğrileri" }
    ];

    this.container.innerHTML = `
      <div class="exercise-cat-selector max-w-4xl mx-auto p-4 md:p-6 space-y-6 animate-fadeIn">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="font-mono text-xs text-amber-400 font-bold uppercase tracking-wider">EGZERSİZ ANALİZİ</span>
            <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30">Adım 1 / 2</span>
          </div>
          <h2 class="text-2xl md:text-3xl font-black text-white tracking-tight">Hangi egzersiz grubunu analiz etmek istiyorsunuz?</h2>
          <p class="text-xs md:text-sm text-slate-400 mt-1 max-w-xl">
            Aynı harekette tutuş genişliğini 10 cm değiştirdiğinizde veya açıyı supinasyona çevirdiğinizde eklem yükleri nasıl değişir?
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          ${categories.map(c => `
            <div class="cat-card p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-900/90 transition-all duration-150 cursor-pointer group shadow-sm hover:shadow-amber-500/5 hover:-translate-y-0.5" data-cat="${c.id}">
              <div class="flex items-center justify-between mb-2">
                <span class="text-2xl">${c.icon}</span>
                <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-amber-400 border border-amber-500/20">${c.count}</span>
              </div>
              <h4 class="text-sm font-bold text-white group-hover:text-amber-300 transition mb-1">${c.name}</h4>
              <p class="text-[11px] text-slate-400 leading-snug">${c.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    this.container.querySelectorAll('.cat-card').forEach(card => {
      card.addEventListener('click', () => {
        state.selectExerciseCategory(card.dataset.cat);
      });
    });
  }

  // ==========================================
  // LEVEL 2: O KATEGORİNİN EGZERSİZLERİ & DETAYI
  // ==========================================
  renderCategoryExercises(catName) {
    const allExercises = graph.getAllExercises();
    // Kategoriye göre filtrele (veya içeriyorsa)
    let exercises = allExercises.filter(e => e.category.toLowerCase().includes(catName.toLowerCase()) || catName.toLowerCase().includes(e.category.toLowerCase()));
    if (exercises.length === 0) exercises = allExercises;

    const s = state.getState();
    const activeExercise = graph.getExercise(s.selectedExerciseId) || exercises[0] || allExercises[0];

    this.container.innerHTML = `
      <div class="exercise-detail-view max-w-5xl mx-auto p-4 md:p-6 space-y-6 animate-fadeIn">
        <!-- Başlık & Geri Dönüş -->
        <div class="border-b border-slate-800 pb-4">
          <div class="flex items-center justify-between mb-2">
            <button id="btnBackToCats" class="text-xs font-mono text-slate-400 hover:text-amber-400 transition flex items-center gap-1">
              ← Tüm Egzersiz Gruplarına Dön
            </button>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
              ${activeExercise.category}
            </span>
          </div>
          <h2 class="text-2xl md:text-3xl font-black text-white tracking-tight">${activeExercise.name}</h2>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- Sol Liste (Kategori Egzersizleri) -->
          <div class="lg:col-span-4 space-y-2">
            ${exercises.map(ex => `
              <div class="exercise-item-card p-3 rounded-xl border transition cursor-pointer ${
                ex.id === activeExercise.id 
                  ? 'bg-amber-500/15 border-amber-500/60 shadow-lg shadow-amber-500/10' 
                  : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900 hover:border-slate-700'
              }" data-id="${ex.id}" data-name="${ex.name}">
                <span class="text-[9px] font-mono text-amber-400/80 block uppercase">${ex.category}</span>
                <h4 class="font-bold text-xs ${ex.id === activeExercise.id ? 'text-amber-300' : 'text-white'}">${ex.name}</h4>
              </div>
            `).join('')}
          </div>

          <!-- Sağ Panel: Detaylı Biyomekanik Analiz -->
          <div class="lg:col-span-8 bg-slate-950 border border-slate-800/90 rounded-2xl p-5 shadow-2xl space-y-5">
            <!-- Direnç Profili ve Tepe Tork Noktası -->
            <div class="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div class="flex items-center justify-between">
                <span class="font-mono text-xs text-amber-400 font-bold uppercase">Direnç Profili & Tepe Tork:</span>
                <span class="text-[10px] font-mono text-slate-400">${activeExercise.resistanceProfile.type}</span>
              </div>
              <p class="text-xs text-slate-300 leading-relaxed">${activeExercise.resistanceProfile.feelExplanation}</p>
            </div>

            <!-- Tutuş & Teknik Varyasyonları -->
            <div class="space-y-3">
              <h4 class="font-mono text-xs text-cyan-400 font-bold uppercase tracking-wider">
                Tutuş & Duruş Değişkenleri
              </h4>
              <div class="space-y-2.5">
                ${activeExercise.variations.map(v => `
                  <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800/90 space-y-1">
                    <div class="flex items-center justify-between">
                      <span class="font-bold text-xs text-white">${v.name}</span>
                      <span class="text-[10px] font-mono text-amber-300 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                        ${v.primaryStress}
                      </span>
                    </div>
                    <p class="text-xs text-slate-300 leading-relaxed">${v.mechanics}</p>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Hedef Kaslar (Tıklanabilir) -->
            <div>
              <h4 class="font-mono text-xs text-emerald-400 font-bold uppercase tracking-wider mb-2">
                Primer Hedef Kaslar
              </h4>
              <div class="flex flex-wrap gap-2">
                ${activeExercise.targetMuscles.primeMovers.map(mId => {
                  const m = graph.getMuscle(mId);
                  return `
                    <button class="ex-muscle-jump px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 text-xs font-mono text-emerald-300 transition flex items-center gap-1.5" data-id="${mId}">
                      <span>⚡</span>
                      <span>${m ? m.name : mId}</span>
                      <span class="text-[10px] text-emerald-500">→</span>
                    </button>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Biyomekanik CTA -->
            <button id="btnExToBioLab" class="w-full p-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold flex items-center justify-center gap-2 transition">
              <span>⚡ Bu Egzersizin Fizik & Kaldıraç Simülasyonuna Git</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    `;

    // Event Listeners
    const backBtn = this.container.querySelector('#btnBackToCats');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        state.openExercises();
      });
    }

    this.container.querySelectorAll('.exercise-item-card').forEach(card => {
      card.addEventListener('click', () => {
        state.selectExercise(card.dataset.id, card.dataset.name);
      });
    });

    this.container.querySelectorAll('.ex-muscle-jump').forEach(btn => {
      btn.addEventListener('click', () => {
        state.selectMuscle(btn.dataset.id);
      });
    });

    const bioBtn = this.container.querySelector('#btnExToBioLab');
    if (bioBtn) {
      bioBtn.addEventListener('click', () => {
        let sim = "lateral_raise";
        if (activeExercise.id.includes('curl') || activeExercise.id.includes('pulldown')) {
          sim = "biceps_curl";
        } else if (activeExercise.id.includes('squat') || activeExercise.id.includes('deadlift') || activeExercise.id.includes('thrust')) {
          sim = "squat_lever";
        } else if (activeExercise.id.includes('bench')) {
          sim = "bench_mechanics";
        } else {
          sim = "lateral_raise";
        }
        state.openBioLab(sim, `${activeExercise.name} Mekaniği`);
      });
    }
  }
}
