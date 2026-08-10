import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Eye, Power, Users, TrendingUp } from 'lucide-react';

export default function LiveSessionCard({ session, onForceEnd, onViewRoster, onViewGraph }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs space-y-4 hover:border-slate-300 transition-all">
      <div className="flex justify-between items-start gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-700 border border-rose-200 font-mono uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping" />
              Live Now
            </span>
            <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
              {session.batch_code || 'BATCH-2026-A'}
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-900 mt-1.5">{session.title}</h3>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            {session.course_name || 'General Curriculum'}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            title="Join/Watch Classroom Stream"
            onClick={() => navigate(`/live-session/${session.session_id}`)}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Watch Live</span>
          </button>

          <button
            title="Force End Classroom"
            onClick={() => onForceEnd(session.session_id, session.title)}
            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold flex items-center cursor-pointer border border-rose-200/60 transition-all"
          >
            <Power className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50/70 border border-slate-100 rounded-lg text-xs">
        <div>
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Trainer</span>
          <span className="font-bold text-slate-800">{session.trainer_name}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Duration</span>
          <span className="font-bold font-mono text-slate-800">{session.duration_minutes || 30} mins</span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Attendance Rate</span>
          <span className="font-bold font-mono text-emerald-600">
            {session.attendance_summary?.attendance_percentage || '90.0%'}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center pt-2 border-t border-slate-100">
        <button
          onClick={() => onViewRoster(session)}
          className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
        >
          <Users className="w-3.5 h-3.5 text-indigo-600" />
          <span>View Roster ({session.active_participant_count})</span>
        </button>

        <button
          onClick={() => onViewGraph(session)}
          className="text-xs font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Attendance Graph</span>
        </button>
      </div>
    </div>
  );
}