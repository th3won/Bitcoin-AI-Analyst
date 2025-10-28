
import React, { useState, useCallback } from 'react';
import { AnalysisType, InputData } from './types';
import { ANALYSIS_OPTIONS } from './constants';
import { generateBitcoinReport } from './services/geminiService';
import LoadingSpinner from './components/LoadingSpinner';
import { PriceIcon, NewsIcon, ExpertIcon, SocialIcon, MacroIcon, PredictionIcon } from './components/icons';

const App: React.FC = () => {
  const [analysisType, setAnalysisType] = useState<AnalysisType>(AnalysisType.COMPREHENSIVE);
  const [inputData, setInputData] = useState<InputData>({
    price: '현재 비트코인 가격은 1억 144만원, 24시간 변동률은 +2.5%입니다.',
    news: '주요 이슈: 미국 ETF 승인 기대감 고조, Mt. Gox 배상 물량 출회 연기.',
    expert: '전문가 전망: 단기적 5% 내외 등락 예상, 기관 투자자 수요 확대 긍정적.',
    social: '시장 심리: 공포탐욕지수 72 (탐욕), 트위터 언급량 15% 증가, 긍정 감성 우세.',
    macro: '거시 지표: 미국 기준금리 동결 가능성, Halving 주기 도래 임박.',
    prediction: 'AI 예측: 2025년 말까지 2억 원 도달 가능 시나리오 제시됨.',
  });
  const [report, setReport] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInputData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateReport = useCallback(async () => {
    setIsLoading(true);
    setError('');
    setReport('');
    const result = await generateBitcoinReport(inputData, analysisType);
    if (result.startsWith('오류가 발생했습니다:')) {
      setError(result);
    } else {
      setReport(result);
    }
    setIsLoading(false);
  }, [inputData, analysisType]);

  const renderInputCard = (id: keyof InputData, title: string, icon: React.ReactNode) => (
    <div className="bg-dark-card border border-dark-border rounded-lg p-4 flex flex-col">
      <div className="flex items-center mb-3">
        {icon}
        <h3 className="text-lg font-semibold text-light-text ml-2">{title}</h3>
      </div>
      <textarea
        id={id}
        name={id}
        value={inputData[id]}
        onChange={handleInputChange}
        className="flex-grow bg-gray-800 text-medium-text border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-brand-primary focus:outline-none resize-none"
        rows={4}
      />
    </div>
  );

  return (
    <div className="min-h-screen text-light-text font-sans antialiased p-4 sm:p-6 lg:p-8">
      <main className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-yellow-300">
            Bitcoin AI Analyst
          </h1>
          <p className="mt-2 text-lg text-medium-text">
            AI 기반 비트코인 시장 분석 리포트 생성기
          </p>
        </header>
        
        <div className="space-y-8">
          {/* Inputs Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderInputCard('price', '실시간 시세', <PriceIcon />)}
            {renderInputCard('news', '최신 뉴스', <NewsIcon />)}
            {renderInputCard('expert', '전문가 분석', <ExpertIcon />)}
            {renderInputCard('social', '소셜 시그널', <SocialIcon />)}
            {renderInputCard('macro', '거시경제 변수', <MacroIcon />)}
            {renderInputCard('prediction', 'AI 예측', <PredictionIcon />)}
          </div>
          
          {/* Controls Section */}
          <div className="bg-dark-card border border-dark-border rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4">
             <div className="w-full md:w-auto">
                <label htmlFor="analysisType" className="block text-sm font-medium text-medium-text mb-2">분석 유형 선택</label>
                <select
                  id="analysisType"
                  value={analysisType}
                  onChange={(e) => setAnalysisType(e.target.value as AnalysisType)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-light-text focus:ring-2 focus:ring-brand-primary focus:outline-none"
                >
                  {ANALYSIS_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
             </div>
             <button
                onClick={handleGenerateReport}
                disabled={isLoading}
                className="w-full md:w-auto mt-4 md:mt-0 bg-brand-primary hover:bg-yellow-600 text-black font-bold py-3 px-8 rounded-lg transition-all duration-300 disabled:bg-brand-secondary disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? '분석 중...' : '분석 리포트 생성'}
              </button>
          </div>

          {/* Output Section */}
          <div className="bg-dark-card border border-dark-border rounded-lg p-6 min-h-[200px]">
            <h2 className="text-2xl font-bold text-brand-primary mb-4">AI 분석 리포트</h2>
            {isLoading && <LoadingSpinner />}
            {error && <div className="text-red-400 bg-red-900/50 p-4 rounded-md">{error}</div>}
            {report && (
              <div className="text-light-text whitespace-pre-wrap leading-relaxed text-lg">
                {report}
              </div>
            )}
            {!isLoading && !error && !report && (
              <p className="text-medium-text">리포트를 생성하려면 위 버튼을 클릭하세요.</p>
            )}
          </div>
        </div>

        <footer className="text-center mt-12 text-medium-text text-sm">
          <p>&copy; {new Date().getFullYear()} Bitcoin AI Analyst. Powered by Google Gemini.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
