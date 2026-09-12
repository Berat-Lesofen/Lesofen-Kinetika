/**
 * LESOFEN KINETIKA - Hierarchical Movement Atlas Component (Hareket Atlası)
 * Progressive Disclosure:
 * Level 1: Eklem / Bölge Seçimi (Omuz, Dirsek, Skapula, Kalça, Diz, Ayak Bileği, Omurga)
 * Level 2: O Eklemin Hareketleri & Biyomekanik Eksen / Kuvvet Çifti Detayı
 */

import { graph } from '../core/graph.js';
import { state } from '../core/state.js';

export class MovementAtlas {
  constructor(containerElement, onMuscleSelect) {
    this.container = containerElement;
    this.onMuscleSelect = onMuscleSelect;

    this.render = this.render.bind(this);
    state.subscribe(() => {
      if (state.getState().activeTab === "movements") {
        this.render();
      }
    });
    this.render();
  }

  render() {
    const s = state.getState();
    const activeJoint = s.selectedJoint;

    // Eğer eklem seçilmemişse eklem seçim ekranını göster
    if (!activeJoint && s.movementFlowLevel === 1) {
      this.renderJointSelector();
    } else {
      this.renderJointMovements(activeJoint || "Omuz");
    }
  }

  // ==========================================
  // LEVEL 1: EKLEM SEÇİCİ
  // ==========================================
  renderJointSelector() {
    const joints = [
      { id: "Omuz", icon: "🛡️", name: "Omuz Kompleksi", count: "7 Hareket", desc: "Glenohumeral eklem fleksiyonu, ekstansiyonu, abdüksiyonu ve scaption" },
      { id: "Dirsek", icon: "🦾", name: "Dirsek & Önkol", count: "4 Hareket", desc: "Dirsek fleksiyonu, ekstansiyonu, önkol supinasyonu ve pronasyonu" },
      { id: "Skapula", icon: "🦅", name: "Skapulotorasik (Kürek Kemiği)", count: "5 Hareket", desc: "Skapular elevasyon, depresyon, retraksiyon ve yukarı rotasyon" },
      { id: "Kalça", icon: "⚡", name: "Kalça Eklemi", count: "6 Hareket", desc: "Kalça fleksiyonu, ekstansiyonu, abdüksiyonu ve dış rotasyonu" },
      { id: "Diz", icon: "🦵", name: "Diz Eklemi", count: "2 Hareket", desc: "Diz fleksiyonu (hamstring) ve diz ekstansiyonu (quadriceps)" },
      { id: "Ayak Bileği", icon: "🦶", name: "Ayak Bileği", count: "3 Hareket", desc: "Plantar fleksiyon, dorsifleksiyon (kaval) ve inversiyon" },
      { id: "Omurga", icon: "🏛️", name: "Omurga & Core", count: "4 Hareket", desc: "Lomber fleksiyon, ekstansiyon, lateral bükülme ve gövde rotasyonu" }
    ];

    this.container.innerHTML = `
      <div class="movement-selector max-w-4xl mx-auto p-4 md:p-6 space-y-6 animate-fadeIn">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="font-mono text-xs text-indigo-400 font-bold uppercase tracking-wider">HAREKET ATLASI</span>
            <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">Adım 1 / 2</span>
          </div>
          <h2 class="text-2xl md:text-3xl font-black text-white tracking-tight">Hangi eklem hareketini incelemek istiyorsunuz?</h2>
          <p class="text-xs md:text-sm text-slate-400 mt-1 max-w-xl">
            Aşağıdan bir eklem seçin. O eklem etrafındaki hareket düzlemlerini, agonist ve antagonist kas kuvvet çiftlerini inceleyin.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          ${joints.map(j => `
            <div class="joint-card p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/90 transition-all duration-150 cursor-pointer group shadow-sm hover:shadow-indigo-500/5 hover:-translate-y-0.5" data-joint="${j.id}">
              <div class="flex items-center justify-between mb-2">
                <span class="text-2xl">${j.icon}</span>
                <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/60">${j.count}</span>
              </div>
              <h4 class="text-sm font-bold text-white group-hover:text-indigo-300 transition mb-1">${j.name}</h4>
              <p class="text-[11px] text-slate-400 leading-snug">${j.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    this.container.querySelectorAll('.joint-card').forEach(card => {
      card.addEventListener('click', () => {
        state.selectJoint(card.dataset.joint);
      });
    });
  }

  // ==========================================
  // LEVEL 2: O EKLEMİN HAREKETLERİ & DETAYI
  // ==========================================
  renderJointMovements(jointName) {
    const allMovements = graph.getAllMovements();
    const movements = allMovements.filter(m => m.joint.toLowerCase().includes(jointName.toLowerCase()));
    const s = state.getState();
    const activeMovement = graph.getMovement(s.selectedMovementId) || movements[0] || allMovements[0];
    const activeMuscles = graph.getMusclesForMovement(activeMovement.id);

    this.container.innerHTML = `
      <div class="movement-joint-view max-w-5xl mx-auto p-4 md:p-6 space-y-6 animate-fadeIn">
        <!-- Başlık & Geri Dönüş -->
        <div class="border-b border-slate-800 pb-4">
          <div class="flex items-center justify-between mb-2">
            <button id="btnBackToJoints" class="text-xs font-mono text-slate-400 hover:text-indigo-400 transition flex items-center gap-1">
              ← Tüm Eklemlere Dön
            </button>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              ${jointName} Eklemi · ${movements.length} Hareket
            </span>
          </div>
          <h2 class="text-2xl md:text-3xl font-black text-white tracking-tight">${jointName} Hareketleri</h2>
          <p class="text-xs md:text-sm text-slate-400 mt-1">
            Soldan bir hareket seçerek düzlem, dönme ekseni ve kas kuvvet çifti dağılımını inceleyin.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- Sol Liste: Hareket Seçici -->
          <div class="lg:col-span-4 space-y-2">
            ${movements.map(m => `
              <div class="movement-item-card p-3 rounded-xl border transition cursor-pointer ${
                m.id === activeMovement.id 
                  ? 'bg-indigo-500/15 border-indigo-500/60 shadow-lg shadow-indigo-500/10' 
                  : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900 hover:border-slate-700'
              }" data-id="${m.id}">
                <div class="flex items-center justify-between">
                  <h4 class="font-bold text-xs ${m.id === activeMovement.id ? 'text-indigo-300' : 'text-white'}">${m.name}</h4>
                  <span class="text-[10px] font-mono text-slate-500">${m.plane.split(' ')[0]}</span>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Sağ Panel: Hareket Detayı -->
          <div class="lg:col-span-8 bg-slate-950 border border-slate-800/90 rounded-2xl p-5 shadow-2xl space-y-4">
            <div class="border-b border-slate-800 pb-3">
              <span class="font-mono text-[10px] text-indigo-400 uppercase tracking-wider block mb-1">DÖNME EKSENİ & DÜZLEM</span>
              <h3 class="text-xl font-black text-white">${activeMovement.name}</h3>
              <p class="text-xs text-slate-400 mt-1">${activeMovement.description}</p>
            </div>

            <!-- Düzlem & Eksen Rozetleri -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
              <div class="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span class="text-[10px] text-slate-500 block uppercase">Düzlem:</span>
                <span class="text-slate-200 font-bold">${activeMovement.plane}</span>
              </div>
              <div class="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span class="text-[10px] text-slate-500 block uppercase">Eksen:</span>
                <span class="text-slate-200 font-bold">${activeMovement.axis}</span>
              </div>
              <div class="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span class="text-[10px] text-slate-500 block uppercase">ROM (Açıklık):</span>
                <span class="text-indigo-300 font-bold">${activeMovement.rom}</span>
              </div>
            </div>

            <!-- Primer Motor Kaslar -->
            <div>
              <h4 class="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                Primer Motor Kaslar (Agonists)
              </h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                ${activeMuscles.primeMovers.map(m => `
                  <div class="muscle-jump p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition cursor-pointer flex items-center justify-between" data-id="${m.id}">
                    <div>
                      <div class="font-bold text-xs text-white">${m.name}</div>
                      <div class="text-[10px] text-slate-400 italic">${m.latinName}</div>
                    </div>
                    <span class="text-[10px] font-mono text-emerald-400 shrink-0">Kası İncele →</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Sinerjist Kaslar -->
            ${activeMuscles.synergists.length > 0 ? `
              <div>
                <h4 class="font-mono text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-indigo-400"></span>
                  Sinerjist Kaslar (Destek & Katkı)
                </h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  ${activeMuscles.synergists.map(m => `
                    <div class="muscle-jump p-2 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition cursor-pointer flex items-center justify-between text-xs" data-id="${m.id}">
                      <span class="text-slate-300">${m.name}</span>
                      <span class="text-[10px] font-mono text-indigo-400">→</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <!-- Mekanizma Notu -->
            <div class="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <span class="font-mono font-bold text-amber-400 block mb-1">Kuvvet Çifti & Biyomekanik Mekanizma:</span>
              ${activeMovement.mechanicsNote}
            </div>

            <!-- Biyomekanik CTA -->
            <button id="btnMovToBioLab" class="w-full p-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold flex items-center justify-center gap-2 transition">
              <span>⚡ Bu Hareketin Biyomekanik Simülasyonuna Git</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    `;

    // Event Listeners
    const backBtn = this.container.querySelector('#btnBackToJoints');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        state.openMovements();
      });
    }

    this.container.querySelectorAll('.movement-item-card').forEach(card => {
      card.addEventListener('click', () => {
        state.selectMovement(card.dataset.id);
      });
    });

    this.container.querySelectorAll('.muscle-jump').forEach(card => {
      card.addEventListener('click', () => {
        state.selectMuscle(card.dataset.id);
      });
    });

    const bioBtn = this.container.querySelector('#btnMovToBioLab');
    if (bioBtn) {
      bioBtn.addEventListener('click', () => {
        let sim = "lateral_raise";
        if (activeMovement.id.includes('elbow')) sim = "biceps_curl";
        else if (activeMovement.id.includes('knee') || activeMovement.id.includes('hip')) sim = "squat_lever";
        else if (activeMovement.id.includes('bench') || activeMovement.id.includes('adduction')) sim = "bench_mechanics";
        state.openBioLab(sim, `${activeMovement.name} Mekaniği`);
      });
    }
  }
}
