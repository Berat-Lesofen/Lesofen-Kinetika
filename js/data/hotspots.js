/**
 * LESOFEN KINETIKA - 2D Anatomical Hotspots
 * Koordinat Haritası: Kullanıcı görsellerinin doğal çözünürlükleri üzerinden SVG viewBox mapping
 * Anterior (Ön): 978 x 1024
 * Posterior (Arka): 1024 x 571
 */

export const ANTERIOR_HOTSPOTS = [
  // 1. Omuz & Boyun
  {
    id: "deltoid_anterior",
    name: "Deltoid (Anterior)",
    cx: 560,
    cy: 215,
    r: 22,
    mirror: { cx: 375, cy: 215, r: 22 },
    category: "Omuz"
  },
  {
    id: "deltoid_lateral",
    name: "Deltoid (Lateral)",
    cx: 588,
    cy: 240,
    r: 20,
    mirror: { cx: 348, cy: 240, r: 20 },
    category: "Omuz"
  },
  {
    id: "trapezius_upper",
    name: "Trapezius (Üst)",
    cx: 520,
    cy: 168,
    r: 20,
    mirror: { cx: 415, cy: 168, r: 20 },
    category: "Sırt & Boyun"
  },

  // 2. Göğüs
  {
    id: "pectoralis_major_clavicular",
    name: "Pectoralis Major (Clavicular)",
    cx: 505,
    cy: 220,
    r: 24,
    mirror: { cx: 430, cy: 220, r: 24 },
    category: "Göğüs"
  },
  {
    id: "pectoralis_major_sternal",
    name: "Pectoralis Major (Sternal)",
    cx: 500,
    cy: 265,
    r: 26,
    mirror: { cx: 435, cy: 265, r: 26 },
    category: "Göğüs"
  },

  // 3. Kol & Önkol
  {
    id: "biceps_brachii",
    name: "Biceps Brachii",
    cx: 582,
    cy: 310,
    r: 22,
    mirror: { cx: 352, cy: 310, r: 22 },
    category: "Kol"
  },
  {
    id: "brachialis_brachioradialis",
    name: "Brachialis & Brachioradialis",
    cx: 605,
    cy: 355,
    r: 20,
    mirror: { cx: 330, cy: 355, r: 20 },
    category: "Kol"
  },
  {
    id: "triceps_brachii",
    name: "Triceps Brachii (Anterior Bakış)",
    cx: 615,
    cy: 315,
    r: 18,
    mirror: { cx: 320, cy: 315, r: 18 },
    category: "Kol"
  },
  {
    id: "forearm_flexors_extensors",
    name: "Flexor & Extensor Group (Önkol)",
    cx: 640,
    cy: 435,
    r: 22,
    mirror: { cx: 295, cy: 435, r: 22 },
    category: "Önkol"
  },

  // 4. Core & Karın
  {
    id: "rectus_abdominis",
    name: "Rectus Abdominis (Six-pack)",
    cx: 468,
    cy: 360,
    r: 32,
    category: "Core"
  },
  {
    id: "obliques",
    name: "External & Internal Obliques",
    cx: 535,
    cy: 410,
    r: 22,
    mirror: { cx: 400, cy: 410, r: 22 },
    category: "Core"
  },

  // 5. Bacak & Uyluk
  {
    id: "quadriceps_rectus_femoris",
    name: "Quadriceps (Rectus Femoris)",
    cx: 538,
    cy: 560,
    r: 26,
    mirror: { cx: 398, cy: 560, r: 26 },
    category: "Ön Bacak"
  },
  {
    id: "quadriceps_vasti",
    name: "Quadriceps (Vasti Grubu)",
    cx: 560,
    cy: 620,
    r: 24,
    mirror: { cx: 375, cy: 620, r: 24 },
    category: "Ön Bacak"
  },

  // 6. Baldır & Kaval
  {
    id: "tibialis_anterior",
    name: "Tibialis Anterior (Ön Kaval)",
    cx: 522,
    cy: 795,
    r: 18,
    mirror: { cx: 413, cy: 795, r: 18 },
    category: "Ön Bacak"
  },
  {
    id: "gastrocnemius",
    name: "Gastrocnemius (Baldır)",
    cx: 560,
    cy: 780,
    r: 20,
    mirror: { cx: 375, cy: 780, r: 20 },
    category: "Baldır"
  },
  {
    id: "soleus",
    name: "Soleus (Derin Baldır)",
    cx: 550,
    cy: 855,
    r: 18,
    mirror: { cx: 385, cy: 855, r: 18 },
    category: "Baldır"
  }
];

export const POSTERIOR_HOTSPOTS = [
  // 1. Üst Sırt & Omuz
  {
    id: "trapezius_upper",
    name: "Trapezius (Üst)",
    cx: 500,
    cy: 110,
    r: 22,
    category: "Sırt & Boyun"
  },
  {
    id: "trapezius_middle_lower",
    name: "Trapezius (Orta & Alt)",
    cx: 500,
    cy: 155,
    r: 24,
    category: "Sırt"
  },
  {
    id: "deltoid_posterior",
    name: "Posterior Deltoid (Arka Omuz)",
    cx: 568,
    cy: 152,
    r: 20,
    mirror: { cx: 432, cy: 152, r: 20 },
    category: "Omuz"
  },
  {
    id: "infraspinatus_teres_minor",
    name: "Infraspinatus & Teres Minor",
    cx: 550,
    cy: 175,
    r: 18,
    mirror: { cx: 450, cy: 175, r: 18 },
    category: "Omuz Derin"
  },
  {
    id: "teres_major",
    name: "Teres Major",
    cx: 562,
    cy: 195,
    r: 16,
    mirror: { cx: 438, cy: 195, r: 16 },
    category: "Sırt"
  },
  {
    id: "rhomboids",
    name: "Rhomboids (Eşkenar Kaslar)",
    cx: 522,
    cy: 170,
    r: 16,
    mirror: { cx: 478, cy: 170, r: 16 },
    category: "Sırt Derin"
  },

  // 2. Kollar (Arka)
  {
    id: "triceps_brachii",
    name: "Triceps Brachii (Arka Kol)",
    cx: 588,
    cy: 205,
    r: 20,
    mirror: { cx: 412, cy: 205, r: 20 },
    category: "Kol"
  },
  {
    id: "forearm_flexors_extensors",
    name: "Forearm Extensors (Önkol Ekstansörleri)",
    cx: 605,
    cy: 270,
    r: 18,
    mirror: { cx: 395, cy: 270, r: 18 },
    category: "Önkol"
  },

  // 3. Sırt & Bel
  {
    id: "latissimus_dorsi",
    name: "Latissimus Dorsi (Kanat)",
    cx: 538,
    cy: 215,
    r: 22,
    mirror: { cx: 462, cy: 215, r: 22 },
    category: "Sırt"
  },
  {
    id: "erector_spinae",
    name: "Erector Spinae (Omurga Kasları)",
    cx: 500,
    cy: 235,
    r: 20,
    category: "Sırt & Core"
  },
  {
    id: "obliques",
    name: "External Oblique (Bel / Dış Oblik)",
    cx: 535,
    cy: 265,
    r: 16,
    mirror: { cx: 465, cy: 265, r: 16 },
    category: "Core"
  },

  // 4. Kalça
  {
    id: "gluteus_medius",
    name: "Gluteus Medius (Orta Kalça)",
    cx: 540,
    cy: 295,
    r: 18,
    mirror: { cx: 460, cy: 295, r: 18 },
    category: "Kalça"
  },
  {
    id: "gluteus_maximus",
    name: "Gluteus Maximus (Büyük Kalça)",
    cx: 522,
    cy: 330,
    r: 26,
    mirror: { cx: 478, cy: 330, r: 26 },
    category: "Kalça"
  },

  // 5. Arka Bacak (Hamstrings)
  {
    id: "hamstrings",
    name: "Hamstrings (Biceps Femoris & Semitendinosus)",
    cx: 535,
    cy: 410,
    r: 26,
    mirror: { cx: 465, cy: 410, r: 26 },
    category: "Arka Bacak"
  },

  // 6. Baldır & Aşil
  {
    id: "gastrocnemius",
    name: "Gastrocnemius (Baldır İkiz Kas)",
    cx: 538,
    cy: 485,
    r: 20,
    mirror: { cx: 462, cy: 485, r: 20 },
    category: "Baldır"
  },
  {
    id: "soleus",
    name: "Soleus (Derin Baldır)",
    cx: 538,
    cy: 525,
    r: 16,
    mirror: { cx: 462, cy: 525, r: 16 },
    category: "Baldır"
  }
];
