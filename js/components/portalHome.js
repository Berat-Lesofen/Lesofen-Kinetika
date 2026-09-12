/**
 * LESOFEN KINETIKA - Portal Home Component (Level 1 Giriş Kapısı)
 * Kullanıcıyı bilgiyle boğmayan, 6 ana kapıdan oluşan sade karşılama alanı
 */

import { state } from '../core/state.js';
import { graph } from '../core/graph.js';

export class PortalHome {
  constructor(containerElement) {
    this.container = containerElement;
    this.render();
  }

  render() {
    const totalRegions = graph.getTotalRegionsCount();
    const totalMuscles = graph.getAllMuscles().length;
    const totalMovements = graph.getAllMovements().length;
    const totalExercises = graph.getAllExercises().length;
    const totalInsights = graph.getAllInsights().length;

    this.container.innerHTML = `
      <div class="portal-home max-w-5xl mx-auto px-4 py-8 md:py-12 animate-fadeIn">
        <!-- Hero Karşılama Başlığı -->
        <div class="text-center max-w-2xl mx-auto mb-10 md:mb-12">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-4">
            <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            İnteraktif Hareket & Biyomekanik Laboratuvarı
          </div>
          <h1 class="text-3xl md:text-5xl font-black text-white tracking-tight mb-3">
            Ne öğrenmek istiyorsun?
          </h1>
          <p class="text-sm md:text-base text-slate-400 leading-relaxed font-sans">
            İnsan hareketini, kas fonksiyonunu ve kaldıraç fiziğini adım adım keşfedin. 
            Aşağıdan bir başlangıç noktası seçin.
          </p>
        </div>

        <!-- 6 Ana Giriş Kapısı Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          <!-- 1. KAS SİSTEMİ -->
          <div class="portal-card p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900/90 transition-all duration-200 cursor-pointer flex flex-col justify-between group shadow-lg hover:shadow-cyan-500/5 hover:-translate-y-1" data-target="anatomy">
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-lg">
                  💪
                </div>
                <span class="font-mono text-[10px] text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">${totalRegions} Bölge · ${totalMuscles} Kas</span>
              </div>
              <h3 class="text-lg font-bold text-white group-hover:text-cyan-300 transition mb-2">Kas Sistemi</h3>
              <p class="text-xs text-slate-400 leading-relaxed mb-4">
                Üst gövde, gövde ve alt gövde kas gruplarını, yapışma noktalarını (orijin/insersiyo) ve innervasyonu keşfedin.
              </p>
            </div>
            <div class="flex items-center text-xs font-mono font-bold text-cyan-400 pt-3 border-t border-slate-800/80 group-hover:translate-x-1 transition">
              Kasları Keşfet →
            </div>
          </div>

          <!-- 2. HAREKET ATLASI -->
          <div class="portal-card p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/90 transition-all duration-200 cursor-pointer flex flex-col justify-between group shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1" data-target="movements">
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-lg">
                  🔄
                </div>
                <span class="font-mono text-[10px] text-indigo-400 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">${totalMovements} Hareket · Eksenler</span>
              </div>
              <h3 class="text-lg font-bold text-white group-hover:text-indigo-300 transition mb-2">Hareket Atlası</h3>
              <p class="text-xs text-slate-400 leading-relaxed mb-4">
                Omuz, dirsek veya kalça hareketlerinin hangi düzlemde gerçekleştiğini, agonist ve antagonist kas zincirlerini inceleyin.
              </p>
            </div>
            <div class="flex items-center text-xs font-mono font-bold text-indigo-400 pt-3 border-t border-slate-800/80 group-hover:translate-x-1 transition">
              Hareketleri İncele →
            </div>
          </div>

          <!-- 3. BİYOMEKANİK LABORATUVARI -->
          <div class="portal-card p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-900/90 transition-all duration-200 cursor-pointer flex flex-col justify-between group shadow-lg hover:shadow-amber-500/5 hover:-translate-y-1" data-target="biolab">
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 text-lg">
                  ⚡
                </div>
                <span class="font-mono text-[10px] text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">Fizik & Tork Motoru</span>
              </div>
              <h3 class="text-lg font-bold text-white group-hover:text-amber-300 transition mb-2">Biyomekanik Laboratuvarı</h3>
              <p class="text-xs text-slate-400 leading-relaxed mb-4">
                Kaldıraçlar, moment kolları ve eklem açısına bağlı tork değişiminin interaktif fizik modellerini deneyimleyin.
              </p>
            </div>
            <div class="flex items-center text-xs font-mono font-bold text-amber-400 pt-3 border-t border-slate-800/80 group-hover:translate-x-1 transition">
              Laboratuvara Gir →
            </div>
          </div>

          <!-- 4. EGZERSİZ ANALİZİ -->
          <div class="portal-card p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900/90 transition-all duration-200 cursor-pointer flex flex-col justify-between group shadow-lg hover:shadow-emerald-500/5 hover:-translate-y-1" data-target="exercises">
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-lg">
                  🏋️
                </div>
                <span class="font-mono text-[10px] text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">${totalExercises} Temel Egzersiz</span>
              </div>
              <h3 class="text-lg font-bold text-white group-hover:text-emerald-300 transition mb-2">Egzersiz Analizi</h3>
              <p class="text-xs text-slate-400 leading-relaxed mb-4">
                Bench Press, Squat, Lateral Raise ve Lat Pulldown'da tutuş ve duruş varyasyonlarının kaslara binen yükü nasıl değiştirdiğini görün.
              </p>
            </div>
            <div class="flex items-center text-xs font-mono font-bold text-emerald-400 pt-3 border-t border-slate-800/80 group-hover:translate-x-1 transition">
              Egzersizleri Analiz Et →
            </div>
          </div>

          <!-- 5. NEDEN HİSSEDİYORUM? -->
          <div class="portal-card p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-rose-500/50 hover:bg-slate-900/90 transition-all duration-200 cursor-pointer flex flex-col justify-between group shadow-lg hover:shadow-rose-500/5 hover:-translate-y-1" data-target="insights">
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 text-lg">
                  💡
                </div>
                <span class="font-mono text-[10px] text-rose-400 px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">${totalInsights} Mekanik Çözüm</span>
              </div>
              <h3 class="text-lg font-bold text-white group-hover:text-rose-300 transition mb-2">Neden Hissediyorum?</h3>
              <p class="text-xs text-slate-400 leading-relaxed mb-4">
                "Lateral raise'de neden trapezim yanıyor?", "Squat'ta hamstring neden pasif kalır?" gibi soruların kineziyolojik yanıtları.
              </p>
            </div>
            <div class="flex items-center text-xs font-mono font-bold text-rose-400 pt-3 border-t border-slate-800/80 group-hover:translate-x-1 transition">
              İpuçlarını Oku →
            </div>
          </div>

          <!-- 6. ANTRENMAN AJANDASI (KİŞİSEL PLANLAMA ARACI) -->
          <div class="portal-card p-6 rounded-2xl bg-gradient-to-br from-purple-950/30 via-slate-900/80 to-slate-900/90 border border-purple-500/40 hover:border-purple-400 hover:shadow-purple-500/15 transition-all duration-200 cursor-pointer flex flex-col justify-between group shadow-lg hover:-translate-y-1 relative overflow-hidden" data-target="agenda">
            <div class="absolute -right-6 -top-6 w-20 h-20 bg-purple-500/10 rounded-full blur-xl pointer-events-none"></div>
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 text-lg shadow-inner">
                  📅
                </div>
                <span class="font-mono text-[9px] text-purple-300 px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 tracking-wider uppercase font-bold">
                  🛠️ Kişisel Planlama Aracı
                </span>
              </div>
              <h3 class="text-lg font-bold text-white group-hover:text-purple-300 transition mb-2 flex items-center gap-2">
                Antrenman Ajandası
              </h3>
              <p class="text-xs text-slate-300/90 leading-relaxed mb-4">
                Hangi gün hangi split'i yaptığınızı sürükle-bırak veya dokunarak takip edin. Set, kalori veya şifre kalabalığı içermez.
              </p>
            </div>
            <div class="flex items-center text-xs font-mono font-bold text-purple-400 pt-3 border-t border-purple-500/30 group-hover:translate-x-1 transition">
              Ajandayı Başlat (Kişisel Araç) →
            </div>
          </div>
        </div>

        <!-- Hızlı Arama İpucu -->
        <div class="mt-10 p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 max-w-xl mx-auto flex items-center justify-between text-xs font-mono text-slate-400">
          <div class="flex items-center gap-2">
            <span class="text-cyan-400">🔍</span>
            <span>Spesifik bir kas veya hareket mi arıyorsunuz?</span>
          </div>
          <button id="portalSearchTrigger" class="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white transition font-bold">
            ⌘K ile Ara
          </button>
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  attachEventListeners() {
    this.container.querySelectorAll('.portal-card').forEach(card => {
      card.addEventListener('click', () => {
        const target = card.dataset.target;
        if (target === 'anatomy') {
          state.openMuscles();
        } else if (target === 'movements') {
          state.openMovements();
        } else if (target === 'biolab') {
          state.openBioLab();
        } else if (target === 'exercises') {
          state.openExercises();
        } else if (target === 'insights') {
          state.openInsights();
        } else if (target === 'agenda') {
          state.openAgenda();
        }
      });
    });

    const searchBtn = this.container.querySelector('#portalSearchTrigger');
    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        const modal = document.getElementById('globalSearchModal');
        if (modal) {
          modal.classList.remove('hidden');
          const input = modal.querySelector('#modalSearchInput');
          if (input) input.focus();
        }
      });
    }
  }
}
