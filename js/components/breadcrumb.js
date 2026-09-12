/**
 * LESOFEN KINETIKA - Interactive Breadcrumb Navigation Component
 * Kullanıcının hangi derinlikte olduğunu gösteren ve tek tıkla geri dönüş sağlayan bar
 */

import { state } from '../core/state.js';

export class BreadcrumbNav {
  constructor(containerElement) {
    this.container = containerElement;
    this.render = this.render.bind(this);
    state.subscribe(() => this.render());
    this.render();
  }

  render() {
    const s = state.getState();
    const crumbs = s.breadcrumbs || [{ id: "home", label: "Kinetika" }];
    const isHome = s.activeTab === "home" || crumbs.length <= 1;

    // Ana ekranda breadcrumb barını gösterme veya minimal göster
    if (isHome) {
      this.container.innerHTML = ``;
      this.container.classList.add('hidden');
      return;
    }

    this.container.classList.remove('hidden');

    this.container.innerHTML = `
      <div class="breadcrumb-bar bg-slate-950/90 border-b border-slate-800/80 px-4 py-2 flex items-center justify-between gap-3 text-xs font-mono animate-fadeIn">
        <!-- Sol: Geri Butonu ve Yol Haritası -->
        <div class="flex items-center gap-2 overflow-x-auto custom-scrollbar py-0.5">
          <button id="btnBreadcrumbBack" class="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition flex items-center gap-1 shrink-0 font-bold">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
            <span>Geri</span>
          </button>

          <div class="flex items-center gap-1.5 text-slate-400 shrink-0">
            ${crumbs.map((crumb, idx) => {
              const isLast = idx === crumbs.length - 1;
              return `
                <button class="crumb-btn transition ${
                  isLast 
                    ? 'text-cyan-400 font-bold cursor-default' 
                    : 'text-slate-400 hover:text-slate-200 hover:underline cursor-pointer'
                }" data-id="${crumb.id}">
                  ${crumb.label}
                </button>
                ${!isLast ? '<span class="text-slate-600 font-normal">/</span>' : ''}
              `;
            }).join('')}
          </div>
        </div>

        <!-- Sağ: Derinlik Seviyesi Rozeti -->
        <div class="hidden sm:flex items-center gap-1.5 shrink-0">
          <span class="text-[10px] uppercase font-mono px-2 py-0.5 rounded border border-cyan-500/30 text-cyan-400 bg-cyan-500/10">
            Seviye ${crumbs.length}
          </span>
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  attachEventListeners() {
    const backBtn = this.container.querySelector('#btnBreadcrumbBack');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        state.stepBack();
      });
    }

    this.container.querySelectorAll('.crumb-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        state.handleBreadcrumbClick(id);
      });
    });
  }
}
