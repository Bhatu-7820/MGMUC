import React from 'react';
import { ChatProvider } from './context/ChatContext';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import MobileDrawer from './components/layout/MobileDrawer';
import SearchModal from './components/layout/SearchModal';
import SettingsModal from './components/layout/SettingsModal';
import ChatWindow from './components/chat/ChatWindow';
import ChatInput from './components/chat/ChatInput';

export function App() {
  return (
    <ChatProvider>
      <div className="full-page-wrapper">
        {/* Collapsible Edge-to-Edge Desktop Sidebar */}
        <Sidebar />

        {/* Mobile Navigation Drawer */}
        <MobileDrawer />

        {/* Main Edge-to-Edge Chat Canvas Container */}
        <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-[#f4f8fe] dark:bg-[#0e131f]">
          {/* Top Header Bar */}
          <Header />

          {/* Messages Stream */}
          <ChatWindow />

          {/* Floating Input Pill */}
          <ChatInput />
        </div>

        {/* Search & Settings Modals */}
        <SearchModal />
        <SettingsModal />
      </div>
    </ChatProvider>
  );
}

export default App;
