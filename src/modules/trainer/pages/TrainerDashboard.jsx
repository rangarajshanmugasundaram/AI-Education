import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Video, 
  BellRing, 
  Plus, 
  Star, 
  FileText, 
  Sparkles, 
  Calendar, 
  Users, 
  MessageSquare, 
  BarChart2, 
  CheckCircle2, 
  XCircle,
  PlayCircle
} from 'lucide-react';

import CreateLiveSessionButton from '../components/CreateLiveSessionButton';
import UploadRecordingModal from '../../recordings/components/UploadRecordingModal'; 
import feedbackService from '../../../services/features/feedbackService';
import notificationService from '../../../services/features/notificationService';
import classroomService from '../../../services/features/classroomService';

export default function TrainerDashboard() {
  const navigate = useNavigate();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false); 

  const [sessions, setSessions] = useState([
    { id: 'session_101', batchName: 'Full Stack JavaScript - Batch A', dateTime: '2026-07-27 at 10:00', notified: true },
    { id: 'sess-xyz2', batchName: 'UI/UX Design Masterclass - Evening', dateTime: '2026-07-28 at 18:30', notified: false }
  ]);

  const [feedbackData, setFeedbackData] = useState({
    metrics: { overall_rating: 0, total_reviews: 0, distribution: {} },
    results: []
  });

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

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const trainerEmail = localStorage.getItem('user_email') || 'trainer1@gmail.com';
        const data = await feedbackService.getTrainerFeedback(trainerEmail);
        if (data && data.metrics) {
          setFeedbackData(data);
        }
      } catch (err) {
        console.error('Failed to load trainer feedback:', err);
      }
    };
    fetchFeedback();
  }, []);

  const handleSessionCreated = useCallback((newSession) => {
    setSessions((prev) => [newSession, ...prev]);
    localStorage.setItem('active_live_session', JSON.stringify({ id: newSession.id, isLive: true }));
    window.dispatchEvent(new Event('live_session_updated'));
  }, []);

  const handleAddRecording = useCallback((newRecording) => {
    setRecordings((prevRecs) => [newRecording, ...prevRecs]);
  }, []);

  const handleNotifyStudents = async (id, batchName) => {
    try {
      await notificationService.create({
        title: `📢 Session Announcement: ${batchName || id}`,
        message: `Trainer has posted an update regarding session (${id}). Please check your classroom portal.`,
        priority: 'High',
        recipient_type: 'All',
        batch_id: id,
      });

      setSessions(prev => prev.map(s => s.id === id ? { ...s, notified: true } : s));
      alert("System Update: Real-time notification pushed to student profiles!");
    } catch (err) {
      console.error('Failed to send notification:', err);
    }
  };

  const handleStartSession = async (sessionId, batchName) => {
    try {
      if (classroomService?.startSession) {
        await classroomService.startSession(sessionId);
      }

      await notificationService.create({
        title: `🔴 Live Session Started: ${batchName || sessionId}`,
        message: `Trainer has initiated the live classroom (${sessionId}). Click 'Join Live Class' to connect now!`,
        priority: 'Emergency',
        recipient_type: 'All',
        batch_id: sessionId,
      });

      localStorage.setItem('active_live_session', JSON.stringify({ id: sessionId, isLive: true }));
      window.dispatchEvent(new Event('live_session_updated'));

      navigate(`/live-session/${sessionId}`);
    } catch (err) {
      console.error('Error starting live session:', err);
      localStorage.setItem('active_live_session', JSON.stringify({ id: sessionId, isLive: true }));
      window.dispatchEvent(new Event('live_session_updated'));
      navigate(`/live-session/${sessionId}`);
    }
  };

  const handleEndSession = async (sessionId, batchName) => {
    try {
      if (classroomService?.endSession) {
        await classroomService.endSession(sessionId);
      }

      await notificationService.create({
        title: `⏹️ Live Session Ended: ${batchName || sessionId}`,
        message: `The live classroom session (${sessionId}) has been closed by the trainer.`,
        priority: 'Low',
        recipient_type: 'All',
        batch_id: sessionId,
      });

      localStorage.removeItem('active_live_session');
      window.dispatchEvent(new Event('live_session_updated'));

      alert(`Session ${sessionId} has been successfully ended.`);
    } catch (err) {
      console.error('Error ending live session:', err);
      localStorage.removeItem('active_live_session');
      window.dispatchEvent(new Event('live_session_updated'));
    }
  };

  return (
    <>
      <div className="w-full flex flex-col gap-6 max-w-[1600px] mx-auto">
        
        {/* Enterprise Page Banner Header */}
        <header className="w-full bg-white border border-slate-200/80 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Trainer Administration Hub
            </h1>
            <p className="text-xs text-slate-500">
              Manage scheduled lectures, evaluate engagement analytics, and access AI session logs.
            </p>
          </div>
          
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className="h-9 text-xs font-semibold px-4 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 text-slate-500" />
              <span>Upload Recording</span>
            </button>
            <CreateLiveSessionButton onSessionCreated={handleSessionCreated} />
          </div>
        </header>

        {/* Grid Layout */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          <main className="w-full lg:col-span-3 flex flex-col gap-6">
            
            {/* Scheduled & Active Lectures */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Scheduled & Active Lectures
                </h2>
              </div>

              <div className="w-full bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs space-y-3">
                {sessions.map((session) => (
                  <div 
                    key={session.id} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-100 rounded-lg bg-slate-50/50 gap-4 hover:border-slate-200 transition-all"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 bg-slate-200/80 px-2 py-0.5 rounded-md">
                          ID: {session.id}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{session.batchName}</h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Scheduled: {session.dateTime}</span>
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleNotifyStudents(session.id, session.batchName)}
                        disabled={session.notified}
                        className={`h-8 px-3 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                          session.notified 
                            ? 'bg-slate-100 text-slate-400 border-slate-200/80 cursor-not-allowed' 
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 active:scale-95'
                        }`}
                      >
                        <BellRing className="w-3.5 h-3.5" />
                        <span>{session.notified ? 'Notified' : 'Notify Students'}</span>
                      </button>

                      <button 
                        type="button"
                        onClick={() => handleStartSession(session.id, session.batchName)}
                        className="h-8 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 rounded-lg shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <PlayCircle className="w-3.5 h-3.5" />
                        <span>Start Session</span>
                      </button>

                      <button 
                        type="button"
                        onClick={() => handleEndSession(session.id, session.batchName)}
                        className="h-8 bg-white hover:bg-rose-50 text-rose-600 border border-slate-200 text-xs font-bold px-3 rounded-lg transition-all cursor-pointer active:scale-95"
                      >
                        End
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Student Feedback & Rating Analytics */}
            <section className="space-y-3">
              <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Star className="w-3.5 h-3.5 text-slate-400" />
                Student Feedback & Ratings
              </h2>

              <div className="w-full bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-50/80 border border-slate-100 rounded-lg p-5 flex flex-col items-center justify-center text-center">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    <span className="text-3xl font-bold font-mono text-slate-900">
                      {feedbackData.metrics.overall_rating || '5.0'}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-slate-700 mt-2">Average Session Rating</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Based on {feedbackData.metrics.total_reviews} reviews</span>
                </div>

                <div className="md:col-span-2 space-y-2.5 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                  {feedbackData.results.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 text-xs border border-dashed border-slate-200 rounded-lg">
                      <MessageSquare className="w-6 h-6 mb-2 text-slate-300" />
                      <span>No student feedback recorded yet. Ratings will appear here once live classes complete.</span>
                    </div>
                  ) : (
                    feedbackData.results.map((rev) => (
                      <div key={rev.id || rev.created_at} className="p-3 bg-slate-50/60 border border-slate-100 rounded-lg space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800">{rev.student_id}</span>
                          <div className="flex items-center gap-0.5 text-amber-500">
                            {[...Array(rev.rating || 5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-500" />
                            ))}
                          </div>
                        </div>
                        {rev.review && <p className="text-xs text-slate-600">{rev.review}</p>}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>

            {/* AI Session Notes & Transcripts */}
            <section className="space-y-3">
              <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                Stored Session Notes & AI Insights
              </h2>

              <div className="w-full bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs space-y-4">
                {mockArchivedNotes.map((note) => (
                  <div key={note.id} className="p-4 border border-slate-100 rounded-lg bg-slate-50/30 space-y-3">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <h3 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                        {note.batchName}
                      </h3>
                      <span className="text-[10px] font-semibold text-slate-400 font-mono">{note.date}</span>
                    </div>
                    
                    <div className="bg-white p-3 border border-slate-100 rounded-md">
                      <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Audio Transcription Snippet</span>
                      <p className="text-slate-600 italic font-mono text-xs leading-relaxed">{note.transcriptSnippet}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">AI Summary</span>
                        <p className="text-xs text-slate-600 leading-relaxed">{note.aiSummary}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Key Recommendations</span>
                        <p className="text-xs text-slate-700 font-medium leading-relaxed">{note.aiActionNotes}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </main>

          {/* Performance Analytics Sidebar */}
          <aside className="w-full lg:col-span-1 space-y-3 lg:sticky lg:top-24">
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <BarChart2 className="w-3.5 h-3.5 text-slate-400" />
              Classroom Performance
            </h2>

            <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs space-y-2.5">
              <div className="p-3 bg-slate-50/80 border border-slate-100 rounded-lg flex justify-between items-center">
                <span className="text-xs font-medium text-slate-500 flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  Attendance
                </span>
                <span className="text-xs font-bold font-mono text-slate-900">{mockAnalytics.attendanceRate}</span>
              </div>

              <div className="p-3 bg-slate-50/80 border border-slate-100 rounded-lg flex justify-between items-center">
                <span className="text-xs font-medium text-slate-500 flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                  Chat Activity
                </span>
                <span className="text-xs font-bold font-mono text-slate-900">{mockAnalytics.chatInteractions} msg</span>
              </div>

              <div className="p-3 bg-slate-50/80 border border-slate-100 rounded-lg flex justify-between items-center">
                <span className="text-xs font-medium text-slate-500 flex items-center gap-2">
                  <BarChart2 className="w-3.5 h-3.5 text-slate-400" />
                  Poll Participation
                </span>
                <span className="text-xs font-bold font-mono text-slate-900">{mockAnalytics.pollParticipation}</span>
              </div>

              <div className="p-3 bg-slate-50/80 border border-slate-100 rounded-lg flex justify-between items-center">
                <span className="text-xs font-medium text-slate-500 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                  Quiz Averages
                </span>
                <span className="text-xs font-bold font-mono text-slate-900">{mockAnalytics.quizAverage}</span>
              </div>

              <div className="p-4 border border-slate-200 bg-slate-900 text-white rounded-lg flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-bold font-mono tracking-tight">{mockAnalytics.aiParticipationScore}/100</span>
                <span className="text-[9px] text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-slate-400" />
                  AI Engagement Score
                </span>
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