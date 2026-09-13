/**
 * PROTOTYPE 01 — LATERAL RAISE (DATA & LITERATURE METADATA)
 * Contains empirical biomechanical parameters, reference studies, and explicit model assumptions.
 */

export const LATERAL_RAISE_DATA = {
  id: 'lateral-raise',
  title: 'Lateral Raise — Omuz Biyomekaniği',
  description: 'Humerus, skapula, eklem merkezi, dambıl yerçekimi çizgisi, external/internal moment kolları ve deltoid tork talebi.',

  // Model / Reference Curve for Middle Deltoid Moment Arm (Kuechle et al. 1997, Murray et al. 2006)
  // NOTE: Bireysel antropometriye, humerus iç/dış rotasyonuna ve 3B hareket düzlemine göre kişiden kişiye değişir.
  momentArmModelInfo: {
    label: 'Model / Referans Eğrisi (Kuechle 1997 / Murray 2006 referans veri seti)',
    disclaimer: 'Bu değerler laboratuvar kadavra/görüntüleme referans eğrisidir; yaşayan bireylerde omuz geometrisi, humerus rotasyonu ve kas çizgisine göre farklılık gösterir.'
  },

  empiricalMomentArms: [
    { angle: 0,   momentArmCm: 1.6 },
    { angle: 15,  momentArmCm: 2.0 },
    { angle: 30,  momentArmCm: 2.5 },
    { angle: 45,  momentArmCm: 2.9 },
    { angle: 60,  momentArmCm: 3.3 }, // Peak reference moment arm
    { angle: 75,  momentArmCm: 3.2 },
    { angle: 90,  momentArmCm: 3.0 },
    { angle: 105, momentArmCm: 2.7 },
    { angle: 120, momentArmCm: 2.4 },
    { angle: 135, momentArmCm: 2.1 },
    { angle: 150, momentArmCm: 1.8 },
    { angle: 165, momentArmCm: 1.4 },
    { angle: 180, momentArmCm: 1.0 }
  ],

  // Scientific Sources & References
  sources: [
    {
      author: 'Inman, V. T., Saunders, J. B., & Abbott, L. C.',
      year: 1944,
      title: 'Observations on the function of the shoulder joint',
      journal: 'The Journal of Bone & Joint Surgery, 26(1), 1-30',
      note: 'Klasik 2:1 skapulohumeral ritim (Baseline simplified model).'
    },
    {
      author: 'Kuechle, D. K., Newman, S. R., Itoi, E., Morrey, B. F., & An, K. N.',
      year: 1997,
      title: 'Shoulder muscle moment arms during horizontal abduction and adduction, and internal and external rotation',
      journal: 'Journal of Biomechanics, 30(5), 429-439',
      note: 'Orta deltoid iç moment kolunun 55°-65° abduksiyonda referans pik değeri (~3.3 cm).'
    },
    {
      author: 'Murray, W. M., Buchanan, T. S., & Delp, S. L.',
      year: 2006,
      title: 'The effect of joint angle on muscle moment arms at the shoulder',
      journal: 'Journal of Bone and Joint Surgery',
      note: 'Omuz açısına bağlı kas moment kollarının ölçüm metodolojisi.'
    },
    {
      author: 'Winter, D. A.',
      year: 2009,
      title: 'Biomechanics and Motor Control of Human Movement (4th ed.)',
      journal: 'John Wiley & Sons',
      note: 'Segment kütle ve uzunluk antropometri standartları.'
    }
  ],

  // Categorized Model Assumptions & Boundaries
  // Rigorous 4-tier scientific classification
  assumptions: {
    sourceBacked: [
      '[SOURCE VALUE] Yerçekimi ivmesi: g = 9.80665 m/s² (NIST fizik standardı)',
      '[SOURCE VALUE] Humerus uzunluk oranı: 0.172 × Boy (Winter 2009 antropometri)',
      '[SOURCE VALUE] Önkol + El uzunluk oranı: 0.232 × Boy (Winter 2009 antropometri)',
      '[SOURCE VALUE] Kol segment kütle oranları: Üst kol %2.8, Önkol+El %2.2 vücut ağırlığı (Winter 2009)',
      '[SOURCE VALUE] Orta deltoid kadavra/MR referans moment kolu: 1.5 - 3.5 cm (Kuechle 1997, Murray 2006)'
    ],
    derivedModelValues: [
      '[DERIVED MODEL VALUE] External Moment Arm: r_ext(θ) = L_arm × sin(θ) trigonometrik izdüşüm hesabı',
      '[DERIVED MODEL VALUE] Glenohumeral External Torque: τ_ext = ∑(F_i × r_i) moment dengesi',
      '[DERIVED MODEL VALUE] Modelled Deltoid Force Demand: F_deltoid = τ_ext / r_int quasi-statik talebi',
      '[DERIVED MODEL VALUE] Mechanical Advantage: MA = r_int / r_ext oranı (~0.046 @ 90°)'
    ],
    modelAssumptions: [
      '[MODEL ASSUMPTION] Baseline Simplified Kinematics: 2:1 ritmi (Inman 1944) standart doğrusal model varsayımıdır; canlı bireylerde ve elevasyon düzlemine göre değişkenlik gösterir.',
      '[MODEL ASSUMPTION] Yarı-Statik Denge (Quasi-Static): Sabit kontrollü tempo varsayımıyla açısal ivmelenme (I·α) ihmal edilmiştir (∑τ = 0).',
      '[MODEL ASSUMPTION] Tek Bileşke Deltoid Vektörü: Orta deltoidin çoklu lifleri akromion-lateral tüberozite tek hat olarak modellenmiştir.',
      '[MODEL ASSUMPTION] Setting Fazı Basitleştirmesi: 0°-30° aralığında skapula rotasyonu 0° kabul edilmiştir.',
      '[MODEL ASSUMPTION] 2D Düzlemsel İnceleme: Hareket skapular düzlemde incelenmiş, humerus aksiyel rotasyonu sabit tutulmuştur.'
    ],
    limitations: [
      '[KNOWN LIMITATION] Kas aktivasyonu (EMG) ile eklem tork talebi birbirine eşit değildir.',
      '[KNOWN LIMITATION] Rotator manşet kuvvet çifti (supraspinatus/infraspinatus) ve eklem reaksiyon kuvvetleri modele dahil edilmemiştir.',
      '[KNOWN LIMITATION] Tek kas teorik talebi, canlı insandaki sinerjist yük paylaşımını doğrudan yansıtmaz.'
    ]
  }
};
