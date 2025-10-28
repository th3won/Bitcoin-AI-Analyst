
import { GoogleGenAI } from "@google/genai";
import { InputData, AnalysisType } from '../types';
import { BASE_PROMPT } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

function formatDataForPrompt(data: InputData): string {
  return `
[제공 데이터]
- 실시간 시세: ${data.price || '데이터 없음'}
- 최신 주요 뉴스 요약: ${data.news || '데이터 없음'}
- 업계 전문가 분석 요약: ${data.expert || '데이터 없음'}
- 소셜 네트워크 시그널: ${data.social || '데이터 없음'}
- 주요 거시경제 변수: ${data.macro || '데이터 없음'}
- 다른 AI 예측: ${data.prediction || '데이터 없음'}
`;
}

export const generateBitcoinReport = async (
  data: InputData,
  analysisType: AnalysisType
): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    
    const fullPrompt = `
${BASE_PROMPT}

**요청된 분석 유형:** ${analysisType}

${formatDataForPrompt(data)}
`;

    const response = await ai.models.generateContent({
      model: model,
      contents: fullPrompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Gemini API call failed:", error);
    if (error instanceof Error) {
        return `오류가 발생했습니다: ${error.message}. API 키 또는 요청을 확인해주세요.`;
    }
    return "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
};
