
import React, { useState } from 'react';
import { AppView } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './views/Dashboard';
import Scenarios from './views/Scenarios';
import Polishing from './views/Polishing';
import Tutor from './views/Tutor';
import Vocabulary from './views/Vocabulary';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);

  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD: return <Dashboard onViewChange={setCurrentView} />;
      case AppView.SCENARIOS: return <Scenarios />;
      case AppView.POLISHING: return <Polishing />;
      case AppView.TUTOR: return <Tutor />;
      case AppView.VOCABULARY: return <Vocabulary />;
      default: return <Dashboard onViewChange={setCurrentView} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar activeView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderView()}
        </div>
      </main>
      
      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-slate-200 flex justify-around py-3 px-2 z-50">
        <button onClick={() => setCurrentView(AppView.DASHBOARD)} className={`flex flex-col items-center ${currentView === AppView.DASHBOARD ? 'text-blue-600' : 'text-slate-400'}`}>
          <i className="fas fa-home text-xl"></i>
          <span className="text-[10px] mt-1">Home</span>
        </button>
        <button onClick={() => setCurrentView(AppView.SCENARIOS)} className={`flex flex-col items-center ${currentView === AppView.SCENARIOS ? 'text-blue-600' : 'text-slate-400'}`}>
          <i className="fas fa-comments text-xl"></i>
          <span className="text-[10px] mt-1">Scenarios</span>
        </button>
        <button onClick={() => setCurrentView(AppView.TUTOR)} className={`flex flex-col items-center ${currentView === AppView.TUTOR ? 'text-blue-600' : 'text-slate-400'}`}>
          <i className="fas fa-headset text-xl"></i>
          <span className="text-[10px] mt-1">Tutor</span>
        </button>
        <button onClick={() => setCurrentView(AppView.VOCABULARY)} className={`flex flex-col items-center ${currentView === AppView.VOCABULARY ? 'text-blue-600' : 'text-slate-400'}`}>
          <i className="fas fa-book text-xl"></i>
          <span className="text-[10px] mt-1">Words</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
