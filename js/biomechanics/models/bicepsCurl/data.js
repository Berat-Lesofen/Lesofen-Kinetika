/**
 * PROTOTYPE 02 — BICEPS CURL (DATA & LITERATURE METADATA)
 * Empirical biomechanical parameters, reference curves, and explicit model assumptions.
 * Sources: Murray et al. (1995), An et al. (1981), Pigeon et al. (1996), Winter (2009).
 */

export const BICEPS_CURL_DATA = {
  id: 'biceps-curl',
  title: 'Biceps Curl — Dirsek & Önkol Biyomekaniği',
  description: 'Humerus, radius, ulna, 3 bağımsız fleksör kas (Biceps brachii, Brachialis, Brachioradialis), önkol pronasyon/supinasyonu ve dirsek tork talebi.',

  // Reference curves for muscle internal moment arms vs elbow flexion angle (degrees)
  // Sources: Murray et al. (1995, J Biomech), Pigeon et al. (1996)
  // NOTE: Kadavra ve görüntüleme tabanlı model/referans verileridir; bireysel anatomiye göre değişir.
  momentArmModelInfo: {
    label: 'Model / Reference curves (Murray 1995 / Pigeon 1996 referans veri setleri)',
    disclaimer: 'Bu değerler laboratuvar referans eğrileridir. Moment kolunun büyüklüğü otomatik olarak o kasın nöromüsküler aktivasyonunun (EMG) yüksek olduğu anlamına gelmez.'
  },

  // Biceps Brachii Moment Arm (cm) vs Flexion Angle across Forearm Rotations
  // Radius tüberozitesine yapıştığından supinasyonda en yüksek moment koluna sahiptir.
  // Pronasyonda tendon radius boynuna dolandığından fleksiyondaki etkin moment kolu düşer.
  bicepsMomentArms: [
    { angle: 0,   supinatedCm: 2.1, neutralCm: 1.8, pronatedCm: 1.4 },
    { angle: 20,  supinatedCm: 2.9, neutralCm: 2.4, pronatedCm: 1.8 },
    { angle: 45,  supinatedCm: 3.8, neutralCm: 3.1, pronatedCm: 2.3 },
    { angle: 70,  supinatedCm: 4.6, neutralCm: 3.7, pronatedCm: 2.8 },
    { angle: 90,  supinatedCm: 4.9, neutralCm: 4.0, pronatedCm: 3.1 }, // Pik supinasyon
    { angle: 110, supinatedCm: 4.5, neutralCm: 3.6, pronatedCm: 2.7 },
    { angle: 130, supinatedCm: 3.7, neutralCm: 3.0, pronatedCm: 2.2 },
    { angle: 150, supinatedCm: 2.8, neutralCm: 2.2, pronatedCm: 1.6 }
  ],

  // Brachialis Moment Arm (cm) vs Flexion Angle
  // Ulna tüberozitesine yapışır. Ulna önkol rotasyonunda dönmediği için moment kolu
  // pronasyon/supinasyondan TAMAMEN BAĞIMSIZDIR (Saf fleksör).
  brachialisMomentArms: [
    { angle: 0,   momentArmCm: 1.6 },
    { angle: 20,  momentArmCm: 2.0 },
    { angle: 45,  momentArmCm: 2.5 },
    { angle: 70,  momentArmCm: 2.9 },
    { angle: 90,  momentArmCm: 3.0 }, // Pik (~90°-100°)
    { angle: 110, momentArmCm: 2.9 },
    { angle: 130, momentArmCm: 2.5 },
    { angle: 150, momentArmCm: 2.0 }
  ],

  // Brachioradialis Moment Arm (cm) vs Flexion Angle
  // Radius distal styloid prosesine yapışır. Uzun bir moment koluna sahiptir.
  // Nötr pozisyonda (hammer) optimal çekiş yönüne sahiptir.
  brachioradialisMomentArms: [
    { angle: 0,   neutralCm: 4.8, supinatedCm: 4.2, pronatedCm: 4.4 },
    { angle: 20,  neutralCm: 5.6, supinatedCm: 5.0, pronatedCm: 5.2 },
    { angle: 45,  neutralCm: 6.5, supinatedCm: 5.8, pronatedCm: 6.0 },
    { angle: 70,  neutralCm: 7.2, supinatedCm: 6.4, pronatedCm: 6.7 },
    { angle: 90,  neutralCm: 7.5, supinatedCm: 6.7, pronatedCm: 7.0 }, // Pik (~90°-100°)
    { angle: 110, neutralCm: 7.1, supinatedCm: 6.3, pronatedCm: 6.6 },
    { angle: 130, neutralCm: 6.2, supinatedCm: 5.4, pronatedCm: 5.7 },
    { angle: 150, neutralCm: 5.0, supinatedCm: 4.3, pronatedCm: 4.5 }
  ],

  // Scientific Sources
  sources: [
    {
      author: 'Murray, W. M., Delp, S. L., & Buchanan, T. S.',
      year: 1995,
      title: 'Variation of muscle moment arms with elbow and forearm position',
      journal: 'Journal of Biomechanics, 28(5), 513-525',
      note: 'Biceps, brachialis ve brachioradialis kaslarının dirsek açısı ve önkol rotasyonuna bağlı moment kolu ölçümleri.'
    },
    {
      author: 'An, K. N., Hui, F. C., Morrey, B. F., Linscheid, R. L., & Chao, E. Y.',
      year: 1981,
      title: 'Muscles across the elbow joint: a biomechanical analysis',
      journal: 'Journal of Biomechanics, 14(10), 659-669',
      note: 'Dirsek fleksör kaslarının geometrik çizgileri ve tendon sonlanma verileri.'
    },
    {
      author: 'Pigeon, P., Yahia, L. H., & Feldman, A. G.',
      year: 1996,
      title: 'Moment arm and muscle length of the human arm muscles as functions of joint angles',
      journal: 'Journal of Biomechanics, 29(10), 1365-1370',
      note: 'Dirsek eklemi kas moment kolu analitik polinom fonksiyonları.'
    },
    {
      author: 'Winter, D. A.',
      year: 2009,
      title: 'Biomechanics and Motor Control of Human Movement (4th ed.)',
      journal: 'John Wiley & Sons',
      note: 'Önkol ve el antropometrik kütle ve uzunluk standartları.'
    }
  ],

  // Assumptions & Boundaries
  // Rigorous 4-tier scientific classification
  assumptions: {
    sourceBacked: [
      '[SOURCE VALUE] Yerçekimi ivmesi: g = 9.80665 m/s² (NIST fizik standardı)',
      '[SOURCE VALUE] Önkol uzunluk oranı: 0.157 × Boy, El kavrama: 0.075 × Boy (Winter 2009 antropometri)',
      '[SOURCE VALUE] Önkol + El segment kütlesi: Vücut ağırlığının %2.2 si (Winter 2009)',
      '[SOURCE VALUE] Brachialis insersiyonu: Ulna tüberozitesi ve koronoid çıkıntı (An 1981 kadavra anatomisi)',
      '[SOURCE VALUE] Biceps insersiyonu: Radius tüberozitesi (An 1981 kadavra anatomisi)',
      '[SOURCE VALUE] Brachioradialis insersiyonu: Distal radius styloid prosesi (An 1981 kadavra anatomisi)',
      '[SOURCE VALUE] 3 Kas Moment Arm Referans Eğrileri: Murray et al. (1995), Pigeon et al. (1996) kadavra/MR verileri'
    ],
    derivedModelValues: [
      '[DERIVED MODEL VALUE] External Load Moment Arm: r_ext(θ) = L_forearm × sin(θ_flex) trigonometrik bağıntısı',
      '[DERIVED MODEL VALUE] External Elbow Flexion Torque: τ_ext = ∑(F_i × r_i) moment eşitliği',
      '[DERIVED MODEL VALUE] Biceps Radial Tuberosity Wrapping: Pronasyonda tendonun radius boynuna dolanmasıyla moment kolunun %25-35 azalması interpolasyonu',
      '[DERIVED MODEL VALUE] Brachialis Invariance: Ulna dönmediğinden rotasyon açısından bağımsız r_int(θ_flex)',
      '[DERIVED MODEL VALUE] Modelled Muscle Force Demand: F_iso,i = τ_ext / r_int,i izole tek kas talebi'
    ],
    modelAssumptions: [
      '[MODEL ASSUMPTION] Kinematik Açı Sınırları: Dirsek fleksiyonu 0°-150°, önkol rotasyonu -80° ile +80° aralığında modellenmiştir.',
      '[MODEL ASSUMPTION] Sabit Dikey Humerus: Serbest dambıl curl formu gereği humerus dikey aşağı sabitlenmiştir.',
      '[MODEL ASSUMPTION] Yarı-Statik Denge (Quasi-Static): İvmelenme ve eylemsizlik torkları (I·α) ihmal edilmiştir (∑τ = 0).',
      '[MODEL ASSUMPTION] 2D Düzlemsel İnceleme: Radius-ulna rotasyonu derinlik katmanları ve aksiyel dönme projeksiyonu ile basitleştirilmiştir.'
    ],
    limitations: [
      '[KNOWN LIMITATION] Kas aktivasyonu (EMG) ile mekanik moment kolu birbirine eşit değildir; büyük moment kolu maksimum aktivasyonu garantilemez.',
      '[KNOWN LIMITATION] Üç fleksör kasın gerçek in vivo kuvvet paylaşımı motor kontrol stratejilerine bağlıdır.',
      '[KNOWN LIMITATION] Brachioradialis basitçe "pronator" veya "supinator" değildir; fleksiyon üretirken önkolu nötre getirmeye yardımcı bir şant kasıdır.',
      '[KNOWN LIMITATION] Pronator teres ve bilek fleksörlerinin sekonder dirsek fleksiyon katkısı modele dahil edilmemiştir.'
    ]
  }
};
