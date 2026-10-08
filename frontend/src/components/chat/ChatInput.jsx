import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

export const ChatInput = () => {
  const [question, setQuestion] = useState('');
  const { sendMessage, isLoading } = useChat();
  const textareaRef = useRef(null);

  // Auto-grow textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [question]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;
    sendMessage(question);
    setQuestion('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 pb-3 pt-1 px-4 z-30 pointer-events-none flex flex-col items-center">
      {/* Floating Capsule Input Pill */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[780px] app-composer-pill px-4 py-2 flex items-center gap-3 min-h-[58px] pointer-events-auto"
      >

        {/* Input Textarea */}
        <textarea
          ref={textareaRef}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about MGMU IICT..."
          disabled={isLoading}
          rows={1}
          className="flex-1 bg-transparent border-0 resize-none outline-none text-xs sm:text-sm text-[#1E293B] placeholder-[#94A3B8] max-h-28 py-1.5 font-sans font-medium"
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={!question.trim() || isLoading}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer flex-shrink-0 ${
            question.trim() && !isLoading
              ? 'bg-[#3B82F6] text-white hover:bg-[#2563EB] shadow-md'
              : 'bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed'
          }`}
          title="Send Question"
        >
          <Send className="w-4 h-4 translate-x-0.5 -translate-y-0.5 rotate-45" />
        </button>
      </form>

      {/* Clean Floating Disclaimer Note */}
      <span className="text-[11px] text-[#475569] font-medium mt-1.5 px-3 py-0.5 rounded-full bg-white/90 backdrop-blur-md border border-[#E2E8F0] text-center shadow-xs pointer-events-auto">
        MGMU IICT AI Assistant can make mistakes. Please verify important information with the official college office.
      </span>
    </div>
  );
};

export default ChatInput;



