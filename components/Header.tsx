import React from 'react';
import { Mountain } from 'lucide-react';

export const Header: React.FC = () => (
  <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="bg-indigo-600 p-1.5 rounded-lg">
          <Mountain className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-slate-900 tracking-tight">Pinnacle Leadership</span>
      </div>
      <div className="text-sm font-medium text-slate-500 hidden sm:block">
        Charisma & Resilience Assessment
      </div>
    </div>
  </header>
);