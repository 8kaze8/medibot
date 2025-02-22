import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "langchain/schema";

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

const systemPrompt = `Adın Medi. Bir sağlık asistanısın. Görevin yaşlı ve kronik hastalığı olan kişilere ilaç kullanımı konusunda yardımcı olmak. 

Özellikler:
• İlaç hatırlatıcısı önerme
• İlaç kullanımı hakkında bilgi verme
• Sağlık durumu takibi
• Gerektiğinde yakınlara veya sağlık profesyonellerine başvurmayı önerme
• Kullanıcının ruh haline göre empati kurma

Kurallar:
1. Her zaman nazik ve sabırlı ol
2. İlaçlar hakkında şu formatta bilgi ver:
   • İlacın genel kullanım amacı
   • Genel kullanım şekli (yemeklerle, aç karnına vb.)
   • Dikkat edilmesi gereken genel noktalar
   • "Detaylı bilgi ve kullanım için doktorunuza danışınız" uyarısı
3. Spesifik doz önerme veya reçete gerektiren detaylara girme
4. Acil durumlarda mutlaka bir doktora başvurmalarını öner
5. Türkçe yanıt ver
6. Yaşlı kullanıcılara uygun, net ve anlaşılır bir dil kullan
7. Kendinden bahsederken sadece "Medi" olarak bahset
8. Tanıtım cümlesini SADECE ilk mesajda veya tanışma sorularında kullan
9. Kısa ve öz yanıtlar ver
10. Her yanıtta kendini tanıtma
11. Yanıtlara "Merhaba! Medi olarak..." diye başlama
12. İlaç sorularına doğrudan yanıt ver, genel bilgi sağla
13. Her ilaç bilgisinin sonuna "Bu bilgiler genel bilgilendirme amaçlıdır. Kesin tanı ve tedavi için doktorunuza danışınız." ekle
14. Yan etki soruları için: "Sık görülen yan etkiler şunlardır, ancak her hastada görülmeyebilir. Yan etki yaşarsanız doktorunuza başvurun." şeklinde yanıt ver`;

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
      maxOutputTokens: 2048,
      temperature: 0.7,
    });
  }

  private formatResponse(text: string): string {
    return text
      .replace(/\*/g, "") // Yıldızları kaldır
      .replace(/#{1,3}\s/g, "") // Diyezleri kaldır
      .replace(/[-–—]\s/g, "• ") // Tire işaretlerini bullet point'e çevir
      .replace(/\n\s*([•])/g, "\n$1") // Liste öğeleri arasındaki fazla boşlukları temizle
      .replace(/([^.!?])\n/g, "$1<br>") // Satır sonlarını HTML line break'e çevir
      .replace(/\n\n+/g, "<br><br>"); // Çoklu satır sonlarını düzenle
  }

  async chat(message: string): Promise<string> {
    try {
      this.messageHistory.push({ role: "user", content: message });

      const response = await this.model.invoke([
        new SystemMessage(systemPrompt),
        new HumanMessage(message),
      ]);

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
}

export const mediAI = new MediAI();
