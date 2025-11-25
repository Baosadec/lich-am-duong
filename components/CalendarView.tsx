import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Sparkles, Calendar as CalendarIcon, Clock, Bell, BellOff, MapPin } from 'lucide-react';
import { CalendarDay, LunarDetails } from '../types';
import { getLunarDetails } from '../services/geminiService';

const DAYS_OF_WEEK = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

export const CalendarView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [lunarInfo, setLunarInfo] = useState<LunarDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [notificationGranted, setNotificationGranted] = useState(false);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "granted") {
      setNotificationGranted(true);
    }
  }, []);

  const requestNotification = async () => {
    if (!("Notification" in window)) {
      alert("Trình duyệt của bạn không hỗ trợ thông báo.");
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      setNotificationGranted(true);
      new Notification("Lịch Vạn Niên AI", {
        body: "Đã bật thông báo! Bạn sẽ nhận được lời khuyên phong thủy mỗi ngày.",
        icon: '/favicon.ico'
      });
    }
  };

  const getDaysInMonth = (date: Date): CalendarDay[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days: CalendarDay[] = [];
    
    // Previous month padding
    const startingDayOfWeek = firstDay.getDay();
    for (let i = 0; i < startingDayOfWeek; i++) {
      const d = new Date(year, month, -startingDayOfWeek + i + 1);
      days.push({ date: d, isCurrentMonth: false, isToday: false });
    }

    // Current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const d = new Date(year, month, i);
      const today = new Date();
      const isToday = d.getDate() === today.getDate() && 
                      d.getMonth() === today.getMonth() && 
                      d.getFullYear() === today.getFullYear();
      days.push({ date: d, isCurrentMonth: true, isToday });
    }

    // Next month padding to fill grid (6 rows * 7 cols = 42)
    const remainingSlots = 42 - days.length;
    for (let i = 1; i <= remainingSlots; i++) {
      const d = new Date(year, month + 1, i);
      days.push({ date: d, isCurrentMonth: false, isToday: false });
    }

    return days;
  };

  const days = getDaysInMonth(currentDate);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = async (date: Date) => {
    setSelectedDate(date);
    setLoading(true);
    setLunarInfo(null);
    try {
      const info = await getLunarDetails(date);
      setLunarInfo(info);

      // Trigger notification if it's today and permission granted
      const today = new Date();
      const isToday = date.getDate() === today.getDate() && 
                      date.getMonth() === today.getMonth() && 
                      date.getFullYear() === today.getFullYear();
                      
      if (notificationGranted && isToday) {
         new Notification(`Hôm nay ${info.lunarDate} Âm lịch`, {
             body: `Lời khuyên: ${info.advice}`,
             icon: '/favicon.ico'
         });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedDate(null);
    setLunarInfo(null);
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
        <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition">
          <ChevronLeft className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        </button>
        <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            Tháng {currentDate.getMonth() + 1}, {currentDate.getFullYear()}
            </h2>
            <button 
                onClick={requestNotification}
                className={`mt-2 text-xs flex items-center gap-1.5 px-3 py-1 rounded-full transition-all duration-300 ${
                    notificationGranted 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400 hover:bg-indigo-50 hover:text-indigo-600'
                }`}
            >
                {notificationGranted ? (
                    <><Bell className="w-3 h-3 fill-current" /> Đã bật thông báo</>
                ) : (
                    <><BellOff className="w-3 h-3" /> Bật thông báo ngày</>
                )}
            </button>
        </div>
        <button onClick={handleNextMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition">
          <ChevronRight className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {DAYS_OF_WEEK.map(day => (
          <div key={day} className="text-center text-xs font-bold uppercase tracking-wider text-slate-400 py-2">
            {day}
          </div>
        ))}
        {days.map((day, idx) => (
          <button
            key={idx}
            onClick={() => handleDateClick(day.date)}
            className={`
              h-12 sm:h-14 rounded-xl flex flex-col items-center justify-center transition-all duration-200 relative
              ${!day.isCurrentMonth ? 'text-slate-300 dark:text-slate-700' : 'text-slate-700 dark:text-slate-200 hover:bg-white hover:shadow-md dark:hover:bg-slate-700'}
              ${day.isToday ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 !text-white shadow-lg shadow-indigo-200 dark:shadow-none' : ''}
              ${selectedDate && day.date.getTime() === selectedDate.getTime() ? 'ring-2 ring-indigo-400 ring-offset-2 dark:ring-offset-slate-900' : ''}
            `}
          >
            <span className={`text-base ${day.isToday ? 'font-bold' : 'font-medium'}`}>{day.date.getDate()}</span>
            {/* Dot indicator for today or notification */}
            {day.isToday && (
              <span className="absolute bottom-1.5 w-1 h-1 bg-white rounded-full opacity-80"></span>
            )}
          </button>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedDate && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div 
            className="bg-white dark:bg-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl animate-slide-up relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
            <button 
              onClick={closeModal} 
              className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-700 rounded-full hover:rotate-90 transition duration-300 text-slate-500 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6 mt-2">
              <h3 className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-1">Dương Lịch</h3>
              <p className="text-3xl font-bold text-slate-800 dark:text-white">
                {selectedDate.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
              <p className="text-sm text-slate-500 font-medium">{selectedDate.getFullYear()}</p>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-slate-500 text-sm animate-pulse font-medium">Đang luận giải thiên cơ...</p>
              </div>
            ) : lunarInfo ? (
              <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
                {/* Lunar Highlight */}
                <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-slate-700 dark:to-slate-800 rounded-2xl p-5 border border-indigo-100 dark:border-slate-600 flex items-center justify-between shadow-sm">
                  <div>
                    <p className="text-xs text-indigo-500 dark:text-indigo-400 font-bold uppercase tracking-wide mb-1">Âm Lịch</p>
                    <p className="text-3xl font-bold text-indigo-900 dark:text-white">{lunarInfo.lunarDate}</p>
                  </div>
                  <div className="text-right">
                     <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{lunarInfo.lunarYear}</p>
                     <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{lunarInfo.element}</p>
                     </div>
                  </div>
                </div>

                {/* Advice */}
                <div>
                   <h4 className="flex items-center text-sm font-bold text-slate-800 dark:text-slate-200 mb-3">
                     <Sparkles className="w-4 h-4 mr-2 text-yellow-500 fill-yellow-500" /> Lời khuyên hôm nay
                   </h4>
                   <p className="text-sm text-slate-700 dark:text-slate-300 italic bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-xl border-l-4 border-yellow-400 leading-relaxed shadow-sm">
                     "{lunarInfo.advice}"
                   </p>
                </div>

                {/* Good/Bad Hours */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-50 dark:bg-green-900/10 p-3 rounded-xl border border-green-100 dark:border-green-900/30">
                    <h4 className="flex items-center text-xs font-bold text-green-700 dark:text-green-400 mb-2 uppercase">
                      <Clock className="w-3 h-3 mr-1" /> Hoàng Đạo
                    </h4>
                    <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5 font-medium">
                      {lunarInfo.luckyHours.slice(0, 3).map((h, i) => <li key={i}>• {h}</li>)}
                    </ul>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/10 p-3 rounded-xl border border-red-100 dark:border-red-900/30">
                    <h4 className="flex items-center text-xs font-bold text-red-600 dark:text-red-400 mb-2 uppercase">
                      <Clock className="w-3 h-3 mr-1" /> Hắc Đạo
                    </h4>
                    <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5 font-medium">
                      {lunarInfo.badHours.slice(0, 3).map((h, i) => <li key={i}>• {h}</li>)}
                    </ul>
                  </div>
                </div>

                {/* Do's and Don'ts */}
                <div className="space-y-3">
                    <div className="flex items-start gap-3">
                        <div className="mt-1 w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 text-xs font-bold">✓</div>
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Việc nên làm</span>
                            <div className="flex flex-wrap gap-2">
                                {lunarInfo.auspicious.map((item, idx) => (
                                    <span key={idx} className="px-2.5 py-1 bg-white dark:bg-slate-700 border border-slate-100 dark:border-slate-600 text-xs rounded-md font-medium text-slate-600 dark:text-slate-300">{item}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="mt-1 w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 text-xs font-bold">✕</div>
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Việc nên tránh</span>
                            <div className="flex flex-wrap gap-2">
                                {lunarInfo.inauspicious.map((item, idx) => (
                                    <span key={idx} className="px-2.5 py-1 bg-white dark:bg-slate-700 border border-slate-100 dark:border-slate-600 text-xs rounded-md font-medium text-slate-600 dark:text-slate-300">{item}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

              </div>
            ) : (
                <div className="text-center text-red-500 py-4 text-sm">Không thể tải dữ liệu. Vui lòng thử lại.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};