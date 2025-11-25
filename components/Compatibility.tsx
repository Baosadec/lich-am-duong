import React, { useState } from 'react';
import { Heart, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { checkCompatibility } from '../services/geminiService';
import { CompatibilityResult } from '../types';

export const Compatibility: React.FC = () => {
  const [date1, setDate1] = useState('');
  const [date2, setDate2] = useState('');
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!date1 || !date2) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await checkCompatibility(date1, date2);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Bói Duyên Phận</h2>
        <p className="text-slate-500 text-sm">Nhập ngày sinh để xem mức độ hòa hợp về mệnh, thiên can và địa chi.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Người thứ nhất</label>
          <input 
            type="date" 
            value={date1}
            onChange={(e) => setDate1(e.target.value)}
            className="w-full p-4 bg-slate-50 dark:bg-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition"
          />
        </div>

        <div className="flex justify-center -my-2 relative z-10">
          <div className="bg-indigo-100 dark:bg-slate-600 p-2 rounded-full">
             <Heart className="w-5 h-5 text-indigo-500 fill-indigo-500 animate-pulse" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Người thứ hai</label>
          <input 
            type="date" 
            value={date2}
            onChange={(e) => setDate2(e.target.value)}
            className="w-full p-4 bg-slate-50 dark:bg-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition"
          />
        </div>

        <button 
          onClick={handleCheck}
          disabled={!date1 || !date2 || loading}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          {loading ? 'Đang Luận Giải...' : 'Xem Kết Quả'}
        </button>
      </div>

      {result && (
        <div className="mt-8 animate-fade-in space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-lg border border-indigo-50 dark:border-slate-700 relative overflow-hidden">
             {/* Score Circle */}
             <div className="flex justify-center mb-6">
                <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100 dark:text-slate-700" />
                        <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={377} strokeDashoffset={377 - (377 * result.score) / 100} className={`text-indigo-500 transition-all duration-1000 ease-out`} />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-slate-800 dark:text-white">{result.score}%</span>
                        <span className="text-xs text-slate-500 font-medium">Hòa hợp</span>
                    </div>
                </div>
             </div>

             <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{result.summary}</h3>
             </div>

             <div className="space-y-4">
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl">
                    <h4 className="font-bold text-indigo-700 dark:text-indigo-300 text-sm mb-2">Chi tiết ngũ hành</h4>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{result.elementAnalysis}</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
                    <h4 className="font-bold text-slate-700 dark:text-slate-300 text-sm mb-2">Luận giải chi tiết</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed text-justify">{result.details}</p>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};