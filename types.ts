
export enum AnalysisType {
  COMPREHENSIVE = '종합 분석형',
  NEWS = '뉴스 분석형',
  EXPERT = '전문가 전망 합산형',
  SCENARIO = 'AI 시나리오형',
}

export interface InputData {
  price: string;
  news: string;
  expert: string;
  social: string;
  macro: string;
  prediction: string;
}
