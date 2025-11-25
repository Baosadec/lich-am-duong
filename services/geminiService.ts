import { GoogleGenAI, Type } from "@google/genai";
import { CompatibilityResult, LunarDetails } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = "gemini-2.5-flash";

export const getLunarDetails = async (date: Date): Promise<LunarDetails> => {
  const dateString = date.toLocaleDateString('vi-VN');
  
  const prompt = `Bạn là một chuyên gia lịch vạn niên và phong thủy Việt Nam.
  Hãy cung cấp thông tin chi tiết cho ngày dương lịch: ${dateString}.
  
  Tôi cần thông tin chính xác về:
  1. Ngày âm lịch (Ngày/Tháng).
  2. Năm can chi (Ví dụ: Giáp Thìn).
  3. Mệnh ngũ hành của ngày (Ví dụ: Hỏa - Phú Đăng Hỏa).
  4. Giờ hoàng đạo (Các khung giờ tốt trong ngày).
  5. Giờ hắc đạo (Các khung giờ xấu).
  6. Lời khuyên ngắn gọn cho ngày này.
  7. 3 việc nên làm.
  8. 3 việc nên tránh.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            lunarDate: { type: Type.STRING, description: "Ngày/Tháng âm lịch (VD: 15/01)" },
            lunarYear: { type: Type.STRING, description: "Năm Can Chi (VD: Giáp Thìn)" },
            element: { type: Type.STRING, description: "Mệnh ngũ hành" },
            luckyHours: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Danh sách giờ hoàng đạo" },
            badHours: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Danh sách giờ hắc đạo" },
            advice: { type: Type.STRING, description: "Lời khuyên tổng quan trong ngày" },
            auspicious: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Danh sách 3 việc nên làm" },
            inauspicious: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Danh sách 3 việc nên tránh" },
          },
          required: ["lunarDate", "lunarYear", "element", "luckyHours", "badHours", "advice", "auspicious", "inauspicious"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No data returned");
    
    return JSON.parse(text) as LunarDetails;
  } catch (error) {
    console.error("Error fetching lunar details:", error);
    // Fallback data in case of error to prevent app crash
    return {
      lunarDate: "N/A",
      lunarYear: "Không xác định",
      element: "Không xác định",
      luckyHours: [],
      badHours: [],
      advice: "Hiện tại hệ thống đang bận, vui lòng thử lại sau.",
      auspicious: [],
      inauspicious: [],
    };
  }
};

export const checkCompatibility = async (date1: string, date2: string): Promise<CompatibilityResult> => {
  const prompt = `Phân tích độ hợp nhau (tình duyên/hợp tác) giữa người sinh ngày ${date1} và người sinh ngày ${date2}.
  Dựa trên Thiên Can, Địa Chi, và Ngũ Hành nạp âm.
  Đưa ra điểm số trên thang 100.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: "Điểm số hợp nhau (0-100)" },
            summary: { type: Type.STRING, description: "Kết luận ngắn gọn (1 câu)" },
            details: { type: Type.STRING, description: "Phân tích chi tiết về tính cách và sự hòa hợp" },
            elementAnalysis: { type: Type.STRING, description: "Phân tích sâu về ngũ hành tương sinh tương khắc" },
          },
          required: ["score", "summary", "details", "elementAnalysis"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No data returned");
    return JSON.parse(text) as CompatibilityResult;
  } catch (error) {
    console.error("Error checking compatibility:", error);
    return {
      score: 0,
      summary: "Lỗi kết nối",
      details: "Không thể phân tích lúc này.",
      elementAnalysis: "",
    };
  }
};

export const getSmartAdvice = async (query: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Bạn là trợ lý ảo phong thủy thông thái. Người dùng hỏi: "${query}". Hãy trả lời ngắn gọn, hữu ích, mang tính tích cực và tâm linh lành mạnh.`,
        });
        return response.text || "Xin lỗi, tôi chưa nghĩ ra câu trả lời.";
    } catch (e) {
        return "Hiện tại tôi đang mất kết nối với vũ trụ.";
    }
}
