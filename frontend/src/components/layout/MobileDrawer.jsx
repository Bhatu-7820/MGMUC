import React from 'react';
import { X, Plus, MessageSquare, Trash2, ShieldCheck, ExternalLink } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import Logo from '../common/Logo';

export const MobileDrawer = () => {
  const {
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    recentConversations,
    loadConversation,
    removeConversation,
    startNewChat,
    currentConversationId,
  } = useChat();

  if (!isMobileSidebarOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsMobileSidebarOpen(false)}
      />

      {/* Slide-over Drawer */}
      <div className="relative flex flex-col w-4/5 max-w-xs h-full bg-[rgba(235,243,255,0.85)] backdrop-blur-xl p-4 shadow-2xl border-r border-white/40 z-10">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <Logo size="small" />
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={startNewChat}
          className="flex items-center justify-center gap-2 w-full my-4 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 text-white font-semibold text-xs shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Chat</span>
        </button>

        <div className="flex-1 overflow-y-auto">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Recent Questions
          </span>

          {recentConversations.length === 0 ? (
            <div className="text-xs text-slate-400 py-4 text-center">No recent history</div>
          ) : (
            <div className="space-y-1">
              {recentConversations.map((conv) => {
                const convId = conv._id || conv.id;
                const isActive = currentConversationId === convId;
                return (
                  <div
                    key={convId}
                    onClick={() => loadConversation(convId)}
                    className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer ${
                      isActive ? 'bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-200 font-semibold' : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{conv.title}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeConversation(convId);
                      }}
                      className="p-1 text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500">
          <div className="font-semibold text-slate-700 dark:text-slate-300">MGM University IICT</div>
          <div>Chhatrapati Sambhajinagar</div>
        </div>
      </div>
    </div>
  );
};

export default MobileDrawer;
