/**
 * PROTOTYPE 04 — BENCH PRESS (DATA & LITERATURE METADATA)
 * Biomechanical parameters, empirical bar path studies, and explicit model taxonomy.
 * Sources: McLaughlin & Madsen (1984), Elliott et al. (1989), van den Tillaar (2010), Winter (2009).
 */

export const BENCH_PRESS_DATA = {
  id: 'bench-press',
  title: 'Bench Press — Omuz, Dirsek & Bar Yolu Biyomekaniği',
  description: 'Gövde, omuz ekseni, humerus, önkol ve bar zincirinde dış moment kolları, düz dikey vs kavisli (J-curve) bar yolu karşılaştırması.',

  // Academic Reference Studies
  sources: [
    {
      author: 'McLaughlin, T. M., & Madsen, N.',
      year: 1984,
      title: 'Bench press: more with less strain',
      journal: 'Powerlifting USA, 7, 30-32',
      note: 'Elit sporcularda bar yolunun göğüsten kalkarken omuz eklem eksenine doğru kavisli (J-curve) ilerlemesi ve omuz moment kolunun azaltılması.'
    },
    {
      author: 'Elliott, B. C., Wilson, G. J., & Kerr, G. K.',
      year: 1989,
      title: 'A biomechanical analysis of the sticking region in the bench press',
      journal: 'Medicine & Science in Sports & Exercise, 21(4), 450-462',
      note: 'Sticking region (takılma bölgesi) kinematiği ve omuz/dirsek moment kolları.'
    },
    {
      author: 'van den Tillaar, R., & Ettema, G.',
      year: 2010,
      title: 'The sticking period in a maximum bench press',
      journal: 'Journal of Sports Sciences, 28(5), 529-535',
      note: 'Bar yüksekliği ve eklem açılarının itiş evrelerindeki dinamik değişimi.'
    },
    {
      author: 'Winter, D. A.',
      year: 2009,
      title: 'Biomechanics and Motor Control of Human Movement (4th ed.)',
      journal: 'John Wiley & Sons',
      note: 'Üst ekstremite antropometrik uzunluk ve kütle oranları.'
    }
  ],

  // Rigorous 4-tier scientific classification
  assumptions: {
    sourceBacked: [
      '[SOURCE VALUE] Yerçekimi ivmesi: g = 9.80665 m/s² (NIST fizik standardı)',
      '[SOURCE VALUE] Humerus uzunluk oranı: 0.172 × Boy (Winter 2009 antropometri)',
      '[SOURCE VALUE] Önkol uzunluk oranı: 0.157 × Boy (Winter 2009 antropometri)',
      '[SOURCE VALUE] Kavisli Bar Yolu İlkesi (J-Curve): Göğüsten çıkan barın baş tarafına (omuz eksenine) doğru yönelerek lockout anında omuz moment kolunu sıfıra yaklaştırması (McLaughlin 1984)',
      '[SOURCE VALUE] Düz Dikey Bar Yolu İlkesi: Barın alt göğüs temas noktası üzerinde dikey kalması durumunda lockout anında omuz moment kolunun yüksek kalması (Elliott 1989)'
    ],
    derivedModelValues: [
      '[DERIVED MODEL VALUE] Shoulder External Moment Arm: r_ext,shoulder = |x_shoulder - x_bar| dik yatay uzaklık hesabı',
      '[DERIVED MODEL VALUE] Elbow External Moment Arm: r_ext,elbow = |x_elbow - x_bar| dik yatay uzaklık hesabı',
      '[DERIVED MODEL VALUE] Shoulder Horizontal Flexion/Adduction Moment Demand: τ_shoulder = F_bar × r_ext,shoulder (N·m)',
      '[DERIVED MODEL VALUE] Elbow Extension Moment Demand: τ_elbow = F_bar × r_ext,elbow (N·m)'
    ],
    modelAssumptions: [
      '[MODEL ASSUMPTION] 2D Sagittal / Yanal Düzlem Projeksiyonu: Bench press hareketi yatay düzlem ve sagittal izdüşüm üzerinden modellenmiştir.',
      '[MODEL ASSUMPTION] Sabit Bench Yüzeyi: Gövdenin yatay düzlemde hareketsiz uzandığı ve skapulanın bench yüzeyine sabitlendiği varsayılmıştır.',
      '[MODEL ASSUMPTION] Yarı-Statik Denge (Quasi-Static): İvmelenme ve eylemsizlik torkları ihmal edilmiştir (∑τ = 0).',
      '[MODEL ASSUMPTION] Dirsek Tuck Açısı: Humerusun gövdeye göre sagittal açısı ~65° standart form olarak parametrik kabul edilmiştir.'
    ],
    limitations: [
      '[KNOWN LIMITATION] Bu modelde göğüs (pectoralis major), omuz (anterior deltoid) veya triceps kas aktivasyon yüzdesi (EMG) uydurulmaz; yalnızca net eklem moment talepleri gösterilir.',
      '[KNOWN LIMITATION] "Bu tutuş kesin daha güvenlidir" veya "bu açı göğsü maksimum çalıştırır" gibi mutlak iddialarda bulunulmaz.',
      '[KNOWN LIMITATION] Göğüs kafesi köprü (arch) yüksekliği standart referans boyutta sabit tutulmuştur.'
    ]
  }
};
