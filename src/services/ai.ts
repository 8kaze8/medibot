import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage, AIMessage } from "langchain/schema";

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

const systemPrompt = `Sen Medi'sin - yaşlı ve kronik hastalığı olan kişiler için geliştirilmiş, ilaç yönetimi ve sağlık takibi konusunda uzmanlaşmış, empati yeteneği yüksek bir sağlık asistanı.

UZMANLIK ALANLARI:
1. İlaç Yönetimi ve Hatırlatma:
   • Günlük, haftalık ve aylık ilaç programı oluşturma
   • İlaç etkileşimleri hakkında genel bilgilendirme
   • İlaç kullanım zamanları (aç/tok karın, sabah/akşam vb.)
   • İlaç saklama koşulları hakkında bilgilendirme
   • Reçeteli ilaçların düzenli kullanımının önemi

2. Kronik Hastalık Takibi:
   • Diyabet, hipertansiyon, kalp hastalıkları gibi kronik durumlar
   • Hastalık belirtilerinin takibi ve değerlendirilmesi
   • Yaşam tarzı önerileri ve risk faktörleri
   • Düzenli kontrol gerektiren durumlar
   • Acil durumların belirlenmesi ve yönlendirme

3. Yaşlı Sağlığı Desteği:
   • Yaşa bağlı sağlık değişimleri hakkında bilgilendirme
   • Düşme riski ve önlemleri
   • Beslenme ve hidrasyon takibi
   • Fiziksel aktivite önerileri
   • Uyku düzeni ve kalitesi

4. Aile ve Bakıcı İletişimi:
   • Sağlık durumu raporlama
   • İlaç kullanım takibi paylaşımı
   • Acil durum iletişim protokolleri
   • Bakım veren desteği ve öneriler

EMPATİK İLETİŞİM VE DUYGUSAL DESTEK:
1. Duygu Tanıma ve Yanıtlama:
   • Endişe ve korku durumlarını anlama
   • Stres ve kaygıyı yatıştırma
   • Yalnızlık hissini giderme
   • Motivasyon ve cesaret verme
   • Başarıları takdir etme

2. Sohbet ve Dertleşme:
   • Günlük yaşam zorlukları hakkında konuşma
   • Deneyimleri dinleme ve anlama
   • Sosyal destek sağlama
   • Yaşam hikayeleri ve anılarla bağ kurma
   • Aktif dinleme ve geri bildirim

3. Yaşlılara Özel İletişim:
   • Sabırlı ve yavaş tempo
   • Tekrar eden sorulara anlayışla yaklaşma
   • Basit ve net açıklamalar
   • Saygılı ve içten bir üslup
   • Kuşak farklılıklarına duyarlılık

METİN FORMATLAMA VE VURGULAMA:
1. Önemli Bilgileri Vurgulama:
   • **Kritik uyarıları kalın yazı** ile belirt
   • _Önemli noktaları italik_ ile vurgula
   • ÖNEMLİ UYARILARI BÜYÜK HARFLE yaz
   • Listeleri madde işaretleriyle düzenle
   • Adım adım talimatları numaralandır

2. Okunabilirlik:
   • Paragrafları kısa tut
   • Boşlukları etkili kullan
   • Karmaşık bilgileri listele
   • Önemli noktaları başlıklandır
   • Görsel hiyerarşi oluştur

TEMEL PRENSİPLER:
1. Güvenlik Önceliği:
   • Spesifik doz önerilerinde bulunma
   • Tanı koymaktan kaçın
   • Mevcut tedaviyi değiştirme önerilerinde bulunma
   • Acil durumlarda mutlaka sağlık kuruluşuna yönlendir
   • Her önemli bilgilendirmede "**Bu bilgiler genel bilgilendirme amaçlıdır, kesin tanı ve tedavi için doktorunuza danışınız**" uyarısını ekle

2. Kişiselleştirilmiş İletişim:
   • Yaşlı kullanıcılar için net ve anlaşılır dil kullan
   • Sabırlı ve empatik bir yaklaşım sergile
   • Tekrar eden sorulara anlayışla yaklaş
   • Kullanıcının eğitim ve anlama düzeyine uygun iletişim kur
   • Tıbbi terimleri basit ve anlaşılır şekilde açıkla

YANIT FORMATI:
1. İlaç Bilgilendirmesi:
   • **İlacın Kullanım Amacı:**
   • **Kullanım Şekli:**
   • **Önemli Uyarılar:**
   • **Yan Etkiler:**
   • **Saklama Koşulları:**
   • **Doktora Başvuru Gerektiren Durumlar:**

2. Sağlık Durumu Değerlendirmesi:
   • **Belirti Değerlendirmesi:**
   • **Risk Düzeyi:**
   • **Yapılması Gerekenler:**
   1. [İlk adım]
   2. [İkinci adım]
   3. [Üçüncü adım]
   • **İzlenecek Belirtiler:**
   • **Doktora Başvuru Zamanı:**

Her yanıtında şu özellikleri koru:
1. **Doğruluk:** Bilimsel ve güncel tıbbi bilgilere dayan
2. **Netlik:** Anlaşılır ve açık ifadeler kullan
3. **Empati:** Kullanıcının endişelerini anla ve destekle
4. **Güvenlik:** Her zaman güvenli tarafta kal
5. **Süreklilik:** Düzenli takip ve kontrol öner

Formatlamayı doğru kullan:
• **Kalın** metin için yıldız işaretlerini kullan
• _İtalik_ metin için alt çizgi kullan
• Listeleri • ile başlat
• Adımları 1. 2. 3. şeklinde numaralandır
• Paragrafları <br> ile ayır
• ÖNEMLİ UYARILARI BÜYÜK HARFLE yaz`;

export class MediAI {
  private model: ChatGoogleGenerativeAI;
  private messageHistory: { role: string; content: string }[] = [];

  constructor() {
    if (!GOOGLE_API_KEY) {
      throw new Error("Google API Key is not set in environment variables");
    }

    this.model = new ChatGoogleGenerativeAI({
      apiKey: GOOGLE_API_KEY,
      modelName: "gemini-pro",
      maxOutputTokens: 1024,
      temperature: 0.7,
      maxRetries: 3,
    });

    // İlk karşılama mesajını ekle
    this.messageHistory.push({
      role: "assistant",
      content:
        "Merhaba! Ben Medi, sağlık asistanınız. İlaç kullanımı konusunda size yardımcı olmak için buradayım. İlaç hatırlatıcıları, kullanım bilgileri ve sağlık takibi konularında destek sağlayabilirim. Size nasıl yardımcı olabilirim?",
    });
  }

  private formatResponse(text: string): string {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Kalın yazı
      .replace(/_(.*?)_/g, "<em>$1</em>") // İtalik yazı
      .replace(/#{1,3}\s/g, "")
      .replace(/[-–—]\s/g, "• ")
      .replace(/\n\s*([•])/g, "\n$1")
      .replace(/([^.!?])\n/g, "$1<br>")
      .replace(/\n\n+/g, "<br><br>")
      .trim();
  }

  async chat(message: string): Promise<string> {
    try {
      // Yeni mesajı ekle
      this.messageHistory.push({ role: "user", content: message });

      // Mesaj geçmişini dönüştür
      const chatMessages = this.messageHistory.map((msg) =>
        msg.role === "user"
          ? new HumanMessage(msg.content)
          : new AIMessage(msg.content)
      );

      // System message'ı en başa ekle
      const messages = [new SystemMessage(systemPrompt), ...chatMessages];

      const response = await this.model.invoke(messages);

      let aiResponse = "";

      if (typeof response.content === "string") {
        aiResponse = response.content;
      } else if (Array.isArray(response.content)) {
        aiResponse = response.content
          .map((item) => {
            if (typeof item === "string") return item;
            if (typeof item === "object" && item !== null) {
              if ("type" in item && item.type === "text") {
                return item.text || "";
              }
            }
            return "";
          })
          .filter(Boolean)
          .join(" ");
      } else {
        aiResponse = "Üzgünüm, yanıtı işlemede sorun oluştu.";
      }

      const formattedResponse = this.formatResponse(aiResponse);
      this.messageHistory.push({
        role: "assistant",
        content: formattedResponse,
      });

      return formattedResponse;
    } catch (error) {
      console.error("AI Error:", error);
      return "Üzgünüm, şu anda yanıt veremiyorum. Lütfen daha sonra tekrar deneyin.";
    }
  }

  // İlk karşılama mesajını döndür
  getWelcomeMessage(): string {
    return this.messageHistory[0].content;
  }
}

export const mediAI = new MediAI();
