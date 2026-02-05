
import React from 'react';
import { AppView } from '../types';

interface SidebarProps {
  activeView: AppView;
  onViewChange: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  const navItems = [
    { id: AppView.DASHBOARD, label: 'Dashboard', icon: 'fa-chart-pie' },
    { id: AppView.SCENARIOS, label: 'Daily Scenarios', icon: 'fa-comments' },
    { id: AppView.POLISHING, label: 'Expression Refiner', icon: 'fa-magic' },
    { id: AppView.TUTOR, label: 'AI Tutor (Voice)', icon: 'fa-microphone-lines' },
    { id: AppView.VOCABULARY, label: 'Vocabulary', icon: 'fa-book-open' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-10">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <i className="fas fa-paper-plane text-white text-lg"></i>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">FluentFlow</span>
        </div>
        
        <nav className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeView === item.id 
                  ? 'bg-blue-50 text-blue-600 font-semibold' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <i className={`fas ${item.icon} w-6`}></i>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
      
      <div className="mt-auto p-6 border-t border-slate-100">
        <div className="bg-slate-900 rounded-2xl p-4 text-white text-sm">
          <p className="font-medium opacity-70 mb-1">Upgrade Pro</p>
          <p className="text-xs opacity-50 mb-3">Unlimited AI Tutor time and advanced scenarios.</p>
          <button className="w-full py-2 bg-blue-500 hover:bg-blue-400 rounded-lg font-bold transition-colors">
            Get Started
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
