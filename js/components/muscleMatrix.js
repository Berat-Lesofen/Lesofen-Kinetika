/**
 * LESOFEN KINETIKA - Muscle Matrix Component (Kas Sistemi & Biyomekanik Matrisi)
 * İnsan çizimi yerine fonksiyonel ve analitik kart/matris mimarisi
 */

import { graph } from '../core/graph.js';
import { state } from '../core/state.js';

export class MuscleMatrix {
  constructor(containerElement, onMuscleSelect) {
    this.container = containerElement;
    this.onMuscleSelect = onMuscleSelect;

    this.selectedRegion = "all";
    this.selectedDepth = "all"; // all | superficial | deep
    this.searchQuery = "";

    this.render = this.render.bind(this);
    state.subscribe(() => this.render());
  }

  setRegion(region) {
    this.selectedRegion = region;
    this.render();
  }

  setDepth(depth) {
    this.selectedDepth = depth;
    this.render();
  }

  setSearch(query) {
    this.searchQuery = query.toLowerCase().trim();
    this.render();
  }

  render() {
    const muscles = graph.getAllMuscles();
    const currentState = state.getState();
    const selectedId = currentState.selectedMuscleId;

    // 11 Bölge Tanımı
    const regions = [
      { id: "all", label: "Tüm Bölgeler" },
      { id: "Göğüs", label: "Göğüs" },
      { id: "Sırt", label: "Sırt" },
      { id: "Omuz", label: "Omuz" },
      { id: "Kol", label: "Kol" },
      { id: "Önkol", label: "Önkol" },
      { id: "Core", label: "Karın / Core" },
      { id: "Kalça", label: "Kalça" },
      { id: "Ön Bacak", label: "Quadriceps" },
      { id: "Arka Bacak", label: "Hamstring" },
      { id: "Baldır", label: "Baldır & Kaval" }
    ];

    // Filtreleme mantığı
    const filtered = muscles.filter(m => {
      // Bölge eşleşmesi
      if (this.selectedRegion !== "all") {
        const cat = (m.category || "").toLowerCase();
        const reg = this.selectedRegion.toLowerCase();
        if (!cat.includes(reg)) return false;
      }
      // Derinlik eşleşmesi
      if (this.selectedDepth !== "all") {
        if (m.depthLayer !== this.selectedDepth) return false;
      }
      // Arama eşleşmesi
      if (this.searchQuery) {
        const q = this.searchQuery;
        const nameMatch = m.name.toLowerCase().includes(q);
        const latinMatch = m.latinName.toLowerCase().includes(q);
        const idMatch = m.id.toLowerCase().includes(q);
        const catMatch = (m.category || "").toLowerCase().includes(q);
        if (!nameMatch && !latinMatch && !idMatch && !catMatch) return false;
      }
      return true;
    });

    this.container.innerHTML = `
      <div class="muscle-matrix-wrapper flex flex-col h-full p-4 md:p-6 space-y-5 animate-fadeIn">
        <!-- Başlık ve Kontrol Çubuğu -->
        <div class="matrix-header border-b border-slate-800 pb-4">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="font-mono text-xs text-cyan-400 font-bold uppercase tracking-wider">KAS SİSTEMİ</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">Fonksiyonel Matris</span>
              </div>
              <h2 class="text-2xl font-black text-white tracking-tight">Anatomik Hedefler & Biyomekanik Birimler</h2>
            </div>
            <div class="flex items-center gap-2">
              <span class="font-mono text-xs px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                <strong class="text-cyan-400 font-bold">${filtered.length}</strong> / ${muscles.length} Kas Birimi
              </span>
            </div>
          </div>

          <!-- Canlı Arama & Katman Filtresi -->
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 mb-3">
            <div class="relative flex-1">
              <input type="text" id="matrixSearchInput" value="${this.searchQuery}" placeholder="Kas adı, Latin isim veya bölge ara (örn: deltoid, kaval, biceps)..." 
                     class="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2 pl-9 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 transition">
              <svg class="w-4 h-4 text-slate-500 absolute left-3 top-2.5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            
            <!-- Katman Seçici (Yüzeyel / Derin) -->
            <div class="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 shrink-0">
              <button class="depth-filter-btn px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition ${
                this.selectedDepth === 'all' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
              }" data-depth="all">Tümü</button>
              <button class="depth-filter-btn px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition ${
                this.selectedDepth === 'superficial' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
              }" data-depth="superficial">Yüzeyel</button>
              <button class="depth-filter-btn px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition ${
                this.selectedDepth === 'deep' ? 'bg-purple-500/20 text-purple-300 font-bold' : 'text-slate-400 hover:text-slate-200'
              }" data-depth="deep">Derin</button>
            </div>
          </div>

          <!-- 11 Bölgesel Buton Filtresi -->
          <div class="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1">
            ${regions.map(reg => `
              <button class="region-filter-btn whitespace-nowrap px-3 py-1 rounded-lg font-mono text-[11px] border transition ${
                this.selectedRegion === reg.id
                  ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-sm shadow-cyan-500/20'
                  : 'bg-slate-900/80 text-slate-300 border-slate-800/90 hover:bg-slate-800/80 hover:border-slate-700'
              }" data-region="${reg.id}">
                ${reg.label}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Kas Kartları Izgarası -->
        <div class="flex-1 overflow-y-auto custom-scrollbar pr-1">
          ${filtered.length === 0 ? `
            <div class="p-12 text-center text-slate-500">
              <p class="font-mono text-sm">Filtre kriterlerine uygun kas bulunamadı.</p>
              <button id="resetMatrixFilters" class="mt-3 text-xs text-cyan-400 underline hover:text-cyan-300">Filtreleri Sıfırla</button>
            </div>
          ` : `
            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              ${filtered.map(m => {
                const isSelected = m.id === selectedId;
                const isDeep = m.depthLayer === 'deep';
                
                return `
                  <div class="muscle-matrix-card p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                    isSelected 
                      ? 'bg-cyan-500/10 border-cyan-500/60 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/30' 
                      : 'bg-slate-950/70 border-slate-800/80 hover:bg-slate-900/80 hover:border-slate-700 hover:shadow-md'
                  }" data-id="${m.id}">
                    <div>
                      <!-- Üst Rozetler -->
                      <div class="flex items-center justify-between gap-2 mb-2">
                        <span class="font-mono text-[10px] px-2 py-0.5 rounded border border-amber-500/30 text-amber-300 bg-amber-500/10">
                          ${m.category}
                        </span>
                        <span class="font-mono text-[9px] px-1.5 py-0.5 rounded border ${
                          isDeep 
                            ? 'border-purple-500/40 text-purple-300 bg-purple-500/10' 
                            : 'border-cyan-500/40 text-cyan-300 bg-cyan-500/10'
                        }">
                          ${isDeep ? 'Derin' : 'Yüzeyel'}
                        </span>
                      </div>

                      <!-- Kas Başlığı -->
                      <h3 class="text-sm font-bold text-white group-hover:text-cyan-300 transition flex items-center gap-1.5 mb-0.5">
                        <span class="w-2 h-2 rounded-full shrink-0" style="background-color: ${m.color || '#00f2fe'};"></span>
                        ${m.name}
                      </h3>
                      <p class="text-[11px] font-serif italic text-slate-400 mb-3">${m.latinName}</p>

                      <!-- Hızlı Hareketler (Primer Motor Eylemler) -->
                      <div class="flex flex-wrap gap-1 mb-2">
                        ${m.actions.slice(0, 2).map(act => `
                          <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                            ${act.role === 'prime_mover' ? '⚡ ' : ''}${act.movement.replace(/_/g, ' ')}
                          </span>
                        `).join('')}
                      </div>
                    </div>

                    <!-- Alt Bilgi & Bağlantı -->
                    <div class="pt-2 border-t border-slate-900/90 flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>${m.exercises?.length || 0} Egzersiz</span>
                      <span class="${isSelected ? 'text-cyan-400 font-bold' : 'text-slate-500 group-hover:text-cyan-400'} transition flex items-center gap-0.5">
                        İncele 
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                      </span>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          `}
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  attachEventListeners() {
    // Arama Kutusu
    const searchInput = this.container.querySelector('#matrixSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        // debounce yerine anlık hafif filtre
        const cards = this.container.querySelectorAll('.muscle-matrix-card');
        const q = this.searchQuery;
        cards.forEach(card => {
          const text = card.textContent.toLowerCase();
          card.style.display = (!q || text.includes(q)) ? 'flex' : 'none';
        });
      });
    }

    // Bölge Butonları
    this.container.querySelectorAll('.region-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.setRegion(btn.dataset.region);
      });
    });

    // Katman Butonları
    this.container.querySelectorAll('.depth-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.setDepth(btn.dataset.depth);
      });
    });

    // Kart Tıklama
    this.container.querySelectorAll('.muscle-matrix-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        state.selectMuscle(id);
        if (this.onMuscleSelect) this.onMuscleSelect(id);
      });
    });

    // Sıfırla Butonu
    const resetBtn = this.container.querySelector('#resetMatrixFilters');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.selectedRegion = "all";
        this.selectedDepth = "all";
        this.searchQuery = "";
        this.render();
      });
    }
  }
}
