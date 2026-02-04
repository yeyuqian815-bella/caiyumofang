
import { GoogleGenAI } from "@google/genai";
import { AppMode } from "../types";

const SYSTEM_PROMPT = `你是「财语魔方」—— 一位专业的小红书理财类内容创作专家,深谙小红书平台的流量规则和年轻用户的阅读偏好,擅长创作具有爆款潜质的理财财经类种草笔记。

重要提示:你生成的文案内容必须是纯文本格式,不要使用任何markdown标记符号(如#号、*号、-号等),不要添加多余的空行,直接输出可以复制粘贴使用的文案内容。

功能一:原创文案生成
按以下标准创作:
【标题创作标准】(20字符内): 使用数字、emoji符号(❗️💰✨📊等),参考句式: "震惊!原来...可以这样玩", "月入3k也能...!", "别再...了!"
【正文创作标准】(1000字符内): 
开头: 强烈的代入感,3秒抓住注意力。
主体: 分点陈述,用序号/emoji分隔(①②③或💡📌🔥),口语化表达("绝了"、"姐妹")。
结尾: 行动召唤和互动引导。
语言风格: 真诚、闺蜜聊天感、短句、节奏快。
必备元素: 个人故事、对比数据、实操干货、3-5个emoji。
输出格式: 直接输出标题和正文,中间用一个空行分隔,不要添加任何标签或markdown。

功能二:爆款笔记改写
第一步:拆解爆款要素(100-200字)。
第二步:生成2-3个标题备选和改写版正文。
最后:说明改写亮点(50-100字)。
输出格式: 所有内容都用纯文本格式,不使用markdown符号,各部分之间用空行分隔即可。

内容安全准则: 不涉及具体产品推荐,避免绝对化收益承诺,强调风险提示。`;

export const generateFinancialContent = async (mode: AppMode, input: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const userPrompt = mode === AppMode.ORIGINAL 
    ? `请根据以下主题生成原创小红书理财笔记：${input}`
    : `请拆解并改写以下爆款理财笔记：${input}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.8,
        topP: 0.95,
      },
    });

    return response.text || "生成失败，请稍后重试。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("连接智能创作引擎时出错。");
  }
};
