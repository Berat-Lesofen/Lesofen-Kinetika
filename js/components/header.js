/**
 * LESOFEN KINETIKA - Header & Navigation Component
 */

import { state } from '../core/state.js';
import { graph } from '../core/graph.js';

export class Header {
  constructor(headerContainer, onSearchSelect) {
    this.container = headerContainer;
    this.onSearchSelect = onSearchSelect;
    this.render();
    state.subscribe(() => this.updateActiveTab());
  }

  render() {
    this.container.innerHTML = `
      <header class="site-header bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-40 px-3 sm:px-4 py-2.5">
        <div class="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          <!-- Marka & Logo Alanı -->
          <div class="brand-block flex items-center gap-2.5 md:gap-3 cursor-pointer" id="brandHomeLink">
            <img src="assets/branding/logo.png" alt="LESOFEN KINETIKA" class="header-brand-logo rounded-full shadow-lg shadow-cyan-500/10 transition-transform hover:scale-105" />
            <div class="brand-text flex flex-col">
              <span class="tracking-[0.24em] text-[10px] font-mono text-amber-400 font-bold leading-none">LESOFEN</span>
              <span class="text-base sm:text-lg font-black tracking-tight text-white leading-tight">KINETIKA</span>
              <span class="text-[9px] font-mono text-slate-400 tracking-wider hidden lg:block">HUMAN MOVEMENT · ANATOMY · BIOMECHANICS</span>
            </div>
          </div>

          <!-- Navigasyon Sekmeleri (Desktop) -->
          <nav class="hidden md:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800/80">
            <button class="nav-tab px-3 py-1.5 rounded-lg text-xs font-medium transition" data-tab="anatomy">
              Kas Sistemi
            </button>
            <button class="nav-tab px-3 py-1.5 rounded-lg text-xs font-medium transition" data-tab="movements">
              Hareket Atlası
            </button>
            <button class="nav-tab px-3 py-1.5 rounded-lg text-xs font-medium transition" data-tab="biolab">
              Biyomekanik Lab
            </button>
            <button class="nav-tab px-3 py-1.5 rounded-lg text-xs font-medium transition" data-tab="exercises">
              Egzersiz Analizi
            </button>
            <button class="nav-tab px-3 py-1.5 rounded-lg text-xs font-medium transition" data-tab="insights">
              Neden Hissediyorum?
            </button>
            <button class="nav-tab px-3 py-1.5 rounded-lg text-xs font-medium transition" data-tab="quiz">
              Quiz
            </button>
            <button class="nav-tab px-3 py-1.5 rounded-lg text-xs font-medium transition" data-tab="agenda">
              Ajanda
            </button>
          </nav>

          <!-- Arama & Mobil Menü Butonu -->
          <div class="flex items-center gap-2">
            <button id="btnOpenSearch" class="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs flex items-center gap-2 transition">
              <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <span class="hidden sm:inline">Hızlı Keşif...</span>
              <kbd class="text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 border border-slate-700 hidden sm:inline">⌘K</kbd>
            </button>

            <!-- Mobil Sekme Aç/Kapa -->
            <button id="btnMobileNavToggle" class="md:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
            </button>
          </div>
        </div>

        <!-- Mobil Menü Çekmecesi -->
        <div id="mobileNavMenu" class="md:hidden hidden pt-3 border-t border-slate-800/80 mt-2.5 pb-2">
          <div class="grid grid-cols-2 gap-1.5 text-xs">
            <button class="nav-tab-mobile p-2 rounded-lg text-left bg-slate-900 text-slate-300" data-tab="anatomy">Kas Sistemi</button>
            <button class="nav-tab-mobile p-2 rounded-lg text-left bg-slate-900 text-slate-300" data-tab="movements">Hareket Atlası</button>
            <button class="nav-tab-mobile p-2 rounded-lg text-left bg-slate-900 text-slate-300" data-tab="biolab">Biyomekanik Lab</button>
            <button class="nav-tab-mobile p-2 rounded-lg text-left bg-slate-900 text-slate-300" data-tab="exercises">Egzersiz Analizi</button>
            <button class="nav-tab-mobile p-2 rounded-lg text-left bg-slate-900 text-slate-300" data-tab="insights">Neden Hissediyorum?</button>
            <button class="nav-tab-mobile p-2 rounded-lg text-left bg-slate-900 text-slate-300" data-tab="quiz">Quiz</button>
            <button class="nav-tab-mobile p-2 rounded-lg text-left bg-slate-900 text-slate-300" data-tab="agenda">Ajanda</button>
          </div>
        </div>
      </header>

      <!-- Global Hızlı Arama Modalı -->
      <div id="globalSearchModal" class="hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-20 p-4 animate-fadeIn">
        <div class="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
          <div class="p-3.5 border-b border-slate-800 flex items-center gap-3">
            <svg class="w-5 h-5 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input id="modalSearchInput" type="text" placeholder="Kas, hareket veya egzersiz ara..." 
                   class="w-full bg-transparent text-sm text-white focus:outline-none placeholder-slate-500">
            <button id="btnCloseSearch" class="text-xs font-mono text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded">ESC</button>
          </div>
          <div id="searchResultsList" class="p-3 max-h-96 overflow-y-auto space-y-2">
            <p class="text-xs text-slate-500 text-center py-4">Aramak için yazmaya başlayın...</p>
          </div>
        </div>
      </div>
    `;

    this.attachEventListeners();
    this.updateActiveTab();
  }

  updateActiveTab() {
    const activeTab = state.getState().activeTab;
    const desktopTabs = this.container.querySelectorAll('.nav-tab');
    const mobileTabs = this.container.querySelectorAll('.nav-tab-mobile');

    desktopTabs.forEach(tab => {
      const isMatch = tab.dataset.tab === activeTab;
      if (isMatch) {
        tab.className = "nav-tab px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-amber-400 border border-slate-700/80 shadow-sm";
      } else {
        tab.className = "nav-tab px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/40";
      }
    });

    mobileTabs.forEach(tab => {
      const isMatch = tab.dataset.tab === activeTab;
      if (isMatch) {
        tab.className = "nav-tab-mobile p-2 rounded-lg text-left font-semibold bg-slate-800 text-amber-400 border border-slate-700/80";
      } else {
        tab.className = "nav-tab-mobile p-2 rounded-lg text-left text-slate-300 bg-slate-900";
      }
    });
  }

  attachEventListeners() {
    const brand = this.container.querySelector('#brandHomeLink');
    if (brand) {
      brand.addEventListener('click', () => state.goHome());
    }

    const allTabs = this.container.querySelectorAll('.nav-tab, .nav-tab-mobile');
    allTabs.forEach(t => {
      t.addEventListener('click', () => {
        state.setActiveTab(t.dataset.tab);
        const mobileMenu = this.container.querySelector('#mobileNavMenu');
        if (mobileMenu) mobileMenu.classList.add('hidden');
      });
    });

    const toggleBtn = this.container.querySelector('#btnMobileNavToggle');
    const mobileMenu = this.container.querySelector('#mobileNavMenu');
    if (toggleBtn && mobileMenu) {
      toggleBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      });
    }

    const modal = this.container.querySelector('#globalSearchModal');
    const openBtn = this.container.querySelector('#btnOpenSearch');
    const closeBtn = this.container.querySelector('#btnCloseSearch');
    const searchInput = this.container.querySelector('#modalSearchInput');
    const resultsList = this.container.querySelector('#searchResultsList');

    const openModal = () => {
      modal.classList.remove('hidden');
      searchInput.focus();
    };

    const closeModal = () => {
      modal.classList.add('hidden');
    };

    if (openBtn) openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openModal();
      }
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
      }
    });

    searchInput.addEventListener('input', (e) => {
      const q = e.target.value;
      if (!q || q.trim().length === 0) {
        resultsList.innerHTML = `<p class="text-xs font-mono text-slate-500 text-center py-4">Aramak için yazmaya başlayın...</p>`;
        return;
      }

      const results = graph.search(q);
      const total = results.muscles.length + results.movements.length + results.exercises.length;

      if (total === 0) {
        resultsList.innerHTML = `<p class="text-xs font-mono text-slate-400 text-center py-4">Sonuç bulunamadı: "${q}"</p>`;
        return;
      }

      let html = "";

      if (results.muscles.length > 0) {
        html += `<div class="font-mono text-[10px] text-cyan-400 font-bold uppercase tracking-wider mb-1">Kaslar (${results.muscles.length})</div>`;
        results.muscles.forEach(m => {
          html += `
            <div class="search-item p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 transition cursor-pointer flex items-center justify-between" 
                 data-type="muscle" data-id="${m.id}">
              <div>
                <span class="font-bold text-xs text-white">${m.name}</span>
                <span class="text-[11px] text-slate-400 italic block">${m.latinName}</span>
              </div>
              <span class="font-mono text-[10px] text-amber-400 px-2 py-0.5 rounded bg-amber-500/10">İncele →</span>
            </div>
          `;
        });
      }

      if (results.movements.length > 0) {
        html += `<div class="font-mono text-[10px] text-emerald-400 font-bold uppercase tracking-wider mt-3 mb-1">Hareketler (${results.movements.length})</div>`;
        results.movements.forEach(mv => {
          html += `
            <div class="search-item p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 transition cursor-pointer flex items-center justify-between" 
                 data-type="movement" data-id="${mv.id}">
              <div>
                <span class="font-bold text-xs text-white">${mv.name}</span>
                <span class="text-[11px] text-slate-400 block">${mv.joint}</span>
              </div>
              <span class="font-mono text-[10px] text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10">Harekete Git →</span>
            </div>
          `;
        });
      }

      if (results.exercises.length > 0) {
        html += `<div class="font-mono text-[10px] text-amber-400 font-bold uppercase tracking-wider mt-3 mb-1">Egzersizler (${results.exercises.length})</div>`;
        results.exercises.forEach(ex => {
          html += `
            <div class="search-item p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 transition cursor-pointer flex items-center justify-between" 
                 data-type="exercise" data-id="${ex.id}">
              <div>
                <span class="font-bold text-xs text-white">${ex.name}</span>
                <span class="text-[11px] text-slate-400 block">${ex.category}</span>
              </div>
              <span class="font-mono text-[10px] text-amber-400 px-2 py-0.5 rounded bg-amber-500/10">Egzersize Git →</span>
            </div>
          `;
        });
      }

      resultsList.innerHTML = html;

      resultsList.querySelectorAll('.search-item').forEach(item => {
        item.addEventListener('click', () => {
          const type = item.dataset.type;
          const id = item.dataset.id;
          closeModal();

          if (type === 'muscle') {
            state.selectMuscle(id, "anatomy");
            if (this.onSearchSelect) this.onSearchSelect(id);
          } else if (type === 'movement') {
            state.selectMovement(id);
            state.setActiveTab("movements");
          } else if (type === 'exercise') {
            state.selectExercise(id);
            state.setActiveTab("exercises");
          }
        });
      });
    });
  }
}
