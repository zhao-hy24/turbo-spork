
import React from 'react';
import { AppView } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const data = [
  { name: 'Mon', fluency: 40, vocab: 24, consistency: 10 },
  { name: 'Tue', fluency: 45, vocab: 28, consistency: 20 },
  { name: 'Wed', fluency: 42, vocab: 32, consistency: 40 },
  { name: 'Thu', fluency: 55, vocab: 40, consistency: 60 },
  { name: 'Fri', fluency: 60, vocab: 45, consistency: 80 },
  { name: 'Sat', fluency: 75, vocab: 52, consistency: 90 },
  { name: 'Sun', fluency: 80, vocab: 60, consistency: 100 },
];

interface DashboardProps {
  onViewChange: (view: AppView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onViewChange }) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Welcome back, Scholar! 👋</h1>
          <p className="text-slate-500 mt-1">You've mastered 12 new words this week. Keep it up!</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
            Last 7 Days <i className="fas fa-chevron-down ml-2 text-xs"></i>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 text-sm font-medium uppercase tracking-wider">Fluency Score</span>
            <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <i className="fas fa-bolt text-sm"></i>
            </div>
          </div>
          <p className="text-4xl font-bold text-slate-800">82%</p>
          <div className="mt-2 text-sm text-green-500 flex items-center">
            <i className="fas fa-arrow-up mr-1"></i> 5.2% from last week
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 text-sm font-medium uppercase tracking-wider">Vocab Retained</span>
            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
              <i className="fas fa-book text-sm"></i>
            </div>
          </div>
          <p className="text-4xl font-bold text-slate-800">428</p>
          <div className="mt-2 text-sm text-slate-500">Words in long-term memory</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 text-sm font-medium uppercase tracking-wider">Day Streak</span>
            <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
              <i className="fas fa-fire text-sm"></i>
            </div>
          </div>
          <p className="text-4xl font-bold text-slate-800">14</p>
          <div className="mt-2 text-sm text-orange-500">Don't break the streak!</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Learning Activity</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorFluency" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}
                />
                <Area type="monotone" dataKey="fluency" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorFluency)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button 
            onClick={() => onViewChange(AppView.SCENARIOS)}
            className="group relative bg-blue-600 p-8 rounded-3xl text-left overflow-hidden transition-transform active:scale-95"
          >
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 text-white text-xl">
                <i className="fas fa-comments"></i>
              </div>
              <h3 className="text-white text-xl font-bold mb-2">Practice Scenarios</h3>
              <p className="text-blue-100 text-sm leading-relaxed">Start role-playing real life conversations.</p>
            </div>
            <i className="fas fa-chevron-right absolute bottom-8 right-8 text-blue-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all"></i>
          </button>

          <button 
            onClick={() => onViewChange(AppView.TUTOR)}
            className="group relative bg-slate-900 p-8 rounded-3xl text-left overflow-hidden transition-transform active:scale-95"
          >
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 text-white text-xl">
                <i className="fas fa-microphone-lines"></i>
              </div>
              <h3 className="text-white text-xl font-bold mb-2">Voice Tutor</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Talk to our AI native coach in real-time.</p>
            </div>
            <i className="fas fa-chevron-right absolute bottom-8 right-8 text-slate-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
