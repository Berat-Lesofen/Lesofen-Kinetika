/**
 * LESOFEN KINETIKA - Muscle Detail Panel Component
 * Seçili kasın anatomik, biyomekanik ve egzersiz ilişkilerini gösteren analitik panel
 */

import { graph } from '../core/graph.js';
import { state } from '../core/state.js';

export class MuscleDetailPanel {
  constructor(containerElement) {
    this.container = containerElement;
    this.render = this.render.bind(this);
    state.subscribe(() => this.render());
  }

  render() {
    const s = state.getState();
    const muscle = graph.getMuscle(s.selectedMuscleId);

    if (!muscle) {
      this.container.innerHTML = `
        <div class="p-8 text-center text-slate-500">
          <p class="font-mono text-sm">İncelenecek bir kas seçin veya anatomik görseldeki hedeflere dokunun.</p>
        </div>
      `;
      return;
    }

    const movements = graph.getMovementsForMuscle(muscle.id);
    const exercises = graph.getExercisesForMuscle(muscle.id);
    const insights = graph.getInsightsForMuscle(muscle.id);

    this.container.innerHTML = `
      <div class="muscle-panel-inner animate-fadeIn">
        <!-- Başlık Kartı -->
        <div class="panel-header border-b border-slate-800 pb-4 mb-5">
          <div class="flex items-center justify-between gap-2 mb-2">
            <span class="badge-category font-mono text-xs px-2.5 py-0.5 rounded border border-amber-500/30 text-amber-400 bg-amber-500/10">
              ${muscle.category}
            </span>
            <span class="badge-depth font-mono text-[10px] px-2 py-0.5 rounded border ${
              muscle.depthLayer === 'deep' 
                ? 'border-purple-500/40 text-purple-300 bg-purple-500/15' 
                : 'border-cyan-500/40 text-cyan-300 bg-cyan-500/15'
            }">
              ${muscle.depthLayer === 'deep' ? 'Derin Katman' : 'Yüzeyel Katman'}
            </span>
          </div>
          <h2 class="font-serif text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span class="w-3 h-3 rounded-full shrink-0" style="background-color: ${muscle.color};"></span>
            ${muscle.name}
          </h2>
          <p class="text-sm font-serif italic text-slate-400 mt-0.5">${muscle.latinName}</p>
        </div>

        <!-- 1. Anatomik Yapışma & İnnervasyon -->
        <div class="section-block bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 mb-4">
          <h3 class="font-mono text-xs text-cyan-400 font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            Anatomik Yapışma & İnnervasyon
          </h3>
          <div class="space-y-2 text-xs">
            <div>
              <span class="text-slate-400 font-semibold">Origin (Başlangıç):</span>
              <p class="text-slate-200 mt-0.5 leading-relaxed">${muscle.attachments.origin}</p>
            </div>
            <div>
              <span class="text-slate-400 font-semibold">Insertion (Tutunma):</span>
              <p class="text-slate-200 mt-0.5 leading-relaxed">${muscle.attachments.insertion}</p>
            </div>
            <div class="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span class="text-slate-400 font-semibold">Sinir / Kök:</span>
              <span class="font-mono text-amber-300 font-medium">${muscle.innervation.nerve} (${muscle.innervation.roots})</span>
            </div>
          </div>
        </div>

        <!-- 2. Fonksiyonel Hareketler & Biyomekanik Rol -->
        <div class="section-block bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 mb-4">
          <h3 class="font-mono text-xs text-emerald-400 font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            Fonksiyonel Hareketler & Rol Dağılımı
          </h3>
          <div class="space-y-2.5">
            ${movements.map(m => {
              const details = m.movementDetails;
              const hasPlane = details.plane && details.plane !== "Bilinmiyor" && details.plane !== "-";
              const hasAxis = details.axis && details.axis !== "Bilinmiyor" && details.axis !== "-";

              return `
                <div class="movement-jump-card p-3 rounded-lg bg-slate-950/70 border border-slate-800/70 hover:border-cyan-500/60 transition cursor-pointer group" data-movement="${m.movement}">
                  <div class="flex items-center justify-between gap-2 mb-1.5">
                    <span class="font-bold text-xs text-slate-100 group-hover:text-cyan-300 transition flex items-center gap-1">
                      ${details.name || m.movement}
                      <span class="text-[10px] text-cyan-500 opacity-0 group-hover:opacity-100 transition">→</span>
                    </span>
                    <span class="font-mono text-[10px] px-2 py-0.5 rounded uppercase font-semibold shrink-0 ${
                      m.role === 'prime_mover' 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : (m.role === 'synergist' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-slate-700/30 text-slate-300 border border-slate-700/40')
                    }">
                      ${m.role === 'prime_mover' ? 'Primer Motor' : (m.role === 'synergist' ? 'Sinerjist' : 'Stabilizatör')}
                    </span>
                  </div>
                  <p class="text-xs text-slate-300 leading-normal">${m.description}</p>
                  
                  ${(hasPlane || hasAxis) ? `
                    <div class="mt-2 pt-2 border-t border-slate-900 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-mono text-slate-400">
                      ${hasPlane ? `<span>Düzlem: <span class="text-slate-200">${details.plane}</span></span>` : ''}
                      ${hasAxis ? `<span>Eksen: <span class="text-slate-200">${details.axis}</span></span>` : ''}
                    </div>
                  ` : ''}
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- 3. Biyomekanik & Direnç Profili -->
        <div class="section-block bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 mb-4">
          <h3 class="font-mono text-xs text-amber-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            Biyomekanik & Direnç Profili
          </h3>
          <p class="text-xs text-slate-300 leading-relaxed mb-2.5">${muscle.biomechanics.momentArmType}</p>
          <div class="p-2.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs leading-relaxed">
            <span class="font-bold font-mono">Direnç Yolu Notu:</span> ${muscle.biomechanics.resistanceProfileTip}
          </div>
        </div>

        <!-- 4. Egzersizler ve feelNote -->
        <div class="section-block bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 mb-4">
          <h3 class="font-mono text-xs text-cyan-400 font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
            İlgili Egzersizler & Kaldırma Hissi
          </h3>
          <div class="space-y-3">
            ${muscle.exercises.map(ex => `
              <div class="exercise-jump-card p-3 rounded-lg bg-slate-950/70 border border-slate-800 hover:border-amber-500/60 transition cursor-pointer group" data-exercise="${ex.id}">
                <div class="flex items-center justify-between mb-1">
                  <span class="font-bold text-xs text-white group-hover:text-amber-300 transition flex items-center gap-1">
                    ${ex.name}
                    <span class="text-[10px] text-amber-500 opacity-0 group-hover:opacity-100 transition">→</span>
                  </span>
                  <span class="font-mono text-[10px] text-amber-400 font-semibold uppercase">${ex.role === 'prime_mover' ? 'Primer Katkı' : 'Destek / Sinerji'}</span>
                </div>
                <p class="text-xs text-slate-400 mb-2">${ex.mechanicsSummary}</p>
                <div class="p-2 rounded bg-slate-900/90 border border-slate-800 text-[11px] text-cyan-200">
                  <span class="font-mono font-semibold text-cyan-400">🎯 feelNote:</span> ${ex.feelNote}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 5. "Neden Hissediyorum?" İpuçları -->
        ${insights.length > 0 ? `
          <div class="section-block bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 mb-4">
            <h3 class="font-mono text-xs text-rose-400 font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Neden Hissediyorum?
            </h3>
            ${insights.map(ins => `
              <div class="p-2.5 rounded bg-slate-950 border border-slate-800/80 mb-2">
                <p class="text-xs font-semibold text-slate-200 mb-1">${ins.question}</p>
                <p class="text-xs text-slate-400 leading-relaxed">${ins.summary}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- 6. Kaynakça & Bilimsel Literatür -->
        <div class="section-block border-t border-slate-800 pt-3 text-[11px] text-slate-500">
          <span class="font-mono text-slate-400 font-bold uppercase">Evidence (Literatür):</span>
          <ul class="list-disc list-inside mt-1 space-y-0.5">
            ${muscle.evidence.map(ev => `<li>${ev}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  attachEventListeners() {
    // Harekete Zıpla
    this.container.querySelectorAll('.movement-jump-card').forEach(card => {
      card.addEventListener('click', () => {
        const movId = card.dataset.movement;
        state.selectMovement(movId);
        state.setState({ activeTab: 'movements' });
      });
    });

    // Egzersize Zıpla
    this.container.querySelectorAll('.exercise-jump-card').forEach(card => {
      card.addEventListener('click', () => {
        const exId = card.dataset.exercise;
        state.selectExercise(exId);
        state.setState({ activeTab: 'exercises' });
      });
    });
  }
}
