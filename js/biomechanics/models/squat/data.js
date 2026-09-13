/**
 * PROTOTYPE 03 — SQUAT (DATA & LITERATURE METADATA)
 * Biomechanical parameters, empirical reference studies, and explicit model taxonomy.
 * Sources: Fry et al. (2003), Escamilla (2001), Schoenfeld (2010), Winter (2009).
 */

export const SQUAT_DATA = {
  id: 'squat',
  title: 'Squat — Kalça, Diz & Ayak Bileği Biyomekaniği',
  description: 'Ayak, tibia, femur, pelvis, gövde ve barbell zincirinde dış moment kolları, gövde eğiminin diz ve kalça tork taleplerine mekanik etkisi.',

  // Academic Reference Studies
  sources: [
    {
      author: 'Fry, A. C., Smith, J. C., & Schilling, B. K.',
      year: 2003,
      title: 'Effect of knee position on hip and knee torques during the barbell squat',
      journal: 'The Journal of Strength & Conditioning Research, 17(4), 629-633',
      note: 'Dizin öne hareketinin kısıtlanmasının kalça torkunu %1000 artırıp diz torkunu düşürmesi; gövde eğimi-moment kolu ilişkisi.'
    },
    {
      author: 'Escamilla, R. F.',
      year: 2001,
      title: 'Knee biomechanics of the dynamic squat exercise',
      journal: 'Medicine & Science in Sports & Exercise, 33(1), 127-141',
      note: 'Farklı derinliklerde patellofemoral ve tibiofemoral kompresif momentler ve eklem açıları.'
    },
    {
      author: 'Schoenfeld, B. J.',
      year: 2010,
      title: 'Squatting kinematics and kinetics and their application to exercise performance',
      journal: 'Journal of Strength and Conditioning Research, 24(12), 3497-3506',
      note: 'High-bar vs Low-bar squat kinematiği ve kalça/diz moment talepleri.'
    },
    {
      author: 'Winter, D. A.',
      year: 2009,
      title: 'Biomechanics and Motor Control of Human Movement (4th ed.)',
      journal: 'John Wiley & Sons',
      note: 'Alt ekstremite segment kütle oranları ve kütle merkezleri (COM).'
    }
  ],

  // Rigorous 4-tier scientific classification
  assumptions: {
    sourceBacked: [
      '[SOURCE VALUE] Yerçekimi ivmesi: g = 9.80665 m/s² (NIST fizik standardı)',
      '[SOURCE VALUE] Uyluk (Femur) uzunluk oranı: 0.245 × Boy (Winter 2009 antropometri)',
      '[SOURCE VALUE] Baldır (Tibia) uzunluk oranı: 0.246 × Boy (Winter 2009 antropometri)',
      '[SOURCE VALUE] Ayak uzunluğu: 0.152 × Boy (Winter 2009 antropometri)',
      '[SOURCE VALUE] Gövde + Baş + Boyun segment uzunluğu: ~0.47 × Boy (Winter 2009 antropometri)',
      '[SOURCE VALUE] Segment Kütle Oranları: Uyluk %10.0, Baldır+Ayak %6.1, Gövde+Baş %67.8 (Winter 2009)',
      '[SOURCE VALUE] Gövde eğimi arttıkça kalça moment kolunun artması, diz moment kolunun azalması mekanik ilkesi (Fry 2003)'
    ],
    derivedModelValues: [
      '[DERIVED MODEL VALUE] External Knee Moment Arm: r_ext,knee = |x_knee - x_bar| dik yatay uzaklık hesabı',
      '[DERIVED MODEL VALUE] External Hip Moment Arm: r_ext,hip = |x_hip - x_bar| dik yatay uzaklık hesabı',
      '[DERIVED MODEL VALUE] External Ankle Moment Arm: r_ext,ankle = |x_ankle - x_bar| dik yatay uzaklık hesabı',
      '[DERIVED MODEL VALUE] External Knee Extensor Moment Demand: τ_knee = F_system × r_ext,knee (N·m)',
      '[DERIVED MODEL VALUE] External Hip Extensor Moment Demand: τ_hip = F_system × r_ext,hip (N·m)',
      '[DERIVED MODEL VALUE] Sistem Kütle Merkezi (COM) izdüşümü: ∑(m_i × x_i) / M_total'
    ],
    modelAssumptions: [
      '[MODEL ASSUMPTION] 2D Sagittal Düzlem Modeli: Squat hareketi iki bacağın simetrik çalıştığı sagittal düzlem kapalı kinematik zinciri olarak basitleştirilmiştir.',
      '[MODEL ASSUMPTION] Denge Koşulu (Midfoot Balance): Sistem kütle merkezi ve barbell düşey doğrultusunun ayak tabanı destek alanı (topuk-parmak ucu) ortasında kaldığı kabul edilmiştir.',
      '[MODEL ASSUMPTION] Yarı-Statik Denge (Quasi-Static): Kontrollü tempo varsayılarak eylemsizlik torkları (I·α) ihmal edilmiştir (∑τ = 0).',
      '[MODEL ASSUMPTION] Kinematik Derinlik Sınırları: Ayakta duruş (0° fleksiyon) ile derin squat (125° diz fleksiyonu) aralığı incelenmektedir.'
    ],
    limitations: [
      '[KNOWN LIMITATION] Bu model "bu form daha güvenlidir", "dizi korur" veya "beli korur" gibi klinik/mutlak sonuçlar üretmez; yalnızca net mekanik moment taleplerini gösterir.',
      '[KNOWN LIMITATION] Quadriceps, gluteus maximus ve hamstring kaslarının gerçek in vivo kuvvet dağılımı modellenmemiştir (kas kuvveti dağılımı nöral strateji gerektirir).',
      '[KNOWN LIMITATION] Ayak bileği pronasyonu ve kalça adduksiyon/abduksiyon 3B hareketleri sagittal düzlemde sabitlenmiştir.'
    ]
  }
};
