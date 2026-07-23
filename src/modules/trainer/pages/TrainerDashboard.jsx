import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateLiveSessionButton from '../components/CreateLiveSessionButton';
import UploadRecordingModal from '../components/UploadRecordingModal'; 

export default function TrainerDashboard() {
  const navigate = useNavigate();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false); 

  const [sessions, setSessions] = useState([
    { id: 'sess-abc1', batchName: 'Full Stack JavaScript - Batch A', dateTime: '2026-07-10 at 10:00', notified: true },
    { id: 'sess-xyz2', batchName: 'UI/UX Design Masterclass - Evening', dateTime: '2026-07-15 at 18:30', notified: false }
  ]);

  const [recordings, setRecordings] = useState([
    {
      id: 'rec-1',
      title: 'Whiteboard Setup and Architecture Overview',
      session: 'Full-Stack Engineering Bootcamp',
      duration: '01:24',
      fileName: 'session_intro_whiteboard.mp4',
      uploadedAt: 'Jul 4, 2026'
    }
  ]);

  const mockAnalytics = {
    attendanceRate: '92%',
    chatInteractions: 184,
    pollParticipation: '86%',
    quizAverage: '78/100',
    aiParticipationScore: 84 
  };

  const mockArchivedNotes = [
    {
      id: 'archive-1',
      batchName: 'Full Stack JavaScript - Batch A',
      date: '2026-07-03',
      transcriptSnippet: '“...So when defining a variable inside a React functional component, you should understand how useState manages components re-rendering instances dynamically...”',
      aiSummary: 'Introduced basic React state management patterns. Explained state lifetimes and standard hooks architecture definitions.',
      aiActionNotes: 'Recommend setting aside 15 minutes in the next session to clear student doubts concerning callback states.'
    }
  ];

  const handleSessionCreated = useCallback((newSession) => {
    setSessions((prev) => [newSession, ...prev]);
  }, []);

  const handleAddRecording = useCallback((newRecording) => {
    setRecordings((prevRecs) => [newRecording, ...prevRecs]);
  }, []);

  const handleNotifyStudents = (id) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, notified: true } : s));
    alert("System Update: Notifications pushed to all student profiles in this batch!");
  };

  const handleStartSession = (sessionId) => {
    navigate(`/live-session/${sessionId}`);
  };

  return (
    <>
      <div className="w-full flex flex-col gap-5 sm:gap-6 max-w-[1600px] mx-auto bg-slate-50/30 min-h-screen">
        
        {/* Hub Header Block */}
        <header className="w-full bg-white/95 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-4 sm:p-5 lg:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm sticky top-0 z-40 transition-all">
          <div className="space-y-1 text-center sm:text-left">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Trainer Administration Hub
            </h1>
            <p className="text-xs text-slate-500 max-w-xl">
              Manage scheduled lectures, evaluate engagement analytics, and access AI-generated session logs.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className="w-full sm:w-auto h-11 sm:h-10 text-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-[0.98] text-xs font-bold px-4 rounded-xl border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span className="text-sm font-medium">+</span> Upload Recording
            </button>
            
            {/* Modular Independent Component */}
            <CreateLiveSessionButton onSessionCreated={handleSessionCreated} />
          </div>
        </header>

        {/* Dashboard Panels Layout */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* Main Informational Flow Columns */}
          <main className="w-full lg:col-span-3 flex flex-col gap-6 order-1">
            
            {/* Live Lecture Segments */}
            <section className="flex flex-col gap-3">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                Scheduled & Active Lectures
              </h2>
              <div className="w-full bg-white border border-slate-200/70 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3.5">
                {sessions.map((session) => (
                  <div 
                    key={session.id} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-100 rounded-xl bg-slate-50/40 gap-4 transition-all hover:border-slate-200"
                  >
                    <div className="space-y-1 text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                          ID: {session.id}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-slate-800 pt-1">{session.batchName}</h4>
                      <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1.5 mt-0.5">
                        <span>🗓️</span> <span className="font-medium">Scheduled: {session.dateTime}</span>
                      </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <button
                        type="button"
                        onClick={() => handleNotifyStudents(session.id)}
                        disabled={session.notified}
                        className={`h-11 sm:h-9 px-4 text-xs font-bold rounded-xl transition-all border text-center cursor-pointer ${
                          session.notified 
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' 
                            : 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100 active:scale-[0.98]'
                        }`}
                      >
                        {session.notified ? '✓ Notified' : 'Notify Students'}
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleStartSession(session.id)}
                        className="h-11 sm:h-9 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-bold px-4 rounded-xl shadow-md transition-all text-center cursor-pointer"
                      >
                        Start Session
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Smart Lesson Notes & Summary Aggregates */}
            <section className="flex flex-col gap-3">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                Stored Session Notes & AI Insights
              </h2>
              <div className="w-full bg-white border border-slate-200/70 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
                {mockArchivedNotes.map((note) => (
                  <div key={note.id} className="p-4 border border-slate-100 rounded-xl bg-slate-50/30 space-y-3.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-2.5 text-center sm:text-left">
                      <h3 className="font-extrabold text-slate-800 text-sm">{note.batchName}</h3>
                      <span className="text-[10px] font-bold text-slate-400 flex items-center justify-center gap-1 uppercase tracking-wider">
                        <span>📅</span> {note.date}
                      </span>
                    </div>
                    
                    <div className="bg-white p-3.5 border border-slate-100 rounded-xl shadow-sm">
                      <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Audio Transcription Snippet</span>
                      <p className="text-slate-600 italic font-mono text-xs leading-relaxed">{note.transcriptSnippet}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                      <div className="space-y-1">
                        <span className="block text-[9px] font-bold text-blue-600 uppercase tracking-wider">AI Generated Summary</span>
                        <p className="text-xs text-slate-600 leading-relaxed">{note.aiSummary}</p>
                      </div>
                      <div className="md:border-l md:pl-4 border-slate-100 space-y-1">
                        <span className="block text-[9px] font-bold text-amber-600 uppercase tracking-wider">Key Recommendations</span>
                        <p className="text-xs text-slate-600 leading-relaxed font-semibold">{note.aiActionNotes}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Local Video Repository Blocks */}
            <section className="flex flex-col gap-3">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                Classroom Recordings Repository ({recordings.length})
              </h2>
              <div className="w-full bg-white border border-slate-200/70 rounded-2xl p-5 shadow-sm">
                {recordings.length === 0 ? (
                  <div className="w-full flex flex-col items-center justify-center text-center py-12">
                    <span className="text-3xl mb-2">📹</span>
                    <h4 className="text-xs font-bold text-slate-700">No session recordings compiled yet</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Use the button on the top right to start archiving files.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recordings.map((rec) => (
                      <div key={rec.id} className="border border-slate-200/60 hover:border-slate-300 rounded-xl p-4 bg-slate-50/40 flex flex-col gap-3 transition-all">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-bold bg-slate-200/80 text-slate-700 rounded px-1.5 py-0.5 w-max uppercase tracking-wide mb-2">
                            {rec.duration}
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-2 leading-snug">
                            {rec.title}
                          </h4>
                          <p className="text-[11px] text-slate-400 font-semibold mt-1">
                            {rec.session}
                          </p>
                        </div>

                        <div className="pt-2.5 border-t border-slate-200/60 mt-auto flex justify-between items-center text-[10px] text-slate-400 font-medium">
                          <span className="truncate max-w-xs-file font-mono text-slate-400/90">💾 {rec.fileName}</span>
                          <span>{rec.uploadedAt}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}  
              </div>
            </section>

          </main>

          {/* Metric Dashboard Sidebar Column */}
          <aside className="w-full lg:col-span-1 flex flex-col gap-3 lg:sticky lg:top-28 order-2">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              Classroom Performance
            </h2>
            <div className="bg-white border border-slate-200/70 rounded-2xl p-4 shadow-sm grid grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4">
              <div className="p-3.5 border border-slate-100 bg-slate-50/50 rounded-xl flex flex-col lg:flex-row lg:justify-between lg:items-center gap-1 col-span-1">
                <span className="text-[11px] font-semibold text-slate-500">Attendance</span>
                <span className="text-xs sm:text-sm font-black text-slate-800">{mockAnalytics.attendanceRate}</span>
              </div>
              <div className="p-3.5 border border-slate-100 bg-slate-50/50 rounded-xl flex flex-col lg:flex-row lg:justify-between lg:items-center gap-1 col-span-1">
                <span className="text-[11px] font-semibold text-slate-500">Chat Activity</span>
                <span className="text-xs sm:text-sm font-black text-slate-800">{mockAnalytics.chatInteractions} msg</span>
              </div>
              <div className="p-3.5 border border-slate-100 bg-slate-50/50 rounded-xl flex flex-col lg:flex-row lg:justify-between lg:items-center gap-1 col-span-1">
                <span className="text-[11px] font-semibold text-slate-500">Poll Submissions</span>
                <span className="text-xs sm:text-sm font-black text-slate-800">{mockAnalytics.pollParticipation}</span>
              </div>
              <div className="p-3.5 border border-slate-100 bg-slate-50/50 rounded-xl flex flex-col lg:flex-row lg:justify-between lg:items-center gap-1 col-span-1">
                <span className="text-[11px] font-semibold text-slate-500">Quiz Averages</span>
                <span className="text-xs sm:text-sm font-black text-slate-800">{mockAnalytics.quizAverage}</span>
              </div>
              <div className="p-4 border border-blue-100 bg-blue-50/50 rounded-xl flex flex-col gap-1 items-center justify-center text-center col-span-2 lg:col-span-1">
                <span className="text-xl font-black text-blue-700">{mockAnalytics.aiParticipationScore}/100</span>
                <span className="text-[9px] text-blue-600 font-bold uppercase tracking-wider">AI Engagement Score</span>
              </div>
            </div>
          </aside>

        </div>

      </div>

      <UploadRecordingModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleAddRecording}
      />
    </>
  );
}