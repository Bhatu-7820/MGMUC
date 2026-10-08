import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

let currentAbortController = null;

/**
 * Send chat question to MGMU IICT Chatbot API with abort support
 */
export const sendChatMessage = async (question, conversationId = null) => {
  // Abort previous running request if present
  if (currentAbortController) {
    currentAbortController.abort();
  }

  currentAbortController = new AbortController();

  try {
    const response = await apiClient.post(
      '/chat',
      {
        question,
        conversationId,
      },
      {
        signal: currentAbortController.signal,
      }
    );
    currentAbortController = null;
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      throw new Error('Previous request cancelled for new question.');
    }
    currentAbortController = null;
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      throw new Error("Request timed out. Please check your network connection and try again.");
    }
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Server error');
    }
    throw new Error('Unable to connect to MGMU IICT server. Please check your connection.');
  }
};

/**
 * Fetch all conversation histories
 */
export const fetchConversations = async () => {
  try {
    const response = await apiClient.get('/conversations');
    return response.data;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return { success: false, data: [] };
  }
};

/**
 * Fetch a specific conversation history by ID
 */
export const fetchConversationById = async (id) => {
  try {
    const response = await apiClient.get(`/conversations/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching conversation ${id}:`, error);
    return { success: false, data: null };
  }
};

/**
 * Delete a conversation by ID
 */
export const deleteConversation = async (id) => {
  try {
    const response = await apiClient.delete(`/conversations/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting conversation ${id}:`, error);
    return { success: false };
  }
};

/**
 * Search College Data (Courses, Faculty, Notices)
 */
export const searchCollegeData = async (query, category = '') => {
  try {
    const response = await apiClient.get('/knowledge/search', {
      params: { q: query, category },
    });
    return response.data;
  } catch (error) {
    console.error('Search error:', error);
    return { success: false, data: { courses: [], faculty: [], knowledge: [] } };
  }
};

/**
 * Fetch API Health & Verification Status
 */
export const checkApiHealth = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    return { status: 'offline' };
  }
};

export default apiClient;
