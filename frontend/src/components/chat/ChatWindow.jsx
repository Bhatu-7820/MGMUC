import React, { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import SuggestedQuestions from './SuggestedQuestions';
import { useChat } from '../../context/ChatContext';

export const ChatWindow = () => {
  const { messages, isLoading, loadingStage } = useChat();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto pt-4 pb-28 px-4 sm:px-6 main-content-canvas z-10 flex flex-col justify-between">
      <div className="max-w-[1100px] mx-auto w-full my-auto flex flex-col justify-center relative z-10">
        {messages.length === 0 ? (
          /* Compact Welcome Hero Section */
          <div className="flex flex-col items-center justify-center py-6 px-6 sm:px-10 text-center max-w-2xl mx-auto bg-white/85 backdrop-blur-md rounded-3xl border border-white/80 shadow-[0_8px_32px_rgba(15,23,42,0.08)] my-auto">
            <h1 className="text-2xl sm:text-[30px] font-extrabold text-[#0F172A] tracking-tight mb-1 font-heading leading-tight">
              MGMU IICT AI Assistant
            </h1>

            {/* Subtitle (Vibrant Blue #2563EB) */}
            <p className="text-base sm:text-lg font-bold text-[#2563EB] mb-2.5">
              How can I help you today?
            </p>

            {/* Description Text */}
            <p className="text-xs sm:text-[13.5px] text-[#334155] max-w-[580px] leading-relaxed font-sans mb-5 font-semibold">
              Get verified information about admissions, courses, fees, faculty, academics, campus facilities, placements, scholarships and more.
            </p>

            {/* Suggested 3x2 Compact Category Cards Grid */}
            <SuggestedQuestions />
          </div>
        ) : (
          /* Active Conversation Messages */
          <div className="space-y-4 w-full max-w-[850px] mx-auto pb-4 my-auto">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isLoading && <TypingIndicator stage={loadingStage} />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
    </div>
  );

};

export default ChatWindow;


