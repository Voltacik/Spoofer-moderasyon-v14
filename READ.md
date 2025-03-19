# Spoofer & Moderasyon Botu README

## 📌 Genel Bilgilendirme
Bu bot, Discord sunucularınızda moderasyon ve spoofer güncelleme bildirimlerini yönetmek için geliştirilmiştir. Bot, moderasyon komutlarıyla sunucu yönetimini kolaylaştırırken, spoofer güncellemelerini belirlenen kanalda duyurmanızı sağlar.

---

## ⚙️ Kurulum Adımları

1. **Dosyaları İndirin ve Yerleştirin**
2. **Bağımlılıkları Yükleyin**: `npm install`
3. **Config.json Dosyasını Düzenleyin**:
   - Bildirim Kanalı ID'sini girin
   - Hoşgeldin mesajı için görsel yolu belirtin
   - Yasaklı kelime filtresinden muaf kullanıcıların ID'lerini ekleyin
4. **Botu Başlatın**: `node index.js`

---

## 🔧 Önemli Komutlar

### 🛠️ Spoofer Güncelleme Duyurusu
- **Komut:** `/spoofer oyun: [oyun adı]`
- **Açıklama:** Seçilen oyun için spoofer güncelleme duyurusu yapar.
- **Örnek:** `/spoofer oyun: valorant`
- **Not:** `resimler` klasörüne `oyunAdı.png` şeklinde görsel eklenmelidir.

### 🎫 Ticket Paneli
- **Kanal Bağlantısı:** `setURL('https://discord.com/channels/SUNUCU_ID/KANAL_ID')`
- **Görsel:** `ticket.png` (resimler klasöründe olmalı)

### 📢 Duyuru Komutu
- **Komut:** `/duyur mesaj: [duyuru metni]`
- **Görsel:** `duyuru.png` (resimler klasöründe olmalı)

### 👥 Kayıt Sistemi
- **Komut:** `/kayit-kur`
- **Görsel:** `welcome.png` (resimler klasöründe olmalı)

### 🛑 Yasaklı Kelime Filtresi
- `config.json` içinde `whitelist` bölümüne belirli kullanıcı ID'leri eklenerek filtre dışı bırakılabilir.

---

## 🎨 Görsel Gereksinimler
- **Spoofer Güncellemeleri:** `resimler` klasörüne `oyunAdı.png` formatında görseller eklenmelidir.
- **Hoşgeldin Görseli:** `config.json` dosyasında `welcomeImageUrl` olarak tanımlanmalı.

---

## 📌 Özet
Bu bot, Discord sunucularınızda moderasyon ve spoofer güncellemeleri için kapsamlı bir çözüm sunar. Basit ve anlaşılır adımlarla kolayca kurulabilir ve özelleştirilebilir. 🚀

s