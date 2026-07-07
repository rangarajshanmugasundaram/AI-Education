import { useState, useEffect, useRef, useCallback } from 'react';

export default function ClassroomChat() {
  const [messages, setMessages] = useState(() => [
    {
      id: 'init-1',
      sender: 'Trainer',
      text: 'Welcome to the digital classroom session! Use this board workspace to sketch out solutions.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAdmin: true
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const chatBottomRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = useCallback((e) => {
    e.preventDefault();
    const cleanInput = inputValue.trim();
    if (!cleanInput) return;

    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: 'You',
      text: cleanInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAdmin: false
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');
  }, [inputValue]);

  return (
    <div className="flex flex-col w-full h-full min-h-0 bg-white overflow-hidden">
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50/50">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex flex-col max-w-[85%] ${msg.isAdmin ? 'mr-auto items-start' : 'ml-auto items-end'}`}
          >
            <span className="text-[10px] font-bold tracking-wide text-slate-400 uppercase mb-1 px-1">
              {msg.sender} <span className="mx-1 font-normal text-slate-300">•</span> <span className="font-medium lowercase">{msg.timestamp}</span>
            </span>
            
            <div className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm tracking-wide ${
              msg.isAdmin 
                ? 'bg-white text-slate-800 rounded-tl-none border border-slate-200/60' 
                : 'bg-blue-600 text-white rounded-tr-none font-medium'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={chatBottomRef} />
      </div>

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