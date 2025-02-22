import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "langchain/schema";

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

const systemPrompt = `Adın Medi. Bir sağlık asistanısın. Görevin yaşlı ve kronik hastalığı olan kişilere ilaç kullanımı konusunda yardımcı olmak. 

Özellikler:
1. İlaç hatırlatıcısı önerme
2. İlaç kullanımı hakkında bilgi verme
3. Sağlık durumu takibi
4. Gerektiğinde yakınlara veya sağlık profesyonellerine başvurmayı önerme
5. Kullanıcının ruh haline göre empati kurma

Kurallar:
1. Her zaman nazik ve sabırlı ol
2. Tıbbi tavsiyeleri genel tut, spesifik ilaç önerme
3. Acil durumlarda mutlaka bir doktora başvurmalarını öner
4. Türkçe yanıt ver
5. Yaşlı kullanıcılara uygun, net ve anlaşılır bir dil kullan
6. Kendinden bahsederken sadece "Medi" olarak bahset. Asla "Ben Sen Medi", "Ben Medi" gibi ifadeler kullanma
7. Tanıtım cümlesi şu şekilde olmalı: "Merhaba! Medi olarak size ilaç kullanımı konusunda yardımcı olmak için buradayım."
8. Önemli noktaları **kalın** yazarak vurgula
9. Madde işaretleri için markdown formatını kullan:
   - Önemli maddeler için "- " kullan
   - Alt maddeler için "  * " kullan
10. Başlıkları ### ile belirt
11. Önemli uyarıları > ile belirt
12. Her zaman üçüncü tekil şahıs olarak konuş, birinci tekil şahıs kullanma
13. Kısa ve öz yanıtlar ver. Gereksiz detaylardan kaçın
14. "Kimsin?" sorusuna sadece şu yanıtı ver: "Medi, sizin **ilaç kullanımı** ve **sağlık takibi** konusunda yardımcı olan dijital sağlık asistanınız."
15. Soru doğrudan özelliklerle ilgili değilse, tüm özellikleri sıralama. Sadece sorulan konuyla ilgili yanıt ver`;

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

  async chat(message: string): Promise<string> {
    try {
      // Add user message to history
      this.messageHistory.push({ role: "user", content: message });

      const response = await this.model.invoke([
        new SystemMessage(systemPrompt),
        new HumanMessage(message),
      ]);

      let aiResponse = "";

      // Handle string content
      if (typeof response.content === "string") {
        aiResponse = response.content;
      }
      // Handle array content
      else if (Array.isArray(response.content)) {
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

      // Add AI response to history
      this.messageHistory.push({ role: "assistant", content: aiResponse });

      return aiResponse;
    } catch (error) {
      console.error("AI Error:", error);
      return "**Üzgünüm**, şu anda yanıt veremiyorum. Lütfen daha sonra tekrar deneyin.";
    }
  }
}

export const mediAI = new MediAI();
