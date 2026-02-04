
import React, { useState, useCallback } from 'react';
import { AppMode } from './types';
import { generateFinancialContent } from './services/geminiService';
import { Button } from './components/Button';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.ORIGINAL);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) {
      setError('请输入主题关键词或爆款笔记内容。');
      return;
    }

    setIsLoading(true);
    setError(null);
    setCopySuccess(false);

    try {
      const result = await generateFinancialContent(mode, input);
      setOutput(result);
    } catch (err: any) {
      setError(err.message || '生成过程中出现未知错误。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = useCallback(() => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  }, [output]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 md:p-8">
      {/* Header */}
      <header className="w-full max-w-4xl flex flex-col items-center mb-8">
        <div className="xiaohongshu-gradient p-3 rounded-2xl mb-4 shadow-lg shadow-pink-200">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">财语魔方</h1>
        <p className="text-gray-500 text-center max-w-md">
          专业的小红书理财内容专家，为你量身打造吸睛爆款笔记
        </p>
      </header>

      <main className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
            <button
              onClick={() => { setMode(AppMode.ORIGINAL); setInput(''); setOutput(''); }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                mode === AppMode.ORIGINAL ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              原创文案生成
            </button>
            <button
              onClick={() => { setMode(AppMode.REWRITE); setInput(''); setOutput(''); }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                mode === AppMode.REWRITE ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              爆款笔记改写
            </button>
          </div>

          <div className="flex-1 flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-2">
              {mode === AppMode.ORIGINAL ? '文案主题/关键词' : '原始爆款文案'}
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === AppMode.ORIGINAL 
                ? '例如：大学生如何从0攒到1万、月薪3k理财攻略、宝妈兼职收益...' 
                : '将想要改写的爆款文案粘贴在这里...'}
              className="flex-1 min-h-[300px] w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none outline-none transition-all text-gray-800"
            />
            
            {error && <p className="mt-2 text-sm text-red-500 font-medium">⚠️ {error}</p>}

            <Button
              onClick={handleGenerate}
              loading={isLoading}
              className="mt-6 xiaohongshu-gradient text-white w-full shadow-lg shadow-pink-100"
            >
              立即生成爆款文案
            </Button>
          </div>
        </div>

        {/* Output Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col min-h-[500px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              <span className="w-2 h-6 xiaohongshu-gradient rounded-full mr-3"></span>
              创作结果
            </h2>
            {output && (
              <button
                onClick={handleCopy}
                className="text-sm font-medium text-pink-600 hover:text-pink-700 flex items-center"
              >
                {copySuccess ? (
                  <span className="flex items-center text-green-600">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    已复制
                  </span>
                ) : (
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    复制全文
                  </span>
                )}
              </button>
            )}
          </div>

          <div className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl p-4 overflow-y-auto relative">
            {isLoading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin"></div>
                <p className="text-gray-500 text-sm animate-pulse">正在为您构思爆款文案...</p>
              </div>
            ) : output ? (
              <pre className="whitespace-pre-wrap text-gray-800 text-sm leading-relaxed font-sans">
                {output}
              </pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <p>文案生成后将在这里显示</p>
                <p className="text-xs mt-1 italic">纯文本格式，一键复制即用</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="mt-12 text-gray-400 text-xs text-center space-y-2">
        <p>© 2026 财语魔方 - 让理财文案更有魔力</p>
        <p>本工具由高级人工智能驱动，建议发布前进行二次人工审核。切记：投资有风险，理财需谨慎。</p>
      </footer>
    </div>
  );
};

export default App;
