/**
 * LESOFEN KINETIKA - Functional Muscle Database
 * 28 Temel Fonksiyonel Hedef Birim
 * Bilimsel Rol Mimarisi & Derinlik Katmanı (Superficial vs Deep)
 */

export const MUSCLES = [
  // ==========================================
  // 1. OMUZ KOMPLEKSİ (DELTOID & ROTATOR CUFF)
  // ==========================================
  {
    id: "deltoid_anterior",
    name: "Anterior Deltoid (Ön Omuz)",
    latinName: "Musculus deltoideus (pars clavicularis)",
    region: "shoulder",
    category: "Omuz",
    viewAngle: "anterior",
    depthLayer: "superficial",
    color: "#ff9f1c",
    attachments: {
      origin: "Klavikulanın lateral 1/3'lük ön yüzeyi",
      insertion: "Tuberositas deltoidea (humerus lateral yüzeyi)"
    },
    innervation: {
      nerve: "Nervus axillaris",
      roots: "C5 - C6"
    },
    actions: [
      { movement: "shoulder_flexion", role: "prime_mover", description: "Kolun sagital planda öne doğru kaldırılmasında ana motorlardan biri." },
      { movement: "shoulder_horizontal_adduction", role: "prime_mover", description: "Kolu göğüs hizasında içeri çekişte (bench press / fly) pektoralis majör ile birlikte çalışır." },
      { movement: "shoulder_internal_rotation", role: "synergist", description: "Humerusun içe rotasyon momentine katkı sağlar." }
    ],
    exercises: [
      {
        id: "overhead_press",
        name: "Overhead Barbell / Dumbbell Press",
        role: "prime_mover",
        mechanicsSummary: "Omuz fleksiyonu ve skapular elevasyon bileşkesi.",
        feelNote: "Dirseklerin hafif skapular düzlemde (30° önde) tutulması, humerus başının akromiyon altına sıkışmasını önlerken ön omuzdaki mekanik verimi destekler."
      },
      {
        id: "flat_barbell_bench_press",
        name: "Flat / Incline Bench Press",
        role: "prime_mover",
        mechanicsSummary: "Horizontal adduksiyon fazında pektoralis majör ile güçlü sinerji.",
        feelNote: "Sehpa eğimi (incline) arttıkça ön omuzun omuz fleksiyon moment kolu uzar ve payı belirgin şekilde yükselir."
      }
    ],
    biomechanics: {
      momentArmType: "Omuz fleksiyonunun 0-60° aralığında güçlü iç moment kolu; yükselme arttıkça hareket skapulotorasik rotasyonla birleşir.",
      resistanceProfileTip: "Dambıl presste alt pozisyonda yerçekimi dikliği nedeniyle yüksek gerilim oluşur."
    },
    evidence: [
      "Ackland et al. (2008) - Moment arms of the muscles crossing the anatomical shoulder joint",
      "Trebs et al. (2010) - An electromyography analysis of 4 levels of incline bench press"
    ]
  },
  {
    id: "deltoid_lateral",
    name: "Lateral Deltoid (Yan / Orta Omuz)",
    latinName: "Musculus deltoideus (pars acromialis)",
    region: "shoulder",
    category: "Omuz",
    viewAngle: "lateral",
    depthLayer: "superficial",
    color: "#00f2fe",
    attachments: {
      origin: "Akromiyonun lateral kenarı ve superior yüzeyi",
      insertion: "Tuberositas deltoidea (humerus dış yüzeyi)"
    },
    innervation: {
      nerve: "Nervus axillaris",
      roots: "C5 - C6"
    },
    actions: [
      { movement: "shoulder_abduction", role: "prime_mover", description: "Omuz abdüksiyonunun hareket açıklığı boyunca ana kuvvet üreticilerinden biridir." },
      { movement: "scaption", role: "prime_mover", description: "Skapular düzlemde (30-45° önde) elverişli eklem hizasıyla elevasyon." }
    ],
    exercises: [
      {
        id: "lateral_raise_dumbbell",
        name: "Dumbbell Lateral Raise",
        role: "prime_mover",
        mechanicsSummary: "Frontal/skapular planda omuz abdüksiyonu.",
        feelNote: "Dambıl yere paralel 90°'ye yaklaştıkça yerçekimi çizgisi ile eklem merkezi arasındaki dik mesafe (external moment arm) zirveye yaklaşır."
      },
      {
        id: "cable_lateral_raise",
        name: "Cross-Body Cable Lateral Raise",
        role: "prime_mover",
        mechanicsSummary: "Kablo açısına bağlı olarak hareketin başında (gerilmiş pozisyonda) da gerilim sunar.",
        feelNote: "Dambılın aksine kablo, kol gövdeye yakınken de direnç vektörü sağlayabilir."
      }
    ],
    biomechanics: {
      momentArmType: "Lateral deltoid abdüksiyon boyunca supraspinatus ile sinerji halinde çalışarak omuz elevasyon momentini üretir.",
      resistanceProfileTip: "Humerusun aşırı iç rotasyona zorlanması yerine nötr veya hafif dış rotasyon subakromiyal alan sağlığını korur."
    },
    evidence: [
      "Inman et al. (1944) - Observations on the function of the shoulder joint",
      "Escamilla et al. (2009) - Shoulder muscle activity in common shoulder rehabilitation exercises"
    ]
  },
  {
    id: "deltoid_posterior",
    name: "Posterior Deltoid (Arka Omuz)",
    latinName: "Musculus deltoideus (pars spinalis)",
    region: "shoulder",
    category: "Omuz",
    viewAngle: "posterior",
    depthLayer: "superficial",
    color: "#ff3366",
    attachments: {
      origin: "Spina scapulae'nin alt kenarı (kürek kemiği dikeni)",
      insertion: "Tuberositas deltoidea (humerus)"
    },
    innervation: {
      nerve: "Nervus axillaris",
      roots: "C5 - C6"
    },
    actions: [
      { movement: "shoulder_horizontal_abduction", role: "prime_mover", description: "Kolu yatay düzlemde geriye çekişte primer motor." },
      { movement: "shoulder_extension", role: "synergist", description: "Kolu arkaya doğru uzatmada latissimus dorsi ve teres major'a destek." },
      { movement: "shoulder_external_rotation", role: "synergist", description: "Humerusun dışa rotasyon momentine katkı sağlar." }
    ],
    exercises: [
      {
        id: "face_pull",
        name: "Cable Face Pull",
        role: "prime_mover",
        mechanicsSummary: "Horizontal abdüksiyon + dış rotasyon bileşkesi.",
        feelNote: "Bilekler kulak hizasına çekildiğinde external rotasyon açısı artar ve infraspinatus ile arka omuz sinerjisi belirginleşir."
      },
      {
        id: "reverse_pec_deck",
        name: "Reverse Pec Deck / Rear Delt Fly",
        role: "prime_mover",
        mechanicsSummary: "Skapular retraksiyonu minimize ederek glenohumeral horizontal abdüksiyon sağlama.",
        feelNote: "Dirsekleri hafif bükülü sabitleyip kürek kemiklerinin aşırı sıkıştırılmaması, hareketin arka omuzda kalmasına yardımcı olur."
      }
    ],
    biomechanics: {
      momentArmType: "Horizontal adduksiyondan geriye doğru açıldıkça arka omuzun çekme vektörü humerus şaftına dikleşir.",
      resistanceProfileTip: "Eğilerek yapılan dambıl açışta tepe noktada tork artarken, kabloda hareket boyunca daha dengeli bir direnç sağlanabilir."
    },
    evidence: [
      "Schoenfeld et al. (2013) - Effect of hand position on EMG activity of posterior shoulder musculature",
      "Kuechle et al. (1997) - Shoulder muscle moment arms during horizontal movements"
    ]
  },
  {
    id: "supraspinatus",
    name: "Supraspinatus (Rotator Manşet - Üst)",
    latinName: "Musculus supraspinatus",
    region: "shoulder",
    category: "Omuz Derin",
    viewAngle: "posterior",
    depthLayer: "deep",
    color: "#a855f7",
    attachments: {
      origin: "Fossa supraspinata (skapula üst çukuru - trapeziusun altında)",
      insertion: "Tuberculum majus humeri (üst faset)"
    },
    innervation: {
      nerve: "Nervus suprascapularis",
      roots: "C5 - C6"
    },
    actions: [
      { movement: "shoulder_abduction", role: "prime_mover", description: "Omuz elevasyonunun başlangıç fazına önemli katkı sağlar; deltoid ile koordineli çalışır." },
      { movement: "scaption", role: "prime_mover", description: "Skapular düzlemde kola stabilizasyon ve başlangıç momenti sağlar." },
      { movement: "joint_stabilization", role: "stabilizer", description: "Humerus başını glenoid kavitede tutarak superior dislokasyonu ve aşırı yukarı kaymayı engeller." }
    ],
    exercises: [
      {
        id: "full_can_exercise",
        name: "Full Can Scaption",
        role: "prime_mover",
        mechanicsSummary: "Skapular planda başparmak yukarıda kontrollü elevasyon.",
        feelNote: "Başparmak yukarı pozisyon subakromiyal alanı geniş tutarak tendon aşınmasını ve sıkışmayı minimize eder."
      }
    ],
    biomechanics: {
      momentArmType: "Kol gövdeye yakınken deltoidin çekiş hattı humerusa paralelken, supraspinatus daha dik bir çekiş açısına sahiptir.",
      resistanceProfileTip: "Yüksek ağırlıklardan ziyade kontrollü, eklemi merkezleme amaçlı dirençlerde aktiftir."
    },
    evidence: [
      "Boettcher et al. (2009) - The full can vs empty can exercise in rehabilitation",
      "Otis et al. (1994) - Changes in moment arms of the rotators across abduction angles"
    ]
  },
  {
    id: "infraspinatus_teres_minor",
    name: "Infraspinatus & Teres Minor (Rotator Manşet - Dış)",
    latinName: "Musculus infraspinatus et teres minor",
    region: "shoulder",
    category: "Omuz Derin",
    viewAngle: "posterior",
    depthLayer: "deep",
    color: "#818cf8",
    attachments: {
      origin: "Fossa infraspinata ve skapulanın lateral kenarı",
      insertion: "Tuberculum majus humeri (orta ve alt faset)"
    },
    innervation: {
      nerve: "Nervus suprascapularis & Nervus axillaris",
      roots: "C5 - C6"
    },
    actions: [
      { movement: "shoulder_external_rotation", role: "prime_mover", description: "Humerusun primer dış rotatör kaslarıdır." },
      { movement: "joint_stabilization", role: "stabilizer", description: "İtiş ve çekişlerde humerus başını posterior/inferior yönde dengeler." }
    ],
    exercises: [
      {
        id: "cable_external_rotation",
        name: "Cable External Rotation",
        role: "prime_mover",
        mechanicsSummary: "Transvers düzlemde humerus uzun ekseni etrafında dış rotasyon.",
        feelNote: "Dirseğin gövdeden ayrılmaması dış rotatörlerin izole edilmesini destekler."
      },
      {
        id: "face_pull",
        name: "Cable Face Pull",
        role: "synergist",
        mechanicsSummary: "Dış rotasyon bileşeniyle rotator manşet stabilizasyonu.",
        feelNote: "Bilekler geriye çevrildiğinde infraspinatus aktivasyonu belirginleşir."
      }
    ],
    biomechanics: {
      momentArmType: "Rotasyon ekseninde humerus başı etrafında teğetsel tork üretir.",
      resistanceProfileTip: "Bench press ve presste anterior translokasyona karşı arka dengeleyici görevi görür."
    },
    evidence: [
      "Reinold et al. (2004) - Electromyographic analysis of rotator cuff during external rotation",
      "Hughes et al. (1998) - Measurement of rotator cuff moment arms"
    ]
  },

  // ==========================================
  // 2. GÖĞÜS (PECTORALIS COMPLEX)
  // ==========================================
  {
    id: "pectoralis_major_clavicular",
    name: "Pectoralis Major - Clavicular (Üst Göğüs)",
    latinName: "Musculus pectoralis major (pars clavicularis)",
    region: "chest",
    category: "Göğüs",
    viewAngle: "anterior",
    depthLayer: "superficial",
    color: "#f59e0b",
    attachments: {
      origin: "Klavikulanın medial 1/2'lik ön yüzeyi",
      insertion: "Crista tuberculi majoris humeri (lateral dudak)"
    },
    innervation: {
      nerve: "Nervus pectoralis lateralis",
      roots: "C5 - C7"
    },
    actions: [
      { movement: "shoulder_flexion", role: "prime_mover", description: "Kolu öne ve yukarı çapraz açıyla kaldırmada önemli rol üstlenir." },
      { movement: "shoulder_horizontal_adduction", role: "prime_mover", description: "Kolu göğüs önünde çapraz içeri çekişte aktiftir." },
      { movement: "shoulder_internal_rotation", role: "synergist", description: "Humerusun iç rotasyonuna destek olur." }
    ],
    exercises: [
      {
        id: "incline_dumbbell_press",
        name: "Incline Dumbbell Press (30° Eğim)",
        role: "prime_mover",
        mechanicsSummary: "Omuz fleksiyonu ve horizontal adduksiyon bileşkesi.",
        feelNote: "Eğim açısı yaklaşık 30° olduğunda klaviküler liflerin çekiş açısı dikey yönlü dirençle elverişli şekilde hizalanabilir."
      }
    ],
    biomechanics: {
      momentArmType: "Kol hafif fleksiyon açısındayken klaviküler liflerin moment kolu sternal liflere göre daha avantajlı hale gelebilir.",
      resistanceProfileTip: "Dambıl incline presste alt pozisyonda dış moment kolu daha geniştir."
    },
    evidence: [
      "Barnett et al. (1995) - Effects of variations of the bench press on EMG activity",
      "Lauver et al. (2016) - Influence of bench angle on upper extremity muscular activation"
    ]
  },
  {
    id: "pectoralis_major_sternal",
    name: "Pectoralis Major - Sternal (Orta ve Alt Göğüs)",
    latinName: "Musculus pectoralis major (pars sternocostalis)",
    region: "chest",
    category: "Göğüs",
    viewAngle: "anterior",
    depthLayer: "superficial",
    color: "#ef4444",
    attachments: {
      origin: "Sternum ön yüzü, 1-6. kostal kıkırdaklar",
      insertion: "Crista tuberculi majoris humeri"
    },
    innervation: {
      nerve: "Nervus pectoralis medialis ve lateralis",
      roots: "C6 - T1"
    },
    actions: [
      { movement: "shoulder_horizontal_adduction", role: "prime_mover", description: "Yatay planda kolu içeri doğru kapatmanın ana motorudur." },
      { movement: "shoulder_adduction", role: "prime_mover", description: "Kolu yukarıdan aşağı gövde yanına indirme (özellikle alt kostal lifler)." },
      { movement: "shoulder_internal_rotation", role: "synergist", description: "Humerusun içe rotasyonuna katkı sunar." }
    ],
    exercises: [
      {
        id: "flat_barbell_bench_press",
        name: "Flat Barbell Bench Press",
        role: "prime_mover",
        mechanicsSummary: "Bileşik horizontal adduksiyon.",
        feelNote: "Skapular retraksiyon (kürek kemiklerini sabitleme), humerus anterior kapsülünü korumaya ve sternal lifleri gerilim hattında tutmaya yardımcı olur."
      }
    ],
    biomechanics: {
      momentArmType: "Kol horizontal abdüksiyondayken (göğsün açık olduğu alt faz) lifler uzamış konumda yüksek gerilim taşır.",
      resistanceProfileTip: "Düz bench presste göğse yakın alt nokta dış moment kolunun belirgin olduğu fazdır."
    },
    evidence: [
      "Schick et al. (2010) - A review of the bench press exercise and EMG activity",
      "Stastny et al. (2017) - Muscle activity during bench press variants"
    ]
  },

  // ==========================================
  // 3. SIRT VE ÇEKİŞ (LATS, TRAPS, RHOMBOIDS)
  // ==========================================
  {
    id: "latissimus_dorsi",
    name: "Latissimus Dorsi (Geniş Sırt / Kanat)",
    latinName: "Musculus latissimus dorsi",
    region: "back",
    category: "Sırt",
    viewAngle: "posterior",
    depthLayer: "superficial",
    color: "#06b6d4",
    attachments: {
      origin: "T7-L12 processus spinosusları, torakolomber fasya, crista iliaca",
      insertion: "Sulcus intertubercularis humeri tabanı"
    },
    innervation: {
      nerve: "Nervus thoracodorsalis",
      roots: "C6 - C8"
    },
    actions: [
      { movement: "shoulder_adduction", role: "prime_mover", description: "Kolu yukarıdan aşağıya (frontal planda) çekmede ana motor." },
      { movement: "shoulder_extension", role: "prime_mover", description: "Kolu önden arkaya (sagital planda) çekişte primer rol." },
      { movement: "shoulder_internal_rotation", role: "synergist", description: "Humerusun iç rotasyonuna destek sağlar." },
      { movement: "scapular_depression", role: "synergist", description: "Skapulanın aşağı çekilmesine indirekt stabilizasyon desteği." }
    ],
    exercises: [
      {
        id: "lat_pulldown_neutral",
        name: "Lat Pulldown (Nötr / Geniş Tutuş)",
        role: "prime_mover",
        mechanicsSummary: "Frontal ve skapular düzlemlerde adduksiyon.",
        feelNote: "Dirsekleri önden ve hafif içeriden gövdeye doğru çekmek, humerus ile latissimus liflerinin çekiş açısını uyumlu hale getirebilir."
      },
      {
        id: "single_arm_cable_row",
        name: "Single-Arm Cable Row",
        role: "prime_mover",
        mechanicsSummary: "Sagital omuz ekstansiyonu.",
        feelNote: "Dirseği kalça cebine doğru yönlendirmek latissimus dorsi'nin alt liflerinin kasılma hissine katkıda bulunur."
      }
    ],
    biomechanics: {
      momentArmType: "Kol 100-120° elevasyondayken adduksiyon moment kolu elverişli konuma gelir.",
      resistanceProfileTip: "Geniş enseye çekiş yerine göğse kontrollü çekiş omuz eklemi stabilitesi için daha uygundur."
    },
    evidence: [
      "Signorile et al. (2002) - Electromyographical comparison of relative activation on lat pulldown",
      "Andersen et al. (2014) - Effects of grip width on muscle strength and activation in lat pull-down"
    ]
  },
  {
    id: "teres_major",
    name: "Teres Major (Büyük Yuvarlak Kas)",
    latinName: "Musculus teres major",
    region: "back",
    category: "Sırt",
    viewAngle: "posterior",
    depthLayer: "superficial",
    color: "#3b82f6",
    attachments: {
      origin: "Skapulanın inferior açısının arka yüzü",
      insertion: "Crista tuberculi minoris humeri"
    },
    innervation: {
      nerve: "Nervus subscapularis inferior",
      roots: "C5 - C7"
    },
    actions: [
      { movement: "shoulder_adduction", role: "prime_mover", description: "Kolu gövdeye çekmede latissimus dorsi ile sinerji oluşturur." },
      { movement: "shoulder_extension", role: "prime_mover", description: "Omuz ekstansiyonuna önemli katkı sağlar." },
      { movement: "shoulder_internal_rotation", role: "synergist", description: "Humerusun içe rotasyonuna katılır." }
    ],
    exercises: [
      {
        id: "lat_pulldown_neutral",
        name: "Lat Pulldown",
        role: "prime_mover",
        mechanicsSummary: "Adduksiyon ve ekstansiyon fazlarında latissimus dorsi ile birlikte çalışır.",
        feelNote: "Kollar geniş açıldığında teres major liflerinin çekiş hattı belirginleşir."
      }
    ],
    biomechanics: {
      momentArmType: "Skapuladan humerusa doğrudan uzanan kısa kaldıraç hattı.",
      resistanceProfileTip: "Kürek kemiğinin dönüş açısı teres major'un gerilim boyunu etkiler."
    },
    evidence: [
      "Hik & Ackland (2019) - The moment arms of muscles acting across human glenohumeral joint"
    ]
  },
  {
    id: "trapezius_upper",
    name: "Trapezius - Superior (Üst Trapez)",
    latinName: "Musculus trapezius (pars descendens)",
    region: "back",
    category: "Sırt",
    viewAngle: "posterior",
    depthLayer: "superficial",
    color: "#e11d48",
    attachments: {
      origin: "Os occipitale, ligamentum nuchae",
      insertion: "Klavikulanın lateral 1/3'lük posterior kenarı"
    },
    innervation: {
      nerve: "Nervus accessorius (CN XI)",
      roots: "CN XI, C3 - C4"
    },
    actions: [
      { movement: "scapular_elevation", role: "prime_mover", description: "Kürek kemiğini yukarı kaldırma (omuz silkme)." },
      { movement: "scapular_upward_rotation", role: "prime_mover", description: "Serratus anterior ile birlikte kol yükselirken skapulayı yukarı döndürme." }
    ],
    exercises: [
      {
        id: "dumbbell_shrug",
        name: "Dumbbell Shrug",
        role: "prime_mover",
        mechanicsSummary: "Skapular elevasyon.",
        feelNote: "Gövdeyi hafif öne eğip skapular düzlemde yukarı çekiş liflerin yönüyle daha uyumlu olabilir."
      }
    ],
    biomechanics: {
      momentArmType: "Akromiyon ve klavikula ucunu yukarı çeken dikey kuvvet çizgisi.",
      resistanceProfileTip: "Lateral raise yaparken kol yükseldikçe skapular rotasyon gereği üst trapezin devreye girmesi doğal ritmin parçasıdır."
    },
    evidence: [
      "Castelein et al. (2016) - Scapular muscle activity during rehabilitation exercises",
      "Pizzari et al. (2014) - Modifying a shrug exercise to optimize scapular upward rotation"
    ]
  },
  {
    id: "trapezius_middle_lower",
    name: "Trapezius - Mid & Lower (Orta ve Alt Trapez)",
    latinName: "Musculus trapezius (pars transversa et ascendens)",
    region: "back",
    category: "Sırt",
    viewAngle: "posterior",
    depthLayer: "superficial",
    color: "#f43f5e",
    attachments: {
      origin: "C7-T12 vertebra processus spinosusları",
      insertion: "Spina scapulae ve trigonum spinae"
    },
    innervation: {
      nerve: "Nervus accessorius (CN XI)",
      roots: "CN XI, C3 - C4"
    },
    actions: [
      { movement: "scapular_retraction", role: "prime_mover", description: "Kürek kemiklerini omurgaya doğru yaklaştırma (orta lifler)." },
      { movement: "scapular_depression", role: "prime_mover", description: "Kürek kemiğini aşağı çekme (alt lifler)." },
      { movement: "scapular_upward_rotation", role: "prime_mover", description: "Skapulanın yukarı rotasyonuna katkı sağlayarak stabilite sunar." }
    ],
    exercises: [
      {
        id: "chest_supported_row",
        name: "Chest Supported Row (Geniş Tutuş)",
        role: "prime_mover",
        mechanicsSummary: "Horizontal çekiş ve skapular retraksiyon.",
        feelNote: "Kürek kemiklerini kontrollü olarak birbirine yaklaştırmak orta trapezi destekler."
      }
    ],
    biomechanics: {
      momentArmType: "Omurgaya doğru yatay ve aşağı çapraz vektör çizgileri.",
      resistanceProfileTip: "Skapular depresyon bench press ve pulldownda gövde stabilitesi için temel oluşturur."
    },
    evidence: [
      "Ekstrom et al. (2003) - EMG analysis of exercises for trapezius and serratus anterior",
      "De Mey et al. (2012) - Conscious correction of scapular orientation"
    ]
  },
  {
    id: "rhomboids",
    name: "Rhomboids (Eşkenar Kaslar - Derin Sırt)",
    latinName: "Musculus rhomboideus major et minor",
    region: "back",
    category: "Sırt",
    viewAngle: "posterior",
    depthLayer: "deep",
    color: "#ec4899",
    attachments: {
      origin: "C7-T5 processus spinosusları (trapeziusun altında yer alır)",
      insertion: "Margo medialis scapulae (kürek kemiği iç kenarı)"
    },
    innervation: {
      nerve: "Nervus dorsalis scapulae",
      roots: "C4 - C5"
    },
    actions: [
      { movement: "scapular_retraction", role: "prime_mover", description: "Skapulayı omurgaya doğru çeker ve sabitler." },
      { movement: "scapular_downward_rotation", role: "prime_mover", description: "Glenoid boşluğu aşağı baktıracak şekilde döndürür." }
    ],
    exercises: [
      {
        id: "seated_cable_row",
        name: "Seated Cable Row",
        role: "prime_mover",
        mechanicsSummary: "Skapula retraksiyonu.",
        feelNote: "Çekişin son bölümünde kürek kemiklerini sabitlemek romboidleri destekler."
      }
    ],
    biomechanics: {
      momentArmType: "Skapula iç kenarından omurgaya yukarı-içeri yönlü kuvvet hattı.",
      resistanceProfileTip: "Skapulanın göğüs kafesine temasını korumada önemli rol oynar."
    },
    evidence: [
      "Moseley et al. (1992) - EMG analysis of scapular muscles during shoulder rehabilitation"
    ]
  },

  // ==========================================
  // 4. KOL - FLEKSİYON & EKSTANSİYON
  // ==========================================
  {
    id: "biceps_brachii",
    name: "Biceps Brachii (Pazu Kası)",
    latinName: "Musculus biceps brachii (caput longum et breve)",
    region: "arm",
    category: "Kol",
    viewAngle: "anterior",
    depthLayer: "superficial",
    color: "#10b981",
    attachments: {
      origin: "Uzun baş: Tuberculum supraglenoidale; Kısa baş: Processus coracoideus",
      insertion: "Tuberositas radii ve bicipital aponevroz"
    },
    innervation: {
      nerve: "Nervus musculocutaneus",
      roots: "C5 - C6"
    },
    actions: [
      { movement: "elbow_flexion", role: "prime_mover", description: "Önkol supinasyondayken en elverişli moment koluna ve yüksek tork kapasitesine sahip fleksörlerden biridir." },
      { movement: "forearm_supination", role: "prime_mover", description: "Önkolun dışa döndürülmesinde ana motor." },
      { movement: "shoulder_flexion", role: "synergist", description: "Biartiküler yapısı nedeniyle omuz fleksiyonuna hafif destek sunar." }
    ],
    exercises: [
      {
        id: "supinated_barbell_curl",
        name: "Standing Barbell / Dumbbell Curl",
        role: "prime_mover",
        mechanicsSummary: "Dirsek fleksiyonu ve önkol supinasyonu.",
        feelNote: "Önkol yere paralelken (90°) dambılın dirsek eklemine dik mesafesi (external moment arm) zirveye yaklaşır."
      },
      {
        id: "incline_dumbbell_curl",
        name: "Incline Dumbbell Curl",
        role: "prime_mover",
        mechanicsSummary: "Omuz ekstansiyondayken dirsek fleksiyonu.",
        feelNote: "Biceps uzun başı köken noktasından uzatılmış pozisyonda başlar."
      }
    ],
    biomechanics: {
      momentArmType: "Tendonun radius boynundaki yapışma geometrisi nedeniyle iç moment kolu yaklaşık 80-100° dirsek açısında zirveye yaklaşır.",
      resistanceProfileTip: "Önkol pronasyona geçtiğinde tendon kemik etrafına sarılarak moment kolu kısalır; işin büyük kısmını Brachialis üstlenir."
    },
    evidence: [
      "Murray et al. (1995) - Variation of muscle moment arms with elbow and forearm position",
      "Schoenfeld et al. (2020) - Effects of range of motion on muscle development"
    ]
  },
  {
    id: "brachialis_brachioradialis",
    name: "Brachialis & Brachioradialis (Derin Kol & Önkol)",
    latinName: "Musculus brachialis et brachioradialis",
    region: "arm",
    category: "Kol",
    viewAngle: "anterior",
    depthLayer: "deep",
    color: "#14b8a6",
    attachments: {
      origin: "Brachialis: Humerus distal ön yüzü; Brachioradialis: Humerus lateral suprakondiler sırtı",
      insertion: "Brachialis: Tuberositas ulnae; Brachioradialis: Processus styloideus radii"
    },
    innervation: {
      nerve: "N. musculocutaneus (Brachialis) & N. radialis (Brachioradialis)",
      roots: "C5 - C6"
    },
    actions: [
      { movement: "elbow_flexion", role: "prime_mover", description: "Önkolun rotasyon pozisyonundan (supinasyon/pronasyon) bağımsız çalışan, dirsek fleksiyonunun en temel ve güçlü beygir gücüdür." },
      { movement: "forearm_pronation", role: "synergist", description: "Brachioradialis önkolu nötr pozisyona getirmeye yardımcı olur." },
      { movement: "forearm_supination", role: "synergist", description: "Tam pronasyondaki kolu yarı-supinasyona yönlendirir." }
    ],
    exercises: [
      {
        id: "hammer_curl",
        name: "Neutral Grip Hammer Curl",
        role: "prime_mover",
        mechanicsSummary: "Önkol nötrken dirsek fleksiyonu.",
        feelNote: "Biceps'in supinasyon avantajı devreden çıktığında Brachialis ve Brachioradialis mekanik olarak ön plana çıkar."
      }
    ],
    biomechanics: {
      momentArmType: "Ulna kemiğine yapışması sebebiyle önkol rotasyonundan etkilenmeyen tutarlı iç kaldıraç.",
      resistanceProfileTip: "Biceps kasının altından geçen Brachialis hipertrofiye uğradığında üst kol hacmini dışa doğru iter."
    },
    evidence: [
      "Basmajian & Latif (1957) - Integrated actions and functions of chief flexors of the elbow",
      "Staudenmann et al. (2015) - Contribution of brachialis and biceps to elbow torque"
    ]
  },
  {
    id: "triceps_brachii",
    name: "Triceps Brachii (Arka Kol - 3 Baş)",
    latinName: "Musculus triceps brachii",
    region: "arm",
    category: "Kol",
    viewAngle: "posterior",
    depthLayer: "superficial",
    color: "#eab308",
    attachments: {
      origin: "Uzun baş: Tuberculum infraglenoidale; Lateral/Medial baş: Humerus posterior yüzü",
      insertion: "Olecranon ulnae (dirsek kemiği çıkıntısı)"
    },
    innervation: {
      nerve: "Nervus radialis",
      roots: "C6 - C8"
    },
    actions: [
      { movement: "elbow_extension", role: "prime_mover", description: "Dirseği düzleştirmenin ana motoru." },
      { movement: "shoulder_extension", role: "synergist", description: "Uzun baş skapulayı aştığı için omuz ekstansiyonuna katkı sağlayabilir." },
      { movement: "shoulder_adduction", role: "synergist", description: "Uzun baş omuz adduksiyonuna hafif destek verir." }
    ],
    exercises: [
      {
        id: "overhead_cable_triceps_extension",
        name: "Overhead Triceps Extension",
        role: "prime_mover",
        mechanicsSummary: "Omuz fleksiyondayken dirsek ekstansiyonu.",
        feelNote: "Kollar baş üzerine kalktığında uzun baş gerilme pozisyonuna girer."
      },
      {
        id: "triceps_pushdown",
        name: "Cable Pushdown",
        role: "prime_mover",
        mechanicsSummary: "Saf dirsek ekstansiyonu.",
        feelNote: "Omuz sabit tutulduğunda dirsek ekstansiyon momenti odaklanır."
      }
    ],
    biomechanics: {
      momentArmType: "Olecranon dirsek ekstansiyonunda makara gibi çalışarak moment kolunu korur.",
      resistanceProfileTip: "Dar tutuş bench presste dirsek fleksiyonu arttığı için triceps üzerindeki ekstansiyon momenti yükselir."
    },
    evidence: [
      "Maeo et al. (2022) - Triceps brachii hypertrophy is substantially greater after overhead vs neutral training",
      "Kholinne et al. (2018) - The role of different heads of triceps brachii"
    ]
  },
  {
    id: "forearm_flexors_extensors",
    name: "Forearm Complex (Önkol Kasları)",
    latinName: "Musculi antebrachii",
    region: "arm",
    category: "Önkol",
    viewAngle: "anterior",
    depthLayer: "superficial",
    color: "#22c55e",
    attachments: {
      origin: "Medial epikondil (fleksörler), Lateral epikondil (ekstansörler)",
      insertion: "Karpal, metakarpal ve falanks kemikleri"
    },
    innervation: {
      nerve: "N. medianus, ulnaris ve radialis",
      roots: "C6 - T1"
    },
    actions: [
      { movement: "wrist_flexion_extension", role: "prime_mover", description: "El bileğinin fleksiyon ve ekstansiyon hareketleri." },
      { movement: "grip_stabilization", role: "stabilizer", description: "Ağır taşımalar ve çekişlerde izometrik kavrama kuvveti üretir." }
    ],
    exercises: [
      {
        id: "farmers_walk",
        name: "Farmer's Walk / Dead Hang",
        role: "stabilizer",
        mechanicsSummary: "Statik izometrik kavrama.",
        feelNote: "Bileği nötr hizada tutmak parmak fleksörlerindeki verimi korur."
      }
    ],
    biomechanics: {
      momentArmType: "Parmak ve el bileği eklemlerindeki tendon makaraları.",
      resistanceProfileTip: "Bilek aşırı büküldüğünde aktif yetersizlik nedeniyle kavrama gücü düşebilir."
    },
    evidence: [
      "Oatis (2009) - Kinesiology: The Mechanics and Pathomechanics of Human Movement"
    ]
  },

  // ==========================================
  // 5. OMURGA VE CORE
  // ==========================================
  {
    id: "rectus_abdominis",
    name: "Rectus Abdominis (Karın Kası)",
    latinName: "Musculus rectus abdominis",
    region: "core",
    category: "Core",
    viewAngle: "anterior",
    depthLayer: "superficial",
    color: "#f97316",
    attachments: {
      origin: "Crista pubica ve symphysis pubica",
      insertion: "5-7. kostal kıkırdaklar ve processus xiphoideus"
    },
    innervation: {
      nerve: "Nervi intercostales",
      roots: "T7 - T12"
    },
    actions: [
      { movement: "lumbar_flexion", role: "prime_mover", description: "Omurgayı öne bükerek göğüs kafesini pelvise yaklaştırır." },
      { movement: "posterior_pelvic_tilt", role: "prime_mover", description: "Pelvisi geriye doğru devirerek bel çukurunu dengeler." },
      { movement: "intra_abdominal_pressure", role: "stabilizer", description: "Gövde içi basınç oluşumuna destek sağlar." }
    ],
    exercises: [
      {
        id: "hanging_leg_raise",
        name: "Hanging Leg / Knee Raise",
        role: "prime_mover",
        mechanicsSummary: "Pelvisin yukarı kıvrılmasıyla lomber fleksiyon.",
        feelNote: "Sadece kalçadan kaldırmak yerine leğen kemiğinin yukarı kıvrılması karın liflerini aktifleştirir."
      },
      {
        id: "cable_crunch",
        name: "Cable Crunch",
        role: "prime_mover",
        mechanicsSummary: "Dirençli lomber fleksiyon.",
        feelNote: "Kalçayı sabit tutup göğüs kemiğini kasığa yaklaştırmak karın liflerinde kasılma sağlar."
      }
    ],
    biomechanics: {
      momentArmType: "Omurga eksenine göre önde yer alan kaldıraç hattı.",
      resistanceProfileTip: "Plank izometrik anti-ekstansiyon sunarken dinamik egzersizler fleksiyon momentini hedefler."
    },
    evidence: [
      "Contreras et al. (2011) - Biomechanical analysis of abdominal exercises",
      "Escamilla et al. (2006) - EMG analysis of traditional and nontraditional abdominal exercises"
    ]
  },
  {
    id: "obliques",
    name: "External & Internal Obliques (Yan Karın)",
    latinName: "Musculi obliquus externus et internus abdominis",
    region: "core",
    category: "Core",
    viewAngle: "anterior",
    depthLayer: "superficial", // External superficial, internal deep
    color: "#fb923c",
    attachments: {
      origin: "Eksternal: 5-12. kostalar; İnternal (Derin): Torakolomber fasya, crista iliaca",
      insertion: "Linea alba, crista pubica"
    },
    innervation: {
      nerve: "Nervi intercostales alt dalları",
      roots: "T7 - L1"
    },
    actions: [
      { movement: "trunk_rotation", role: "prime_mover", description: "Gövdenin dönmesinde çapraz lif yönleriyle primer rol üstlenirler." },
      { movement: "lateral_flexion", role: "prime_mover", description: "Gövdenin yana bükülmesine katkı sağlar." },
      { movement: "intra_abdominal_pressure", role: "stabilizer", description: "Karın içi basınç üreterek omurgayı korumaya yardımcı olur." }
    ],
    exercises: [
      {
        id: "pallof_press",
        name: "Pallof Press (Anti-Rotation)",
        role: "stabilizer",
        mechanicsSummary: "Transvers dönme momentine karşı izometrik direnç.",
        feelNote: "Kollar öne uzatıldıkça dış moment kolu uzar ve oblikler dönmeyi engellemek için daha fazla tork üretir."
      }
    ],
    biomechanics: {
      momentArmType: "Gövdenin dış çeperinde çapraz uzanan lif geometrisi.",
      resistanceProfileTip: "Ağır dambıllarla yana eğilmek yerine anti-rotasyon duruşları omurga disk mekaniği açısından daha elverişlidir."
    },
    evidence: [
      "McGill (2010) - Core Training: Evidence Translating to Better Performance and Injury Prevention"
    ]
  },
  {
    id: "erector_spinae",
    name: "Erector Spinae (Omurga Doğrultucuları)",
    latinName: "Musculus erector spinae",
    region: "core",
    category: "Omurga",
    viewAngle: "posterior",
    depthLayer: "superficial",
    color: "#d97706",
    attachments: {
      origin: "Os sacrum, crista iliaca, vertebra processus spinosusları",
      insertion: "Kaburgalar ve torakal/servikal vertebralar"
    },
    innervation: {
      nerve: "Rami posteriores",
      roots: "C1 - L5"
    },
    actions: [
      { movement: "lumbar_extension", role: "prime_mover", description: "Omurgayı doğrultma ve geriye açma." },
      { movement: "spinal_anti_flexion", role: "stabilizer", description: "Deadlift ve squatta omurganın bükülmesini önleyerek disklere binen kesme kuvvetini dengeler." }
    ],
    exercises: [
      {
        id: "barbell_deadlift",
        name: "Barbell Deadlift",
        role: "stabilizer",
        mechanicsSummary: "Dış fleksiyon momentine karşı izometrik anti-fleksiyon.",
        feelNote: "Bar kaval kemiğine yakın tutulduğunda bel omurlarındaki dış moment kolu kısalır ve omurga daha dengeli yüklenir."
      },
      {
        id: "back_extension_45",
        name: "45° Hyperextension",
        role: "prime_mover",
        mechanicsSummary: "Kontrollü lomber ekstansiyon.",
        feelNote: "Hareketi belden aşırı geriye bükmek yerine nötr omurgayla kalçadan yapmak faset eklemleri korur."
      }
    ],
    biomechanics: {
      momentArmType: "Omurga eksenine paralel çalışan segmentli iç moment kolları.",
      resistanceProfileTip: "Bar vücuttan uzaklaştıkça bel omurlarındaki dış moment kolu hızla katlanır."
    },
    evidence: [
      "McGill et al. (2009) - Coordination of muscle activity to balance external moments on lumbar spine",
      "Cholewicki & McGill (1996) - Mechanical stability of in vivo lumbar spine"
    ]
  },

  // ==========================================
  // 6. KALÇA VE GLUTEAL GRUP
  // ==========================================
  {
    id: "gluteus_maximus",
    name: "Gluteus Maximus (Büyük Kalça Kası)",
    latinName: "Musculus gluteus maximus",
    region: "hip",
    category: "Kalça",
    viewAngle: "posterior",
    depthLayer: "superficial",
    color: "#b91c1c",
    attachments: {
      origin: "Os ilium arka yüzü, os sacrum ve os coccygis lateral kenarları",
      insertion: "Tractus iliotibialis ve tuberositas glutea femoris"
    },
    innervation: {
      nerve: "Nervus gluteus inferior",
      roots: "L5 - S2"
    },
    actions: [
      { movement: "hip_extension", role: "prime_mover", description: "Kalçanın en güçlü ekstansiyon motorlarından biridir." },
      { movement: "hip_external_rotation", role: "prime_mover", description: "Femuru kalçadan dışa doğru döndürür." },
      { movement: "hip_abduction", role: "synergist", description: "Üst lifleri kalça abdüksiyonuna destek olur." },
      { movement: "posterior_pelvic_tilt", role: "prime_mover", description: "Pelvisin geriye yatırılmasına katkı sağlar." }
    ],
    exercises: [
      {
        id: "barbell_hip_thrust",
        name: "Barbell Hip Thrust",
        role: "prime_mover",
        mechanicsSummary: "Kalça ekstansiyonunun tepe fazında direnç sağlama.",
        feelNote: "Tepe noktada ağırlık vektörü pelvise dik biner ve gluteus kısalmış pozisyonda yüksek tork üretir."
      },
      {
        id: "romanian_deadlift",
        name: "Romanian Deadlift",
        role: "prime_mover",
        mechanicsSummary: "Kalça menteşesi ile gerilme altında ekstansiyon.",
        feelNote: "Kalçayı geriye iterek alt pozisyona inmek liflerin uzamış konumda gerilmesini sağlar."
      }
    ],
    biomechanics: {
      momentArmType: "Kalça nötr ve ekstansiyona yaklaştıkça gluteus'un ekstansiyon moment kolu avantaj kazanır.",
      resistanceProfileTip: "Squat kalçayı uzamış pozisyonda, Hip Thrust ise kısalmış pozisyonda elverişli dirençle hedefler."
    },
    evidence: [
      "Contreras et al. (2015) - A comparison of gluteus maximus EMG in back squat and hip thrust",
      "Vigotsky et al. (2017) - Biomechanical analysis of hip thrust"
    ]
  },
  {
    id: "gluteus_medius",
    name: "Gluteus Medius (Orta Kalça Kası)",
    latinName: "Musculus gluteus medius",
    region: "hip",
    category: "Kalça",
    viewAngle: "lateral",
    depthLayer: "superficial",
    color: "#c026d3",
    attachments: {
      origin: "Ala ossis ilii dış yüzeyi (derininde gluteus minimus yer alır)",
      insertion: "Trochanter major femoris lateral yüzeyi"
    },
    innervation: {
      nerve: "Nervus gluteus superior",
      roots: "L4 - S1"
    },
    actions: [
      { movement: "hip_abduction", role: "prime_mover", description: "Bacağı yana açmanın ana motorudur." },
      { movement: "pelvic_stabilization", role: "stabilizer", description: "Tek bacak duruşlarında pelvisin karşı tarafa devrilmesini engeller." },
      { movement: "hip_internal_rotation", role: "synergist", description: "Ön lifleri femurun içe rotasyonuna katkı sunar." }
    ],
    exercises: [
      {
        id: "cable_hip_abduction",
        name: "Standing Cable Hip Abduction",
        role: "prime_mover",
        mechanicsSummary: "Frontal planda kalça abdüksiyonu.",
        feelNote: "Ayağı hafif arkaya ve dışa doğru açmak liflerin eğimli yönüyle uyumludur."
      },
      {
        id: "bulgarian_split_squat",
        name: "Bulgarian Split Squat",
        role: "stabilizer",
        mechanicsSummary: "Tek bacak pelvis stabilizasyonu.",
        feelNote: "Ön dizin içeri çökmesini (valgus) engellemede stabilizatör rol oynar."
      }
    ],
    biomechanics: {
      momentArmType: "Trochanter major üzerinden geçen güçlü kaldıraç kolu.",
      resistanceProfileTip: "Zayıf pelvis stabilizasyonu adım döngüsünde diz valgusuna yol açabilir."
    },
    evidence: [
      "Distefano et al. (2009) - Gluteal muscle activation during common therapeutic exercises",
      "Gottschalk et al. (1989) - Functional anatomy of tensor fasciae latae and gluteus medius/minimus"
    ]
  },

  // ==========================================
  // 7. ÖN VE ARKA BACAK (QUADS & HAMSTRINGS)
  // ==========================================
  {
    id: "quadriceps_rectus_femoris",
    name: "Quadriceps - Rectus Femoris (Biartiküler Ön Bacak)",
    latinName: "Musculus rectus femoris",
    region: "thigh",
    category: "Ön Bacak",
    viewAngle: "anterior",
    depthLayer: "superficial",
    color: "#0284c7",
    attachments: {
      origin: "Spina iliaca anterior inferior (SIAI)",
      insertion: "Patella ve lig. patellae aracılığıyla tuberositas tibiae"
    },
    innervation: {
      nerve: "Nervus femoralis",
      roots: "L2 - L4"
    },
    actions: [
      { movement: "knee_extension", role: "prime_mover", description: "Dizi düzleştirme." },
      { movement: "hip_flexion", role: "prime_mover", description: "İki eklemli olduğu için uyluğu gövdeye doğru çekme." }
    ],
    exercises: [
      {
        id: "leg_extension",
        name: "Seated Leg Extension",
        role: "prime_mover",
        mechanicsSummary: "Kalça 90° fleksiyondayken izole diz ekstansiyonu.",
        feelNote: "Squatta hem diz hem kalça aynı anda büküldüğü için rectus femoris boyunu pek değiştirmez (Lombard paradoksu); leg extension bu kası izole edebilir."
      }
    ],
    biomechanics: {
      momentArmType: "Patella diz ekstansiyon mekanizmasının kaldıraç mesafesini artırır.",
      resistanceProfileTip: "Monoartiküler vastus kaslarından farklı olarak kalça açısına duyarlıdır."
    },
    evidence: [
      "Ema et al. (2013) - Inhomogeneous architectural changes among four heads of quadriceps femoris",
      "Zabaleta-Korta et al. (2021) - Role of multi-joint vs single-joint exercises on quad hypertrophy"
    ]
  },
  {
    id: "quadriceps_vasti",
    name: "Quadriceps - Vasti Grubu (Lateralis, Medialis, Intermedius)",
    latinName: "Musculi vastus lateralis, medialis et intermedius",
    region: "thigh",
    category: "Ön Bacak",
    viewAngle: "anterior",
    depthLayer: "superficial",
    color: "#0369a1",
    attachments: {
      origin: "Femur şaftı ve linea aspera",
      insertion: "Patella ve tuberositas tibiae"
    },
    innervation: {
      nerve: "Nervus femoralis",
      roots: "L2 - L4"
    },
    actions: [
      { movement: "knee_extension", role: "prime_mover", description: "Diz ekstansiyonunun tek eklemli ana motorlarıdır." }
    ],
    exercises: [
      {
        id: "barbell_back_squat",
        name: "Barbell Back Squat",
        role: "prime_mover",
        mechanicsSummary: "Diz fleksiyonu ve ekstansiyonu.",
        feelNote: "Diz fleksiyonu derinleştikçe vastus lifleri uzamış konumda yüksek mekanik gerilimle karşılaşır."
      },
      {
        id: "hack_squat",
        name: "Hack Squat",
        role: "prime_mover",
        mechanicsSummary: "Diz ekstansiyon momenti odaklı çöküş.",
        feelNote: "Dizlerin öne gitmesi diz eklemindeki dış moment kolunu artırabilir."
      }
    ],
    biomechanics: {
      momentArmType: "Patellofemoral kaldıraç sistemi.",
      resistanceProfileTip: "Vastus medialis patellanın dışa kaymasını dengeleyen medial destekleyicidir."
    },
    evidence: [
      "Schoenfeld (2010) - Squatting kinematics and kinetics",
      "Escamilla et al. (1998) - Biomechanics of knee during closed kinetic chain exercises"
    ]
  },
  {
    id: "hamstrings",
    name: "Hamstrings (Arka Bacak Grubu)",
    latinName: "Musculi ischiocrurales (biceps femoris, semitendinosus, semimembranosus)",
    region: "thigh",
    category: "Arka Bacak",
    viewAngle: "posterior",
    depthLayer: "superficial",
    color: "#7c3aed",
    attachments: {
      origin: "Tuber ischiadicum ve femur linea aspera (kısa baş)",
      insertion: "Caput fibulae ve tibia medial kondili"
    },
    innervation: {
      nerve: "Nervus ischiadicus",
      roots: "L5 - S2"
    },
    actions: [
      { movement: "knee_flexion", role: "prime_mover", description: "Dizi geriye doğru bükme." },
      { movement: "hip_extension", role: "prime_mover", description: "Kalçanın geriye itilmesine güçlü katkı." }
    ],
    exercises: [
      {
        id: "seated_leg_curl",
        name: "Seated Leg Curl",
        role: "prime_mover",
        mechanicsSummary: "Kalça fleksiyondayken diz fleksiyonu.",
        feelNote: "Oturma pozisyonunda leğen kemiği geriye çekilerek hamstring kas lifleri uzatılmış konuma gelir."
      },
      {
        id: "romanian_deadlift",
        name: "Romanian Deadlift",
        role: "prime_mover",
        mechanicsSummary: "Diz hafif kırıkken kalça ekstansiyonu.",
        feelNote: "Diz açısı sabit tutularak kalçadan eğilmek hamstring kaslarını uzama gerilimi altına sokar."
      }
    ],
    biomechanics: {
      momentArmType: "Kalça fleksiyona gittikçe hamstringlerin kalça ekstansiyon moment kolu uzar.",
      resistanceProfileTip: "Squatta diz ve kalça eşzamanlı büküldüğünden kas boyu minimal değişir; izole hamstring gelişimi için curl ve hinge egzersizleri önemlidir."
    },
    evidence: [
      "Maeo et al. (2021) - Greater hamstrings muscle hypertrophy after seated vs prone leg curl",
      "Kellis et al. (2012) - In vivo hamstring muscle architecture and biomechanics"
    ]
  },

  // ==========================================
  // 8. BALDIR VE AYAK BİLEĞİ (CALVES)
  // ==========================================
  {
    id: "gastrocnemius",
    name: "Gastrocnemius (İki Başlı Yüzeyel Baldır)",
    latinName: "Musculus gastrocnemius (caput mediale et laterale)",
    region: "calf",
    category: "Baldır",
    viewAngle: "posterior",
    depthLayer: "superficial",
    color: "#059669",
    attachments: {
      origin: "Femur medial ve lateral kondilleri arka yüzeyi",
      insertion: "Aşil tendonu aracılığıyla tuber calcanei"
    },
    innervation: {
      nerve: "Nervus tibialis",
      roots: "S1 - S2"
    },
    actions: [
      { movement: "ankle_plantarflexion", role: "prime_mover", description: "Parmak ucuna yükselme (özellikle diz düzken avantajlıdır)." },
      { movement: "knee_flexion", role: "synergist", description: "Dizin bükülmesine hafif mekanik katkı sunar." }
    ],
    exercises: [
      {
        id: "standing_calf_raise",
        name: "Standing Calf Raise",
        role: "prime_mover",
        mechanicsSummary: "Diz düzken ayak bileği plantar fleksiyonu.",
        feelNote: "Diz eklemi düz kilitlendiğinde gastrocnemius gergin kalır ve yüklenir."
      }
    ],
    biomechanics: {
      momentArmType: "Aşil tendonu üzerinden 2. tip kaldıraç sistemi kurar.",
      resistanceProfileTip: "Diz büküldüğünde aktif yetersizlik eğilimi gösterir ve işi Soleus devralır."
    },
    evidence: [
      "Hébert-Losier et al. (2009) - Scientific bases of calf muscle training",
      "Kassiano et al. (2023) - Which calf exercise produces greater hypertrophy?"
    ]
  },
  {
    id: "soleus",
    name: "Soleus (Derin Düz Baldır)",
    latinName: "Musculus soleus",
    region: "calf",
    category: "Baldır",
    viewAngle: "posterior",
    depthLayer: "deep",
    color: "#15803d",
    attachments: {
      origin: "Fibula başı ve tibia linea musculi solei (gastroknemiusun derinindedir)",
      insertion: "Aşil tendonu aracılığıyla tuber calcanei"
    },
    innervation: {
      nerve: "Nervus tibialis",
      roots: "S1 - S2"
    },
    actions: [
      { movement: "ankle_plantarflexion", role: "prime_mover", description: "Diz açısından bağımsız olarak ayak bileğini aşağı itme." },
      { movement: "postural_stabilization", role: "stabilizer", description: "Ayakta dururken vücudun öne devrilmesini önleyen tonik stabilizatör." }
    ],
    exercises: [
      {
        id: "seated_calf_raise",
        name: "Seated Calf Raise",
        role: "prime_mover",
        mechanicsSummary: "Diz 90° fleksiyondayken plantar fleksiyon.",
        feelNote: "Diz büküldüğünde gastrocnemius deaktifleştiği için yükün büyük bölümü Soleus kasına biner."
      }
    ],
    biomechanics: {
      momentArmType: "Ayak bileğini kateden tek eklemli kaldıraç.",
      resistanceProfileTip: "Ağırlıklı olarak tip-1 dayanıklılık liflerinden oluşur; kontrollü tempo ve gerilim altında çalışmaya uygundur."
    },
    evidence: [
      "Gollnick et al. (1974) - Human muscle fiber type adaptation in gastrocnemius and soleus",
      "Cronin et al. (2013) - Soleus fascicle length and muscle tendon interaction"
    ]
  },
  {
    id: "tibialis_anterior",
    name: "Tibialis Anterior (Ön Kaval Kası)",
    latinName: "Musculus tibialis anterior",
    region: "calf",
    category: "Baldır",
    viewAngle: "anterior",
    depthLayer: "superficial",
    color: "#06b6d4",
    attachments: {
      origin: "Tibia lateral kondili, tibianın lateral üst 2/3'lük yüzeyi ve membrana interossea",
      insertion: "Os cuneiforme mediale ve 1. metatarsal kemiğin tabanı (ayak tabanının iç kenarı)"
    },
    innervation: {
      nerve: "Nervus fibularis (peroneus) profundus",
      roots: "L4 - L5"
    },
    actions: [
      { movement: "ankle_dorsiflexion", role: "prime_mover", description: "Ayak bileğinin en güçlü dorsifleksörüdür; ayağı yukarı ve kaval kemiğine doğru çeker." },
      { movement: "ankle_inversion", role: "prime_mover", description: "Subtalar eklemde ayak tabanını içe (mediale) çevirir ve medial arkı dinamik olarak destekler." }
    ],
    exercises: [
      {
        id: "barbell_back_squat",
        name: "Barbell Back Squat",
        role: "stabilizer",
        mechanicsSummary: "Ayak bileği dorsifleksiyon kontrolü ve anterior stabilizasyon.",
        feelNote: "Çömelme derinleştikçe dizlerin kontrollü öne gitmesine izin verirken tibianın öne translasyonunu dengeler."
      }
    ],
    biomechanics: {
      momentArmType: "Ayak bileği anteriorunda ekstansör retinakulum altından geçen ve dorsifleksiyon için elverişli moment koluna sahip kaldıraç.",
      resistanceProfileTip: "Ayak bileği plantar fleksiyondayken gerilmiş pozisyondadır; koşu ve iniş mekaniğinde zemin reaksiyon kuvvetlerini sönümlemede kritik rol oynar."
    },
    evidence: [
      "Marsh et al. (2004) - In vivo mechanics of the human tibialis anterior muscle during dorsiflexion",
      "Maganaris (2001) - Force-length characteristics of in vivo human tibialis anterior muscle"
    ]
  }
];
