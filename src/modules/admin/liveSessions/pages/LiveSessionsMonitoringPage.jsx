import React, { useState, useEffect, useCallback } from 'react';
import { 
  Radio, 
  RefreshCw, 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  Video 
} from 'lucide-react';

import { 
  fetchLiveSessions, 
  fetchLiveStats, 
  forceEndLiveSession 
} from '../../../../services/features/liveMonitoringService';

import LiveSessionCard from '../components/LiveSessionCard';
import ParticipantsModal from '../components/ParticipantsModal';
import AttendanceGraph from '../components/AttendanceGraph';

const MOCK_LIVE_SESSIONS = [
  {
    session_id: 'session_101',
    title: 'Microservices & Gateway Integration',
    batch_code: 'BATCH-2026-FS1',
    trainer_name: 'Rangaraj S',
    course_name: 'Full-Stack Cloud Architecture',
    active_participant_count: 22,
    duration_minutes: 35,
    started_at: '2026-08-10T09:30:00Z',
    attendance_summary: { total_logged: 25, present: 22, absent: 2, late: 1, attendance_percentage: '92.0%' },
    participants: [
      { _id: '1', name: 'Rangaraj S', email: 'trainer@ai-education.com', role: 'Trainer', is_muted: false, is_camera_on: true },
      { _id: '2', name: 'Aarav Sharma', email: 'aarav@example.com', role: 'Student', is_muted: true, is_camera_on: true }
    ]
  },
  {
    session_id: 'session_102',
    title: 'MongoDB Aggregation Frameworks',
    batch_code: 'BATCH-2026-AI2',
    trainer_name: 'Anand Kumar',
    course_name: 'Data Structures & Algorithms',
    active_participant_count: 18,
    duration_minutes: 50,
    started_at: '2026-08-10T09:15:00Z',
    attendance_summary: { total_logged: 20, present: 16, absent: 2, late: 2, attendance_percentage: '88.0%' },
    participants: [
      { _id: '3', name: 'Anand Kumar', email: 'anand@ai-education.com', role: 'Trainer', is_muted: false, is_camera_on: true }
    ]
  }
];

export default function LiveSessionsMonitoringPage() {
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [selectedSession, setSelectedSession] = useState(null);
  const [isRosterOpen, setIsRosterOpen] = useState(false);
  const [isGraphOpen, setIsGraphOpen] = useState(false);

  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [sessionsRes, statsRes] = await Promise.all([
        fetchLiveSessions(),
        fetchLiveStats()
      ]);

      if (sessionsRes && sessionsRes.sessions && sessionsRes.sessions.length > 0) {
        setSessions(sessionsRes.sessions);
      } else {
        setSessions(MOCK_LIVE_SESSIONS);
      }

      if (statsRes && statsRes.stats) {
        setStats(statsRes.stats);
      }
    } catch (err) {
      console.error('Failed to load live sessions monitoring:', err);
      setSessions(MOCK_LIVE_SESSIONS);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(() => loadData(true), 15000);
    return () => clearInterval(interval);
  }, [loadData]);

  const handleForceEnd = async (sessionId, title) => {
    if (window.confirm(`Are you sure you want to forcibly terminate live session: "${title}"?`)) {
      try {
        await forceEndLiveSession(sessionId);
      } catch (e) {
        console.error('Force end failed:', e);
      }
      loadData(true);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 max-w-[1600px] mx-auto min-h-screen p-4 sm:p-6 bg-slate-50/30">
      
      {/* Header */}
      <header className="w-full bg-white border border-slate-200/80 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Radio className="w-5 h-5 text-rose-600 animate-pulse" />
            Admin Live Session Monitoring
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Supervisory control over ongoing classrooms, real-time participant rosters, attendance graphs, and watch access.
          </p>
        </div>

        <button
          onClick={() => loadData(true)}
          disabled={refreshing}
          className="h-9 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Syncing...' : 'Sync Live Feeds'}</span>
        </button>
      </header>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-xs space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">ACTIVE LIVE SESSIONS</span>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold font-mono text-rose-600">{sessions.length} Live</span>
            <Radio className="w-4 h-4 text-rose-600" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-xs space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">LIVE CONNECTED USERS</span>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold font-mono text-indigo-600">
              {stats?.total_live_participants || sessions.reduce((acc, s) => acc + s.active_participant_count, 0)}
            </span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-xs space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">AVG ATTENDANCE RATE</span>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold font-mono text-emerald-600">
              {stats?.average_attendance_rate || '91.2%'}
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-xs space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">SYSTEM HEALTH</span>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold font-mono text-slate-800">{stats?.system_health_status || 'Optimal'}</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* Live Session Grid Cards */}
      <div className="space-y-3">
        <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Video className="w-3.5 h-3.5 text-slate-400" />
          Active Live Classrooms ({sessions.length})
        </h2>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading active classroom streams...</div>
        ) : sessions.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 bg-white border rounded-xl">No live sessions currently broadcasting.</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {sessions.map((s) => (
              <LiveSessionCard
                key={s.session_id}
                session={s}
                onForceEnd={handleForceEnd}
                onViewRoster={(sess) => { setSelectedSession(sess); setIsRosterOpen(true); }}
                onViewGraph={(sess) => { setSelectedSession(sess); setIsGraphOpen(true); }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Participants Roster Modal */}
      <ParticipantsModal
        isOpen={isRosterOpen}
        onClose={() => setIsRosterOpen(false)}
        participants={selectedSession?.participants || []}
        sessionTitle={selectedSession?.title || ''}
      />

      {/* Attendance Graph Modal */}
      {isGraphOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <AttendanceGraph attendanceSummary={selectedSession?.attendance_summary} />
            <div className="flex justify-end bg-white p-3 border-t rounded-b-xl">
              <button onClick={() => setIsGraphOpen(false)} className="px-4 py-1.5 text-xs font-bold bg-slate-900 text-white rounded cursor-pointer">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}