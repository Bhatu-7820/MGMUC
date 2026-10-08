import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  sendChatMessage,
  fetchConversations,
  fetchConversationById,
  deleteConversation as apiDeleteConversation,
  checkApiHealth,
} from '../services/api';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [recentConversations, setRecentConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('Searching MGMU IICT verified sources...');
  const [errorToast, setErrorToast] = useState(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Collapsible Sidebar State (Desktop)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem('mgmu_sidebar_collapsed') === 'true';
  });

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('mgmu_sidebar_collapsed', String(next));
      return next;
    });
  };

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState({ status: 'checking' });

  // 100% Sky Blue & Pure White Light Theme Default
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('mgmu_theme', 'light');
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Initial load: Fetch system health & recent conversations
  useEffect(() => {
    loadHealthStatus();
    loadConversationsList();
  }, []);

  const loadHealthStatus = async () => {
    const health = await checkApiHealth();
    setApiStatus(health);
  };

  const loadConversationsList = async () => {
    const res = await fetchConversations();
    if (res.success && res.data) {
      setRecentConversations(res.data);
    }
  };

  // Start a fresh new chat session
  const startNewChat = () => {
    setMessages([]);
    setCurrentConversationId(null);
    setIsMobileSidebarOpen(false);
  };

  // Load an existing conversation from backend
  const loadConversation = async (convId) => {
    setIsLoading(true);
    setCurrentConversationId(convId);
    setIsMobileSidebarOpen(false);
    try {
      const res = await fetchConversationById(convId);
      if (res.success && res.data && res.data.messages) {
        setMessages(
          res.data.messages.map((m) => ({
            id: m._id || `msg_${Math.random()}`,
            sender: m.sender,
            text: m.text,
            sources: m.sources || [],
            category: m.category,
            confidence: m.confidence,
            timestamp: m.timestamp || new Date(),
          }))
        );
      }
    } catch (err) {
      showError('Failed to load conversation history');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a conversation history item
  const removeConversation = async (convId) => {
    await apiDeleteConversation(convId);
    setRecentConversations((prev) => prev.filter((c) => (c._id || c.id) !== convId));
    if (currentConversationId === convId) {
      startNewChat();
    }
  };

  // Send a user question with progressive stage updates
  const sendMessage = async (userQuestion) => {
    if (!userQuestion || !userQuestion.trim()) return;

    const trimmedQuestion = userQuestion.trim();
    const userMsgId = `msg_user_${Date.now()}`;
    const assistantMsgId = `msg_asst_${Date.now()}`;

    // Append user message immediately to chat UI
    const newUserMsg = {
      id: userMsgId,
      sender: 'user',
      text: trimmedQuestion,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setIsLoading(true);
    setLoadingStage('Analyzing question & checking freshness requirements...');
    setErrorToast(null);

    // Stage updates timer for smooth loading experience
    const stageTimer1 = setTimeout(() => {
      setLoadingStage('Searching verified knowledge base & official MGMU portals...');
    }, 900);

    const stageTimer2 = setTimeout(() => {
      setLoadingStage('Validating claims against official sources & formatting response...');
    }, 2200);

    try {
      const response = await sendChatMessage(trimmedQuestion, currentConversationId);

      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);

      if (response.success && response.data) {
        const {
          answer,
          sources,
          category,
          confidence,
          conversationId,
          isLiveWebVerified,
          academicYear,
          retrievedAt,
          disclaimer
        } = response.data;

        if (conversationId) {
          setCurrentConversationId(conversationId);
          loadConversationsList();
        }

        const newAssistantMsg = {
          id: assistantMsgId,
          sender: 'assistant',
          text: answer,
          sources: sources || [],
          category,
          confidence,
          isLiveWebVerified: Boolean(isLiveWebVerified),
          academicYear: academicYear || '2026-27',
          retrievedAt: retrievedAt || 'October 2026',
          disclaimer,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, newAssistantMsg]);
      }
    } catch (err) {
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      if (err.message.includes('cancelled')) return;

      const fallbackErrorMsg = {
        id: assistantMsgId,
        sender: 'assistant',
        text: "I couldn't find verified information for that question right now. Please try again or ask about admissions, courses, fees, faculty, or MGMU IICT facilities.",
        sources: [],
        category: 'ERROR',
        confidence: 'UNVERIFIED',
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, fallbackErrorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Retry sending the last user message
  const retryLastMessage = () => {
    const lastUserMsg = [...messages].reverse().find((m) => m.sender === 'user');
    if (lastUserMsg) {
      sendMessage(lastUserMsg.text);
    }
  };

  const showError = (msg) => {
    setErrorToast(msg);
    setTimeout(() => setErrorToast(null), 5000);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        currentConversationId,
        recentConversations,
        isLoading,
        loadingStage,
        errorToast,
        isMobileSidebarOpen,
        isSidebarCollapsed,
        toggleSidebarCollapse,
        isSearchModalOpen,
        isSettingsModalOpen,
        apiStatus,
        theme,
        toggleTheme,
        setIsMobileSidebarOpen,
        setIsSearchModalOpen,
        setIsSettingsModalOpen,
        sendMessage,
        startNewChat,
        loadConversation,
        removeConversation,
        retryLastMessage,
        loadHealthStatus,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
