import { useState, useEffect, useRef, useCallback } from 'react';

// Pass sessionId down as a prop from the main Classroom layout page
export default function ClassroomChat({ sessionId = 'session_101' }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const chatBottomRef = useRef(null);

  // Match your exact setup tokens and keys
  const getAuthToken = () => localStorage.getItem('token') || 'mock-jwt-token-from-backend-xyz123'; 
  const getUserEmail = () => localStorage.getItem('user_email') || 'trainertest@gmail.com';
  const getUserRole = () => localStorage.getItem('role') || 'Trainer';

  // 1. Fetch Chat History from the Backend
  const fetchChatHistory = useCallback(async () => {
    const token = getAuthToken();
    const email = getUserEmail();

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/chat/session/${sessionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-User-Email': email.trim().toLowerCase(),
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) throw new Error('Failed to fetch messages.');

      const data = await response.json();
      
      // Map Django SQLite model fields directly to your UI components
      const formattedMessages = data.map(msg => ({
        id: msg.message_id,
        sender: msg.sender_name,
        text: msg.message,
        timestamp: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        // Dynamically flags trainers or specific admins
        isAdmin: msg.sender_name.toLowerCase().includes('trainer') || msg.message_type === 'System'
      }));

      setMessages(formattedMessages);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  // Initial lookup and polling cycle to keep it responsive during your presentation
  useEffect(() => {
    fetchChatHistory();
    const pollInterval = setInterval(fetchChatHistory, 3000); // 3 seconds polling
    return () => clearInterval(pollInterval);
  }, [fetchChatHistory]);

  // Handle viewing position
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 2. Post New Message to Backend API
  const handleSendMessage = useCallback(async (e) => {
    e.preventDefault();
    const cleanInput = inputValue.trim();
    if (!cleanInput) return;

    const token = getAuthToken();
    const email = getUserEmail();

    // Clear field directly for visual performance responsiveness
    setInputValue('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/chat/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-User-Email': email.trim().toLowerCase(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          message: cleanInput,
          message_type: 'Text'
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Error executing request.');
      }

      fetchChatHistory();
    } catch (err) {
      alert(`Message delivery failed: ${err.message}`);
      setInputValue(cleanInput); 
    }
  }, [inputValue, sessionId, fetchChatHistory]);

  // 3. Delete Message Handler (Trainer Only)
  const handleDeleteMessage = async (messageId) => {
    const token = getAuthToken();
    const email = getUserEmail();
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/chat/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-User-Email': email.trim().toLowerCase(),
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) throw new Error('Unauthorized or message not found.');
      
      setMessages((prev) => prev.filter(msg => msg.id !== messageId));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex flex-col w-full h-full min-h-0 bg-white overflow-hidden">
      
      {/* Messages Feed Viewport */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50/50">
        {isLoading && messages.length === 0 ? (
          <div className="text-center text-xs text-slate-400 py-4">Syncing chat logs...</div>
        ) : error ? (
          <div className="text-center text-xs text-red-500 py-4">Error: {error}</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-xs text-slate-400 py-4">No messages yet in this session. Send one to start!</div>
        ) : (
          messages.map((msg) => {
            // Check if current user email or name matches the row log
            const isMe = msg.sender.toLowerCase().includes('trainer') || msg.sender === localStorage.getItem('username');

            return (
              <div 
                key={msg.id} 
                className={`flex flex-col max-w-[85%] ${!isMe ? 'mr-auto items-start' : 'ml-auto items-end'}`}
              >
                <span className="text-[10px] font-bold tracking-wide text-slate-400 uppercase mb-1 px-1">
                  {msg.sender} <span className="mx-1 font-normal text-slate-300">•</span> <span className="font-medium lowercase">{msg.timestamp}</span>
                  {msg.isAdmin && <span className="ml-1 text-[9px] bg-amber-100 text-amber-700 px-1 rounded">Staff</span>}
                </span>
                
                <div className="group flex items-center gap-2">
                  <div className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm tracking-wide ${
                    !isMe 
                      ? 'bg-white text-slate-800 rounded-tl-none border border-slate-200/60' 
                      : 'bg-blue-600 text-white rounded-tr-none font-medium'
                  }`}>
                    {msg.text}
                  </div>

                  {/* Professional SVG Trash Delete Button (Renders if Role is Trainer) */}
                  {getUserRole() === 'Trainer' && (
                    <button 
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="opacity-0 group-hover:opacity-100 flex items-center justify-center w-6 h-6 rounded-full bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 border border-slate-200 hover:border-red-200 shadow-sm transition-all duration-150 shrink-0"
                      title="Delete message"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Input Form Box Container */}
      <form 
        onSubmit={handleSendMessage} 
        className="p-3 border-t border-slate-100 bg-white shrink-0"
      >
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
            className="bg-blue-600 text-white font-bold text-xs px-4 h-9 rounded-lg hover:bg-blue-700 active:scale-[0.97] transition-all disabled:opacity-30 disabled:pointer-events-none shrink-0"
          >
            Send
          </button>
        </div>
      </form>
      
    </div>
  );
}