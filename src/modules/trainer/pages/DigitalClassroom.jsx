import { useState, useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import WhiteboardZone from '../components/WhiteboardZone';
import ClassroomChat from '../components/ClassroomChat';

const MemoizedWhiteboard = memo(WhiteboardZone);
const MemoizedChat = memo(ClassroomChat);

export default function DigitalClassroom() {
  const navigate = useNavigate();
  const [activeSession, setActiveSession] = useState(null);

  // Identify Current User Role from local storage
  const userRole = localStorage.getItem('user_role') || 'Student';

  // Check for active created session from Trainer
  useEffect(() => {
    const checkActiveSession = () => {
      const storedSession = localStorage.getItem('active_live_session');
      if (storedSession) {
        try {
          setActiveSession(JSON.parse(storedSession));
        } catch (e) {
          setActiveSession({ id: storedSession, isLive: true });
        }
      } else {
        // Fallback default active session for dev testing
        setActiveSession({ id: 'session_101', isLive: true });
      }
    };

    checkActiveSession();
    window.addEventListener('storage', checkActiveSession);
    return () => window.removeEventListener('storage', checkActiveSession);
  }, []);

  const activeSessionId = activeSession?.id || 'session_101';
  const isSessionLive = activeSession?.isLive ?? true;

  // Handler to redirect student into the full-screen live meeting page
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
      <header className="w-full bg-white border border-slate-200/80 rounded-2xl px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div>
          <h1 className="text-base font-bold text-slate-900 tracking-tight">
            Digital Classroom Workspace
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Interact with the whiteboard workspace and communicate with your trainer in real time.
          </p>
        </div>
        
        <div className="flex items-center gap-3 self-start sm:self-center">
          {/* Live Indicator Tag */}
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
            isSessionLive 
              ? 'bg-amber-50 text-amber-700 border-amber-100' 
              : 'bg-slate-100 text-slate-500 border-slate-200'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isSessionLive ? 'bg-amber-500 animate-pulse' : 'bg-slate-400'}`} aria-hidden="true" />
            {isSessionLive ? `Live Session Active (${activeSessionId})` : 'No Live Session'}
          </div>

          {/* 🎓 JOIN BUTTON FOR STUDENTS ONLY */}
          {userRole.toLowerCase() === 'student' && (
            <button
              type="button"
              onClick={handleJoinLiveSession}
              disabled={!isSessionLive}
              className={`text-xs font-bold px-4 py-2 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer ${
                isSessionLive
                  ? 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              <span>📹</span> Join Live Meeting
            </button>
          )}
        </div>
      </header>

      {/* Dynamic Sandbox Layout */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
        
        {/* Main Canvas Workspace Area */}
        <main className="w-full lg:col-span-3 flex flex-col gap-3">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            Whiteboard Development Sandbox
          </h2>
          <div 
            style={{ height: 'calc(100vh - 220px)', minHeight: '580px' }} 
            className="w-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm min-h-0" 
          >
            <MemoizedWhiteboard sessionId={activeSessionId} />
          </div>
        </main>

        {/* Engagement Sidebar Panel */}
        <aside className="w-full lg:col-span-1 flex flex-col gap-3 lg:sticky lg:top-6">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            Classroom Engagement
          </h3>
          
          <div 
            style={{ height: 'calc(100vh - 220px)', minHeight: '580px' }} 
            className="w-full bg-white border border-slate-200 rounded-2xl flex flex-col overflow-hidden shadow-sm min-h-0"
          >
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
              <h4 className="text-xs font-bold text-slate-800 tracking-wide uppercase">
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