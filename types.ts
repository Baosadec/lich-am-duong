export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export interface LunarDetails {
  lunarDate: string; // e.g., "15/01"
  lunarYear: string; // e.g., "Giáp Thìn"
  element: string; // e.g., "Hỏa - Phú Đăng Hỏa"
  luckyHours: string[];
  badHours: string[];
  advice: string; // Daily advice
  auspicious: string[]; // Việc nên làm
  inauspicious: string[]; // Việc kỵ
}

export interface CompatibilityResult {
  score: number;
  summary: string;
  details: string;
  elementAnalysis: string;
}

export enum Tab {
  CALENDAR = 'CALENDAR',
  COMPATIBILITY = 'COMPATIBILITY',
  ASSISTANT = 'ASSISTANT'
}