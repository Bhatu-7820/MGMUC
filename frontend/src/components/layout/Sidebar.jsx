import React, { useState } from 'react';
import Logo from '../common/Logo';
import { useChat } from '../../context/ChatContext';
import {
  Plus,
  MessageSquare,
  Trash2,
  GraduationCap,
  BookOpen,
  IndianRupee,
  UserCheck,
  Building2,
  BookMarked,
  FileCheck,
  Award,
  BarChart3,
  Home,
  Bell,
  Phone,
  HelpCircle,
  Settings,
  Search,
  ChevronRight,
  Clock,
} from 'lucide-react';

const COLLEGE_CATEGORIES = [
  { label: 'Admissions', query: 'What is the B.Tech admission process at MGMU IICT?', icon: GraduationCap },
  { label: 'Courses & Programs', query: 'What programs and degree courses are offered at IICT?', icon: BookOpen },
  { label: 'Fee Structure', query: 'What is the fee structure for B.Tech CSE and MCA?', icon: IndianRupee },
  { label: 'Faculty Directory', query: 'Who is the HOD of Computer Science and Engineering?', icon: UserCheck },
  { label: 'Departments', query: 'Which departments exist in IICT?', icon: Building2 },
  { label: 'Academics', query: 'Tell me about the academic calendar and syllabus.', icon: BookMarked },
  { label: 'Examinations', query: 'What are the examination rules and evaluation criteria?', icon: FileCheck },
  { label: 'Scholarships', query: 'What scholarships and EBC schemes are available?', icon: Award },
  { label: 'Placements', query: 'What are the placement statistics and top recruiting companies?', icon: BarChart3 },
  { label: 'Campus & Facilities', query: 'Does IICT provide hostel facilities and what is the fee?', icon: Home },
  { label: 'Notices', query: 'What are the latest announcements and college notices?', icon: Bell },
  { label: 'Contact', query: 'How can I contact MGMU IICT admission office?', icon: Phone },
];

export const Sidebar = () => {
  const {
    isSidebarCollapsed,
    recentConversations,
    currentConversationId,
    startNewChat,
    loadConversation,
    removeConversation,
    sendMessage,
    setIsSearchModalOpen,
    setIsSettingsModalOpen,
  } = useChat();

  const [activeCategory, setActiveCategory] = useState('Admissions');

  if (isSidebarCollapsed) {
    /* Rail Mode */
    return (
      <aside className="hidden md:flex flex-col items-center py-4 w-[72px] app-sidebar flex-shrink-0 z-20 h-full justify-between">
        <div className="flex flex-col items-center gap-3.5 w-full">
          <div className="p-1">
            <Logo size="small" showText={false} />
          </div>

          <button
            onClick={startNewChat}
            className="w-10 h-10 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white flex items-center justify-center transition-all cursor-pointer shadow-sm"
            title="New Chat"
          >
            <Plus className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="w-10 h-10 rounded-xl text-[#64748B] hover:bg-[#E8F0FE] hover:text-[#2563EB] flex items-center justify-center transition-colors cursor-pointer"
            title="Search (Ctrl K)"
          >
            <Search className="w-4.5 h-4.5" />
          </button>

          <div className="w-full px-2 space-y-1 mt-2 pt-2 border-t border-[#E2E8F0] flex flex-col items-center">
            {COLLEGE_CATEGORIES.slice(0, 5).map((cat, idx) => {
              const IconComp = cat.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveCategory(cat.label);
                    sendMessage(cat.query);
                  }}
                  className="w-10 h-10 rounded-xl text-[#64748B] hover:bg-[#E8F0FE] hover:text-[#2563EB] flex items-center justify-center transition-colors cursor-pointer"
                  title={cat.label}
                >
                  <IconComp className="w-4.5 h-4.5" />
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 pb-2">
          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className="w-10 h-10 rounded-xl text-[#64748B] hover:bg-[#E8F0FE] hover:text-[#2563EB] flex items-center justify-center transition-colors cursor-pointer"
            title="Settings"
          >
            <Settings className="w-4.5 h-4.5" />
          </button>
        </div>
      </aside>
    );
  }

  /* Expanded Sidebar Mode matching screenshot */
  return (
    <aside className="hidden md:flex flex-col w-[250px] app-sidebar flex-shrink-0 z-20 h-full">
      {/* Top New Chat Button */}
      <div className="p-3.5 border-b border-white/40">
        <button
          onClick={() => {
            setActiveCategory(null);
            startNewChat();
          }}
          className="w-full flex items-center justify-center gap-2.5 h-[44px] rounded-xl bg-[#3B82F6]/90 hover:bg-[#2563EB] text-white text-sm font-semibold transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4.5 h-4.5 stroke-[2.5]" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {/* Recent Chats Direct Item with Chevron */}
        <div className="space-y-1">
          <div
            onClick={() => setIsSearchModalOpen(true)}
            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-[#475569] hover:bg-white/50 hover:text-[#2563EB] transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <Clock className="w-4.5 h-4.5 text-[#64748B] group-hover:text-[#2563EB]" />
              <span>Recent Chats</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#2563EB]" />
          </div>

          {recentConversations.length > 0 && (
            <div className="pl-3 space-y-0.5 border-l-2 border-[#E2E8F0]/60 ml-4 my-1">
              {recentConversations.slice(0, 3).map((conv) => {
                const convId = conv._id || conv.id;
                const isActive = currentConversationId === convId;
                return (
                  <div
                    key={convId}
                    className={`group flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#2563EB]/12 text-[#1D4ED8] font-semibold border border-[#2563EB]/15'
                        : 'text-[#475569] hover:bg-white/50 hover:text-[#2563EB]'
                    }`}
                    onClick={() => loadConversation(convId)}
                  >
                    <span className="truncate max-w-[140px] text-[11px]">{conv.title || 'Chat'}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeConversation(convId);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-0.5 text-[#94A3B8] hover:text-red-500"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* COLLEGE INFORMATION Section */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider font-heading">
            COLLEGE INFORMATION
          </div>
          <div className="space-y-0.5">
            {COLLEGE_CATEGORIES.map((item, idx) => {
              const IconComp = item.icon;
              const isActive = activeCategory === item.label;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveCategory(item.label);
                    sendMessage(item.query);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-[#2563EB]/12 text-[#1D4ED8] border border-[#2563EB]/15'
                      : 'text-[#475569] hover:bg-white/50 hover:text-[#2563EB]'
                  }`}
                >
                  <IconComp className={`w-4.5 h-4.5 flex-shrink-0 ${isActive ? 'text-[#2563EB]' : 'text-[#64748B]'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Footer Links */}
      <div className="p-3 border-t border-white/40 space-y-0.5">
        <button
          onClick={() => setIsSettingsModalOpen(true)}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-[#475569] hover:bg-white/50 hover:text-[#2563EB] transition-colors cursor-pointer"
        >
          <HelpCircle className="w-4.5 h-4.5 text-[#64748B]" />
          <span>Help & Support</span>
        </button>
        <button
          onClick={() => setIsSettingsModalOpen(true)}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-[#475569] hover:bg-white/50 hover:text-[#2563EB] transition-colors cursor-pointer"
        >
          <Settings className="w-4.5 h-4.5 text-[#64748B]" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;


