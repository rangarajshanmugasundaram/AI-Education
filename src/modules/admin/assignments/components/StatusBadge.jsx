import React from 'react';
import { AlertTriangle, CheckCircle2, Clock, FileCheck } from 'lucide-react';

export default function StatusBadge({ status, isLate }) {
  const normalized = (status || '').toLowerCase();

  if (isLate) {
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 inline-flex items-center gap-1 font-mono">
        <AlertTriangle className="w-3 h-3" /> LATE
      </span>
    );
  }

  switch (normalized) {
    case 'open':
    case 'published':
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1 font-mono">
          <CheckCircle2 className="w-3 h-3" /> Published
        </span>
      );
    case 'closed':
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 inline-flex items-center gap-1 font-mono">
          <Clock className="w-3 h-3" /> Closed
        </span>
      );
    case 'graded':
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 inline-flex items-center gap-1 font-mono">
          <FileCheck className="w-3 h-3" /> Graded
        </span>
      );
    case 'pending evaluation':
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 inline-flex items-center gap-1 font-mono">
          <Clock className="w-3 h-3" /> Pending Review
        </span>
      );
    default:
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 inline-flex items-center gap-1 font-mono">
          Draft
        </span>
      );
  }
}