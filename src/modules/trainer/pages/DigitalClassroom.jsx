import { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Radio, MessageSquare, PenTool, Sparkles } from 'lucide-react';
import WhiteboardZone from '../components/WhiteboardZone';
import ClassroomChat from '../components/ClassroomChat';
import classroomService from '../../../services/features/classroomService';
import websocketService from '../../../services/features/websocketService';

const MemoizedWhiteboard = memo(WhiteboardZone);
const MemoizedChat = memo(ClassroomChat);

export default function DigitalClassroom() {
  const navigate = useNavigate();
  const [activeSession, setActiveSession] = useState(null);

  // Identify Current User Role from local storage
  const userRole = localStorage.getItem('user_role') || 'Student';

  // Check active live session state
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

    // Query Django Backend directly
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

  useEffect(() => {
    checkActiveSession();

    const handleNewNotification = (payload) => {
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
          id: data.batch_id || data.session_id || 'session_101',
          isLive: true,
          title: data.title,
        };
        setActiveSession(liveObj);
        localStorage.setItem('active_live_session', JSON.stringify(liveObj));
      } else if (isLiveEnd) {
        setActiveSession(null);
        localStorage.removeItem('active_live_session');
      }
    };

    websocketService.on('NEW_NOTIFICATION', handleNewNotification);
    websocketService.on('SESSION_CONTROL', (payload) => {
      if (payload?.isLive === false || payload?.action === 'ended') {
        setActiveSession(null);
        localStorage.removeItem('active_live_session');
      }
    });

    window.addEventListener('storage', checkActiveSession);
    window.addEventListener('live_session_updated', checkActiveSession);

    return () => {
      websocketService.off('NEW_NOTIFICATION', handleNewNotification);
      window.removeEventListener('storage', checkActiveSession);
      window.removeEventListener('live_session_updated', checkActiveSession);
    };
  }, [checkActiveSession]);

  const activeSessionId = activeSession?.id || 'session_101';
  const isSessionLive = Boolean(activeSession && activeSession.isLive);

  const handleJoinLiveSession = () => {
    if (!isSessionLive) {
      alert("No active live session available. Please wait for your trainer to start a class.");
      return;
    }
    navigate(`/live-session/${activeSessionId}`);
  };

  return (
    <div className="w-full flex flex-col gap-6 max-w-[1600px] mx-auto">
      
      {/* Workspace Header Panel */}
      <header className="w-full bg-white border border-slate-200/80 rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Digital Classroom Workspace
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Interact with the whiteboard workspace and communicate with your trainer in real time.
          </p>
        </div>
        
        <div className="flex items-center gap-3 self-start sm:self-center">
          {/* Live Indicator Badge */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border ${
            isSessionLive 
              ? 'bg-rose-50 text-rose-700 border-rose-100' 
              : 'bg-slate-50 text-slate-500 border-slate-200/80'
          }`}>
            <Radio className={`w-3.5 h-3.5 ${isSessionLive ? 'animate-pulse text-rose-600' : 'text-slate-400'}`} />
            <span className="font-mono text-[11px]">
              {isSessionLive ? `Live Session Active (${activeSessionId})` : 'No Active Session'}
            </span>
          </div>

          {/* Student Join Button */}
          {userRole.toLowerCase() === 'student' && (
            <button
              type="button"
              onClick={handleJoinLiveSession}
              disabled={!isSessionLive}
              className={`h-9 px-4 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                isSessionLive
                  ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs active:scale-95'
                  : 'bg-slate-100 text-slate-400 border border-slate-200/80 cursor-not-allowed shadow-none'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Join Live Meeting</span>
            </button>
          )}
        </div>
      </header>

      {/* Dynamic Workspace Layout */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
        
        {/* Main Canvas Workspace Area */}
        <main className="w-full lg:col-span-3 flex flex-col gap-3">
          <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <PenTool className="w-3.5 h-3.5 text-slate-400" />
            Whiteboard Development Sandbox
          </h2>
          <div 
            style={{ height: 'calc(100vh - 230px)', minHeight: '560px' }} 
            className="w-full bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-xs min-h-0" 
          >
            <MemoizedWhiteboard sessionId={activeSessionId} />
          </div>
        </main>

        {/* Engagement Sidebar Panel */}
        <aside className="w-full lg:col-span-1 flex flex-col gap-3 lg:sticky lg:top-24">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
            Classroom Engagement
          </h3>
          
          <div 
            style={{ height: 'calc(100vh - 230px)', minHeight: '560px' }} 
            className="w-full bg-white border border-slate-200/80 rounded-xl flex flex-col overflow-hidden shadow-xs min-h-0"
          >
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 shrink-0 flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 tracking-wider uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-slate-500" />
                Live Chat Stream
              </h4>
            </div>
            
            <div className="w-full flex-1 flex flex-col overflow-hidden min-h-0">
              <MemoizedChat sessionId={activeSessionId} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}