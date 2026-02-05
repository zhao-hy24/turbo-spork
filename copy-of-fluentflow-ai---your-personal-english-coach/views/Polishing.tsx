
import React, { useState } from 'react';
import { polishExpression } from '../services/geminiService';

const Polishing: React.FC = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{original: string, refined: string, explanation: string} | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePolish = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    try {
      const data = await polishExpression(input);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      <header className="text-center">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Expression Refiner</h1>
        <p className="text-slate-500">Transform your raw English sentences into natural, native-sounding expressions.</p>
      </header>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">Enter your draft:</label>
        <textarea 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g., I want to eat lunch because I am very hunger."
          rows={4}
          className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all resize-none"
        ></textarea>
        <div className="mt-4 flex justify-end">
          <button 
            onClick={handlePolish}
            disabled={isLoading || !input.trim()}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all disabled:bg-slate-300 shadow-lg shadow-blue-200"
          >
            {isLoading ? <><i className="fas fa-wand-magic-sparkles animate-pulse mr-2"></i> Refining...</> : 'Polish It'}
          </button>
        </div>
      </div>

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slideIn">
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-400 uppercase mb-4">Original</h4>
            <p className="text-slate-600 italic">"{result.original}"</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
            <h4 className="text-xs font-bold text-blue-400 uppercase mb-4">Refined</h4>
            <p className="text-blue-800 font-semibold text-lg leading-relaxed">"{result.refined}"</p>
          </div>
          <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-400 uppercase mb-4">Why the change?</h4>
            <p className="text-slate-700 leading-relaxed">{result.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Polishing;
