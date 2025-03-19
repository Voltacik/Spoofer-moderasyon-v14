# 🎭 Spoofer & Moderasyon Botu

![Spoofer Bot](https://i.imgur.com/your-image.png)

## 🚀 Özellikler

✅ **Spoofer Güncelleme Duyuruları**  
✅ **Gelişmiş Moderasyon Komutları**  
✅ **Yasaklı Kelime Filtresi**  
✅ **Görselli Kayıt Sistemi**  
✅ **Ticket Panel Sistemi**  
✅ **Kolay Özelleştirme**  

---

## 📥 Kurulum

1. **Gerekli Bağımlılıkları Yükleyin**
   ```bash
   npm install
   ```
2. **Config.json Dosyanızı Düzenleyin**
   ```json
   {
     "bildirimKanali": "KANAL_ID",
     "welcomeImageUrl": "./resimler/hosgeldin.png",
     "whitelist": ["KULLANICI_ID"]
   }
   ```
3. **Botu Başlatın**
   ```bash
   node index.js
   ```

---

## 🔧 Kullanım

### 🎮 Spoofer Güncellemelerini Duyur
```
/spoofer oyun: [oyun adı]
```
📝 **Örnek:** `/spoofer oyun: valorant`  
📌 **Not:** `resimler` klasörüne `valorant.png` eklemelisiniz.

### 🎟️ Ticket Paneli Aç
```
setURL('https://discord.com/channels/SUNUCU_ID/KANAL_ID')
```
🖼 **Görsel:** `ticket.png`

### 📢 Duyuru Gönder
```
/duyur mesaj: [duyuru metni]
```
🖼 **Görsel:** `duyuru.png`

### 📌 Kayıt Paneli Kur
```
/kayit-kur
```
🖼 **Görsel:** `welcome.png`

### 🛑 Yasaklı Kelime Filtresi
Belirli kullanıcıları filtre dışı bırakmak için `config.json` dosyasındaki `whitelist` bölümüne ID ekleyin.

---

## 🎨 Görsel Gereksinimler
- **Spoofer Güncellemeleri:** `resimler` klasörüne `oyunAdı.png` eklenmeli.
- **Hoşgeldin Görseli:** `config.json` dosyasında `welcomeImageUrl` olarak tanımlanmalı.

---

## 🤝 Katkıda Bulun
Projeye katkıda bulunmak isterseniz, **Pull Request** gönderebilir veya **Issue** açabilirsiniz. 

---

📌 **Botunuzu şimdi kurun ve yönetin!** 🚀

