import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  User,
  Copy,
  Check,
  Edit3,
  ThumbsUp,
  ThumbsDown,
  Tag,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import SourceBadge from '../common/SourceBadge';
import { useChat } from '../../context/ChatContext';

export const ChatMessage = ({ message }) => {
  const {
    sender,
    text,
    sources,
    category,
    confidence,
    isError,
    isLiveWebVerified,
    academicYear,
    retrievedAt
  } = message;
  const isUser = sender === 'user';
  const [isCopied, setIsCopied] = useState(false);
  const [liked, setLiked] = useState(null);
  const { retryLastMessage, sendMessage } = useChat();

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-[850px] mx-auto my-3 px-1 sm:px-2">
      {isUser ? (
        /* User Question Row - Light Blue Surface #E8F0FE */
        <div className="flex items-start justify-between gap-3 group bg-[#E8F0FE]/95 backdrop-blur-md border border-[#BFDBFE] rounded-[14px] p-3.5 shadow-sm">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-7 h-7 rounded-full bg-[#3B82F6] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="text-sm font-semibold text-[#1E293B] pt-0.5 leading-relaxed">
              {text}
            </div>
          </div>
          <button
            onClick={() => sendMessage(text)}
            className="p-1 rounded-lg text-[#94A3B8] hover:text-[#2563EB] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            title="Edit question"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* AI Response Row - Crisp Pure White Surface #FFFFFF */
        <div className="flex flex-col gap-2 pl-0 sm:pl-8">
          {/* AI Header Badge */}
          <div className="flex items-center gap-2 text-xs font-bold text-[#2563EB] font-heading px-1">
            <span>MGMU IICT AI Assistant</span>
            <span className="w-3.5 h-3.5 rounded-full bg-[#3B82F6] text-white flex items-center justify-center text-[9px] font-bold">
              ✓
            </span>
            {category && category !== 'GENERAL' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F0FE] px-2 py-0.5 text-[10px] font-semibold text-[#2563EB] border border-[#BFDBFE]">
                <Tag className="w-2.5 h-2.5" />
                {category}
              </span>
            )}
          </div>

          {/* Response Surface */}
          <div className={`app-card p-5 text-[#1E293B] bg-white/95 backdrop-blur-md border border-[#E2E8F0] shadow-md ${isError ? 'border-red-200 bg-red-50/90' : ''}`}>
            {isError ? (
              <div className="flex items-start gap-3 text-red-700 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
                <div className="flex-1">
                  <p className="font-semibold">{text}</p>
                  <button
                    onClick={retryLastMessage}
                    className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Try Again
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="prose-academic text-sm text-[#1E293B] leading-relaxed overflow-x-auto">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      table: ({ node, ...props }) => (
                        <div className="overflow-x-auto my-3 rounded-xl border border-[#E2E8F0]">
                          <table className="min-w-full divide-y divide-[#E2E8F0] text-left text-xs" {...props} />
                        </div>
                      ),
                      th: ({ node, ...props }) => (
                        <th className="bg-[#E8F0FE] px-3.5 py-2 font-bold text-[#2563EB]" {...props} />
                      ),
                      td: ({ node, ...props }) => (
                        <td className="px-3.5 py-2 border-t border-[#E8F0FE] text-[#1E293B]" {...props} />
                      ),
                    }}
                  >
                    {text}
                  </ReactMarkdown>
                </div>

                {/* Action Bar (Thumbs, Copy, Regenerate) */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#E2E8F0] text-xs text-[#64748B]">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setLiked(liked === 'up' ? null : 'up')}
                      className={`hover:text-[#2563EB] cursor-pointer transition-colors ${liked === 'up' ? 'text-[#2563EB] font-bold' : ''}`}
                      title="Helpful"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setLiked(liked === 'down' ? null : 'down')}
                      className={`hover:text-[#1E293B] cursor-pointer transition-colors ${liked === 'down' ? 'text-red-500 font-bold' : ''}`}
                      title="Not helpful"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={handleCopy}
                      className="hover:text-[#2563EB] cursor-pointer transition-colors flex items-center gap-1 text-[11px] font-medium"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-[#16A34A]" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={retryLastMessage}
                      className="inline-flex items-center gap-1 font-semibold text-[#64748B] hover:text-[#2563EB] cursor-pointer transition-colors text-[11px]"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Regenerate</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Verified Source Badge */}
          {!isError && (
            <SourceBadge
              sources={sources}
              confidence={confidence}
              category={category}
              isLiveWebVerified={isLiveWebVerified}
              academicYear={academicYear}
              retrievedAt={retrievedAt}
            />
          )}
        </div>
      )}
    </div>
  );
};


export default ChatMessage;

