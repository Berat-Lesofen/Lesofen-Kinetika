/**
 * LESOFEN KINETIKA - 2D Interactive Anatomical Atlas Viewer
 * Kullanıcı görselleri (Anterior/Posterior) ve SVG Hotspot Katmanı
 */

import { ANTERIOR_HOTSPOTS, POSTERIOR_HOTSPOTS } from '../data/hotspots.js';
import { graph } from '../core/graph.js';
import { state } from '../core/state.js';

export class AtlasViewer {
  constructor(containerElement, onMuscleSelect) {
    this.container = containerElement;
    this.onMuscleSelect = onMuscleSelect;

    this.currentView = "anterior"; // anterior | posterior | list
    this.hoveredHotspotId = null;

    this.render = this.render.bind(this);
    state.subscribe(() => this.renderHotspotStates());

    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="atlas-viewer-root w-full h-full flex flex-col relative bg-[#08090c] select-none">
        
        <!-- Üst Atlas Kontrolleri: [ ÖN GÖRÜNÜM ] [ ARKA GÖRÜNÜM ] [ KAS LİSTESİ ] -->
        <div class="atlas-top-bar flex items-center justify-between px-4 py-3 bg-slate-950/90 border-b border-slate-800/80 z-20">
          <div class="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button id="tabViewAnterior" class="atlas-tab-btn px-3.5 py-1.5 rounded-lg font-mono text-xs font-bold transition ${
              this.currentView === 'anterior' ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' : 'text-slate-400 hover:text-white'
            }">
              ÖN GÖRÜNÜM
            </button>
            <button id="tabViewPosterior" class="atlas-tab-btn px-3.5 py-1.5 rounded-lg font-mono text-xs font-bold transition ${
              this.currentView === 'posterior' ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' : 'text-slate-400 hover:text-white'
            }">
              ARKA GÖRÜNÜM
            </button>
            <button id="tabViewList" class="atlas-tab-btn px-3.5 py-1.5 rounded-lg font-mono text-xs font-bold transition ${
              this.currentView === 'list' ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' : 'text-slate-400 hover:text-white'
            }">
              KAS LİSTESİ
            </button>
          </div>

          <div class="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
            <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span id="atlasStatusText">İnteraktif 2D Görsel Katmanı</span>
          </div>
        </div>

        <!-- Ana Görsel / Liste Alanı -->
        <div class="atlas-stage-container flex-1 relative flex items-center justify-center p-2 sm:p-4 overflow-hidden bg-radial-gradient">
          <div id="atlasDisplayArea" class="w-full h-full flex items-center justify-center">
            <!-- Dinamik İçerik Buraya Gelecek -->
          </div>
        </div>

        <!-- Alt Durum Çubuğu -->
        <div class="atlas-bottom-hint px-4 py-2 border-t border-slate-900 bg-slate-950/60 text-[11px] font-mono text-slate-500 flex justify-between items-center">
          <span>İpucu: Görseldeki kas hedeflerine veya etiketlere dokunarak analiz panelini açabilirsiniz.</span>
          <span class="text-cyan-400">LESOFEN KINETIKA 2D Engine</span>
        </div>
      </div>
    `;

    this.attachTopBarListeners();
    this.renderActiveView();
  }

  renderActiveView() {
    const displayArea = this.container.querySelector('#atlasDisplayArea');
    if (!displayArea) return;

    if (this.currentView === "anterior") {
      this.renderAnteriorView(displayArea);
    } else if (this.currentView === "posterior") {
      this.renderPosterView(displayArea);
    } else if (this.currentView === "list") {
      this.renderMuscleListView(displayArea);
    }
  }

  renderAnteriorView(container) {
    const selectedId = state.getState().selectedMuscleId;

    container.innerHTML = `
      <div class="relative w-full max-w-2xl max-h-[75vh] flex items-center justify-center aspect-[978/1024]">
        <!-- Ana Anatomik Görsel -->
        <img src="assets/anatomy/anterior.jpg" alt="Anterior Anatomi" 
             class="w-full h-full object-contain rounded-xl shadow-2xl border border-slate-800/60 pointer-events-none select-none">

        <!-- SVG Hotspot Katmanı (978 x 1024 viewBox) -->
        <svg viewBox="0 0 978 1024" class="absolute inset-0 w-full h-full z-10">
          <defs>
            <filter id="glowCyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glowAmber" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <!-- Hotspotlar -->
          ${ANTERIOR_HOTSPOTS.map(h => {
            const isSelected = h.id === selectedId;
            return this.renderHotspotGroup(h, isSelected);
          }).join('')}
        </svg>
      </div>
    `;

    this.attachSvgListeners(container);
  }

  renderPosterView(container) {
    const selectedId = state.getState().selectedMuscleId;

    container.innerHTML = `
      <div class="relative w-full max-w-4xl max-h-[75vh] flex items-center justify-center aspect-[1024/571]">
        <!-- Ana Anatomik Görsel -->
        <img src="assets/anatomy/posterior.jpg" alt="Posterior Anatomi" 
             class="w-full h-full object-contain rounded-xl shadow-2xl border border-slate-800/60 pointer-events-none select-none">

        <!-- SVG Hotspot Katmanı (1024 x 571 viewBox) -->
        <svg viewBox="0 0 1024 571" class="absolute inset-0 w-full h-full z-10">
          <defs>
            <filter id="glowCyanPost" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <!-- Hotspotlar -->
          ${POSTERIOR_HOTSPOTS.map(h => {
            const isSelected = h.id === selectedId;
            return this.renderHotspotGroup(h, isSelected);
          }).join('')}
        </svg>
      </div>
    `;

    this.attachSvgListeners(container);
  }

  renderHotspotGroup(h, isSelected) {
    const points = [{ cx: h.cx, cy: h.cy }];
    if (h.mirror) points.push(h.mirror);

    const fillColor = isSelected ? "rgba(0, 242, 254, 0.45)" : "rgba(255, 159, 28, 0.22)";
    const strokeColor = isSelected ? "#00f2fe" : "#ff9f1c";
    const strokeWidth = isSelected ? 3 : 1.5;

    return `
      <g class="hotspot-group cursor-pointer transition-all duration-150" data-id="${h.id}" data-name="${h.name}">
        ${points.map(pt => `
          <!-- Dış Nabız Efekti / Seçili Halka -->
          <circle cx="${pt.cx}" cy="${pt.cy}" r="${pt.r * (isSelected ? 1.4 : 1.1)}" 
                  fill="none" stroke="${strokeColor}" stroke-width="${strokeWidth}" 
                  opacity="${isSelected ? 0.9 : 0.4}" 
                  class="${isSelected ? 'animate-ping' : ''}" />

          <!-- Ana Dokunma Noktası -->
          <circle cx="${pt.cx}" cy="${pt.cy}" r="${pt.r}" 
                  fill="${fillColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}"
                  filter="${isSelected ? 'url(#glowCyan)' : 'none'}" />

          <!-- Merkez Vurgu Noktası -->
          <circle cx="${pt.cx}" cy="${pt.cy}" r="${isSelected ? 6 : 4}" 
                  fill="${isSelected ? '#fff' : strokeColor}" />
        `).join('')}
      </g>
    `;
  }

  renderMuscleListView(container) {
    const muscles = graph.getAllMuscles();
    const selectedId = state.getState().selectedMuscleId;

    // Bölgelere göre grupla
    const categories = [
      "Omuz", "Göğüs", "Sırt", "Sırt & Boyun", "Sırt Derin", "Omuz Derin",
      "Kol", "Önkol", "Core", "Kalça", "Ön Bacak", "Arka Bacak", "Baldır"
    ];

    const grouped = {};
    categories.forEach(cat => grouped[cat] = []);
    muscles.forEach(m => {
      const cat = m.category || "Diğer";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(m);
    });

    container.innerHTML = `
      <div class="w-full max-w-4xl h-full max-h-[75vh] overflow-y-auto custom-scrollbar p-3 space-y-6">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 class="text-lg font-black text-white">Anatomik Kas Fihristi</h3>
            <p class="text-xs text-slate-400">Herhangi bir kasa tıkladığınızda sistem otomatik olarak ilgili görünüme geçer ve kası odaklar.</p>
          </div>
          <span class="font-mono text-xs text-amber-400 font-bold">${muscles.length} Fonksiyonel Hedef</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${categories.map(cat => {
            const list = grouped[cat];
            if (!list || list.length === 0) return '';
            return `
              <div class="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 space-y-2.5">
                <span class="font-mono text-xs text-cyan-400 font-bold uppercase tracking-wider block border-b border-slate-800/60 pb-1">
                  ${cat}
                </span>
                <div class="space-y-1.5">
                  ${list.map(m => `
                    <div class="muscle-list-row p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                      m.id === selectedId 
                        ? 'bg-cyan-500/15 border-cyan-500/60 text-white font-bold' 
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
                    }" data-id="${m.id}" data-view="${m.viewAngle}">
                      <div>
                        <div class="text-xs font-semibold">${m.name}</div>
                        <div class="text-[10px] text-slate-400 italic">${m.latinName}</div>
                      </div>
                      <span class="font-mono text-[10px] px-2 py-0.5 rounded ${
                        m.viewAngle === 'posterior' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'
                      }">
                        ${m.viewAngle === 'posterior' ? 'Arka' : 'Ön'}
                      </span>
                    </div>
                  `).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    // Liste satırlarına tıklama dinleyicisi
    container.querySelectorAll('.muscle-list-row').forEach(row => {
      row.addEventListener('click', () => {
        const id = row.dataset.id;
        const viewAngle = row.dataset.view;

        // Görünümü kasın yönüne göre otomatik ayarla
        this.currentView = (viewAngle === "posterior") ? "posterior" : "anterior";
        state.selectMuscle(id);

        this.render();
        if (this.onMuscleSelect) this.onMuscleSelect(id);
      });
    });
  }

  attachTopBarListeners() {
    const btnAnterior = this.container.querySelector('#tabViewAnterior');
    const btnPosterior = this.container.querySelector('#tabViewPosterior');
    const btnList = this.container.querySelector('#tabViewList');

    if (btnAnterior) {
      btnAnterior.addEventListener('click', () => {
        this.currentView = "anterior";
        this.render();
      });
    }

    if (btnPosterior) {
      btnPosterior.addEventListener('click', () => {
        this.currentView = "posterior";
        this.render();
      });
    }

    if (btnList) {
      btnList.addEventListener('click', () => {
        this.currentView = "list";
        this.render();
      });
    }
  }

  attachSvgListeners(container) {
    const tooltip = document.getElementById('anatomyTooltip');
    const groups = container.querySelectorAll('.hotspot-group');

    groups.forEach(g => {
      const id = g.dataset.id;
      const name = g.dataset.name;
      const muscleData = graph.getMuscle(id);

      // Hover
      g.addEventListener('pointerenter', (e) => {
        if (tooltip) {
          tooltip.style.display = "block";
          tooltip.style.left = `${e.clientX + 14}px`;
          tooltip.style.top = `${e.clientY - 12}px`;
          tooltip.innerHTML = `
            <div class="font-mono text-[10px] text-amber-400 font-bold uppercase tracking-wider">KAS DETAYI</div>
            <div class="text-xs font-bold text-white">${muscleData ? muscleData.name : name}</div>
            <div class="text-[10px] text-slate-400 italic">${muscleData ? muscleData.latinName : ''}</div>
          `;
        }
      });

      g.addEventListener('pointermove', (e) => {
        if (tooltip) {
          tooltip.style.left = `${e.clientX + 14}px`;
          tooltip.style.top = `${e.clientY - 12}px`;
        }
      });

      g.addEventListener('pointerleave', () => {
        if (tooltip) tooltip.style.display = "none";
      });

      // Tıklama
      g.addEventListener('click', () => {
        state.selectMuscle(id);
        if (tooltip) tooltip.style.display = "none";
        if (this.onMuscleSelect) this.onMuscleSelect(id);
      });
    });
  }

  renderHotspotStates() {
    // Sadece hotspotların görsel parıltısını yeniden güncelle
    if (this.currentView === "anterior" || this.currentView === "posterior") {
      this.renderActiveView();
    }
  }

  switchToMuscle(muscleId) {
    const muscle = graph.getMuscle(muscleId);
    if (!muscle) return;

    if (muscle.viewAngle === "posterior") {
      this.currentView = "posterior";
    } else {
      this.currentView = "anterior";
    }
    this.render();
  }
}
