import React, { useMemo } from 'react';
import { Activity, Users, CheckCircle2, Clock, AlertTriangle, X } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export default function AttendanceGraph({ attendanceSummary, activeCount = 0, onClose }) {
  // Normalize Summary Payload with Fallbacks
  const summary = useMemo(() => {
    return attendanceSummary || {
      total_logged: 0,
      present: 0,
      absent: 0,
      late: 0,
      attendance_percentage: '0.0%'
    };
  }, [attendanceSummary]);

  // Capacity & Metric Calculations
  const totalStudents = summary.total_logged > 0 ? summary.total_logged : (activeCount > 0 ? activeCount : 0);
  const presentVal = summary.total_logged > 0 ? summary.present : activeCount;
  const lateVal = summary.late || 0;
  const absentVal = summary.total_logged > 0 ? summary.absent : Math.max(0, totalStudents - presentVal);

  const presentPct = totalStudents > 0 ? Math.round((presentVal / totalStudents) * 100) : 0;
  const latePct = totalStudents > 0 ? Math.round((lateVal / totalStudents) * 100) : 0;
  const absentPct = totalStudents > 0 ? Math.round((absentVal / totalStudents) * 100) : 0;

  // Single-Row Bar Chart Data for Recharts
  const barData = [
    {
      name: 'Attendance',
      Present: presentVal,
      Late: lateVal,
      Absent: absentVal,
    },
  ];

  // Health Status Badge Determination
  const getHealthStatus = () => {
    if (totalStudents === 0) return { label: 'NO DATA', color: 'bg-slate-100 text-slate-500 border-slate-200' };
    if (presentPct >= 80) return { label: 'OPTIMAL', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    if (presentPct >= 50) return { label: 'MODERATE', color: 'bg-amber-50 text-amber-700 border-amber-200' };
    return { label: 'LOW ATTENDANCE', color: 'bg-rose-50 text-rose-700 border-rose-200' };
  };

  const health = getHealthStatus();

  return (
    <div className="relative bg-white rounded-2xl p-6 shadow-xl space-y-5 max-w-lg w-full mx-auto border border-slate-100">
      
      {/* 🔴 TOP-RIGHT CLOSE X BUTTON (Positioned cleanly at the top-right arrow location) */}
      {onClose && (
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-800 transition-all cursor-pointer z-20 shadow-2xs"
          aria-label="Close Modal"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* 1. HEADER SECTION */}
      <div className="border-b border-slate-100 pb-4 pr-12">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="p-2 bg-slate-900 text-white rounded-xl shadow-xs">
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Live Attendance Analytics
            </h3>
            <p className="text-[11px] text-slate-500">
              Real-time participation & batch capacity tracking
            </p>
          </div>
        </div>

        {/* Health Badge & Attendance Rate Metrics */}
        <div className="flex items-center justify-between pt-1">
          <div className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border flex items-center gap-1.5 ${health.color}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            {health.label}
          </div>

          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black font-mono text-slate-900 tracking-tight leading-none">
              {presentPct}%
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              RATE
            </span>
          </div>
        </div>
      </div>

      {/* 2. CAPACITY SUMMARY ROW */}
      <div className="flex items-center justify-between text-xs bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-indigo-600" />
          <span className="text-slate-600 font-medium">Batch Enrollment:</span>
          <strong className="font-mono text-slate-900 text-sm">{totalStudents}</strong>
        </div>
        <div className="flex items-center gap-2.5 text-slate-500 text-[11px]">
          <span>Logged: <strong className="font-mono text-emerald-600">{presentVal}</strong></span>
          <span>•</span>
          <span>Unregistered: <strong className="font-mono text-rose-500">{absentVal}</strong></span>
        </div>
      </div>

      {/* 3. RECHARTS STACKED BAR CHART */}
      <div className="w-full h-5 bg-slate-100 rounded-lg overflow-hidden border border-slate-200/80 p-0.5">
        {totalStudents === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-[9px] font-bold text-slate-400 uppercase tracking-wider">
            No Active Classroom Session Data
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={barData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <XAxis type="number" hide domain={[0, totalStudents]} />
              <YAxis type="category" dataKey="name" hide />
              <Tooltip
                cursor={false}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 text-white text-[11px] p-2.5 rounded-lg shadow-xl space-y-1 font-mono">
                        {payload.map((entry, index) => (
                          <div key={index} className="flex justify-between gap-4">
                            <span style={{ color: entry.color }} className="font-bold">
                              {entry.name}:
                            </span>
                            <span>{entry.value} ({Math.round((entry.value / totalStudents) * 100)}%)</span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="Present" stackId="a" fill="#10b981" radius={[4, 0, 0, 4]} />
              <Bar dataKey="Late" stackId="a" fill="#f59e0b" />
              <Bar dataKey="Absent" stackId="a" fill="#f43f5e" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* 4. DETAILED METRICS CARDS GRID */}
      <div className="grid grid-cols-3 gap-2.5 pt-1">
        {/* Present Card */}
        <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Present
            </span>
            <span className="text-[10px] font-bold font-mono text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded">
              {presentPct}%
            </span>
          </div>
          <div className="text-lg font-black font-mono text-emerald-950">
            {presentVal} <span className="text-[10px] font-semibold text-emerald-700">students</span>
          </div>
        </div>

        {/* Late Join Card */}
        <div className="p-3 bg-amber-50/60 border border-amber-100 rounded-xl space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-600" />
              Late Join
            </span>
            <span className="text-[10px] font-bold font-mono text-amber-700 bg-amber-100/80 px-1.5 py-0.5 rounded">
              {latePct}%
            </span>
          </div>
          <div className="text-lg font-black font-mono text-amber-950">
            {lateVal} <span className="text-[10px] font-semibold text-amber-700">students</span>
          </div>
        </div>

        {/* Absent Card */}
        <div className="p-3 bg-rose-50/60 border border-rose-100 rounded-xl space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-rose-800 uppercase tracking-wider flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-rose-600" />
              Absent
            </span>
            <span className="text-[10px] font-bold font-mono text-rose-700 bg-rose-100/80 px-1.5 py-0.5 rounded">
              {absentPct}%
            </span>
          </div>
          <div className="text-lg font-black font-mono text-rose-950">
            {absentVal} <span className="text-[10px] font-semibold text-rose-700">students</span>
          </div>
        </div>
      </div>

    </div>
  );
}