
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzePromotionScreenshot = async (base64Image: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image
          }
        },
        {
          text: `You are an expert in Chinese bank loyalty programs. Analyze this screenshot of a bank promotion.
          Identify:
          1. The bank name.
          2. The type of reward (Lottery, Cashback, Points, Coupon).
          3. Key steps to participate.
          4. Expiry date.
          5. Estimated value in CNY.
          
          Respond ONLY in JSON format following this schema:
          {
            "bank": "string",
            "title": "string",
            "category": "Lottery | Cashback | Points | Coupon",
            "steps": ["step 1", "step 2"],
            "expiryDate": "YYYY-MM-DD",
            "estimatedValue": number
          }`
        }
      ]
    },
    config: {
      responseMimeType: "application/json"
    }
  });

  return JSON.parse(response.text);
};

export const fetchLatestBankOffers = async () => {
  const currentDate = new Date().toLocaleDateString('zh-CN');
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `当前日期是 ${currentDate}。请联网搜索目前中国各大主流银行（工行、建行、招行、农行、中行、交行、平安、兴业等）正在进行的、真实有效的“薅羊毛”活动。
    重点关注：手机银行App签到抽奖、微信立减金领取、数字人民币红包、消费达标返现等。
    请列出至少6个最新活动，确保日期覆盖当前月份。`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            bank: { type: Type.STRING },
            title: { type: Type.STRING },
            category: { type: Type.STRING },
            steps: { type: Type.ARRAY, items: { type: Type.STRING } },
            expiryDate: { type: Type.STRING },
            estimatedValue: { type: Type.NUMBER }
          },
          required: ["bank", "title", "category", "steps", "expiryDate", "estimatedValue"]
        }
      }
    }
  });

  return JSON.parse(response.text);
};

export const getSmartOptimizationStrategy = async (userCards: string[], activeOffers: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Based on the user's cards: [${userCards.join(', ')}] and the following active bank promotions: ${activeOffers},
    provide a priority list of which activities to do first to maximize returns with minimum effort. 
    Focus on "薅羊毛" (high reward/effort ratio). Keep the tone encouraging and professional in Chinese.`
  });

  return response.text;
};
