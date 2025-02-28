# Medi - Akıllı Sağlık Asistanı

Medi, ReMedi sağlık uygulamasının yapay zeka destekli akıllı asistanıdır. Bu proje, Google Yapay Zeka ve Teknoloji Akademisi'nin düzenlediği Ideathon etkinliği kapsamında geliştirilmiş olup, ileride ReMedi uygulamasına tam entegrasyonu planlanmaktadır.

> **ÖNEMLİ NOT:** Bu proje şu anda demo aşamasındadır. Projeyi kendi bilgisayarınızda çalıştırmak için Google Cloud Console'dan bir API anahtarı almanız ve `.env` dosyasına eklemeniz gerekmektedir. Detaylı bilgi için kurulum adımlarını takip edin.

## 🎯 Proje Hakkında

Medi, yaşlılar ve kronik hastalığı olan kişiler için geliştirilmiş, ilaç yönetimi ve sağlık takibi konusunda uzmanlaşmış bir sağlık asistanıdır. Google'ın Gemini yapay zeka modelini kullanarak, kullanıcılara kişiselleştirilmiş sağlık desteği sunar.

## ✨ Özellikler

- 💊 İlaç Yönetimi ve Hatırlatma

  - Günlük, haftalık ve aylık ilaç programı
  - İlaç etkileşimleri hakkında bilgilendirme
  - İlaç kullanım zamanları ve saklama koşulları

- 🏥 Kronik Hastalık Takibi

  - Hastalık belirtilerinin takibi
  - Yaşam tarzı önerileri
  - Risk faktörleri değerlendirmesi

- 👵 Yaşlı Sağlığı Desteği

  - Beslenme ve hidrasyon takibi
  - Düşme riski ve önlemleri
  - Fiziksel aktivite önerileri

- 👨‍👩‍👦 Aile ve Bakıcı İletişimi
  - Sağlık durumu raporlama
  - İlaç kullanım takibi paylaşımı
  - Acil durum iletişim protokolleri

## 🛠️ Teknolojiler

- React + TypeScript
- Vite
- Material-UI (MUI)
- Google Gemini AI
- LangChain

## 🚀 Kurulum

1. Projeyi klonlayın:

   ```bash
   git clone https://github.com/yourusername/medibot.git
   cd medibot
   ```

2. Bağımlılıkları yükleyin:

   ```bash
   npm install
   ```

3. Google Cloud Console'dan API anahtarı alın:

   - [Google Cloud Console](https://console.cloud.google.com)'a gidin
   - Yeni bir proje oluşturun veya mevcut projenizi seçin
   - Gemini API'yi etkinleştirin
   - API anahtarı oluşturun

4. `.env` dosyasına API anahtarınızı ekleyin:

   ```env
   VITE_GOOGLE_API_KEY=your_api_key_here
   ```

5. Geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   ```

## 📱 Kullanım

1. Yeni bir sohbet başlatın
2. Sağlık veya ilaçlarınızla ilgili sorularınızı sorun
3. Medi size anlayışlı ve net yanıtlar verecektir

---

Bu proje Google Yapay Zeka ve Teknoloji Akademisi'nin Ideathon etkinliği kapsamında Kadir Zeyrek tarafından geliştirilmiştir. © 2024
