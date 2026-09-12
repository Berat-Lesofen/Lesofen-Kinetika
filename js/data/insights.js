/**
 * LESOFEN KINETIKA - Movement & Biomechanical Insights
 * "Neden Bunu Hissediyorum?" - Biyomekanik ve Nöromüsküler Analizler
 * (Eğitim amaçlı anatomi ve kaldırma mekaniği incelemesi)
 */

export const INSIGHTS = [
  {
    id: "lateral_raise_traps",
    question: "Lateral raise yaparken trapezimi omuzlarımdan daha fazla hissediyorum. Neden?",
    category: "Omuz & Sırt",
    relatedMuscles: ["deltoid_lateral", "trapezius_upper"],
    relatedMovements: ["shoulder_abduction", "scaption", "scapular_elevation"],
    summary: "Bu his çeşitli teknik ve mekanik faktörlerle ilişkili olabilir. Kol yükseldikçe kürek kemiğinin yukarı rotasyonu için üst trapezin devreye girmesi doğal bir anatomi kuralıdır.",
    detailedExplanation: `
      1. **Skapulohumeral Ritim:** Kol vücuttan uzaklaştıkça hareket sadece omuz ekleminden (glenohumeral) gelmez; kürek kemiği de akromiyonun humerus başına çarpmasını önlemek için yukarı doğru döner (skapulotorasik rotasyon). Bu süreçte üst trapez ve serratus anterior kaslarının çalışması normal bir anatomik işlevdir.
      2. **Omuz Silkme Alışkanlığı:** Ağırlık deltoidin rahat kontrol edebileceği seviyenin üzerindeyse, hareket istem dışı olarak omuz silkme (elevasyon) ile başlatılabilir.
      3. **Mekanik İpucu:** Dambılları dümdüz yukarı çekmek yerine 'kolları odanın iki yanına doğru uzatır gibi' hareket ettirmek ve hareketi frontal düzlemden yaklaşık 20-30° önde (skapular düzlemde) yapmak lateral deltoid üzerindeki odaklanmayı destekleyebilir.
    `,
    cueTip: "Omuzları kulaklara yaklaştırmak yerine kolları iki yana doğru uzatmayı deneyebilirsiniz."
  },
  {
    id: "squat_hamstrings_paradox",
    name: "Squat ve Hamstrings",
    question: "Ağır squat yapmama rağmen hamstringlerimde neden belirgin bir kasılma hissetmiyorum?",
    category: "Bacak & Kalça",
    relatedMuscles: ["hamstrings", "quadriceps_vasti", "gluteus_maximus"],
    relatedMovements: ["knee_extension", "hip_extension"],
    summary: "Lombard Paradoksu nedeniyle, squat sırasında diz bükülürken kalça da bükülür; bu da iki eklemli hamstring kasının toplam boyunun minimal düzeyde değişmesine yol açar.",
    detailedExplanation: `
      1. **Lombard Paradoksu:** Hamstring grubu hem kalçayı hem dizi kateder. Çömelirken dizde bükülerek kısalma eğilimine girerken, kalçada öne eğilerek uzama eğilimine girer. Sonuç olarak kas boyundaki net değişim sınırlı kalır (quasi-izometrik çalışma).
      2. **Mekanik Gerilim Dağılımı:** Hipertrofi için kritik olan 'uzama altında yüksek mekanik gerilim' squatta hamstringler üzerinde gluteus ve vastus kaslarına kıyasla daha sınırlı oluşur.
      3. **Antrenman Notu:** Hamstring gelişimi için kalçanın sabit kalıp dizin büküldüğü (Seated Leg Curl) veya dizin sabit kalıp kalçanın menteşelendiği (Romanian Deadlift) hareketler programda tamamlayıcı bir rol oynar.
    `,
    cueTip: "Squat temel olarak quadriceps ve gluteus odaklıdır; hamstring gelişimi için leg curl ve RDL gibi hareketler önemlidir."
  },
  {
    id: "bench_shoulder_pain",
    question: "Bench press yaparken omzumun ön bölgesinde aşırı gerilim hissediyorum. Neden?",
    category: "Göğüs & Omuz",
    relatedMuscles: ["pectoralis_major_sternal", "deltoid_anterior", "supraspinatus", "infraspinatus_teres_minor"],
    relatedMovements: ["shoulder_horizontal_adduction"],
    summary: "Bu his kürek kemiklerinin sehpadaki stabilitesi, dirseklerin açılma açısı ve omuz ekleminin anterior kapsülüne binen yüklerle ilişkili olabilir.",
    detailedExplanation: `
      1. **Eklem Alanı ve Dirsek Açısı:** Kollar gövdeye 90° dik tutulduğunda (boyun hizasına indirildiğinde), humerus başı akromiyon altına yaklaşarak subakromiyal alandaki dokulara baskı yapabilir.
      2. **Skapular Stabilite:** Kürek kemikleri sehpada sabitlenmediğinde (retraksiyon eksikliği), bar göğse indiğinde omuz başı öne doğru kayma eğilimi gösterebilir.
      3. **Mekanik İpucu:** Dirsekleri gövdeye yaklaşık 45-60° açıyla yaklaştırmak (ok ucu pozisyonu), göğsü hafif kabartıp kürek kemiklerini sehpaya sabitlemek yükün pektoralis majör liflerine daha elverişli dağılmasına yardımcı olur.
    `,
    cueTip: "Dirsekleri T şeklinde 90° açmak yerine gövdeyle yaklaşık 45-60° açı oluşturan bir ok ucu formu tercih edilebilir."
  },
  {
    id: "deadlift_lower_back",
    question: "Deadlift yaparken kalçamdan çok bel omurlarımda yoğun baskı hissediyorum. Neden?",
    category: "Core & Sırt",
    relatedMuscles: ["erector_spinae", "gluteus_maximus", "hamstrings"],
    relatedMovements: ["hip_extension", "lumbar_extension", "spinal_anti_flexion"],
    summary: "Bar kaval kemiğinden birkaç santimetre uzaklaştığında bile, bel omurlarındaki dış moment kolu hızla uzar ve tork omurga doğrultucuları üzerine yoğunlaşır.",
    detailedExplanation: `
      1. **Dış Moment Kolu Değişimi:** Bar ayağın orta noktasından (midfoot) uzaklaştıkça, L5-S1 omurgası ile ağırlık arasındaki dik mesafe genişler ve beldeki dış fleksiyon momenti belirgin biçimde katlanır.
      2. **Omurga Pozisyonu:** Omurga yuvarlandığında erector spinae kaslarının mekanik avantajı zayıflayabilir ve yük pasif bağ dokulara kayabilir.
      3. **Mekanik İpucu:** Barı kaval kemiğine yakın tutmak, latissimus dorsi kaslarını sıkarak barı geriye çekmek ve hareketi 'belden kaldırmak' yerine 'yeri ayak tabanlarıyla itmek' olarak düşünmek yükü posterior zincir kaslarına dengeli dağıtır.
    `,
    cueTip: "Barı kaval kemiğinden uzaklaştırmayın ve ağırlığı ayak tabanlarınızla zemini iterek kaldırmayı deneyin."
  },
  {
    id: "lat_pulldown_arms_only",
    question: "Lat Pulldown yaparken sırtımı değil kollarımı ve önkollarımı hissediyorum. Neden?",
    category: "Sırt & Kol",
    relatedMuscles: ["latissimus_dorsi", "biceps_brachii", "forearm_flexors_extensors"],
    relatedMovements: ["shoulder_adduction", "elbow_flexion"],
    summary: "Hareketi bileklerle çekip barı göğse indirmeye odaklanıldığında dirsek fleksiyonu baskın hale gelebilir; sırt kaslarını devreye sokmak humerusun gövdeye adduksiyonunu gerektirir.",
    detailedExplanation: `
      1. **Bilek ve Çekiş Odağı:** Barı avuçlarla sıkıca kavrayıp göğse çekmeye odaklanıldığında motor kontrol dirsek fleksörleri üzerinden çalışabilir.
      2. **Humerus Hareketi:** Latissimus dorsi önkola değil üst kol kemiğine (humerus) yapışır. Bu nedenle sırt liflerinin kasılması dirseğin gövdeye ne kadar yaklaştığıyla doğrudan ilişkilidir.
      3. **Mekanik İpucu:** Başparmaksız tutuş veya kayış (strap) kullanmak önkoldaki aşırı gerilimi azaltabilir; zihinsel odağı 'ellerle çekmek' yerine 'dirsekleri kalça ceplerine doğru basmak' olarak kurgulamak sırt hissiyatını destekler.
    `,
    cueTip: "Ellerinizi birer kanca gibi düşünün ve dirseklerinizi kalça ceplerinize doğru basmaya odaklanın."
  },
  {
    id: "calf_seated_vs_standing",
    question: "Oturarak calf raise yaptığımda baldırımın üst kısmında neden az gerilim hissediyorum?",
    category: "Baldır",
    relatedMuscles: ["gastrocnemius", "soleus"],
    relatedMovements: ["ankle_plantarflexion"],
    summary: "Gastrocnemius diz eklemini aşar. Diz 90° büküldüğünde kas iki ucundan birbirine yaklaşarak kısalır (aktif yetersizlik) ve işi tek eklemli Soleus kası üstlenir.",
    detailedExplanation: `
      1. **Aktif Yetersizlik (Active Insufficiency):** Gastrocnemius iki eklemli (biartiküler) bir kastır. Diz bükülü olduğunda lifler o kadar kısalır ki etkili tork üretme kapasitesi belirgin şekilde azalır.
      2. **Soleus Devreye Girer:** Soleus dizin altından başlar (monoartiküler). Diz açısı soleus kas boyunu etkilemez; bu nedenle otururken yükün büyük bölümü soleus kasına biner.
      3. **Antrenman Notu:** Üst baldırın belirginleşmesi için dizlerin düz kilitlendiği (Standing Calf Raise), derin baldır dayanıklılığı için ise oturarak (Seated Calf Raise) varyasyonlar tercih edilebilir.
    `,
    cueTip: "Üst baldır için dizlerin düz olduğu varyasyonlar, derin soleus kası için oturarak yapılan hareketler uygundur."
  }
];
