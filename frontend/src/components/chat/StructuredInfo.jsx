import React from 'react';
import {
  BookOpen,
  UserCheck,
  Briefcase,
  MapPin,
  CheckCircle2,
  GraduationCap,
} from 'lucide-react';

export const StructuredInfo = ({ category, text = '', sources = [] }) => {
  const lowerText = text.toLowerCase();

  // 1. Course & Fee Breakdown Structured Card
  if (category === 'COURSES' || category === 'FEES' || lowerText.includes('b.tech') || lowerText.includes('mca')) {
    return (
      <div className="mt-4 my-2 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="glass-card rounded-2xl p-4 border border-blue-200 dark:border-blue-500/20 bg-gradient-to-br from-blue-50/80 to-indigo-50/50 dark:from-slate-900/90 dark:to-blue-950/40">
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-500/10 text-blue-800 dark:text-blue-400 text-xs font-bold border border-blue-300 dark:border-blue-500/20">
              <BookOpen className="w-3.5 h-3.5" /> B.Tech CSE & IT
            </span>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 font-heading">₹1,40,000 / Year</span>
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white font-heading mb-1">Computer Science & Info Tech</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">4 Years (8 Semesters) • Intake: 120 (CSE) / 60 (IT)</p>
          <div className="space-y-1 text-[11px] text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
              <span>10+2 PCM minimum 45% (40% Reserved)</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
              <span>Valid MHT-CET / JEE Main Scorecard</span>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-amber-200 dark:border-amber-500/20 bg-gradient-to-br from-amber-50/80 to-orange-50/50 dark:from-slate-900/90 dark:to-amber-950/40">
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 text-xs font-bold border border-amber-300 dark:border-amber-500/20">
              <GraduationCap className="w-3.5 h-3.5" /> MCA & BCA
            </span>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 font-heading">₹95,000 / Year</span>
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white font-heading mb-1">Computer Applications</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">MCA (2 Yrs) / BCA (3 Yrs) • Intake: 60 Seats</p>
          <div className="space-y-1 text-[11px] text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
              <span>Passed BCA or B.Sc CS/IT with min 50%</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
              <span>Valid MAH-MCA-CET / MGMU Entrance score</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Faculty & HOD Directory Card
  if (category === 'FACULTY' || lowerText.includes('dr.') || lowerText.includes('prof.')) {
    return (
      <div className="mt-4 my-2 glass-card rounded-2xl p-4 border border-purple-200 dark:border-purple-500/20 bg-purple-50/40 dark:bg-slate-900/80">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200 dark:border-slate-800">
          <UserCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span className="text-xs font-bold text-slate-900 dark:text-white font-heading uppercase tracking-wider">
            Academic Leadership Directory
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
            <div className="font-bold text-amber-700 dark:text-amber-400 font-heading">Dr. Sharad G. Bhartiya</div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400">Director / Dean, IICT</div>
            <div className="text-[10px] text-slate-500 mt-1 font-mono">director.iict@mgmu.ac.in</div>
          </div>
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
            <div className="font-bold text-purple-700 dark:text-purple-400 font-heading">Dr. Vijaya B. Musande</div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400">HOD, Computer Science & Engg</div>
            <div className="text-[10px] text-slate-500 mt-1 font-mono">hod.cse@mgmu.ac.in</div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Placements & Career Highlights Card
  if (category === 'PLACEMENT' || lowerText.includes('placement') || lowerText.includes('tcs')) {
    return (
      <div className="mt-4 my-2 glass-card rounded-2xl p-4 border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50/30 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-950 dark:to-emerald-950/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-bold text-slate-900 dark:text-white font-heading uppercase tracking-wider">Placement Statistics</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 text-[10px] font-bold border border-emerald-300 dark:border-emerald-500/30">
            88%+ Success Rate
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3 text-center">
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Highest Package</div>
            <div className="text-base font-extrabold text-amber-600 dark:text-amber-400 font-heading">12.0 LPA</div>
          </div>
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Average Package</div>
            <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-heading">5.2 LPA</div>
          </div>
        </div>

        <div className="text-[11px] text-slate-600 dark:text-slate-400 font-semibold mb-1">Top Corporate Recruiters:</div>
        <div className="flex flex-wrap gap-1.5">
          {['TCS', 'Infosys', 'Wipro', 'Capgemini', 'Persistent Systems', 'Cognizant', 'Tech Mahindra'].map((company, i) => (
            <span key={i} className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[10px] font-medium text-slate-700 dark:text-slate-300 shadow-xs">
              {company}
            </span>
          ))}
        </div>
      </div>
    );
  }

  // 4. Contact & Address Card
  if (category === 'CONTACT' || lowerText.includes('contact') || lowerText.includes('location')) {
    return (
      <div className="mt-4 my-2 glass-card rounded-2xl p-4 border border-blue-200 dark:border-blue-500/20 bg-blue-50/40 dark:bg-slate-900/90">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-xs font-bold text-slate-900 dark:text-white font-heading uppercase tracking-wider">Official Contact Info</span>
        </div>
        <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
          <div>
            <div className="font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase">Campus Address</div>
            <div>MGM Campus, N-6, CIDCO, Chhatrapati Sambhajinagar - 431003, Maharashtra</div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
            <div>
              <div className="font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase">Phone</div>
              <div className="font-bold text-blue-700 dark:text-amber-400">+91-240-2480490</div>
            </div>
            <div>
              <div className="font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase">Admission Helpline</div>
              <div className="font-bold text-emerald-700 dark:text-emerald-400">+91-9422704944</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default StructuredInfo;
