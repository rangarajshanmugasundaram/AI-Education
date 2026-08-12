import React from 'react';
import { BookOpen, Users, AlertTriangle, Award, CheckCircle2 } from 'lucide-react';

export default function StatsOverviewCards({ assignments = [] }) {
  const totalAssignments = assignments.length;
  const activeCount = assignments.filter(a => a.status === 'Published' || a.status === 'Open').length;
  const totalSubmissions = assignments.reduce((acc, curr) => acc + (curr.total_submissions || 0), 0);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
        <div className="flex justify-between items-center text-slate-400">
          <span className="text-[10px] font-bold uppercase tracking-wider">Total Coursework</span>
          <BookOpen className="w-4 h-4 text-indigo-600" />
        </div>
        <div className="text-xl font-black text-slate-900 font-mono">{totalAssignments}</div>
        <p className="text-[10px] text-slate-400">{activeCount} Currently Active</p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
        <div className="flex justify-between items-center text-slate-400">
          <span className="text-[10px] font-bold uppercase tracking-wider">Total Submissions</span>
          <Users className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="text-xl font-black text-slate-900 font-mono">{totalSubmissions}</div>
        <p className="text-[10px] text-slate-400">Across all active batches</p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
        <div className="flex justify-between items-center text-slate-400">
          <span className="text-[10px] font-bold uppercase tracking-wider">Active Assignments</span>
          <CheckCircle2 className="w-4 h-4 text-indigo-500" />
        </div>
        <div className="text-xl font-black text-emerald-600 font-mono">{activeCount}</div>
        <p className="text-[10px] text-slate-400">Open for submissions</p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
        <div className="flex justify-between items-center text-slate-400">
          <span className="text-[10px] font-bold uppercase tracking-wider">Drafts / Inactive</span>
          <AlertTriangle className="w-4 h-4 text-amber-500" />
        </div>
        <div className="text-xl font-black text-slate-800 font-mono">{totalAssignments - activeCount}</div>
        <p className="text-[10px] text-slate-400">Unpublished or closed</p>
      </div>
    </div>
  );
}