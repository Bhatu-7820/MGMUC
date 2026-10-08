import React from 'react';
import Logo from '../common/Logo';

export const TypingIndicator = ({ stage = 'Searching verified college information...' }) => {
  return (
    <div className="flex items-start gap-3 my-3 px-1 max-w-3xl mx-auto">
      <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-white border border-[#E5EAF2] flex items-center justify-center shadow-2xs">
        <Logo size="small" showText={false} />
      </div>

      <div className="flex flex-col bg-white border border-[#E5EAF2] rounded-2xl rounded-tl-xs px-4 py-3 shadow-2xs max-w-md">
        <div className="flex items-center gap-2 mb-1.5 text-xs text-[#3568B8] font-semibold">
          <span>{stage}</span>
        </div>
        <div className="flex items-center gap-1.5 py-1">
          <div className="w-2 h-2 rounded-full bg-[#5B8DEF] animate-bounce"></div>
          <div className="w-2 h-2 rounded-full bg-[#4A7DDF] animate-bounce [animation-delay:0.2s]"></div>
          <div className="w-2 h-2 rounded-full bg-[#3568B8] animate-bounce [animation-delay:0.4s]"></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
