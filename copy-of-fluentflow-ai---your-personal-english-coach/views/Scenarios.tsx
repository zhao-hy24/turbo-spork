
import React, { useState, useMemo } from 'react';
import { Scenario, Message, ScenarioCategory } from '../types';
import { GoogleGenAI } from '@google/genai';

const SCENARIOS: Scenario[] = [
  // Daily Life
  { id: '1', title: 'Coffee Shop', description: 'Order your morning coffee and manage a payment issue.', difficulty: 'Beginner', category: 'Daily', icon: 'fa-mug-hot' },
  { id: '7', title: 'Grocery Shopping', description: 'Find specific items and ask about discounts at the supermarket.', difficulty: 'Beginner', category: 'Daily', icon: 'fa-shopping-basket' },
  { id: '8', title: 'Renting an Apartment', description: 'Talk to a landlord about room facilities and lease terms.', difficulty: 'Intermediate', category: 'Daily', icon: 'fa-house-user' },
  
  // Work & Career
  { id: '2', title: 'Job Interview', description: 'Present your background and answer tricky questions.', difficulty: 'Advanced', category: 'Work', icon: 'fa-briefcase' },
  { id: '6', title: 'Business Pitch', description: 'Present a new project idea to demanding stakeholders.', difficulty: 'Advanced', category: 'Work', icon: 'fa-lightbulb' },
  { id: '9', title: 'Team Meeting', description: 'Discuss project progress and handle disagreements with colleagues.', difficulty: 'Intermediate', category: 'Work', icon: 'fa-users-rectangle' },
  
  // Travel & Tourism
  { id: '3', title: 'Booking a Hotel', description: 'Handle room requirements and price negotiations.', difficulty: 'Intermediate', category: 'Travel', icon: 'fa-hotel' },
  { id: '5', title: 'Airport Check-in', description: 'Manage luggage issues and seat preferences.', difficulty: 'Beginner', category: 'Travel', icon: 'fa-plane-departure' },
  { id: '10', title: 'Asking Directions', description: 'Find your way in a new city and understand complex instructions.', difficulty: 'Beginner', category: 'Travel', icon: 'fa-map-location-dot' },
  
  // Socializing
  { id: '11', title: 'Making Friends', description: 'Break the ice at a social mixer and find common interests.', difficulty: 'Beginner', category: 'Social', icon: 'fa-handshake' },
  { id: '4', title: 'Doctor Visit', description: 'Describe symptoms and understand prescriptions.', difficulty: 'Intermediate', category: 'Social', icon: 'fa-user-nurse' },
  { id: '12', title: 'Dinner Party', description: 'Engage in small talk and polite table conversations.', difficulty: 'Intermediate', category: 'Social', icon: 'fa-utensils' },
];

type DifficultyFilter = 'All' | 'Beginner' | 'Intermediate' | 'Advanced';
type CategoryFilter = 'All' | ScenarioCategory;

const Scenarios: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [diffFilter, setDiffFilter] = useState<DifficultyFilter>('All');
  const [catFilter, setCatFilter] = useState<CategoryFilter>('All');

  const startScenario = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setMessages([
      { 
        role: 'assistant', 
        content: `Hi! Let's start the "${scenario.title}" scenario. I'll play the other person. You can start whenever you're ready!`, 
        timestamp: new Date() 
      }
    ]);
  };

  const handleSend = async () => {
    if (!input.trim() || !selectedScenario) return;

    const userMessage: Message = { role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: `You are a native English speaker in a roleplay. 
          Scenario: ${selectedScenario.title}. 
          Context: ${selectedScenario.description}. 
          Your goal: Keep the conversation natural and authentic. 
          Constraint: If the user's English is unnatural, reply normally but add a small [Tip: Better way to say this...] at the end of your response. 
          Stay in character at all times.`
        }
      });
      
      const response = await chat.sendMessage({ message: input });
      const botMessage: Message = { role: 'assistant', content: response.text || '', timestamp: new Date() };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredScenarios = useMemo(() => {
    return SCENARIOS.filter(s => {
      const matchDiff = diffFilter === 'All' || s.difficulty === diffFilter;
      const matchCat = catFilter === 'All' || s.category === catFilter;
      return matchDiff && matchCat;
    });
  }, [diffFilter, catFilter]);

  const getDifficultyStyles = (diff: string) => {
    switch (diff) {
      case 'Beginner': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Intermediate': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Advanced': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getCategoryColor = (cat: ScenarioCategory) => {
    switch (cat) {
      case 'Daily': return 'text-blue-500 bg-blue-50';
      case 'Work': return 'text-indigo-500 bg-indigo-50';
      case 'Travel': return 'text-orange-500 bg-orange-50';
      case 'Social': return 'text-purple-500 bg-purple-50';
    }
  };

  if (selectedScenario) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
        <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setSelectedScenario(null)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
              <i className="fas fa-arrow-left text-slate-500"></i>
            </button>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{selectedScenario.title}</h2>
              <p className="text-xs text-slate-500">{selectedScenario.category} • {selectedScenario.difficulty}</p>
            </div>
          </div>
          <div className="flex gap-2">
             <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
               <i className="fas fa-info-circle"></i>
             </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-50/50 rounded-3xl border border-slate-200 p-6 space-y-6 shadow-inner scroll-smooth">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
              <div className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                  m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-white'
                }`}>
                  {m.role === 'user' ? 'ME' : 'AI'}
                </div>
                <div className={`px-4 py-3 rounded-2xl shadow-sm relative ${
                  m.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                }`}>
                  <p className="leading-relaxed whitespace-pre-wrap">{m.content}</p>
                  <p className={`text-[9px] mt-1 opacity-40 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start animate-pulse">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-none">
                  <i className="fas fa-ellipsis fa-beat text-slate-300"></i>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 flex gap-3 p-2 bg-white rounded-2xl border border-slate-200 shadow-lg">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your response..."
            className="flex-1 px-4 py-3 focus:outline-none bg-transparent"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-md"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="space-y-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Immersive Scenarios</h1>
          <p className="text-slate-500 mt-1">Master English through real-life simulations categorized by themes.</p>
        </div>
        
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 overflow-x-auto no-scrollbar max-w-full">
            {(['All', 'Daily', 'Work', 'Travel', 'Social'] as CategoryFilter[]).map((c) => (
              <button
                key={c}
                onClick={() => setCatFilter(c)}
                className={`px-5 py-2 text-sm font-bold rounded-xl whitespace-nowrap transition-all ${
                  catFilter === c 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {c === 'All' ? 'All Scenes' : c}
              </button>
            ))}
          </div>

          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            {(['All', 'Beginner', 'Intermediate', 'Advanced'] as DifficultyFilter[]).map((d) => (
              <button
                key={d}
                onClick={() => setDiffFilter(d)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                  diffFilter === d 
                    ? 'bg-slate-800 text-white shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </header>

      {filteredScenarios.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScenarios.map((s) => (
            <div 
              key={s.id} 
              className="bg-white p-6 rounded-[2.5rem] border border-slate-200 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-300 cursor-pointer group flex flex-col relative overflow-hidden"
              onClick={() => startScenario(s)}
            >
              {/* Category Badge on Card */}
              <div className={`absolute top-0 right-0 px-6 py-2 rounded-bl-3xl font-bold text-[10px] uppercase tracking-tighter ${getCategoryColor(s.category)}`}>
                {s.category}
              </div>

              <div className="flex items-start mb-6">
                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-2xl transition-all duration-300 group-hover:scale-110 shadow-sm ${getCategoryColor(s.category)}`}>
                  <i className={`fas ${s.icon}`}></i>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">{s.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-1">{s.description}</p>
              
              <div className="flex items-center justify-between mt-auto">
                <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border shadow-sm ${getDifficultyStyles(s.difficulty)}`}>
                  {s.difficulty}
                </span>
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <i className="fas fa-play text-xs"></i>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] py-32 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
            <i className="fas fa-magnifying-glass text-3xl"></i>
          </div>
          <h3 className="text-xl font-bold text-slate-800">No Match Found</h3>
          <p className="text-slate-400 mt-2">Try clearing filters to see more possibilities.</p>
          <button 
            onClick={() => { setDiffFilter('All'); setCatFilter('All'); }}
            className="mt-6 px-8 py-3 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-900 transition-all"
          >
            Show All Scenarios
          </button>
        </div>
      )}
    </div>
  );
};

export default Scenarios;
