import { memo, useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, Mail, Menu, Radio, User, Settings, HelpCircle, LogOut, ChevronDown } from 'lucide-react';
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
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const profileDropdownRef = useRef(null);

  const isStudentRole = 
    userRole?.toLowerCase() === 'student' || 
    userRole?.toLowerCase() === ROLES?.STUDENT?.toLowerCase();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

    setActiveSession(null);
  }, []);

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

  useEffect(() => {
    const handleNewBroadcast = (payload) => {
      fetchUnreadCount();
      const data = payload?.payload || payload;
      if (!data) return;

      const titleLower = String(data.title || '').toLowerCase();
      const priorityLower = String(data.priority || '').toLowerCase();

      const isLiveStart = priorityLower === 'emergency' || titleLower.includes('live session started') || titleLower.includes('started');
      const isLiveEnd = titleLower.includes('ended') || titleLower.includes('closed') || data.isLive === false;

      if (isLiveStart && !isLiveEnd) {
        const liveObj = { id: data?.batch_id || data?.session_id || 'session_101', isLive: true, title: data?.title };
        setActiveSession(liveObj);
        localStorage.setItem('active_live_session', JSON.stringify(liveObj));
      } else if (isLiveEnd) {
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
    setIsProfileMenuOpen(false);
    logout();
    navigate('/login');
  };

  const handleJoinLiveSession = () => {
    const targetId = activeSession?.id || 'session_101';
    navigate(`/live-session/${targetId}`);
  };

  const userInitials = user?.email ? user.email.slice(0, 2).toUpperCase() : 'AI';
  const userEmail = user?.email || 'user@aieducation.com';

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white px-6 md:px-8 transition-all">
      {/* Product Title Brand */}
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar} 
          className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 cursor-pointer transition-all active:scale-95"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-4 h-4 text-slate-600" />
        </button>
        
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => navigate('/')}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-xs font-black text-white shadow-xs group-hover:bg-slate-800 transition-all">
            AI
          </div>
          <span className="text-base font-bold text-slate-900 tracking-tight">
            AI Education
          </span>
        </div>
      </div>

      {/* Right Action Controls */}
      <div className="flex items-center gap-3">
        {/* Student Live Session Portal Join Button */}
        {isStudentRole && (
          <button
            type="button"
            onClick={handleJoinLiveSession}
            disabled={!activeSession?.isLive}
            className={`h-9 px-4 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              activeSession?.isLive
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs active:scale-95 font-bold'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200/80'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${activeSession?.isLive ? 'animate-pulse text-white' : 'text-slate-400'}`} />
            <span>{activeSession?.isLive ? 'Join Live Class' : 'No Active Session'}</span>
          </button>
        )}

        {/* Global Toolbar */}
        <div className="hidden md:flex items-center gap-2">
          {/* Notifications Bell */}
          <button 
            onClick={() => navigate(notificationRoute)}
            className="relative h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-600 transition-all cursor-pointer active:scale-95"
            title="Notifications"
            aria-label="View Notifications"
          >
            <Bell className="w-4 h-4 text-slate-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Quick Messages */}
          <button 
            className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-600 transition-all cursor-pointer active:scale-95"
            title="Messages"
            aria-label="View Messages"
          >
            <Mail className="w-4 h-4 text-slate-600" />
          </button>
        </div>
        
        {/* User Profile Avatar with Dropdown */}
        <div className="relative pl-1.5" ref={profileDropdownRef}>
          <button
            type="button"
            onClick={() => setIsProfileMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-lg p-1 text-left transition-all hover:bg-slate-100/80 cursor-pointer focus:outline-none"
            aria-expanded={isProfileMenuOpen}
          >
            <div className="relative">
              <div className="h-9 w-9 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                {userInitials}
              </div>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500"></span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Enterprise Profile Menu Popup */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg shadow-slate-900/5 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
              {/* User Identity Info */}
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <p className="text-xs font-bold text-slate-900 truncate">{userEmail}</p>
                <span className="inline-block mt-0.5 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 uppercase tracking-wider">
                  {userRole || 'Member'}
                </span>
              </div>

              {/* Action Links */}
              <div className="space-y-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    navigate('/settings');
                  }}
                  className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  <span>My Profile</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    navigate('/settings');
                  }}
                  className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-slate-500" />
                  <span>Account Settings</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 text-slate-500" />
                  <span>Help & Support</span>
                </button>
              </div>

              {/* Logout Option */}
              <div className="border-t border-slate-100 mt-1 pt-1">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-600" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default memo(Header);