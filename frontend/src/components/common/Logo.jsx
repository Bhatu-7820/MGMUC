import React from 'react';
import { GraduationCap, ShieldCheck, Award } from 'lucide-react';

export const Logo = ({ size = 'medium', showText = true }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-10 h-10',
    large: 'w-14 h-14',
  };

  return (
    <div className="flex items-center gap-3 select-none cursor-pointer">
      {/* Official MGM University Academic Crest Vector Shield */}
      <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#1e3a8a] via-[#2563eb] to-[#0284c7] p-0.5 shadow-md border border-amber-400/40 hover:scale-105 transition-transform duration-300 ${sizeClasses[size] || sizeClasses.medium}`}>
        <div className="relative w-full h-full rounded-[14px] bg-[#0f172a] flex items-center justify-center overflow-hidden p-1.5">
          <svg viewBox="0 0 100 100" className="w-full h-full text-amber-400 drop-shadow-md" fill="currentColor">
            {/* Outer Circular Shield Ring */}
            <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="5 2" />
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
            
            {/* Academic Graduation Cap */}
            <polygon points="50,18 82,34 50,50 18,34" fill="url(#mgmGoldGradient)" />
            <polygon points="50,50 74,38 74,58 50,70 26,58 26,38" fill="url(#mgmGoldGradient)" opacity="0.85" />
            
            {/* Open Book Pages */}
            <path d="M30 65 Q 50 60 70 65 L 70 78 Q 50 72 30 78 Z" fill="none" stroke="currentColor" strokeWidth="2.5" />
            <line x1="50" y1="62" x2="50" y2="76" stroke="currentColor" strokeWidth="2" />
            
            <defs>
              <linearGradient id="mgmGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>
          </svg>

          {/* Verified Check Badge */}
          <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 text-[9px] text-slate-950 font-bold border border-slate-950 shadow-sm">
            ✓
          </span>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold tracking-tight text-[#0f172a] dark:text-white text-base font-heading leading-none">
              MGM<span className="text-amber-500">U</span>
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 text-[10px] font-bold text-[#2563eb] dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              <ShieldCheck className="w-3 h-3 text-[#2563eb]" />
              IICT AI
            </span>
          </div>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 font-sans mt-0.5 truncate">
            Institute of Info & Comm Tech
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
