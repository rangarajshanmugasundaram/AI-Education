import { memo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import notificationService from '../services/features/notificationService';

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const { data } = await notificationService.getMy();
        const unread = (data || []).filter((n) => !n.read_status).length;
        setUnreadCount(unread);
      } catch (err) {
        console.error('Failed to load header notification count:', err);
      }
    };
    fetchUnreadCount();
  }, []);

  return (
    <header 
      style={{ zIndex: 19 }}
      className="sticky top-0 flex h-17.5 w-full items-center justify-between border-b border-blue-100 bg-[#F0F9FF] px-6 transition-colors duration-200"
    >
      {/* Left Block */}
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar} 
          className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-blue-200 bg-white text-xl text-blue-600 hover:bg-blue-50 active:scale-95 transition-all"
        >
          ☰
        </button>
        <div>
          <h1 className="text-lg font-bold text-blue-950 tracking-tight">Dashboard</h1>
        </div>
      </div>

      {/* Right Block */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-3">
          {/* 🔔 Clicking Bell Navigates to Student Inbox Page */}
          <button 
            onClick={() => navigate('/notifications-inbox')}
            className="relative h-10 w-10 flex items-center justify-center rounded-xl border border-blue-200 bg-white hover:bg-blue-50 text-base shadow-sm shadow-blue-500/5 transition-all cursor-pointer"
            title="Notifications"
          >
            🔔
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <button className="h-10 w-10 flex items-center justify-center rounded-xl border border-blue-200 bg-white hover:bg-blue-50 text-base shadow-sm shadow-blue-500/5 transition-all cursor-pointer">
            ✉️
          </button>
        </div>
        
        {/* Logout Profile Container */}
        <div 
          className="relative cursor-pointer group" 
          onClick={() => { localStorage.removeItem("isLoggedIn"); navigate('/login'); }}
          title="Logout"
        >
          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-600/20 group-hover:bg-blue-700 active:scale-95 transition-all">
            RS
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#F0F9FF] bg-emerald-500"></span>
        </div>
      </div>
    </header>
  );
};

export default memo(Header);