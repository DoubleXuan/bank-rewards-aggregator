
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

// Helper to check available models when things fail
const getAvailableModels = async () => {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
    const data = await response.json();
    return data.models ? data.models.map((m: any) => m.name.replace('models/', '')).join(', ') : 'No models found';
  } catch (e) {
    return 'Could not fetch model list';
  }
};

export const analyzePromotionScreenshot = async (base64Image: string) => {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      responseMimeType: "application/json"
    }
  });

  const prompt = `You are an expert in Chinese bank loyalty programs. Analyze this screenshot of a bank promotion.
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
          }`;

  const imagePart = {
    inlineData: {
      data: base64Image,
      mimeType: "image/jpeg",
    },
  };

  try {
    const result = await model.generateContent([prompt, imagePart]);
    return JSON.parse(result.response.text());
  } catch (error) {
    console.error("Gemini Error:", error);
    const models = await getAvailableModels();
    throw new Error(`Analyze failed. Available models: ${models}. Original error: ${error instanceof Error ? error.message : JSON.stringify(error)}`);
  }
};

export const fetchLatestBankOffers = async () => {
  const currentDate = new Date().toLocaleDateString('zh-CN');

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            bank: { type: SchemaType.STRING },
            title: { type: SchemaType.STRING },
            category: { type: SchemaType.STRING },
            steps: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
            expiryDate: { type: SchemaType.STRING },
            estimatedValue: { type: SchemaType.NUMBER }
          },
          required: ["bank", "title", "category", "steps", "expiryDate", "estimatedValue"]
        }
      }
    }
  });

  const prompt = `当前日期是 ${currentDate}。请列出目前中国各大主流银行（工行、建行、招行、农行、中行、交行、平安、兴业等）正在进行的、真实有效的“薅羊毛”活动。
    重点关注：手机银行App签到抽奖、微信立减金领取、数字人民币红包、消费达标返现等。
    请列出至少6个最新活动，确保日期覆盖当前月份。不要杜撰，尽量准确。`;

  try {
    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  } catch (error) {
    console.error("Gemini Error:", error);
    const models = await getAvailableModels();
    throw new Error(`Sync failed. Available models for your key: [${models}]. Original error: ${error instanceof Error ? error.message : JSON.stringify(error)}`);
  }
};

export const getSmartOptimizationStrategy = async (userCards: string[], activeOffers: string) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `Based on the user's cards: [${userCards.join(', ')}] and the following active bank promotions: ${activeOffers},
    provide a priority list of which activities to do first to maximize returns with minimum effort. 
    Focus on "薅羊毛" (high reward/effort ratio). Keep the tone encouraging and professional in Chinese.`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};
