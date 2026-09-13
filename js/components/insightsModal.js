/**
 * LESOFEN KINETIKA - Hierarchical Insights Component ("Neden Hissediyorum?")
 * Progressive Disclosure:
 * Level 1: Bölge / Egzersiz Grubu Seçimi
 * Level 2: Soru Seçimi ve Ayrıntılı Kineziyolojik Çözüm
 */

import { graph } from '../core/graph.js';
import { state } from '../core/state.js';

export class ClinicalInsights {
  constructor(containerElement, onMuscleSelect) {
    this.container = containerElement;
    this.onMuscleSelect = onMuscleSelect;

    this.render = this.render.bind(this);
    state.subscribe(() => {
      if (state.getState().activeTab === "insights") {
        this.render();
      }
    });
    this.render();
  }

  render() {
    const s = state.getState();
    const activeRegion = s.selectedInsightRegion;

    if (!activeRegion && s.insightFlowLevel === 1) {
      this.renderRegionSelector();
    } else {
      this.renderRegionInsights(activeRegion || "Omuz & Sırt");
    }
  }

  // ==========================================
  // LEVEL 1: BÖLGE SEÇİCİ
  // ==========================================
  renderRegionSelector() {
    const regions = [
      { id: "Omuz", name: "Omuz & Üst Sırt", count: "2 Soru", desc: "Lateral raise sırasında trapez baskısı ve bench press omuz batması" },
      { id: "Bacak & Kalça", name: "Bacak & Kalça", count: "1 Soru", desc: "Squatta hamstring kasılmaması (Lombard Paradoksu)" },
      { id: "Core & Sırt", name: "Bel & Omurga", count: "1 Soru", desc: "Deadlift sırasında bel omurlarında oluşan aşırı moment baskısı" }
    ];

    this.container.innerHTML = `
      <div class="insights-selector max-w-4xl mx-auto p-4 md:p-6 space-y-6 animate-fadeIn">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xs text-rose-400 font-bold uppercase tracking-wider">NEDEN HİSSEDİYORUM?</span>
            <span class="text-slate-600">·</span>
            <span class="text-xs text-slate-400">Bölge Seçimi</span>
          </div>
          <h2 class="text-2xl md:text-3xl font-black text-white tracking-tight">Hangi bölgedeki hissi incelemek istiyorsunuz?</h2>
          <p class="text-xs md:text-sm text-slate-400 mt-1 max-w-xl">
            Kaldırış sırasında oluşan anormal gerilimlerin veya hissedilen kasların ardındaki biyomekanik nedenleri keşfedin.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          ${regions.map(r => `
            <div class="insight-reg-card p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-rose-500/50 hover:bg-slate-900/90 transition-all duration-150 cursor-pointer group shadow-sm hover:shadow-rose-500/5 hover:-translate-y-0.5" data-region="${r.id}">
              <div class="flex items-center justify-between mb-2">
                <h4 class="text-sm font-bold text-white group-hover:text-rose-300 transition">${r.name}</h4>
                <span class="text-[11px] text-slate-500">${r.count}</span>
              </div>
              <p class="text-[11px] text-slate-400 leading-snug">${r.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    this.container.querySelectorAll('.insight-reg-card').forEach(card => {
      card.addEventListener('click', () => {
        state.selectInsightRegion(card.dataset.region);
      });
    });
  }

  // ==========================================
  // LEVEL 2: O BÖLGENİN SORULARI & DETAYI
  // ==========================================
  renderRegionInsights(regionName) {
    const allInsights = graph.getAllInsights();
    let insights = allInsights.filter(i => i.category.toLowerCase().includes(regionName.toLowerCase()) || regionName.toLowerCase().includes(i.category.toLowerCase()));
    if (insights.length === 0) insights = allInsights;

    const s = state.getState();
    const activeInsight = graph.getInsight(s.selectedInsightId) || insights[0] || allInsights[0];

    this.container.innerHTML = `
      <div class="insights-detail-view max-w-5xl mx-auto p-4 md:p-6 space-y-6 animate-fadeIn">
        <!-- Başlık & Geri Dönüş -->
        <div class="border-b border-slate-800 pb-4">
          <div class="flex items-center justify-between mb-2">
            <button id="btnBackToInsRegions" class="text-xs font-medium text-slate-400 hover:text-rose-400 transition flex items-center gap-1">
              ← Tüm Bölgelere Dön
            </button>
            <span class="text-xs text-slate-400">
              ${activeInsight.category}
            </span>
          </div>
          <h2 class="text-2xl md:text-3xl font-black text-white tracking-tight">Kaldırış & Biyomekanik İpuçları</h2>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- Sol Liste (Sorular) -->
          <div class="lg:col-span-5 space-y-2">
            ${insights.map(ins => `
              <div class="insight-item-card p-3.5 rounded-xl border transition cursor-pointer ${
                ins.id === activeInsight.id 
                  ? 'bg-rose-500/15 border-rose-500/60 shadow-lg shadow-rose-500/10' 
                  : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900 hover:border-slate-700'
              }" data-id="${ins.id}">
                <span class="text-[9px] font-mono text-rose-400/80 block uppercase mb-0.5">${ins.category}</span>
                <h4 class="font-bold text-xs ${ins.id === activeInsight.id ? 'text-rose-300' : 'text-white'} leading-snug">${ins.question}</h4>
              </div>
            `).join('')}
          </div>

          <!-- Sağ Panel (Açıklama & Çözüm) -->
          <div class="lg:col-span-7 bg-slate-950 border border-slate-800/90 rounded-2xl p-5 shadow-2xl space-y-4">
            <div>
              <span class="text-[10px] font-mono text-rose-400 uppercase tracking-wider block mb-1">SORU & ANALİZ</span>
              <h3 class="text-lg font-black text-white leading-snug">${activeInsight.question}</h3>
              <p class="text-xs text-slate-300 mt-2 leading-relaxed bg-slate-900/80 p-3 rounded-xl border border-slate-800">${activeInsight.summary}</p>
            </div>

            <!-- Ayrıntılı Kineziyolojik Açıklama -->
            <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2 text-xs text-slate-300 leading-relaxed">
              <span class="font-mono text-cyan-400 font-bold uppercase block text-[10px]">Detaylı Mekanizma:</span>
              <div class="space-y-1.5">${activeInsight.detailedExplanation}</div>
            </div>

            <!-- Pratik İpucu Rozeti -->
            <div class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs flex items-center gap-2">
              <span class="text-base">🎯</span>
              <div>
                <strong class="font-mono text-amber-400">Teknik İpucu:</strong>
                <span class="ml-1">${activeInsight.cueTip}</span>
              </div>
            </div>

            <!-- İlgili Kaslar -->
            <div>
              <span class="font-mono text-[10px] text-slate-500 uppercase block mb-1.5">İlgili Kaslar:</span>
              <div class="flex flex-wrap gap-1.5">
                ${activeInsight.relatedMuscles.map(mId => {
                  const m = graph.getMuscle(mId);
                  return `
                    <button class="ins-muscle-jump px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-mono text-slate-300 transition" data-id="${mId}">
                      ${m ? m.name : mId} →
                    </button>
                  `;
                }).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Event Listeners
    const backBtn = this.container.querySelector('#btnBackToInsRegions');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        state.openInsights();
      });
    }

    this.container.querySelectorAll('.insight-item-card').forEach(card => {
      card.addEventListener('click', () => {
        state.selectInsight(card.dataset.id);
      });
    });

    this.container.querySelectorAll('.ins-muscle-jump').forEach(btn => {
      btn.addEventListener('click', () => {
        state.selectMuscle(btn.dataset.id);
      });
    });
  }
}
