/**
 * LESOFEN KINETIKA - Functional Anatomy & Biomechanics Quiz Engine
 */

export const QUIZ_QUESTIONS = [
  {
    id: "q1",
    question: "Omuz abdüksiyonunun ilk 0-15 derecesinde kolu gövdeden ayıran ve humerus başını glenoid kavitede sabitleyen primer kas hangisidir?",
    options: [
      "Lateral Deltoid",
      "Supraspinatus",
      "Latissimus Dorsi",
      "Pectoralis Major"
    ],
    correctIndex: 1,
    explanation: "Doğru! Deltoid kasının çekme açısı 0-15° aralığında humerus şaftına neredeyse paraleldir ve yukarı doğru kompresyon üretir. Bu yüzden abdüksiyonu başlatan ve eklemi merkezleyen asıl kas Rotator Manşet üyesi Supraspinatus'tur; ardından 15° sonrasında Lateral Deltoid bayrağı devralır."
  },
  {
    id: "q2",
    question: "Dumbbell Lateral Raise yaparken dambılın ağırlığı (örneğin 10 kg) değişmemesine rağmen, hareket kol 90°'ye ulaştığında neden en ağır hissedilir?",
    options: [
      "Dambılın kütlesi yukarı çıktıkça artar.",
      "Yerçekimi vektörü ile omuz eklem merkezi arasındaki dik mesafe (External Moment Arm) 90°'de maksimuma ulaşır.",
      "Omuz eklem kıkırdağı 90 derecede sürtünmeyi artırır.",
      "Trapez kası deltoidi geriye doğru çeker."
    ],
    correctIndex: 1,
    explanation: "Harika biyomekanik analiz! Dambılın kütlesi sabittir (10 kg = ~98.1 N). Ancak dış tork = Kuvvet × Dik Mesafe formülüdür. 0°'de moment kolu neredeyse sıfırken, 90°'de kol boyuna eşit maksimum seviyeye çıkar. Dolayısıyla ekleme binen dış tork en tepe noktada pik yapar."
  },
  {
    id: "q3",
    question: "Squat egzersizi derin yapılmasına rağmen neden doğrudan bir 'Hamstrings hipertrofisi' hareketi olarak kabul edilmez?",
    options: [
      "Hamstring kası squatta hiç kasılmaz.",
      "Lombard Paradoksu: Diz bükülürken kalça da büküldüğü için çift eklemli hamstring kasının toplam boyu neredeyse hiç değişmez.",
      "Squat sadece baldır kaslarını çalıştırır.",
      "Quadriceps hamstring kasının sinir iletimini bloke eder."
    ],
    correctIndex: 1,
    explanation: "Kesinlikle doğru! Hamstrings biartiküler (iki eklemli) bir kastır. Çömelirken dizde kısalır, kalçada uzar. Net kas boyu değişimi minimum kalır (quasi-izometrik). Kas uzama altında yüksek mekanik gerilime girmediği için squat bir hamstring hipertrofisi hareketi değildir; Seated Leg Curl veya RDL şarttır."
  },
  {
    id: "q4",
    question: "Oturarak yapılan Seated Calf Raise egzersizinde elmas şeklindeki Gastrocnemius kasının neredeyse hiç çalışmamasının biyomekanik nedeni nedir?",
    options: [
      "Gastrocnemius diz büküldüğünde aktif yetersizliğe (active insufficiency) girer.",
      "Aşil tendonu otururken kopma tehlikesi yaşar.",
      "Soleus kası gastrocnemius'u felç eder.",
      "Oturma pozisyonunda ayak bileği hareket edemez."
    ],
    correctIndex: 0,
    explanation: "Mükemmel! Gastrocnemius diz ekleminin arkasından başlar. Diz 90 derece büküldüğünde kas iki ucundan birbirine yaklaşarak gevşer (aktif yetersizlik). Tek eklemli olan derin Soleus kası ise diz açısından etkilenmez ve oturarak yapılan baldır hareketinde tüm yükü tek başına sırtlar."
  },
  {
    id: "q5",
    question: "Bench press yaparken dirseklerin gövdeye 90° tam dik açılması (boyun hizasına inmesi) neden omuz için risklidir?",
    options: [
      "Göğüs kaslarının fazla büyümesine yol açar.",
      "Humerus başı subakromiyal alana çarparak supraspinatus tendonunu sıkıştırır (Impingement) ve anterior kapsüle aşırı makaslama bindirir.",
      "Barbell bükülme tehlikesi geçirir.",
      "Triceps kası tamamen devreden çıkar."
    ],
    correctIndex: 1,
    explanation: "Tam isabet! 90° tam açık dirsekler omuzun anterior kapsülünü aşırı gerer ve humerus başını akromiyon altına çarptırır. Doğru ve güvenli açı, gövde ile dirsekler arasında yaklaşık 45-60°'lik bir ok ucu (Arrowhead) formu oluşturmaktır."
  },
  {
    id: "q6",
    question: "Biceps Curl yaparken önkol supinasyondan (avuç yukarı) tam pronasyona (avuç aşağı - Reverse Curl) çevrildiğinde neden pazuya binen yük azalır?",
    options: [
      "Biceps tendonu radius etrafına sarılarak mekanik çekiş avantajını kaybeder; yük Brachialis ve Brachioradialis'e aktarılır.",
      "Biceps kası aniden gevşer.",
      "El bileği kemikleri kilitlenir.",
      "Triceps ters yönde kasılır."
    ],
    correctIndex: 0,
    explanation: "Doğru! Biceps brachii tuberositas radii'ye yapışır. Önkol içe döndüğünde (pronasyon) tendon kemiğin etrafına dolanır ve internal moment kolu kısalır. Bu sebeple ters tutuşta fleksiyona ana motor olarak derin Brachialis ve önkoldaki Brachioradialis devam eder."
  }
];
