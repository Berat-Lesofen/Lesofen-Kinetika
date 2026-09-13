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
          <div class="text-xs text-slate-500 font-medium tracking-wider uppercase mb-3">
            Hareket · Fonksiyonel Anatomi · Biyomekanik
          </div>
          <h1 class="font-display font-hero-display text-[1.95rem] sm:text-5xl md:text-6xl lg:text-[4.15rem] text-[#f5f5f4] font-normal tracking-tight leading-[1.08] sm:leading-[1.12] mb-4">
            <span class="block">Vücut hareket ederken</span>
            <span class="block">içeride ne oluyor?</span>
          </h1>
          <p class="text-sm md:text-base text-slate-400 leading-relaxed font-sans max-w-xl mx-auto">
            Kas nasıl çalışıyor? Bir ağırlık neden belirli açılarda daha zor hissettirir? Kuvvet nereye biniyor? 
            Anatomiyi ve mekaniği kalıplara boğulmadan kurcalamak için bir dijital çalışma alanı.
          </p>
        </div>

        <!-- 6 Ana Giriş Kapısı Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          <!-- 1. KAS SİSTEMİ -->
          <div class="portal-card p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/90 transition-all duration-200 cursor-pointer flex flex-col justify-between group shadow-lg hover:-translate-y-0.5" data-target="anatomy">
            <div>
              <div class="flex items-center justify-between mb-3 text-xs text-slate-500">
                <span>01 · Anatomi & Kas Grupları</span>
                <span>${totalRegions} bölge · ${totalMuscles} kas</span>
              </div>
              <h3 class="font-serif text-xl font-bold text-amber-400 group-hover:text-amber-300 transition mb-2">Kas Sistemi</h3>
              <p class="text-xs text-slate-400 leading-relaxed mb-4">
                Hangi kas nereye bağlanıyor? Orijin, insersiyo ve innervasyon bağlantılarını katman katman aç.
              </p>
            </div>
            <div class="flex items-center text-xs font-medium text-slate-400 group-hover:text-amber-300 pt-3 border-t border-slate-800/80 transition">
              <span>Kasları İncele</span>
              <span class="inline-block group-hover:translate-x-1 transition-transform ml-1">→</span>
            </div>
          </div>

          <!-- 2. HAREKET ATLASI -->
          <div class="portal-card p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/90 transition-all duration-200 cursor-pointer flex flex-col justify-between group shadow-lg hover:-translate-y-0.5" data-target="movements">
            <div>
              <div class="flex items-center justify-between mb-3 text-xs text-slate-500">
                <span>02 · Eklemler & Düzlemler</span>
                <span>${totalMovements} hareket</span>
              </div>
              <h3 class="font-serif text-xl font-bold text-cyan-400 group-hover:text-cyan-300 transition mb-2">Hareket Atlası</h3>
              <p class="text-xs text-slate-400 leading-relaxed mb-4">
                Bir eklem hangi düzlemde dönüyor; hangi kaslar birlikte çekip hangileri frenliyor?
              </p>
            </div>
            <div class="flex items-center text-xs font-medium text-slate-400 group-hover:text-cyan-300 pt-3 border-t border-slate-800/80 transition">
              <span>Hareketleri İncele</span>
              <span class="inline-block group-hover:translate-x-1 transition-transform ml-1">→</span>
            </div>
          </div>

          <!-- 3. BİYOMEKANİK LABORATUVARI (ÖNE ÇIKAN SİMÜLASYON KARTI) -->
          <div class="portal-card p-6 rounded-2xl bg-slate-900/80 border border-amber-500/30 hover:border-amber-400/60 hover:bg-slate-900 transition-all duration-200 cursor-pointer flex flex-col justify-between group shadow-lg shadow-amber-500/5 hover:-translate-y-0.5" data-target="biolab">
            <div>
              <div class="flex items-center justify-between mb-3 text-xs text-amber-400/90 font-medium">
                <span>03 · İnteraktif Simülasyon</span>
                <span>4 Dinamik Model</span>
              </div>
              <h3 class="font-serif text-xl font-bold text-amber-400 group-hover:text-amber-300 transition mb-2">Biyomekanik Laboratuvarı</h3>
              <p class="text-xs text-slate-300 leading-relaxed mb-4">
                Kaldıraçlar, moment kolları ve eklem torkları. Açı değiştikçe kasın üstüne binen gerçek yükü interaktif modelle gör.
              </p>
            </div>
            <div class="flex items-center text-xs font-medium text-amber-400 group-hover:text-amber-300 pt-3 border-t border-amber-500/20 transition">
              <span>Laboratuvara Gir</span>
              <span class="inline-block group-hover:translate-x-1 transition-transform ml-1">→</span>
            </div>
          </div>

          <!-- 4. EGZERSİZ ANALİZİ -->
          <div class="portal-card p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/90 transition-all duration-200 cursor-pointer flex flex-col justify-between group shadow-lg hover:-translate-y-0.5" data-target="exercises">
            <div>
              <div class="flex items-center justify-between mb-3 text-xs text-slate-500">
                <span>04 · Direnç & Varyasyonlar</span>
                <span>${totalExercises} temel egzersiz</span>
              </div>
              <h3 class="font-serif text-xl font-bold text-emerald-400 group-hover:text-emerald-300 transition mb-2">Egzersiz Analizi</h3>
              <p class="text-xs text-slate-400 leading-relaxed mb-4">
                Tutuşu veya duruş açısını değiştirdiğinde yük nereye kayıyor? Temel hareketlerin kaldıraç anatomisi.
              </p>
            </div>
            <div class="flex items-center text-xs font-medium text-slate-400 group-hover:text-emerald-300 pt-3 border-t border-slate-800/80 transition">
              <span>Analizleri Gör</span>
              <span class="inline-block group-hover:translate-x-1 transition-transform ml-1">→</span>
            </div>
          </div>

          <!-- 5. NEDEN HİSSEDİYORUM? -->
          <div class="portal-card p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/90 transition-all duration-200 cursor-pointer flex flex-col justify-between group shadow-lg hover:-translate-y-0.5" data-target="insights">
            <div>
              <div class="flex items-center justify-between mb-3 text-xs text-slate-500">
                <span>05 · Kineziyolojik Yanıtlar</span>
                <span>${totalInsights} vaka analizi</span>
              </div>
              <h3 class="font-serif text-xl font-bold text-rose-400 group-hover:text-rose-300 transition mb-2">Neden Hissediyorum?</h3>
              <p class="text-xs text-slate-400 leading-relaxed mb-4">
                Lateral raise'de neden trapez yanar? Squat'ta hamstring niye sessiz kalır? Sık karşılaşılan hislerin kineziyolojik nedenleri.
              </p>
            </div>
            <div class="flex items-center text-xs font-medium text-slate-400 group-hover:text-rose-300 pt-3 border-t border-slate-800/80 transition">
              <span>İpuçlarını Oku</span>
              <span class="inline-block group-hover:translate-x-1 transition-transform ml-1">→</span>
            </div>
          </div>

          <!-- 6. ANTRENMAN AJANDASI -->
          <div class="portal-card p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/90 transition-all duration-200 cursor-pointer flex flex-col justify-between group shadow-lg hover:-translate-y-0.5" data-target="agenda">
            <div>
              <div class="flex items-center justify-between mb-3 text-xs text-slate-500">
                <span>06 · Kişisel Takip</span>
                <span>Haftalık / Aylık Plan</span>
              </div>
              <h3 class="font-serif text-xl font-bold text-violet-400 group-hover:text-violet-300 transition mb-2">
                Antrenman Ajandası
              </h3>
              <p class="text-xs text-slate-400 leading-relaxed mb-4">
                Kişisel antrenman defterin. Hangi gün hangi split'i çalıştığını kaydetmek için basit bir araç.
              </p>
            </div>
            <div class="flex items-center text-xs font-medium text-slate-400 group-hover:text-violet-300 pt-3 border-t border-slate-800/80 transition">
              <span>Ajandayı Aç</span>
              <span class="inline-block group-hover:translate-x-1 transition-transform ml-1">→</span>
            </div>
          </div>
        </div>

        <!-- Hızlı Arama İpucu -->
        <div class="mt-10 p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 max-w-xl mx-auto flex items-center justify-between text-xs text-slate-400">
          <span>Spesifik bir kas, eklem veya egzersiz mi arıyorsun?</span>
          <button id="portalSearchTrigger" class="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white transition font-mono text-xs font-medium cursor-pointer">
            ⌘K ile Ara
          </button>
        </div>

        <!-- Sade Kişisel Editoryal Footer -->
        <footer class="mt-14 pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div class="flex items-center gap-2">
            <span class="font-medium text-slate-400">BEK LESOFEN</span>
            <span class="text-slate-700">·</span>
            <span>Anatomi, hareket ve mekanik üzerine kişisel çalışma alanı.</span>
          </div>
          <div class="text-[11px] text-slate-600">
            Bağımsız Dijital Laboratuvar
          </div>
        </footer>
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
