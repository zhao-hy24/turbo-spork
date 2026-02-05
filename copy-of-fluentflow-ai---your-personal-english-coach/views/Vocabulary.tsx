
import React, { useState } from 'react';
import { generateVocabularyList } from '../services/geminiService';
import { Word } from '../types';

const Vocabulary: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [words, setWords] = useState<Word[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);
    try {
      const list = await generateVocabularyList(topic);
      setWords(list);
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const nextCard = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Smart Vocabulary</h1>
          <p className="text-slate-500">Pick a topic, and AI will generate custom words for your level.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <input 
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Tech Startup, Cooking, Travel"
            className="flex-1 md:w-64 px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button 
            onClick={handleGenerate}
            disabled={isLoading || !topic.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:bg-slate-300"
          >
            {isLoading ? <i className="fas fa-spinner fa-spin"></i> : 'Generate'}
          </button>
        </div>
      </header>

      {words.length > 0 ? (
        <div className="flex flex-col items-center">
          <div className="w-full max-w-lg perspective-1000 h-96 relative cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
            <div className={`relative w-full h-full transition-transform duration-500 preserve-3d shadow-2xl rounded-[2.5rem] overflow-hidden ${isFlipped ? 'rotate-y-180' : ''}`}>
              
              {/* Front Side */}
              <div className="absolute inset-0 backface-hidden bg-white flex flex-col items-center justify-center p-12 border border-slate-200">
                <span className="text-sm font-bold text-blue-500 mb-2 uppercase tracking-widest">Front</span>
                <h2 className="text-5xl font-black text-slate-800 mb-4">{words[currentIndex].term}</h2>
                <p className="text-xl text-slate-400 font-medium italic">{words[currentIndex].phonetic}</p>
                <div className="mt-auto text-slate-300 text-xs">Tap to flip</div>
              </div>

              {/* Back Side */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 bg-blue-600 text-white flex flex-col p-10 border border-blue-500">
                <span className="text-xs font-bold opacity-60 mb-4 uppercase tracking-widest">Definition & Example</span>
                <p className="text-xl font-bold leading-relaxed mb-8">{words[currentIndex].definition}</p>
                <div className="bg-white/10 p-6 rounded-2xl border border-white/20">
                   <p className="text-sm font-bold text-white/60 mb-2">Example Sentence</p>
                   <p className="text-lg italic leading-relaxed">"{words[currentIndex].example}"</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex items-center gap-8">
            <button 
              onClick={(e) => { e.stopPropagation(); prevCard(); }}
              disabled={currentIndex === 0}
              className="w-14 h-14 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-800 hover:border-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <div className="text-slate-400 font-bold">
              {currentIndex + 1} <span className="mx-2 opacity-30">/</span> {words.length}
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); nextCard(); }}
              disabled={currentIndex === words.length - 1}
              className="w-14 h-14 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-800 hover:border-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-20 text-center space-y-4">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300 text-4xl">
            <i className="fas fa-layer-group"></i>
          </div>
          <h3 className="text-xl font-bold text-slate-700">No deck generated yet</h3>
          <p className="text-slate-400 max-w-xs mx-auto">Input a topic above and the AI will create a personalized vocabulary deck for you.</p>
        </div>
      )}
    </div>
  );
};

export default Vocabulary;
