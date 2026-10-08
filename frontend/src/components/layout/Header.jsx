import React from 'react';
import Logo from '../common/Logo';
import { useChat } from '../../context/ChatContext';
import { Search, Settings, Menu } from 'lucide-react';

export const Header = () => {
  const {
    isSidebarCollapsed,
    toggleSidebarCollapse,
    setIsSearchModalOpen,
    setIsSettingsModalOpen,
  } = useChat();

  return (
    <header className="app-header px-4 sm:px-6 flex items-center justify-between z-20 flex-shrink-0">
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Sidebar Hamburger Menu Toggle Button */}
        <button
          onClick={toggleSidebarCollapse}
          className="p-2 rounded-xl text-[#475569] hover:text-[#2563EB] hover:bg-[#E8F0FE] transition-all cursor-pointer"
          title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Menu className="w-5 h-5 text-[#334155]" />
        </button>

        {/* MGM University Emblem Logo & Title */}
        <div className="flex items-center gap-3">
          <Logo size="small" showText={false} />
          <div className="flex flex-col">
            <div className="flex items-center gap-2.5">
              <span className="text-base sm:text-[19px] font-extrabold text-[#0F172A] font-heading tracking-tight">
                MGM University
              </span>
              {/* AI ASSISTANT Pill Badge */}
              <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F0FE] text-[#2563EB] text-[11px] font-bold border border-[#BFDBFE] shadow-2xs">
                AI ASSISTANT
              </span>
            </div>
            <span className="text-xs text-[#475569] hidden sm:block font-semibold tracking-wide">
              Institute of Information & Communication Technology
            </span>
          </div>
        </div>
      </div>

      {/* Right Header Actions */}
      <div className="flex items-center gap-3">
        {/* Knowledge Base Active Status Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E6F4EA] border border-[#BBF7D0] text-[#16A34A] text-xs font-bold shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
          <span>Knowledge Base Active</span>
        </div>

        {/* Search Input Control */}
        <button
          onClick={() => setIsSearchModalOpen(true)}
          className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#F1F5FA] hover:bg-[#E8F0FE] text-[#475569] hover:text-[#0F172A] text-xs font-semibold border border-[#E2E8F0] transition-all cursor-pointer shadow-2xs group"
        >
          <Search className="w-4 h-4 text-[#64748B] group-hover:text-[#2563EB]" />
          <span className="hidden md:inline text-[#475569]">Search MGMU IICT...</span>
          <kbd className="hidden md:inline-block px-2 py-0.5 rounded-md bg-white text-[10px] text-[#475569] font-mono border border-[#E2E8F0] shadow-2xs">
            Ctrl K
          </kbd>
        </button>

        {/* Settings Button */}
        <button
          onClick={() => setIsSettingsModalOpen(true)}
          className="p-2 rounded-xl text-[#475569] hover:text-[#2563EB] hover:bg-[#E8F0FE] transition-all cursor-pointer"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;



