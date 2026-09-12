/**
 * LESOFEN KINETIKA - Exercise & Grip Variations Database
 * Temel Egzersizler, Eklem Hareketleri, Direnç Profilleri ve Tutuş Karşılaştırmaları
 * Nüanslı ve Bilimsel Terminoloji
 */

export const EXERCISES = [
  {
    id: "flat_barbell_bench_press",
    name: "Flat Barbell Bench Press (Düz Sehpa Pres)",
    category: "Göğüs & İtiş",
    targetMuscles: {
      primeMovers: ["pectoralis_major_sternal", "deltoid_anterior", "triceps_brachii"],
      synergists: ["pectoralis_major_clavicular"],
      stabilizers: ["supraspinatus", "infraspinatus_teres_minor", "trapezius_middle_lower", "rhomboids", "latissimus_dorsi"]
    },
    jointActions: [
      { joint: "Omuz", action: "shoulder_horizontal_adduction" },
      { joint: "Dirsek", action: "elbow_extension" },
      { joint: "Skapula", action: "scapular_retraction" }
    ],
    resistanceProfile: {
      type: "Serbest Ağırlık (Yerçekimi Doğrultulu)",
      peakTorqueAngle: "Alt pozisyon (bar göğse yaklaştığında dış moment kolu en uzundur)",
      feelExplanation: "Bar göğse yaklaştığında humerus ile yerçekimi çizgisi arasındaki dik mesafe genişler. Kollar düz kilitlendiğinde ise yük kemik eksenlerine aktarılır ve kaslar üzerindeki dış tork azalır."
    },
    variations: [
      {
        name: "Standart Genişlik (Önkol Dikey)",
        mechanics: "Bar alt noktadayken önkollar yere yaklaşık 90° dikey kalır. Göğüs lifleri ve ön omuz için dengeli bir mekanik gerilim dağılımı sağlar.",
        primaryStress: "Pectoralis Major (Sternal lifler) & Anterior Deltoid"
      },
      {
        name: "Dar Tutuş (Close Grip)",
        mechanics: "Tutuş omuz genişliğine yaklaştırıldığında dirsek fleksiyon açısı artar ve humerus gövdeye yaklaşır; bu durum dirsek ekstansiyon momentini ve triceps brachii üzerindeki mekanik talebi belirgin biçimde artırır.",
        primaryStress: "Triceps Brachii & Anterior Deltoid"
      },
      {
        name: "Geniş Tutuş (Wide Grip)",
        mechanics: "Önkolun dışa açıldığı geniş aralıkta hareket mesafesi kısalır ve omuz horizontal adduksiyon açısı değişir; ancak aşırı genişlik omuz anterior kapsülüne binen makaslama kuvvetini artırabilir.",
        primaryStress: "Pectoralis Major (Uzamış pozisyonda gerilim)"
      }
    ],
    evidenceCitation: "Schick et al. (2010); Lehman (2005) - The influence of grip width and bench inclination on EMG activity"
  },
  {
    id: "lat_pulldown_neutral",
    name: "Lat Pulldown (Geniş vs Nötr vs Ters Tutuş)",
    category: "Sırt & Çekiş",
    targetMuscles: {
      primeMovers: ["latissimus_dorsi", "teres_major", "biceps_brachii", "brachialis_brachioradialis"],
      synergists: ["trapezius_middle_lower", "rhomboids", "deltoid_posterior"],
      stabilizers: ["forearm_flexors_extensors"]
    },
    jointActions: [
      { joint: "Omuz", action: "shoulder_adduction" },
      { joint: "Dirsek", action: "elbow_flexion" },
      { joint: "Skapula", action: "scapular_depression" }
    ],
    resistanceProfile: {
      type: "Kablo / Makara Sistemi",
      peakTorqueAngle: "Kablo çekiş hattına göre hareket açıklığı boyunca sürekli gerilim",
      feelExplanation: "Kablo makarası hareket boyunca gerilimi korur. Dirsekler gövdeye yaklaştıkça latissimus dorsi liflerinin iç moment kolu kısalmaya başlar."
    },
    variations: [
      {
        name: "Geniş Pronated (Avuç İçi Karşıya)",
        mechanics: "Frontal düzlem adduksiyonu baskındır. Teres major ve latissimus dorsi'nin üst torakal lifleri elverişli bir çekiş hattındadır.",
        primaryStress: "Latissimus Dorsi (Üst) & Teres Major"
      },
      {
        name: "Nötr Tutuş (Avuçlar Birbirine Dönük)",
        mechanics: "Kollar skapular düzleme (~30-45° öne) yaklaşır; omuz eklemi sıkışma riski düşerken humerus ile lat lifleri doğal bir hizada buluşur.",
        primaryStress: "Latissimus Dorsi & Brachialis"
      },
      {
        name: "Supinated / Ters Tutuş (Avuç İçi Kendine)",
        mechanics: "Önkol supinasyona geçtiği için biceps brachii mekanik kaldıraç avantajı kazanır ve dirsek fleksiyon katkısı artar.",
        primaryStress: "Biceps Brachii & Alt Lat Lifleri"
      },
      {
        name: "Enseye Çekiş (Behind Neck - Biyomekanik Uyarı)",
        mechanics: "Humerusu aşırı dış rotasyon ve horizontal abdüksiyona zorlayarak subakromiyal alanı daraltır; omuz sağlığı açısından genellikle önerilmez.",
        primaryStress: "Önerilmeyen Eklem Pozisyonu"
      }
    ],
    evidenceCitation: "Andersen et al. (2014) - Effects of grip width on muscle activation in lat pull-down"
  },
  {
    id: "lateral_raise_dumbbell",
    name: "Dumbbell vs Cable Lateral Raise (Orta Omuz Mekaniği)",
    category: "Omuz & İzolasyon",
    targetMuscles: {
      primeMovers: ["deltoid_lateral"],
      synergists: ["supraspinatus", "deltoid_anterior", "trapezius_upper"],
      stabilizers: ["supraspinatus", "infraspinatus_teres_minor", "trapezius_middle_lower"]
    },
    jointActions: [
      { joint: "Omuz", action: "shoulder_abduction" },
      { joint: "Skapula", action: "scapular_upward_rotation" }
    ],
    resistanceProfile: {
      type: "Dambıl (Değişken Dış Tork) vs Kablo (Daha Dengeli Direnç)",
      peakTorqueAngle: "Dambıl ile kol yere paralelken (~90°); Kabloda ise açıya göre ayarlanabilir",
      feelExplanation: "Dambıl kaldırılırken alt noktada yerçekimi çizgisi omuz eklemine çok yakındır. Kol 80-90° açıldığında dik mesafe (external moment arm) zirveye çıkar. Bu nedenle dambıl yukarıda çok daha ağır hissedilir."
    },
    variations: [
      {
        name: "Dumbbell Lateral Raise (Ayakta)",
        mechanics: "Kol yükseldikçe dış moment kolu trigonometrik olarak artar; tepe noktada skapular yukarı rotasyonla trapez katkısı doğal olarak birleşir.",
        primaryStress: "Lateral Deltoid (Yükselme fazında tepe moment)"
      },
      {
        name: "Çapraz Kablo (Cross-Body Cable Raise)",
        mechanics: "Kablo kalça arkasından/önünden çapraz yönlendirildiğinde kol gövdeye yakınken de direnç açısı korunabilir.",
        primaryStress: "Lateral Deltoid (Uzamış pozisyonda gerilim)"
      }
    ],
    evidenceCitation: "Inman et al. (1944); Escamilla et al. (2009) - Shoulder mechanics and deltoid EMG"
  },
  {
    id: "supinated_barbell_curl",
    name: "Biceps Curl: Barbell vs Preacher vs Incline",
    category: "Kol & Fleksiyon",
    targetMuscles: {
      primeMovers: ["biceps_brachii", "brachialis_brachioradialis"],
      synergists: ["forearm_flexors_extensors"],
      stabilizers: ["deltoid_anterior"]
    },
    jointActions: [
      { joint: "Dirsek", action: "elbow_flexion" },
      { joint: "Önkol", action: "forearm_supination" }
    ],
    resistanceProfile: {
      type: "Kaldıraç & Eklem Açısı Değişimi",
      peakTorqueAngle: "Ayakta 90° civarı; Preacher'da hareketin alt-orta fazı",
      feelExplanation: "Ayakta curl yaparken önkol yere paralel olduğunda dambılın dirsek eksenine dik mesafesi maksimumdur. Preacher sehpa kolu öne eğdiği için tepe tork noktası hareketin daha alt fazına kayar."
    },
    variations: [
      {
        name: "Ayakta Barbell Curl",
        mechanics: "Nötr omuz pozisyonu. Önkol yere paralelken tepe dış tork oluşur. Supinasyon avantajıyla biceps güçlü katkı sunar.",
        primaryStress: "Biceps Brachii & Brachialis"
      },
      {
        name: "Incline Dumbbell Curl (45-60°)",
        mechanics: "Omuz hafif ekstansiyondadır. Biceps uzun başı köken noktasından uzatılmış konumda çalışır.",
        primaryStress: "Biceps Uzun Baş (Uzamış pozisyon)"
      },
      {
        name: "Preacher Curl (Scott Sehpa)",
        mechanics: "Omuz fleksiyondadır. Hareketin alt bölümünde dış moment kolu geniştir; kollar dikey kilitlendiğinde yük azalır.",
        primaryStress: "Brachialis & Biceps (Alt-orta faz)"
      }
    ],
    evidenceCitation: "Murray et al. (1995); Schoenfeld et al. (2020) - Range of motion and elbow flexion torque"
  },
  {
    id: "barbell_back_squat",
    name: "Barbell Back Squat: High Bar vs Low Bar",
    category: "Bacak & Kalça",
    targetMuscles: {
      primeMovers: ["quadriceps_vasti", "gluteus_maximus"],
      synergists: ["quadriceps_rectus_femoris", "erector_spinae"],
      stabilizers: ["obliques", "gluteus_medius", "gastrocnemius", "tibialis_anterior"]
    },
    jointActions: [
      { joint: "Diz", action: "knee_extension" },
      { joint: "Kalça", action: "hip_extension" },
      { joint: "Ayak Bileği", action: "ankle_plantarflexion" },
      { joint: "Ayak Bileği", action: "ankle_dorsiflexion" }
    ],
    resistanceProfile: {
      type: "Dikey Barbell Yolu",
      peakTorqueAngle: "Paralel ve altı (hem diz hem kalça ekleminde moment kolları geniştir)",
      feelExplanation: "Bar ayağın orta noktası (midfoot) üzerinde dengelenir. Gövde dik kaldıkça dizdeki moment kolu uzar; gövde öne eğildikçe kalçadaki moment kolu genişler."
    },
    variations: [
      {
        name: "High Bar Back Squat",
        mechanics: "Bar üst trapez üzerine yerleşir. Gövde daha diktir, dizler öne doğru daha fazla hareket eder ve diz ekstansiyon momenti artar.",
        primaryStress: "Quadriceps (Vasti Grubu)"
      },
      {
        name: "Low Bar Back Squat",
        mechanics: "Bar spina scapulae üzerine oturur. Gövde öne daha fazla yatar; bu da kalça eksenine olan dik mesafeyi artırır.",
        primaryStress: "Gluteus Maximus & Erector Spinae"
      },
      {
        name: "Front Squat",
        mechanics: "Bar klavikula ve ön omuz üzerindedir. Gövde oldukça dik tutulur; diz momenti ön plandadır.",
        primaryStress: "Quadriceps & Üst Sırt Ekstansörleri"
      }
    ],
    evidenceCitation: "Schoenfeld (2010); Fry et al. (2003) - Effect of knee position on hip and knee torques during squat"
  },
  {
    id: "romanian_deadlift",
    name: "Romanian Deadlift vs Conventional Deadlift",
    category: "Posterior Zincir & Menteşe",
    targetMuscles: {
      primeMovers: ["gluteus_maximus", "hamstrings"],
      synergists: ["erector_spinae", "latissimus_dorsi", "trapezius_middle_lower"],
      stabilizers: ["forearm_flexors_extensors", "obliques"]
    },
    jointActions: [
      { joint: "Kalça", action: "hip_extension" },
      { joint: "Omurga", action: "spinal_anti_flexion" }
    ],
    resistanceProfile: {
      type: "Kalça Menteşesi (Hip Hinge)",
      peakTorqueAngle: "Gövdenin öne eğildiği alt esneme fazı",
      feelExplanation: "Kalça geriye itildikçe bar ile kalça eklem merkezi arasındaki yatay mesafe açılır ve kalça ekstansörleri üzerinde yüksek gerilme torku oluşur."
    },
    variations: [
      {
        name: "Romanian Deadlift (RDL)",
        mechanics: "Dizler hafif bükülü kilitlenir; hareket kalçanın geriye menteşelenmesiyle gerçekleşir ve hamstringler uzama gerilimine girer.",
        primaryStress: "Hamstrings & Gluteus Maximus"
      },
      {
        name: "Konvansiyonel Deadlift (Yerden)",
        mechanics: "Dizler daha fazla bükülür; yerden koparırken bacak itişi ile kalça kilitlemesi kombine çalışır.",
        primaryStress: "Gluteus Maximus, Erector Spinae & Quadriceps"
      }
    ],
    evidenceCitation: "Kellis et al. (2012); Vigotsky et al. (2017) - Hamstring and gluteal mechanics during hip hinges"
  },
  {
    id: "barbell_hip_thrust",
    name: "Barbell Hip Thrust (Kalça Ekstansiyonu)",
    category: "Kalça & Glute",
    targetMuscles: {
      primeMovers: ["gluteus_maximus"],
      synergists: ["hamstrings"],
      stabilizers: ["erector_spinae", "quadriceps_vasti"]
    },
    jointActions: [
      { joint: "Kalça", action: "hip_extension" }
    ],
    resistanceProfile: {
      type: "Yatay/Açılı Kaldırma Direnci",
      peakTorqueAngle: "Tam kalça kilitlenme anı (tepe nokta)",
      feelExplanation: "Tepe noktada ağırlık vektörü pelvise dikleşir; gluteus maximus kısalmış pozisyondayken yüksek dış torka maruz kalır."
    },
    variations: [
      {
        name: "Standart 90° Diz Açısı",
        mechanics: "Tepe noktada kaval kemiği yere yaklaşık 90° diktir; gluteus lifleri elverişli tork üretir.",
        primaryStress: "Gluteus Maximus"
      },
      {
        name: "Ayaklar İleride",
        mechanics: "Diz açısı daha açık tutulduğunda hamstringlerin kalça ekstansiyonuna katkısı artabilir.",
        primaryStress: "Hamstrings ve Gluteus"
      }
    ],
    evidenceCitation: "Contreras et al. (2015) - A comparison of gluteus maximus activation in back squat vs hip thrust"
  },
  {
    id: "face_pull",
    name: "Cable Face Pull (Dış Rotasyon + Arka Omuz)",
    category: "Omuz & Duruş",
    targetMuscles: {
      primeMovers: ["deltoid_posterior", "infraspinatus_teres_minor"],
      synergists: ["trapezius_middle_lower", "rhomboids"],
      stabilizers: ["biceps_brachii"]
    },
    jointActions: [
      { joint: "Omuz", action: "shoulder_horizontal_abduction" },
      { joint: "Omuz", action: "shoulder_external_rotation" },
      { joint: "Skapula", action: "scapular_retraction" }
    ],
    resistanceProfile: {
      type: "Kablo Direnci",
      peakTorqueAngle: "Son faz (halat kulak hizasına çekilip eller geriye açıldığında)",
      feelExplanation: "Halat kulakların hizasına doğru çekilip dış rotasyon eklendiğinde infraspinatus ve arka omuz sinerjisi belirginleşir."
    },
    variations: [
      {
        name: "Kulak Hizasına Çekiş",
        mechanics: "Dış rotasyon bileşkesi eklenerek rotator manşet ve arka omuz hedeflenir.",
        primaryStress: "Infraspinatus, Teres Minor & Posterior Deltoid"
      }
    ],
    evidenceCitation: "Schoenfeld et al. (2013) - Effect of hand position on EMG of posterior shoulder"
  }
];
