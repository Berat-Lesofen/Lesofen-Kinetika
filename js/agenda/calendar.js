/**
 * LESOFEN KINETIKA - Training Agenda Calendar Component
 * Aylık Takvim Izgarası, Drag & Drop ve Mobil Dokunarak Yerleştirme
 */

import { agendaStorage, SPLITS } from './storage.js';

export class TrainingAgenda {
  constructor(containerElement) {
    this.container = containerElement;

    // Başlangıç tarihi: Mevcut sistem tarihi
    const now = new Date();
    this.currentYear = now.getFullYear();
    this.currentMonth = now.getMonth(); // 0-11

    this.selectedSplitToPlace = null; // Mobil / tap-to-place için aktif seçili split

    this.monthNamesTr = [
      "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
      "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
    ];

    this.dayNamesTr = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

    this.render();
  }

  render() {
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    
    // Ayın ilk gününün haftanın hangi günü olduğu (Pazartesi=0, Pazar=6)
    let firstDayIndex = new Date(this.currentYear, this.currentMonth, 1).getDay();
    firstDayIndex = (firstDayIndex === 0) ? 6 : firstDayIndex - 1; // Pazarı en sona al

    const today = new Date();
    const isCurrentMonth = (today.getFullYear() === this.currentYear && today.getMonth() === this.currentMonth);
    const todayDate = today.getDate();

    this.container.innerHTML = `
      <div class="agenda-root max-w-6xl mx-auto p-4 md:p-6 animate-fadeIn">
        
        <!-- Üst Başlık & Kontroller -->
        <div class="border-b border-slate-800 pb-5 mb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="font-mono text-xs text-amber-400 font-bold uppercase tracking-wider">ANTRENMAN AJANDASI</span>
              <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">Hafıza: Cihaz / LocalStorage</span>
            </div>
            <h2 class="font-serif text-2xl md:text-3xl font-bold text-white tracking-tight">Hangi Gün Hangi Split'i Yaptın?</h2>
            <p class="text-xs text-slate-400 mt-0.5">
              Split kartlarını takvim hücrelerine sürükleyin veya karta dokunduktan sonra istediğiniz güne tıklayın.
            </p>
          </div>

          <!-- Ay Seçici & Butonlar -->
          <div class="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 shadow-xl self-start md:self-auto">
            <button id="btnPrevMonth" class="px-2.5 py-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition font-mono text-xs">
              ‹ Önceki
            </button>
            <span class="px-3 font-mono text-xs font-bold text-white min-w-[130px] text-center">
              ${this.monthNamesTr[this.currentMonth]} ${this.currentYear}
            </span>
            <button id="btnNextMonth" class="px-2.5 py-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition font-mono text-xs">
              Sonraki ›
            </button>
            <button id="btnToday" class="px-2.5 py-1.5 rounded-xl text-[11px] font-mono text-cyan-400 hover:bg-cyan-500/10 border border-slate-800 transition">
              Bugün
            </button>
          </div>
        </div>

        <!-- Sürüklenebilir Split Kartları Bankası -->
        <div class="split-bank-panel bg-slate-950 border border-slate-800/90 rounded-2xl p-4 mb-6 shadow-xl">
          <div class="flex items-center justify-between mb-2.5">
            <span class="font-mono text-xs text-slate-300 font-bold uppercase flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
              SPLIT SEÇENEKLERİ (TUT & BIRAK)
            </span>
            <span class="text-[11px] font-mono text-slate-500 hidden sm:inline">
              ${this.selectedSplitToPlace ? `Seçili: ${this.selectedSplitToPlace} (Güne tıklayın)` : 'Sürükleyin veya dokunun'}
            </span>
          </div>

          <div class="flex flex-wrap gap-2">
            ${SPLITS.map(sp => `
              <div class="split-chip px-3 py-2 rounded-xl font-mono text-xs font-bold border transition cursor-grab active:cursor-grabbing select-none flex items-center gap-1.5 ${
                this.selectedSplitToPlace === sp.id ? 'ring-2 ring-white scale-105 shadow-lg' : ''
              }" 
                   draggable="true" 
                   data-split="${sp.id}"
                   style="background: ${sp.bg}; color: ${sp.color}; border-color: ${sp.border};">
                <span class="w-1.5 h-1.5 rounded-full" style="background: ${sp.color};"></span>
                ${sp.name}
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Aylık Takvim Izgarası (Pazartesi → Pazar) -->
        <div class="calendar-grid-wrapper bg-slate-950 border border-slate-800/90 rounded-2xl p-2 sm:p-4 shadow-2xl overflow-x-auto">
          
          <!-- Gün Başlıkları (Pzt, Sal...) -->
          <div class="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center font-mono text-[11px] font-bold text-slate-400 border-b border-slate-900 pb-2">
            ${this.dayNamesTr.map(d => `<div>${d}</div>`).join('')}
          </div>

          <!-- Gün Hücreleri -->
          <div class="grid grid-cols-7 gap-1 sm:gap-2">
            <!-- Boş başlangıç günleri -->
            ${Array.from({ length: firstDayIndex }).map(() => `
              <div class="day-cell-empty h-20 sm:h-24 rounded-xl bg-slate-950/40 border border-slate-900/40 opacity-30"></div>
            `).join('')}

            <!-- Ayın Günleri -->
            ${Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateKey = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const placedSplitId = agendaStorage.getSplitForDate(dateKey);
              const splitObj = placedSplitId ? SPLITS.find(s => s.id === placedSplitId) : null;
              const isToday = isCurrentMonth && dayNum === todayDate;

              return `
                <div class="day-cell h-20 sm:h-24 rounded-xl p-1.5 sm:p-2 border transition flex flex-col justify-between relative group ${
                  isToday 
                    ? 'bg-slate-900/90 border-cyan-500/50 shadow-md shadow-cyan-500/10' 
                    : 'bg-slate-900/50 border-slate-800/70 hover:border-slate-700'
                }" data-date="${dateKey}">
                  
                  <!-- Gün Numarası -->
                  <div class="flex items-center justify-between">
                    <span class="font-mono text-xs font-bold ${isToday ? 'text-cyan-400' : 'text-slate-400'}">
                      ${String(dayNum).padStart(2, '0')}
                    </span>
                    ${isToday ? '<span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>' : ''}
                  </div>

                  <!-- Yerleştirilmiş Split Rozeti -->
                  <div class="day-content flex-1 flex items-center justify-center">
                    ${splitObj ? `
                      <div class="placed-split-chip w-full py-1 px-1.5 rounded-lg font-mono text-[10px] sm:text-xs font-bold text-center border truncate relative flex items-center justify-between"
                           style="background: ${splitObj.bg}; color: ${splitObj.color}; border-color: ${splitObj.border};">
                        <span class="truncate">${splitObj.name}</span>
                        <button class="btn-remove-split ml-1 opacity-60 hover:opacity-100 hover:text-white font-bold" 
                                data-date="${dateKey}" title="Split'i kaldır">×</button>
                      </div>
                    ` : `
                      <span class="text-[10px] font-mono text-slate-700 opacity-0 group-hover:opacity-60 transition">+</span>
                    `}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

      </div>
    `;

    this.attachEventListeners();
  }

  attachEventListeners() {
    // 1. Ay Değiştirme Butonları
    const btnPrev = this.container.querySelector('#btnPrevMonth');
    const btnNext = this.container.querySelector('#btnNextMonth');
    const btnToday = this.container.querySelector('#btnToday');

    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        if (this.currentMonth === 0) {
          this.currentMonth = 11;
          this.currentYear -= 1;
        } else {
          this.currentMonth -= 1;
        }
        this.render();
      });
    }

    if (btnNext) {
      btnNext.addEventListener('click', () => {
        if (this.currentMonth === 11) {
          this.currentMonth = 0;
          this.currentYear += 1;
        } else {
          this.currentMonth += 1;
        }
        this.render();
      });
    }

    if (btnToday) {
      btnToday.addEventListener('click', () => {
        const now = new Date();
        this.currentYear = now.getFullYear();
        this.currentMonth = now.getMonth();
        this.render();
      });
    }

    // 2. Sürüklenebilir Split Kartları (Drag Source)
    const splitChips = this.container.querySelectorAll('.split-chip');
    splitChips.forEach(chip => {
      chip.addEventListener('dragstart', (e) => {
        const splitId = chip.dataset.split;
        e.dataTransfer.setData('text/plain', splitId);
        e.dataTransfer.effectAllowed = 'copy';
      });

      // Mobil & Tıklayarak Seçme
      chip.addEventListener('click', () => {
        const splitId = chip.dataset.split;
        if (this.selectedSplitToPlace === splitId) {
          this.selectedSplitToPlace = null;
        } else {
          this.selectedSplitToPlace = splitId;
        }
        this.render();
      });
    });

    // 3. Takvim Gün Hücreleri (Drop Target & Click)
    const dayCells = this.container.querySelectorAll('.day-cell');
    dayCells.forEach(cell => {
      const dateKey = cell.dataset.date;

      // Drag Over
      cell.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        cell.classList.add('border-cyan-400', 'bg-cyan-500/10');
      });

      // Drag Leave
      cell.addEventListener('dragleave', () => {
        cell.classList.remove('border-cyan-400', 'bg-cyan-500/10');
      });

      // Drop
      cell.addEventListener('drop', (e) => {
        e.preventDefault();
        cell.classList.remove('border-cyan-400', 'bg-cyan-500/10');
        const splitId = e.dataTransfer.getData('text/plain');
        if (splitId && dateKey) {
          agendaStorage.setSplitForDate(dateKey, splitId);
          this.render();
        }
      });

      // Tıklama ile yerleştirme (Tap-to-place fallback)
      cell.addEventListener('click', (e) => {
        if (e.target.closest('.btn-remove-split')) return;
        if (this.selectedSplitToPlace && dateKey) {
          agendaStorage.setSplitForDate(dateKey, this.selectedSplitToPlace);
          this.render();
        }
      });
    });

    // 4. Split Silme Butonları (×)
    const removeBtns = this.container.querySelectorAll('.btn-remove-split');
    removeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const dateKey = btn.dataset.date;
        if (dateKey) {
          agendaStorage.removeSplit(dateKey);
          this.render();
        }
      });
    });
  }
}
