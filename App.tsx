import React, { useState } from 'react';
import { Calendar, Heart, MessageCircle } from 'lucide-react';
import { CalendarView } from './components/CalendarView';
import { Compatibility } from './components/Compatibility';
import { Assistant } from './components/Assistant';
import { Tab } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.CALENDAR);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
            <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-200 dark:shadow-none">
                        L
                    </div>
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                        Vạn Niên Số
                    </h1>
                </div>
                {/* Theme toggle could go here */}
            </div>
        </header>

        <main className="container mx-auto pt-4 animate-fade-in">
            {activeTab === Tab.CALENDAR && <CalendarView />}
            {activeTab === Tab.COMPATIBILITY && <Compatibility />}
            {activeTab === Tab.ASSISTANT && <Assistant />}
        </main>

        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 pb-safe">
            <div className="max-w-lg mx-auto flex justify-around items-center h-16">
                <button 
                    onClick={() => setActiveTab(Tab.CALENDAR)}
                    className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${activeTab === Tab.CALENDAR ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <Calendar className={`w-6 h-6 ${activeTab === Tab.CALENDAR ? 'fill-current opacity-20' : ''}`} strokeWidth={activeTab === Tab.CALENDAR ? 2.5 : 2} />
                    <span className="text-[10px] font-medium uppercase tracking-wide">Lịch</span>
                </button>

                <button 
                    onClick={() => setActiveTab(Tab.COMPATIBILITY)}
                    className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${activeTab === Tab.COMPATIBILITY ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <Heart className={`w-6 h-6 ${activeTab === Tab.COMPATIBILITY ? 'fill-current opacity-20' : ''}`} strokeWidth={activeTab === Tab.COMPATIBILITY ? 2.5 : 2} />
                    <span className="text-[10px] font-medium uppercase tracking-wide">Bói Duyên</span>
                </button>

                <button 
                    onClick={() => setActiveTab(Tab.ASSISTANT)}
                    className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${activeTab === Tab.ASSISTANT ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <MessageCircle className={`w-6 h-6 ${activeTab === Tab.ASSISTANT ? 'fill-current opacity-20' : ''}`} strokeWidth={activeTab === Tab.ASSISTANT ? 2.5 : 2} />
                    <span className="text-[10px] font-medium uppercase tracking-wide">Trợ Lý</span>
                </button>
            </div>
        </nav>
    </div>
  );
};

export default App;