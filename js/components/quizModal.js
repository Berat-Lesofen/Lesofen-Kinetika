/**
 * LESOFEN KINETIKA - Interactive Functional Anatomy & Biomechanics Quiz
 */

import { QUIZ_QUESTIONS } from '../data/quiz.js';

export class FunctionalQuiz {
  constructor(containerElement) {
    this.container = containerElement;
    this.currentIndex = 0;
    this.selectedOption = null;
    this.isAnswered = false;
    this.score = 0;
    this.isFinished = false;

    this.render();
  }

  render() {
    if (this.isFinished) {
      this.renderFinishedState();
      return;
    }

    const q = QUIZ_QUESTIONS[this.currentIndex];

    this.container.innerHTML = `
      <div class="quiz-container max-w-3xl mx-auto p-4 md:p-6 animate-fadeIn">
        <!-- Üst Bilgi -->
        <div class="border-b border-slate-800 pb-4 mb-6 flex items-center justify-between">
          <div>
            <span class="font-mono text-xs text-purple-400 font-bold uppercase tracking-wider">BİYOMEKANİK TEST MODÜLÜ</span>
            <h2 class="font-serif text-2xl md:text-3xl font-bold text-white mt-0.5">Fonksiyonel Anatomi Bilgini Sına</h2>
          </div>
          <div class="text-right font-mono text-xs text-slate-400">
            Soru <span class="text-purple-400 font-bold text-sm">${this.currentIndex + 1}</span> / ${QUIZ_QUESTIONS.length}
          </div>
        </div>

        <!-- Soru Kartı -->
        <div class="bg-slate-950 border border-slate-800/90 rounded-2xl p-6 shadow-2xl space-y-6">
          <h3 class="font-serif text-lg md:text-xl font-bold text-white leading-relaxed">
            ${q.question}
          </h3>

          <!-- Seçenekler -->
          <div class="space-y-2.5">
            ${q.options.map((opt, idx) => {
              let btnStyle = "bg-slate-900/80 border-slate-800 text-slate-200 hover:bg-slate-800 hover:border-slate-700";
              
              if (this.isAnswered) {
                if (idx === q.correctIndex) {
                  btnStyle = "bg-emerald-500/20 border-emerald-500/60 text-emerald-300 font-semibold";
                } else if (this.selectedOption === idx) {
                  btnStyle = "bg-rose-500/20 border-rose-500/60 text-rose-300";
                } else {
                  btnStyle = "bg-slate-950/40 border-slate-900 text-slate-500 opacity-60";
                }
              } else if (this.selectedOption === idx) {
                btnStyle = "bg-purple-500/20 border-purple-500/60 text-purple-300 font-semibold";
              }

              return `
                <button class="quiz-option-btn w-full text-left p-3.5 rounded-xl border transition flex items-start gap-3 ${btnStyle}" 
                        data-index="${idx}" ${this.isAnswered ? 'disabled' : ''}>
                  <span class="w-6 h-6 rounded-lg font-mono text-xs flex items-center justify-center font-bold shrink-0 ${
                    this.isAnswered && idx === q.correctIndex 
                      ? 'bg-emerald-500 text-slate-950' 
                      : (this.isAnswered && this.selectedOption === idx ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-300')
                  }">
                    ${['A', 'B', 'C', 'D'][idx]}
                  </span>
                  <span class="text-xs md:text-sm mt-0.5 leading-snug">${opt}</span>
                </button>
              `;
            }).join('')}
          </div>

          <!-- Açıklama Alanı (Cevaplandıktan Sonra Açılır) -->
          ${this.isAnswered ? `
            <div class="p-4 rounded-xl border ${this.selectedOption === q.correctIndex ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200' : 'bg-amber-500/10 border-amber-500/30 text-amber-200'} text-xs leading-relaxed space-y-1 animate-fadeIn">
              <strong class="font-mono block uppercase text-[11px] font-bold ${this.selectedOption === q.correctIndex ? 'text-emerald-400' : 'text-amber-400'}">
                ${this.selectedOption === q.correctIndex ? '✓ DOĞRU TEŞHİS' : '✗ BİYOMEKANİK AÇIKLAMA:'}
              </strong>
              <p>${q.explanation}</p>
            </div>
          ` : ''}

          <!-- Alt İşlem Butonları -->
          <div class="pt-4 border-t border-slate-900 flex justify-between items-center">
            <span class="font-mono text-xs text-slate-500">
              Mevcut Puan: <strong class="text-purple-400">${this.score}</strong>
            </span>

            ${!this.isAnswered ? `
              <button id="btnCheckAnswer" class="px-5 py-2.5 rounded-xl font-mono text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white transition shadow-lg shadow-purple-600/20 disabled:opacity-50" 
                      ${this.selectedOption === null ? 'disabled' : ''}>
                Cevabı Doğrula →
              </button>
            ` : `
              <button id="btnNextQuestion" class="px-5 py-2.5 rounded-xl font-mono text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition shadow-lg shadow-emerald-500/20">
                ${this.currentIndex < QUIZ_QUESTIONS.length - 1 ? 'Sonraki Soru →' : 'Sonuçları Gör 🎯'}
              </button>
            `}
          </div>
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  renderFinishedState() {
    const total = QUIZ_QUESTIONS.length;
    const ratio = this.score / total;

    let title = "Biyomekanik Çırağı";
    let message = "Güzel deneme! Biraz daha kas-hareket eksenlerini incelemen tavsiye edilir.";
    if (ratio >= 0.8) {
      title = "Usta Biyomekanikçi & Fonksiyonel Anatomist";
      message = "Mükemmel sonuç! Kaldırma mekaniği, moment kolları ve eklem eksenlerine tam olarak hakimsin.";
    } else if (ratio >= 0.5) {
      title = "Bilinçli Sporcu";
      message = "Temel mantık oturmuş, ancak karmaşık kaldıraç ve paradoks mekaniklerinde birkaç eksiğin var.";
    }

    this.container.innerHTML = `
      <div class="quiz-container max-w-xl mx-auto p-6 text-center animate-fadeIn">
        <div class="bg-slate-950 border border-slate-800/90 rounded-3xl p-8 shadow-2xl space-y-5">
          <div class="w-16 h-16 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-300 mx-auto flex items-center justify-center text-2xl font-black font-mono">
            🎯
          </div>
          <span class="font-mono text-xs text-purple-400 font-bold uppercase tracking-wider">TEST TAMAMLANDI</span>
          <h2 class="font-serif text-2xl md:text-3xl font-bold text-white">${title}</h2>
          <div class="text-5xl font-black font-mono text-white tracking-tight my-2">
            ${this.score} <span class="text-2xl text-slate-500 font-normal">/ ${total}</span>
          </div>
          <p class="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">${message}</p>

          <div class="pt-4">
            <button id="btnRestartQuiz" class="px-6 py-3 rounded-xl font-mono text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white transition shadow-lg shadow-purple-600/20">
              Testi Yeniden Başlat ↺
            </button>
          </div>
        </div>
      </div>
    `;

    const restartBtn = this.container.querySelector('#btnRestartQuiz');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        this.currentIndex = 0;
        this.selectedOption = null;
        this.isAnswered = false;
        this.score = 0;
        this.isFinished = false;
        this.render();
      });
    }
  }

  attachEventListeners() {
    const optionBtns = this.container.querySelectorAll('.quiz-option-btn');
    optionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.isAnswered) return;
        this.selectedOption = parseInt(btn.dataset.index);
        this.render();
      });
    });

    const checkBtn = this.container.querySelector('#btnCheckAnswer');
    if (checkBtn) {
      checkBtn.addEventListener('click', () => {
        if (this.selectedOption === null) return;
        this.isAnswered = true;
        if (this.selectedOption === QUIZ_QUESTIONS[this.currentIndex].correctIndex) {
          this.score += 1;
        }
        this.render();
      });
    }

    const nextBtn = this.container.querySelector('#btnNextQuestion');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (this.currentIndex < QUIZ_QUESTIONS.length - 1) {
          this.currentIndex += 1;
          this.selectedOption = null;
          this.isAnswered = false;
          this.render();
        } else {
          this.isFinished = true;
          this.render();
        }
      });
    }
  }
}
