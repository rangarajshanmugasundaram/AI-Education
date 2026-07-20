import { memo } from 'react';
import WhiteboardZone from '../components/WhiteboardZone';
import ClassroomChat from '../components/ClassroomChat';

const MemoizedWhiteboard = memo(WhiteboardZone);
const MemoizedChat = memo(ClassroomChat);

export default function DigitalClassroom() {
  // Define your session ID here (this could also come from a URL parameter or context)
  const ACTIVE_SESSION_ID = "session_101";

  return (
    <>
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
          
          <div className="self-start sm:self-center flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-semibold border border-amber-100">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" aria-hidden="true" />
            Live Session Active
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
              {/* Pass the session ID to the whiteboard component */}
              <MemoizedWhiteboard sessionId={ACTIVE_SESSION_ID} />
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
                {/* Pass the session ID to the chat component */}
                <MemoizedChat sessionId={ACTIVE_SESSION_ID} />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}