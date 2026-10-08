import React, { useState } from 'react';
import { ShieldCheck, Globe, Info, ExternalLink, ChevronDown, ChevronUp, Clock, CheckCircle2 } from 'lucide-react';

export const SourceBadge = ({
  sources = [],
  confidence = 'HIGH',
  category,
  isLiveWebVerified = false,
  academicYear = '2026-27',
  retrievedAt
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!sources || sources.length === 0) {
    return (
      <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-[#F4F8FD] px-2.5 py-1 text-xs font-medium text-[#66788D] border border-[#DCE5EF]">
        <Info className="w-3.5 h-3.5 text-[#5B8DEF]" />
        <span>General MGMU Information</span>
      </div>
    );
  }

  const primarySource = sources[0];
  const isLive = isLiveWebVerified || primarySource.isLiveVerified || primarySource.level <= 3;
  const displayYear = academicYear || primarySource.academicYear || '2026-27';
  const displayDate = retrievedAt || primarySource.retrievedAt || primarySource.lastUpdated || 'October 2026';

  const getLevelLabel = (level) => {
    switch (level) {
      case 1: return 'Level 1: Official Web Page';
      case 2: return 'Level 2: Official Document / PDF';
      case 3: return 'Level 3: Official Admissions Portal';
      default: return 'Level 4: Verified Knowledge Base';
    }
  };

  return (
    <div className="mt-2.5 bg-[#F8FAFD] border border-[#DCE5EF] rounded-xl p-3 text-xs text-[#203B59] transition-all shadow-xs">
      {/* Top Header Summary */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {isLive ? (
            <span className="inline-flex items-center gap-1.5 font-semibold text-[#15803D] bg-[#ECFDF5] px-2.5 py-0.5 rounded-md border border-[#BBF7D0]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16A34A]"></span>
              </span>
              <Globe className="w-3.5 h-3.5 text-[#16A34A]" />
              Live Official MGMU Verified
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 font-semibold text-[#1E40AF] bg-[#EFF6FF] px-2.5 py-0.5 rounded-md border border-[#DBEAFE]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" />
              Verified Knowledge Base
            </span>
          )}

          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[#475569] font-medium text-[11px] border border-[#E2E8F0]">
            A.Y. {displayYear}
          </span>

          <span className="font-semibold text-[#1E293B] truncate max-w-[200px] sm:max-w-xs">
            {primarySource.source || 'MGM University IICT Official Sources'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {displayDate && (
            <span className="inline-flex items-center gap-1 text-[11px] text-[#64748B]">
              <Clock className="w-3 h-3 text-[#94A3B8]" />
              {displayDate}
            </span>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-0.5 text-[#2563EB] font-semibold hover:underline text-[11px] cursor-pointer"
          >
            {isExpanded ? 'Hide sources' : `Sources (${sources.length}) →`}
            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Expanded Sources Details */}
      {isExpanded && (
        <div className="mt-2.5 pt-2 border-t border-[#E2E8F0] space-y-2">
          {sources.map((src, idx) => (
            <div key={idx} className="flex flex-col gap-1 text-[11px] bg-white p-2.5 rounded-lg border border-[#E2E8F0]">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="font-semibold text-[#0F172A]">{src.title}</span>
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]">
                  {getLevelLabel(src.level)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 text-[#64748B] flex-wrap">
                <span>Source: {src.source || 'MGM University'}</span>
                {src.sourceUrl && (
                  <a
                    href={src.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#2563EB] hover:underline font-semibold"
                  >
                    Official Link <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}

          {/* Honest Accuracy Disclaimer */}
          <p className="text-[10px] text-[#64748B] italic pt-1 text-center sm:text-left">
            * Answers are based on verified MGMU/IICT official sources and may depend on the latest university circulars.
          </p>
        </div>
      )}
    </div>
  );
};

export default SourceBadge;
