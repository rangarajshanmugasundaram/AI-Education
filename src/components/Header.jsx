import { memo, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import notificationService from '../services/features/notificationService';
import websocketService from '../services/features/websocketService';
import classroomService from '../services/features/classroomService';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../constants/roles';

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userRole, logout } = useAuth();

  const [unreadCount, setUnreadCount] = useState(0);
  const [activeSession, setActiveSession] = useState(null);

  // Safe case-insensitive role check
  const isStudentRole = 
    userRole?.toLowerCase() === 'student' || 
    userRole?.toLowerCase() === ROLES?.STUDENT?.toLowerCase();

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/digital-classroom':
        return 'Digital Classroom';
      case '/notifications-inbox':
        return 'Notifications';
      case '/notifications':
        return 'Notification Management';
      case '/attendance':
        return 'Attendance Tracker';
      case '/analytics':
        return 'Analytics & Performance';
      case '/settings':
        return 'Account Settings';
      default:
        return 'Overview';
    }
  };

  // 1. Sync active session state across Storage & Backend DB
  const checkActiveSession = useCallback(async () => {
    const storedSession = localStorage.getItem('active_live_session');
    if (storedSession) {
      try {
        const parsed = JSON.parse(storedSession);
        if (parsed && parsed.isLive) {
          setActiveSession(parsed);
          return;
        }
      } catch (e) {
        console.error('Error parsing active_live_session:', e);
      }
    }

    // Direct Django DB Check - If session is not live, clear state
    try {
      if (classroomService?.getSessionDetails) {
        const res = await classroomService.getSessionDetails('session_101');
        const data = res?.data || res;
        if (data && data.is_live) {
          const liveObj = { id: data.id || 'session_101', isLive: true };
          setActiveSession(liveObj);
          localStorage.setItem('active_live_session', JSON.stringify(liveObj));
          return;
        }
      }
    } catch (err) {
      // Quiet fallback
    }

    // Default to ended/inactive
    setActiveSession(null);
  }, []);

  // 2. Fetch unread notification badge count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await notificationService.getMy();
      const list = Array.isArray(response) ? response : response?.data || [];
      const unread = list.filter((n) => !n.read_status).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error('Failed to load header notification count:', err);
    }
  }, []);

  useEffect(() => {
    fetchUnreadCount();
    checkActiveSession();
  }, [fetchUnreadCount, checkActiveSession, location.pathname]);

  // 3. Real-time WebSocket & Event Listeners
  useEffect(() => {
    const handleNewBroadcast = (payload) => {
      fetchUnreadCount();

      const data = payload?.payload || payload;
      if (!data) return;

      const titleLower = String(data.title || '').toLowerCase();
      const priorityLower = String(data.priority || '').toLowerCase();

      const isLiveStart = 
        priorityLower === 'emergency' || 
        titleLower.includes('live session started') ||
        titleLower.includes('started');

      const isLiveEnd = 
        titleLower.includes('ended') || 
        titleLower.includes('closed') ||
        data.isLive === false;

      if (isLiveStart && !isLiveEnd) {
        const liveObj = {
          id: data?.batch_id || data?.session_id || 'session_101',
          isLive: true,
          title: data?.title,
        };
        setActiveSession(liveObj);
        localStorage.setItem('active_live_session', JSON.stringify(liveObj));
      } else if (isLiveEnd) {
        // 🌟 CLEAR LIVE SESSION UPON TRAINER ENDING CLASS
        setActiveSession(null);
        localStorage.removeItem('active_live_session');
      }
    };

    websocketService.on('NEW_NOTIFICATION', handleNewBroadcast);
    websocketService.on('SESSION_CONTROL', (payload) => {
      if (payload?.isLive === false || payload?.action === 'ended') {
        setActiveSession(null);
        localStorage.removeItem('active_live_session');
      }
    });

    window.addEventListener('storage', checkActiveSession);
    window.addEventListener('live_session_updated', checkActiveSession);

    return () => {
      websocketService.off('NEW_NOTIFICATION', handleNewBroadcast);
      window.removeEventListener('storage', checkActiveSession);
      window.removeEventListener('live_session_updated', checkActiveSession);
    };
  }, [fetchUnreadCount, checkActiveSession]);

  const notificationRoute = isStudentRole ? '/notifications-inbox' : '/notifications';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleJoinLiveSession = () => {
    const targetId = activeSession?.id || 'session_101';
    navigate(`/live-session/${targetId}`);
  };

  const userInitials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : 'RS';

  return (
    <header className="sticky top-0 z-30 flex h-17.5 w-full items-center justify-between border-b border-blue-100 bg-[#F0F9FF] px-6 transition-colors duration-200">
      {/* Left Block - Dynamic Title */}
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar} 
          className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-blue-200 bg-white text-xl text-blue-600 hover:bg-blue-50 active:scale-95 transition-all cursor-pointer"
        >
          ☰
        </button>
        <div>
          <h1 className="text-lg font-bold text-blue-950 tracking-tight">
            {getPageTitle(location.pathname)}
          </h1>
        </div>
      </div>

      {/* Right Block */}
      <div className="flex items-center gap-4">
        {/* 🎓 REAL-TIME JOIN LIVE CLASS BUTTON (STUDENTS ONLY) */}
        {isStudentRole && (
          <button
            type="button"
            onClick={handleJoinLiveSession}
            disabled={!activeSession?.isLive}
            className={`h-10 px-4 text-xs font-black rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeSession?.isLive
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-500/20 active:scale-95'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            <span 
              className={`w-2.5 h-2.5 rounded-full ${
                activeSession?.isLive ? 'bg-white animate-ping' : 'bg-slate-400'
              }`} 
            />
            <span>{activeSession?.isLive ? '📹 Join Live Class' : 'No Active Live Session'}</span>
          </button>
        )}

        <div className="hidden md:flex items-center gap-3">
          {/* Notification Bell */}
          <button 
            onClick={() => navigate(notificationRoute)}
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
        
        {/* Logout Profile Avatar */}
        <div 
          className="relative cursor-pointer group" 
          onClick={handleLogout}
          title="Click to Logout"
        >
          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-600/20 group-hover:bg-blue-700 active:scale-95 transition-all">
            {userInitials}
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#F0F9FF] bg-emerald-500"></span>
        </div>
      </div>
    </header>
  );
};

export default memo(Header);