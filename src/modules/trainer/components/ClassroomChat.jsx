import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Trash2, ShieldCheck } from 'lucide-react';
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
        className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3.5 custom-scrollbar bg-slate-50/40"
      >
        {isLoading && messages.length === 0 ? (
          <div className="text-center text-xs text-slate-400 py-6">Syncing chat logs...</div>
        ) : error ? (
          <div className="text-center text-xs text-rose-500 py-6 font-medium">{error}</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-xs text-slate-400 py-6">No messages yet in this session.</div>
        ) : (
          messages.map((msg) => {
            const currentEmail = getUserEmail();
            const isMe = (msg.sender || '').toLowerCase().includes('trainer') || msg.sender === currentEmail;

            return (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[88%] ${!isMe ? 'mr-auto items-start' : 'ml-auto items-end'}`}
              >
                {/* Sender Tagline */}
                <span className="text-[10px] font-bold tracking-wide text-slate-400 uppercase mb-1 px-1 flex items-center gap-1">
                  <span>{msg.sender}</span>
                  <span className="text-slate-300">•</span>
                  <span className="font-mono text-slate-400 lowercase">{msg.timestamp}</span>
                  {msg.isAdmin && (
                    <span className="ml-1 inline-flex items-center gap-0.5 text-[9px] bg-slate-900 text-white px-1.5 py-0.2 rounded font-semibold uppercase">
                      <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" /> Staff
                    </span>
                  )}
                </span>

                {/* Message Bubble Container */}
                <div className="group flex items-center gap-2">
                  <div
                    className={`p-3 rounded-xl text-xs leading-relaxed shadow-2xs tracking-tight ${
                      !isMe
                        ? 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
                        : 'bg-slate-900 text-white rounded-tr-none font-medium'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Delete Action Button for Trainers */}
                  {getUserRole().toLowerCase() === 'trainer' && (
                    <button
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="opacity-0 group-hover:opacity-100 flex items-center justify-center w-6 h-6 rounded-md bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 hover:border-rose-200 shadow-2xs transition-all shrink-0 cursor-pointer"
                      title="Delete message"
                    >
                      <Trash2 className="w-3 h-3 text-slate-400 hover:text-rose-600" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Responsive Input Bar */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 bg-white shrink-0">
        <div className="flex gap-2 items-center bg-slate-50 border border-slate-200/80 rounded-lg p-1 focus-within:border-slate-900 focus-within:bg-white transition-all">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1 bg-transparent border-0 outline-none text-xs h-8 px-2 text-slate-800 placeholder-slate-400"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="bg-slate-900 text-white font-bold text-xs px-3 h-8 rounded-md hover:bg-slate-800 active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <Send className="w-3 h-3 text-white" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </form>
    </div>
  );
}