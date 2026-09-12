# LESOFEN KINETIKA
> **Human Movement · Anatomy · Biomechanics**  
> *İnsan hareketini, fonksiyonel anatomiyi ve egzersiz biyomekaniğini tek bir interaktif platformda birleştiren 2D dijital atlas ve laboratuvar.*

---

## 🧬 Projenin Amacı ve Felsefesi
`LESOFEN KINETIKA`, fitness ve anatomi dünyasındaki iki büyük problemi çözmek için tasarlanmıştır:
1. **Tıbbi Ezbercilik:** Kasları sadece Latince adlarıyla sıralayıp gerçek insan hareketindeki kaldıraç rolünü göz ardı eden klasik kaynaklar.
2. **Sahte Yüzdeler ve Bro-Science:** *"Bu hareket %83 göğüs çalıştırır"* gibi uydurma rakamlar yerine **Primer Motor (Agonist) · Sinerjist · Dinamik/Statik Stabilizatör** sınıflandırması ve literatür referanslı (`evidence`) analiz.

---

## ⚡ Temel Özellikler ve Modüller

### 1. 2D Yüksek Kaliteli İnteraktif Anatomi Atlası
* **Özel Referans Görseller:** Kullanıcı tarafından sağlanan yüksek çözünürlüklü **Ön (Anterior)** ve **Arka (Posterior)** medikal çizimler ana referans olarak kullanılır.
* **SVG Hotspot & Dokunmatik Katman:** Görsellerin üzerine yerleştirilen responsive SVG koordinat haritası sayesinde her kas grubu canlı nabız ve neon parıltıyla seçilebilir.
* **Üçlü Görünüm Kontrolü:**
  * `[ ÖN GÖRÜNÜM ]`: Pektoralis, Ön/Yan Omuz, Biceps, Core, Quads, Kaval/Baldır.
  * `[ ARKA GÖRÜNÜM ]`: Trapez, Arka Omuz, Triceps, Lats, Erector Spinae, Gluteus, Hamstrings, Gastroknemius/Soleus.
  * `[ KAS LİSTESİ ]`: Bölgesel gruplanmış fihrist (Omuz, Göğüs, Sırt, Kol, Önkol, Core, Kalça, Bacak). Listeden bir kasa tıklanması anında doğru görünümü açar ve kası vurgular.

### 2. Antrenman Ajandası (Training Agenda Calendar)
* **Aylık Takvim Grid'i (Pazartesi → Pazar):** Kullanıcının hangi gün hangi antrenman split'ini yaptığını kaydettiği minimalist modül.
* **Split Seçenekleri:** `PUSH`, `PULL`, `LEGS`, `UPPER`, `LOWER`, `FULL BODY`, `ANTERIOR`, `POSTERIOR`, `REST`.
* **Sürükle & Bırak + Dokunmatik Destek:** Kartları takvim günlerine sürükleyebilir veya karta dokunup güne tıklayabilirsiniz.
* **İstemci Tarafı Saklama (`localStorage`):** Sıfır backend, sıfır üyelik/şifre, sıfır veri karmaşası. Sayfa yenilendiğinde kayıtlar korunur.

### 3. İnteraktif Biyomekanik Laboratuvarı (Star Feature)
* **Dumbbell Lateral Raise (External Moment Arm & Torque):**
  * Eklem açısı slider'ı ($0^\circ - 110^\circ$) ve dambıl ağırlığı seçimi.
  * $d_{\text{ext}} = L \times \sin(\theta)$ formülüyle dinamik hesaplanan dik mesafe (**Sarı Kesikli Çizgi**).
  * Yerçekimi hattı (**Kırmızı Dikey Çizgi**) ve anlık tork göstergesi ($N\cdot m$).
  * *"Dambıl 10 kg sabit kalırken omuza binen dış tork neden 0'dan 58.8 N·m'ye fırlar?"* görsel kanıtı.
* **Biceps Curl (Internal vs External Leverage):**
  * Önkol yere paralel olduğunda ($90^\circ$) dış tork ile biceps tendonunun iç kaldıraç avantajının çakışması ve "sticking point" mekaniği.

### 4. Hareket Atlası (Kinetik Zincir)
* Ekleme göre filtreleme (Omuz, Dirsek, Kalça, Diz, Skapula).
* Hareket düzlemleri (*Frontal, Sagital, Transvers*), eksenler ve normal ROM.
* Agonist, sinerjist ve antagonist kas dağılımı.
* Tek tıkla ilgili kasa 2D atlas üzerinde odaklanma.

### 5. Egzersiz ve Tutuş Analizi
* Bench Press (Standart vs Dar Tutuş vs Geniş Tutuş).
* Lat Pulldown (Geniş Pronated vs Nötr vs Supinated vs Enseye Çekiş riskleri).
* Squat (High Bar vs Low Bar vs Front Squat) moment kolu dağılımı.
* Romanian Deadlift vs Konvansiyonel Deadlift.

### 6. "Neden Hissediyorum?" Rehberi
* *"Lateral raise'de trapezim neden çok yanıyor?"* (Skapulohumeral ritim).
* *"Squat yaparken hamstringlerim neden ağrımıyor?"* (Lombard paradoksu).
* *"Bench presste omzum neden batıyor?"* (Subakromiyal impingement).
* *"Deadliftte belim neden ağrıyor?"* (Kaval kemiğinden uzaklaşan bar ve L5-S1 moment kolu).

### 7. Fonksiyonel Anatomi & Mekanik Quiz
* İnteraktif çoktan seçmeli sorular ve detaylı pedagojik açıklamalar.

---

## 🚀 Çalıştırma (Hızlı Başlangıç)

Sıfır bağımlılık; yerel sunucu ile çalıştırabilirsiniz:

```bash
# Yerel sunucuyu başlatmak için:
node scripts/server.js
```

Tarayıcınızda açın:
👉 **`http://localhost:5173/`**
