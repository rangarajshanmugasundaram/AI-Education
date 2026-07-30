import { useState, useEffect, useRef, useCallback } from 'react';
import axiosInstance from '../../../services/api/axiosSetup';

export default function ClassroomChat({ sessionId = 'session_101' }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const messagesContainerRef = useRef(null);

  const getUserRole = () => localStorage.getItem('user_role') || 'Student';
  const getUserEmail = () => localStorage.getItem('user_email') || '';

  const getAuthToken = () => {
    return (
      localStorage.getItem('access_token') ||
      localStorage.getItem('token') ||
      localStorage.getItem('jwt')
    );
  };

  // Fetch Chat History
  const fetchChatHistory = useCallback(async () => {
    const token = getAuthToken();

    try {
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await axiosInstance.get(`/api/chat/session/${sessionId}/`, { headers });
      const data = response.data || [];

      const formattedMessages = (Array.isArray(data) ? data : []).map((msg) => ({
        id: msg.message_id || msg.id,
        sender: msg.sender_name || msg.sender_id || 'User',
        text: msg.message,
        timestamp: msg.timestamp
          ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : 'Just now',
        isAdmin:
          (msg.sender_role || '').toLowerCase().includes('trainer') ||
          (msg.sender_name || '').toLowerCase().includes('trainer') ||
          msg.message_type === 'System'
      }));

      setMessages(formattedMessages);
      setError(null);
      return true;
    } catch (err) {
      console.error('Chat Sync Error:', err);
      const status = err.response?.status;
      if (status === 401) {
        setError('Session unauthorized. Please log in again.');
      } else {
        setError(err.response?.data?.error || err.response?.data?.detail || 'Failed to sync chat messages.');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  // Safe Polling Cycle
  useEffect(() => {
    let isMounted = true;

    const runPolling = async () => {
      const success = await fetchChatHistory();
      if (!success && isMounted) {
        clearInterval(pollInterval);
      }
    };

    runPolling();
    const pollInterval = setInterval(runPolling, 3000);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
    };
  }, [fetchChatHistory]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Send Message
  const handleSendMessage = useCallback(
    async (e) => {
      e.preventDefault();
      const cleanInput = inputValue.trim();
      if (!cleanInput) return;

      const token = getAuthToken();
      setInputValue('');

      try {
        const headers = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        await axiosInstance.post(
          '/api/chat/send/',
          {
            session_id: sessionId,
            message: cleanInput,
            message_type: 'Text'
          },
          { headers }
        );

        fetchChatHistory();
      } catch (err) {
        alert(`Message delivery failed: ${err.response?.data?.detail || err.response?.data?.error || err.message}`);
        setInputValue(cleanInput);
      }
    },
    [inputValue, sessionId, fetchChatHistory]
  );

  // Delete Message
  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    const token = getAuthToken();
    try {
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      await axiosInstance.delete(`/api/chat/${messageId}/`, { headers });
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    } catch (err) {
      alert(err.response?.data?.detail || err.response?.data?.error || 'Failed to delete message.');
    }
  };

  return (
    <div className="flex flex-col w-full h-full min-h-0 bg-white overflow-hidden">
      {/* Messages Feed */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50/50"
      >
        {isLoading && messages.length === 0 ? (
          <div className="text-center text-xs text-slate-400 py-4">Syncing chat logs...</div>
        ) : error ? (
          <div className="text-center text-xs text-red-500 py-4 font-medium">{error}</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-xs text-slate-400 py-4">No messages yet in this session. Send one to start!</div>
        ) : (
          messages.map((msg) => {
            const currentEmail = getUserEmail();
            const isMe = (msg.sender || '').toLowerCase().includes('trainer') || msg.sender === currentEmail;

            return (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[85%] ${!isMe ? 'mr-auto items-start' : 'ml-auto items-end'}`}
              >
                <span className="text-[10px] font-bold tracking-wide text-slate-400 uppercase mb-1 px-1">
                  {msg.sender} <span className="mx-1 font-normal text-slate-300">•</span>{' '}
                  <span className="font-medium lowercase">{msg.timestamp}</span>
                  {msg.isAdmin && <span className="ml-1 text-[9px] bg-amber-100 text-amber-700 px-1 rounded">Staff</span>}
                </span>

                <div className="group flex items-center gap-2">
                  <div
                    className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm tracking-wide ${
                      !isMe
                        ? 'bg-white text-slate-800 rounded-tl-none border border-slate-200/60'
                        : 'bg-blue-600 text-white rounded-tr-none font-medium'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {getUserRole().toLowerCase() === 'trainer' && (
                    <button
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="opacity-0 group-hover:opacity-100 flex items-center justify-center w-6 h-6 rounded-full bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 border border-slate-200 hover:border-red-200 shadow-sm transition-all duration-150 shrink-0 cursor-pointer"
                      title="Delete message"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 bg-white shrink-0">
        <div className="flex gap-2 items-center bg-slate-50 border border-slate-200 rounded-xl p-1 focus-within:ring-2 focus-within:ring-blue-500/10 focus-within:border-blue-500 focus-within:bg-white transition-all duration-200">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1 bg-transparent border-0 outline-none text-xs sm:text-sm h-9 px-2 text-slate-700 placeholder-slate-400"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="bg-blue-600 text-white font-bold text-xs px-4 h-9 rounded-lg hover:bg-blue-700 active:scale-[0.97] transition-all disabled:opacity-30 disabled:pointer-events-none shrink-0 cursor-pointer"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}