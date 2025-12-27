
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

  const prompt = `当前日期是 ${currentDate}。作为一位资深的“中国信用卡羊毛党”，请利用您的联网搜索能力，深度挖掘各大银行真实的、最新的优惠活动。
    
    【核心搜索任务】
    请针对中国主流银行（工行、建行、招行、中行、农行、邮储等），搜索包含以下**高价值关键词**的活动：
    - **工行**: "i豆", "爱购消费季", "爱购星期五", "任务中心", "立减金"
    - **建行**: "惠省钱", "建行生活", "开宝箱", "造福季", "数字人民币"
    - **招行**: "M+会员", "9分兑", "饭票", "影票", "周三五折"
    - **中行**: "福仔云游记", "月月领", "BOBO鱼"
    - **通用**: "快捷支付立减", "微信立减金", "首绑礼"

    【社媒情报源】
    请参考小红书、什么值得买、微博等平台上的热门攻略，优先提取用户讨论度高的活动。
    
    【筛选标准】
    - 必须真实有效，**绝对不要过期活动** (截止日期需晚于 ${currentDate})。
    - 确保包含具体的参与路径（如“搜索xxx”）。
    - 优先按照上面的“核心关键词”进行匹配，如果没有则搜索其他高价值活动。
    
    请列出至少 8 个精选活动，覆盖不同银行，格式严格遵守 JSON Schema。`;

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

  const prompt = `Based on the user's followed banks: [${userCards.join(', ')}] and the following active bank promotions: ${activeOffers},
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
