/**
 * LESOFEN KINETIKA - Interactive Biomechanics Laboratory
 * Dinamik Moment Kolu (External vs Internal Moment Arm) ve Tork Simülatörü
 * 4 Ana Kinematik Model:
 * 1. Dumbbell Lateral Raise (Omuz Dış Moment Kolu)
 * 2. Biceps Curl (İç Tendon Momenti vs Dış Dambıl Momenti)
 * 3. Squat Kaldıracı (High-Bar vs Low-Bar: Diz vs Kalça Moment Kolu Dağılımı)
 * 4. Bench Press (Dirsek Açısı: 45° Tucked vs 90° Flared & Omuz Makaslama Torku)
 */

import { state } from '../core/state.js';

export class BiomechanicsLab {
  constructor(containerElement) {
    this.container = containerElement;

    const initialSim = state?.getState()?.activeBioSim || "lateral_raise";
    this.state = {
      activeSim: initialSim, // lateral_raise | biceps_curl | squat_lever | bench_mechanics
      // Lateral Raise Params
      latRaiseAngle: 60, // 0 - 120 derece
      latRaiseWeightKg: 10,
      armLengthM: 0.62,
      // Biceps Curl Params
      curlAngle: 75, // 0 - 140 derece
      curlWeightKg: 15,
      forearmLengthM: 0.35,
      // Squat Params
      squatBarType: "high_bar", // high_bar | low_bar
      squatTrunkAngle: 65, // 45 - 80 derece (dikeye göre)
      squatDepthPercent: 80, // % çöküş derinliği
      // Bench Press Params
      benchElbowAngle: 60, // 45 - 90 derece
      benchGripWidth: "medium" // narrow | medium | wide
    };

    this.render = this.render.bind(this);

    if (state && typeof state.subscribe === 'function') {
      state.subscribe((s) => {
        if (s.activeTab === 'biolab') {
          if (s.activeBioSim && s.activeBioSim !== this.state.activeSim) {
            this.state.activeSim = s.activeBioSim;
          }
          this.render();
        }
      });
    }

    this.render();
  }

  render() {
    if (!this.container) return;

    const currentBioSim = state?.getState()?.activeBioSim;
    if (currentBioSim && ['lateral_raise', 'biceps_curl', 'squat_lever', 'bench_mechanics'].includes(currentBioSim)) {
      this.state.activeSim = currentBioSim;
    }

    this.container.innerHTML = `
      <div class="biolab-container max-w-5xl mx-auto p-4 md:p-6 animate-fadeIn">
        <!-- Üst Başlık & Simülatör Seçici -->
        <div class="border-b border-slate-800 pb-5 mb-6">
          <div class="flex items-center gap-2 mb-1">
            <span class="font-mono text-xs text-amber-400 font-bold uppercase tracking-wider">BİYOMEKANİK LABORATUVARI</span>
            <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">Vektör & Tork Motoru</span>
          </div>
          <h2 class="text-2xl md:text-3xl font-black text-white tracking-tight">Kuvvet, Moment Kolu ve Eklem Torku</h2>
          <p class="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl">
            "Ağırlık neden bazı açılarda daha zor hissedilir?" sorusunun yanıtı dambılın kütlesinde değil; 
            eklem dönme ekseni ile yerçekimi hattı arasındaki dik mesafede (<span class="text-amber-400 font-semibold font-mono">External Moment Arm</span>) yatar.
          </p>

          <!-- 4 Simülatör Sekmesi -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-2 mt-5">
            <button id="simTabLateral" class="p-2.5 rounded-xl font-mono text-xs font-semibold border transition text-left ${
              this.state.activeSim === 'lateral_raise' 
                ? 'bg-amber-500/15 border-amber-500/60 text-amber-300 shadow-lg shadow-amber-500/10' 
                : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:bg-slate-800/70 hover:text-slate-200'
            }">
              <span class="block text-[10px] text-amber-400/80 mb-0.5">01 · OMUZ</span>
              Lateral Raise
            </button>
            <button id="simTabBiceps" class="p-2.5 rounded-xl font-mono text-xs font-semibold border transition text-left ${
              this.state.activeSim === 'biceps_curl' 
                ? 'bg-cyan-500/15 border-cyan-500/60 text-cyan-300 shadow-lg shadow-cyan-500/10' 
                : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:bg-slate-800/70 hover:text-slate-200'
            }">
              <span class="block text-[10px] text-cyan-400/80 mb-0.5">02 · DİRSEK</span>
              Biceps Curl
            </button>
            <button id="simTabSquat" class="p-2.5 rounded-xl font-mono text-xs font-semibold border transition text-left ${
              this.state.activeSim === 'squat_lever' 
                ? 'bg-emerald-500/15 border-emerald-500/60 text-emerald-300 shadow-lg shadow-emerald-500/10' 
                : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:bg-slate-800/70 hover:text-slate-200'
            }">
              <span class="block text-[10px] text-emerald-400/80 mb-0.5">03 · KALÇA & DİZ</span>
              Squat Kaldıracı
            </button>
            <button id="simTabBench" class="p-2.5 rounded-xl font-mono text-xs font-semibold border transition text-left ${
              this.state.activeSim === 'bench_mechanics' 
                ? 'bg-rose-500/15 border-rose-500/60 text-rose-300 shadow-lg shadow-rose-500/10' 
                : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:bg-slate-800/70 hover:text-slate-200'
            }">
              <span class="block text-[10px] text-rose-400/80 mb-0.5">04 · GÖĞÜS & İTİŞ</span>
              Bench Press
            </button>
          </div>
        </div>

        <!-- Seçili Simülatör Alanı -->
        <div id="simContentArea">
          ${this.renderActiveSimulator()}
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  renderActiveSimulator() {
    switch (this.state.activeSim) {
      case "lateral_raise":
        return this.renderLateralRaiseSim();
      case "biceps_curl":
        return this.renderBicepsCurlSim();
      case "squat_lever":
        return this.renderSquatLeverSim();
      case "bench_mechanics":
        return this.renderBenchMechanicsSim();
      default:
        return this.renderLateralRaiseSim();
    }
  }

  // ==========================================
  // 1. LATERAL RAISE SIMÜLATÖRÜ
  // ==========================================
  renderLateralRaiseVisual() {
    const angle = this.state.latRaiseAngle;
    const weightKg = this.state.latRaiseWeightKg;
    const armM = this.state.armLengthM;

    const angleRad = (angle * Math.PI) / 180;
    const forceN = weightKg * 9.81;
    const externalMomentArmM = armM * Math.sin(angleRad);
    const torqueNm = forceN * externalMomentArmM;

    const shoulderX = 120;
    const shoulderY = 240;
    const armPixelLength = 170;

    const handX = shoulderX + armPixelLength * Math.sin(angleRad);
    const handY = shoulderY + armPixelLength * Math.cos(angleRad);
    const gravityLineEndY = Math.max(handY + 90, 360);

    return `
      <div class="w-full flex items-center justify-between text-xs font-mono mb-2">
        <span class="text-slate-400">Kinematik Görselleştirme (Frontal / Skapular Düzlem)</span>
        <span class="text-amber-400 font-bold">Açı: ${angle}°</span>
      </div>

      <svg viewBox="0 0 380 400" class="w-full max-w-[380px] h-auto aspect-[380/400] select-none">
        <defs>
          <pattern id="gridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1" />
          </pattern>
          <marker id="arrowRed" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M 0 0 L 6 3 L 0 6 z" fill="#ef4444" />
          </marker>
          <marker id="arrowCyan" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M 0 0 L 6 3 L 0 6 z" fill="#00f2fe" />
          </marker>
        </defs>
        <rect width="380" height="400" fill="url(#gridPattern)" />

        <!-- Gövde Referans Çizgisi -->
        <line x1="${shoulderX}" y1="60" x2="${shoulderX}" y2="380" stroke="#1e2433" stroke-width="2" stroke-dasharray="4,4" />
        <text x="${shoulderX - 10}" y="390" fill="#64748b" font-size="9" font-family="monospace" text-anchor="end">Gövde Ekseni</text>

        <!-- Yerçekimi Doğrultusu (Kırmızı Kesikli Çizgi) -->
        <line x1="${handX}" y1="${handY}" x2="${handX}" y2="${gravityLineEndY}" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="3,3" />
        <line x1="${handX}" y1="${handY}" x2="${handX}" y2="${handY + 55}" stroke="#ef4444" stroke-width="2.5" marker-end="url(#arrowRed)" />
        <text x="${handX + 8}" y="${handY + 35}" fill="#ef4444" font-size="10" font-family="monospace" font-weight="bold">F = ${forceN.toFixed(0)} N</text>

        <!-- External Moment Kolu (Mavi Yatay Dikme) -->
        <line x1="${shoulderX}" y1="${handY}" x2="${handX}" y2="${handY}" stroke="#00f2fe" stroke-width="2.5" marker-end="url(#arrowCyan)" />
        <rect x="${shoulderX + (handX - shoulderX)/2 - 35}" y="${handY - 18}" width="70" height="15" rx="3" fill="rgba(8,9,12,0.85)" stroke="rgba(0,242,254,0.3)" />
        <text x="${shoulderX + (handX - shoulderX)/2}" y="${handY - 7}" fill="#00f2fe" font-size="10" font-family="monospace" text-anchor="middle" font-weight="bold">
          d = ${(externalMomentArmM * 100).toFixed(1)} cm
        </text>

        <!-- Kol (Kemik Segmenti) -->
        <line x1="${shoulderX}" y1="${shoulderY}" x2="${handX}" y2="${handY}" stroke="#e2e8f0" stroke-width="7" stroke-linecap="round" />
        <line x1="${shoulderX}" y1="${shoulderY}" x2="${handX}" y2="${handY}" stroke="#ff9f1c" stroke-width="2" stroke-linecap="round" />

        <!-- Omuz Eklemi (Dönme Ekseni / Fulcrum) -->
        <circle cx="${shoulderX}" cy="${shoulderY}" r="10" fill="#0f172a" stroke="#00f2fe" stroke-width="3" />
        <circle cx="${shoulderX}" cy="${shoulderY}" r="4" fill="#00f2fe" />
        <text x="${shoulderX - 15}" y="${shoulderY - 14}" fill="#94a3b8" font-size="10" font-family="monospace" text-anchor="end">Omuz Ekseni</text>

        <!-- Dambıl / El -->
        <circle cx="${handX}" cy="${handY}" r="12" fill="#ff9f1c" stroke="#fff" stroke-width="2" />
        <text x="${handX}" y="${handY + 4}" fill="#08090c" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">${weightKg}k</text>
      </svg>

      <!-- Tork Gösterge Rozeti -->
      <div class="mt-3 w-full bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
        <span class="text-xs font-mono text-slate-400">Omuz Eklem Torku (T = F × d):</span>
        <span class="text-lg font-mono font-black text-amber-400">${torqueNm.toFixed(1)} N·m</span>
      </div>
    `;
  }

  renderLateralRaiseSim() {
    const angle = this.state.latRaiseAngle;
    const weightKg = this.state.latRaiseWeightKg;

    return `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <!-- Sol Panel: İnteraktif SVG Mekanik Çizimi -->
        <div id="simVisualArea" class="lg:col-span-7 bg-slate-950 border border-slate-800/90 rounded-2xl p-4 sm:p-5 shadow-2xl relative overflow-hidden flex flex-col items-center">
          ${this.renderLateralRaiseVisual()}
        </div>

        <!-- Sağ Panel: Parametreler & Analitik Açıklama -->
        <div id="simControlsArea" class="lg:col-span-5 space-y-4">
          <div class="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-4">
            <h3 class="text-xs font-mono text-cyan-400 uppercase font-bold tracking-wider">Simülasyon Kontrolleri</h3>
            <div>
              <div class="flex justify-between text-xs font-mono mb-1">
                <span class="text-slate-300">Kol Elevasyon Açısı (θ):</span>
                <span id="latAngleBadge" class="text-amber-400 font-bold">${angle}°</span>
              </div>
              <input type="range" id="sliderLatAngle" min="0" max="110" value="${angle}" class="w-full accent-amber-500 cursor-pointer">
            </div>

            <div>
              <span class="text-xs font-mono text-slate-300 block mb-1.5">Dambıl Ağırlığı:</span>
              <div class="grid grid-cols-4 gap-1.5">
                ${[6, 8, 10, 14].map(w => `
                  <button class="weight-btn py-1.5 rounded text-xs font-mono font-bold border transition ${
                    weightKg === w ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }" data-weight="${w}">${w} kg</button>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Biyomekanik Çıkarım -->
          <div class="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs leading-relaxed text-slate-300">
            <span class="font-mono font-bold text-amber-400 block">Kinetik Analiz & Çıkarım:</span>
            <p>
              Kol aşağıdayken (0°) yerçekimi çizgisi omuz ekleminden geçtiği için dış moment kolu <strong>0 cm</strong>'dir ve omuza binen tork sıfırdır.
            </p>
            <p>
              Kol 90°'ye yaklaştıkça yerçekimi hattı ile omuz eklemi arasındaki dik mesafe maksimuma ($L_{\\text{kol}} \\approx 62\\text{ cm}$) ulaşır; 
              bu nedenle dambıl hafif olsa bile en yüksek deltoid torku 90° civarında talep edilir.
            </p>
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================
  // 2. BICEPS CURL SIMÜLATÖRÜ
  // ==========================================
  renderBicepsCurlVisual() {
    const angle = this.state.curlAngle;
    const weightKg = this.state.curlWeightKg;
    const forearmM = this.state.forearmLengthM;

    const angleRad = (angle * Math.PI) / 180;
    const extMomentM = forearmM * Math.sin(angleRad);
    const extTorqueNm = weightKg * 9.81 * extMomentM;

    // İç Moment Kolu (Tendon kaldıracı ~90 derecede pik yapar)
    const intMomentCm = 1.8 + 3.2 * Math.sin(angleRad);
    const intMomentM = intMomentCm / 100;
    const tendonForceN = intMomentM > 0 ? (extTorqueNm / intMomentM) : 0;

    const elbowX = 140;
    const elbowY = 240;
    const forearmPixel = 160;

    const handX = elbowX + forearmPixel * Math.sin(angleRad);
    const handY = elbowY - forearmPixel * Math.cos(angleRad);

    return `
      <div class="w-full flex items-center justify-between text-xs font-mono mb-2">
        <span class="text-slate-400">Dirsek Fleksiyonu & Kaldıraç Çakışması</span>
        <span class="text-cyan-400 font-bold">Dirsek Açısı: ${angle}°</span>
      </div>

      <svg viewBox="0 0 380 380" class="w-full max-w-[380px] h-auto aspect-[1/1] select-none">
        <defs>
          <pattern id="gridCurl" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1" />
          </pattern>
        </defs>
        <rect width="380" height="380" fill="url(#gridCurl)" />

        <!-- Üst Kol (Humerus - Sabit Dikey) -->
        <line x1="${elbowX}" y1="80" x2="${elbowX}" y2="${elbowY}" stroke="#475569" stroke-width="12" stroke-linecap="round" />
        <text x="${elbowX - 15}" y="140" fill="#64748b" font-size="10" font-family="monospace" text-anchor="end">Humerus</text>

        <!-- Önkol (Radius/Ulna) -->
        <line x1="${elbowX}" y1="${elbowY}" x2="${handX}" y2="${handY}" stroke="#e2e8f0" stroke-width="8" stroke-linecap="round" />
        <line x1="${elbowX}" y1="${elbowY}" x2="${handX}" y2="${handY}" stroke="#00f2fe" stroke-width="2" stroke-linecap="round" />

        <!-- Biceps Tendon Çizgisi (İç Moment) -->
        <line x1="${elbowX}" y1="130" x2="${elbowX + 30 * Math.sin(angleRad)}" y2="${elbowY - 30 * Math.cos(angleRad)}" stroke="#ef4444" stroke-width="4" stroke-linecap="round" />

        <!-- Dirsek Eklemi (Fulcrum) -->
        <circle cx="${elbowX}" cy="${elbowY}" r="11" fill="#0f172a" stroke="#00f2fe" stroke-width="3" />
        <circle cx="${elbowX}" cy="${elbowY}" r="4" fill="#00f2fe" />

        <!-- Dambıl -->
        <circle cx="${handX}" cy="${handY}" r="14" fill="#ff9f1c" stroke="#fff" stroke-width="2" />
        <text x="${handX}" y="${handY + 4}" fill="#08090c" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">${weightKg}k</text>
      </svg>

      <!-- Gösterge -->
      <div class="mt-3 w-full grid grid-cols-2 gap-2">
        <div class="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5">
          <span class="text-[10px] font-mono text-slate-400 block">Dış Moment Kolu:</span>
          <span class="text-sm font-mono font-bold text-amber-400">${(extMomentM * 100).toFixed(1)} cm</span>
        </div>
        <div class="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5">
          <span class="text-[10px] font-mono text-slate-400 block">Biceps Tendon Çekişi:</span>
          <span class="text-sm font-mono font-bold text-cyan-400">${tendonForceN.toFixed(0)} N</span>
        </div>
      </div>
    `;
  }

  renderBicepsCurlSim() {
    const angle = this.state.curlAngle;

    return `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div id="simVisualArea" class="lg:col-span-7 bg-slate-950 border border-slate-800/90 rounded-2xl p-4 sm:p-5 shadow-2xl relative overflow-hidden flex flex-col items-center">
          ${this.renderBicepsCurlVisual()}
        </div>

        <div id="simControlsArea" class="lg:col-span-5 space-y-4">
          <div class="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-4">
            <h3 class="text-xs font-mono text-cyan-400 uppercase font-bold tracking-wider">Simülasyon Kontrolleri</h3>
            <div>
              <div class="flex justify-between text-xs font-mono mb-1">
                <span class="text-slate-300">Dirsek Fleksiyon Açısı:</span>
                <span id="curlAngleBadge" class="text-cyan-400 font-bold">${angle}°</span>
              </div>
              <input type="range" id="sliderCurlAngle" min="15" max="135" value="${angle}" class="w-full accent-cyan-500 cursor-pointer">
            </div>
          </div>

          <div class="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs leading-relaxed text-slate-300">
            <span class="font-mono font-bold text-cyan-400 block">Biyomekanik Çıkarım:</span>
            <p>
              Biceps tendonunun iç moment kolu dirsek yaklaşık 80°-100° bükülüyken zirveye ulaşır. 
              Aynı zamanda önkol yere paralelken dambılın dış moment kolu da zirveye ulaşır.
            </p>
            <p>
              Bu çakışma nedeniyle ayakta dambıl curl yaparken hareket açıklığının tam ortası (~90°) en yüksek mekanik gerilim noktasını oluşturur.
            </p>
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================
  // 3. SQUAT KALDIRACI (HIGH-BAR VS LOW-BAR)
  // ==========================================
  renderSquatLeverVisual() {
    const isLowBar = this.state.squatBarType === "low_bar";
    const kneeMomentCm = isLowBar ? 14 : 24;
    const hipMomentCm = isLowBar ? 32 : 20;

    const ankleX = 175;
    const ankleY = 320;
    const kneeX = 190 + (kneeMomentCm * 2.8);
    const kneeY = 240;
    const hipX = 190 - (hipMomentCm * 2.8);
    const hipY = 230;
    const barX = 190;
    const barY = isLowBar ? 110 : 85;

    return `
      <div class="w-full flex items-center justify-between text-xs font-mono mb-2">
        <span class="text-slate-400">Squat Eklem Kaldıracı (Sagital Düzlem)</span>
        <span class="text-emerald-400 font-bold">${isLowBar ? 'Low-Bar (Kalça Dominant)' : 'High-Bar (Diz Dominant)'}</span>
      </div>

      <svg viewBox="0 0 380 360" class="w-full max-w-[380px] h-auto aspect-[380/360] select-none">
        <defs>
          <pattern id="gridSquat" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1" />
          </pattern>
        </defs>
        <rect width="380" height="360" fill="url(#gridSquat)" />

        <!-- Yerçekimi Çizgisi (Ayak Ortası - Midfoot Hattı) -->
        <line x1="190" y1="30" x2="190" y2="340" stroke="#475569" stroke-width="2" stroke-dasharray="4,4" />
        <text x="195" y="345" fill="#64748b" font-size="9" font-family="monospace">Mid-Foot Yerçekimi Ekseni</text>

        <!-- Ayak Tabanı -->
        <line x1="140" y1="320" x2="230" y2="320" stroke="#94a3b8" stroke-width="6" stroke-linecap="round" />

        <!-- Kaval / Tibia -->
        <line x1="${ankleX}" y1="${ankleY}" x2="${kneeX}" y2="${kneeY}" stroke="#e2e8f0" stroke-width="6" stroke-linecap="round" />
        <!-- Uyluk / Femur -->
        <line x1="${kneeX}" y1="${kneeY}" x2="${hipX}" y2="${hipY}" stroke="#e2e8f0" stroke-width="7" stroke-linecap="round" />
        <!-- Gövde / Omurga -->
        <line x1="${hipX}" y1="${hipY}" x2="${barX}" y2="${barY}" stroke="#e2e8f0" stroke-width="8" stroke-linecap="round" />

        <!-- Diz Moment Kolu (Mavi Yatay Dikme) -->
        <line x1="190" y1="${kneeY}" x2="${kneeX}" y2="${kneeY}" stroke="#00f2fe" stroke-width="2.5" />
        <text x="${190 + (kneeX - 190)/2}" y="${kneeY - 6}" fill="#00f2fe" font-size="9" font-family="monospace" text-anchor="middle" font-weight="bold">
          d_diz: ${kneeMomentCm}cm
        </text>

        <!-- Kalça Moment Kolu (Yeşil Yatay Dikme) -->
        <line x1="190" y1="${hipY}" x2="${hipX}" y2="${hipY}" stroke="#10b981" stroke-width="2.5" />
        <text x="${190 - (190 - hipX)/2}" y="${hipY - 6}" fill="#10b981" font-size="9" font-family="monospace" text-anchor="middle" font-weight="bold">
          d_kalça: ${hipMomentCm}cm
        </text>

        <!-- Eklemler -->
        <circle cx="${kneeX}" cy="${kneeY}" r="7" fill="#00f2fe" />
        <circle cx="${hipX}" cy="${hipY}" r="8" fill="#10b981" />

        <!-- Barbell (Yük Merkezi) -->
        <circle cx="${barX}" cy="${barY}" r="12" fill="#ef4444" stroke="#fff" stroke-width="2" />
        <text x="${barX}" y="${barY + 4}" fill="#fff" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">BAR</text>
      </svg>

      <!-- Tork Dağılımı Çubuğu -->
      <div class="mt-3 w-full grid grid-cols-2 gap-2 text-xs font-mono">
        <div class="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
          <span class="text-cyan-400 block font-bold">Diz Ekstansiyon Talebi:</span>
          <span class="text-slate-300">${isLowBar ? 'Daha Düşük (Quadriceps koruyucu)' : 'Daha Yüksek (Quadriceps odaklı)'}</span>
        </div>
        <div class="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
          <span class="text-emerald-400 block font-bold">Kalça Ekstansiyon Talebi:</span>
          <span class="text-slate-300">${isLowBar ? 'Daha Yüksek (Gluteus dominant)' : 'Daha Düşük (Dengeli)'}</span>
        </div>
      </div>
    `;
  }

  renderSquatLeverSim() {
    const isLowBar = this.state.squatBarType === "low_bar";

    return `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div id="simVisualArea" class="lg:col-span-7 bg-slate-950 border border-slate-800/90 rounded-2xl p-4 sm:p-5 shadow-2xl relative overflow-hidden flex flex-col items-center">
          ${this.renderSquatLeverVisual()}
        </div>

        <div id="simControlsArea" class="lg:col-span-5 space-y-4">
          <div class="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-3">
            <h3 class="text-xs font-mono text-emerald-400 uppercase font-bold tracking-wider">Barbell Pozisyonu Seçimi</h3>
            <div class="grid grid-cols-2 gap-2">
              <button id="btnSquatHigh" class="p-3 rounded-xl border text-xs font-mono font-bold transition ${
                !isLowBar ? 'bg-emerald-500 text-slate-950 border-emerald-400' : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
              }">High-Bar Squat</button>
              <button id="btnSquatLow" class="p-3 rounded-xl border text-xs font-mono font-bold transition ${
                isLowBar ? 'bg-emerald-500 text-slate-950 border-emerald-400' : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
              }">Low-Bar Squat</button>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs leading-relaxed text-slate-300">
            <span class="font-mono font-bold text-emerald-400 block">Kaldıraç Mekaniği:</span>
            <p>
              Barbell squat'ta ağırlık daima ayak ortası (mid-foot) hattında dengelenmek zorundadır.
            </p>
            <p>
              <strong>High-Bar:</strong> Bar trapezius üzerinde durur; gövde daha dik kaldığı için dizler öne doğru kayar. Bu durum dizdeki moment kolunu uzatarak <em>Quadriceps</em> yükünü artırır.
            </p>
            <p>
              <strong>Low-Bar:</strong> Bar arka omuz üzerine oturur; gövde öne daha fazla eğilmek zorunda kalır ve kalça geriye uzar. Bu durum kalçadaki moment kolunu büyüterek <em>Gluteus Maximus</em> ve kalça ekstansörlerini ön plana çıkarır.
            </p>
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================
  // 4. BENCH PRESS (DİRSEK AÇISI MEKANİĞİ)
  // ==========================================
  renderBenchMechanicsVisual() {
    const angle = this.state.benchElbowAngle;
    const isFlared = angle >= 75;

    const rad = (angle * Math.PI) / 180;
    const humerusLen = 75;
    const leftElbowX = 150 - humerusLen * Math.sin(rad);
    const leftElbowY = 110 + humerusLen * Math.cos(rad);
    const rightElbowX = 230 + humerusLen * Math.sin(rad);
    const rightElbowY = 110 + humerusLen * Math.cos(rad);

    return `
      <div class="w-full flex items-center justify-between text-xs font-mono mb-2">
        <span class="text-slate-400">Üstten Bakış Mekanik Modeli</span>
        <span class="text-rose-400 font-bold">Dirsek Açıklığı: ${angle}° (${isFlared ? 'Flared / T-Açısı' : 'Tucked / Ok Ucu'})</span>
      </div>

      <svg viewBox="0 0 380 340" class="w-full max-w-[380px] h-auto aspect-[380/340] select-none">
        <defs>
          <pattern id="gridBench" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1" />
          </pattern>
        </defs>
        <rect width="380" height="340" fill="url(#gridBench)" />

        <!-- Gövde / Göğüs Kafesi (Üstten Görünüm) -->
        <rect x="150" y="80" width="80" height="200" rx="20" fill="#1e2433" stroke="#334155" stroke-width="2" />
        <text x="190" y="190" fill="#475569" font-size="10" font-family="monospace" text-anchor="middle">GÖVDE</text>

        <!-- Omuz Eklemleri -->
        <circle cx="150" cy="110" r="10" fill="#0f172a" stroke="#ef4444" stroke-width="2" />
        <circle cx="230" cy="110" r="10" fill="#0f172a" stroke="#ef4444" stroke-width="2" />

        <!-- Humerus Çizgileri -->
        <line x1="150" y1="110" x2="${leftElbowX}" y2="${leftElbowY}" stroke="#e2e8f0" stroke-width="7" stroke-linecap="round" />
        <line x1="230" y1="110" x2="${rightElbowX}" y2="${rightElbowY}" stroke="#e2e8f0" stroke-width="7" stroke-linecap="round" />

        <!-- Barbell Hattı (Dirseklerin üzerinde dikey) -->
        <line x1="40" y1="${leftElbowY}" x2="340" y2="${rightElbowY}" stroke="#ef4444" stroke-width="3" stroke-linecap="round" />

        <!-- Dirsek Eklemleri -->
        <circle cx="${leftElbowX}" cy="${leftElbowY}" r="7" fill="#00f2fe" />
        <circle cx="${rightElbowX}" cy="${rightElbowY}" r="7" fill="#00f2fe" />

        <!-- Barbell Tutuş Noktaları -->
        <circle cx="${leftElbowX}" cy="${leftElbowY}" r="12" fill="rgba(239,68,68,0.3)" stroke="#ef4444" />
        <circle cx="${rightElbowX}" cy="${rightElbowY}" r="12" fill="rgba(239,68,68,0.3)" stroke="#ef4444" />
      </svg>

      <div class="mt-3 w-full bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
        <span class="text-xs font-mono text-slate-400">Eklem Yükü Dağılımı:</span>
        <span class="text-xs font-mono font-bold ${isFlared ? 'text-rose-400' : 'text-emerald-400'}">
          ${isFlared ? '⚠️ Artmış Anterior Eklem Stresi (90°)' : '✅ Dengeli Skapular Düzlem (~45-60°)'}
        </span>
      </div>
    `;
  }

  renderBenchMechanicsSim() {
    const angle = this.state.benchElbowAngle;

    return `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div id="simVisualArea" class="lg:col-span-7 bg-slate-950 border border-slate-800/90 rounded-2xl p-4 sm:p-5 shadow-2xl relative overflow-hidden flex flex-col items-center">
          ${this.renderBenchMechanicsVisual()}
        </div>

        <div id="simControlsArea" class="lg:col-span-5 space-y-4">
          <div class="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-3">
            <h3 class="text-xs font-mono text-rose-400 uppercase font-bold tracking-wider">Dirsek Açısı Kontrolü</h3>
            <div>
              <div class="flex justify-between text-xs font-mono mb-1">
                <span class="text-slate-300">Dirsek - Gövde Açısı:</span>
                <span id="benchAngleBadge" class="text-rose-400 font-bold">${angle}°</span>
              </div>
              <input type="range" id="sliderBenchElbow" min="45" max="90" value="${angle}" class="w-full accent-rose-500 cursor-pointer">
            </div>
          </div>

          <div class="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs leading-relaxed text-slate-300">
            <span class="font-mono font-bold text-rose-400 block">Kinetik Mekanizma:</span>
            <p>
              Dirsekler gövdeye 90° dik açıldığında (T-pozisyonu), humerus horizontal planda geriye açılır; bu açı omuz eklemi anterior kapsülüne binen torku ve subakromiyal bölgedeki baskıyı artırabilir.
            </p>
            <p>
              Dirseklerin gövdeyle yaklaşık 45°-60° açı yaptığı 'ok ucu' formu, pektoralis majör liflerinin çekiş yönüyle uyumludur ve triceps ile omuz eklemi arasında daha dengeli bir yük dağılımı sağlar.
            </p>
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================
  // EVENT LISTENERS
  // ==========================================
  attachEventListeners() {
    if (!this.container) return;

    // 1. Simülatör Sekmeleri (Global state senkronize)
    const tabLateral = this.container.querySelector('#simTabLateral');
    const tabBiceps = this.container.querySelector('#simTabBiceps');
    const tabSquat = this.container.querySelector('#simTabSquat');
    const tabBench = this.container.querySelector('#simTabBench');

    if (tabLateral) {
      tabLateral.addEventListener('click', () => {
        state.openBioLab("lateral_raise", "Lateral Raise Mekaniği");
      });
    }
    if (tabBiceps) {
      tabBiceps.addEventListener('click', () => {
        state.openBioLab("biceps_curl", "Biceps Curl Mekaniği");
      });
    }
    if (tabSquat) {
      tabSquat.addEventListener('click', () => {
        state.openBioLab("squat_lever", "Squat Kaldıracı");
      });
    }
    if (tabBench) {
      tabBench.addEventListener('click', () => {
        state.openBioLab("bench_mechanics", "Bench Press Mekaniği");
      });
    }

    // 2. Simülatör Özel Kontrolleri
    this.attachActiveSimControls();
  }

  attachActiveSimControls() {
    if (!this.container) return;

    // Lateral Raise Slider & Ağırlık Butonları
    const sliderLat = this.container.querySelector('#sliderLatAngle');
    if (sliderLat) {
      sliderLat.addEventListener('input', (e) => {
        this.state.latRaiseAngle = parseInt(e.target.value);
        const badge = this.container.querySelector('#latAngleBadge');
        if (badge) badge.textContent = `${this.state.latRaiseAngle}°`;
        const visual = this.container.querySelector('#simVisualArea');
        if (visual) visual.innerHTML = this.renderLateralRaiseVisual();
      });
    }

    this.container.querySelectorAll('.weight-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.latRaiseWeightKg = parseInt(btn.dataset.weight);
        this.container.querySelectorAll('.weight-btn').forEach(b => {
          const isSelected = parseInt(b.dataset.weight) === this.state.latRaiseWeightKg;
          b.className = `weight-btn py-1.5 rounded text-xs font-mono font-bold border transition ${
            isSelected ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
          }`;
        });
        const visual = this.container.querySelector('#simVisualArea');
        if (visual) visual.innerHTML = this.renderLateralRaiseVisual();
      });
    });

    // Biceps Curl Slider
    const sliderCurl = this.container.querySelector('#sliderCurlAngle');
    if (sliderCurl) {
      sliderCurl.addEventListener('input', (e) => {
        this.state.curlAngle = parseInt(e.target.value);
        const badge = this.container.querySelector('#curlAngleBadge');
        if (badge) badge.textContent = `${this.state.curlAngle}°`;
        const visual = this.container.querySelector('#simVisualArea');
        if (visual) visual.innerHTML = this.renderBicepsCurlVisual();
      });
    }

    // Squat Butonları
    const btnSquatHigh = this.container.querySelector('#btnSquatHigh');
    const btnSquatLow = this.container.querySelector('#btnSquatLow');
    if (btnSquatHigh) {
      btnSquatHigh.addEventListener('click', () => {
        this.state.squatBarType = "high_bar";
        const visual = this.container.querySelector('#simVisualArea');
        if (visual) visual.innerHTML = this.renderSquatLeverVisual();
        btnSquatHigh.className = "p-3 rounded-xl border text-xs font-mono font-bold transition bg-emerald-500 text-slate-950 border-emerald-400";
        if (btnSquatLow) btnSquatLow.className = "p-3 rounded-xl border text-xs font-mono font-bold transition bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800";
      });
    }
    if (btnSquatLow) {
      btnSquatLow.addEventListener('click', () => {
        this.state.squatBarType = "low_bar";
        const visual = this.container.querySelector('#simVisualArea');
        if (visual) visual.innerHTML = this.renderSquatLeverVisual();
        btnSquatLow.className = "p-3 rounded-xl border text-xs font-mono font-bold transition bg-emerald-500 text-slate-950 border-emerald-400";
        if (btnSquatHigh) btnSquatHigh.className = "p-3 rounded-xl border text-xs font-mono font-bold transition bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800";
      });
    }

    // Bench Press Slider
    const sliderBench = this.container.querySelector('#sliderBenchElbow');
    if (sliderBench) {
      sliderBench.addEventListener('input', (e) => {
        this.state.benchElbowAngle = parseInt(e.target.value);
        const badge = this.container.querySelector('#benchAngleBadge');
        if (badge) badge.textContent = `${this.state.benchElbowAngle}°`;
        const visual = this.container.querySelector('#simVisualArea');
        if (visual) visual.innerHTML = this.renderBenchMechanicsVisual();
      });
    }
  }
}
