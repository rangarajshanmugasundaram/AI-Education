import React from 'react';

export default function RecordingStatsCard({ total, ready, processing }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-sm">
        <span className="text-2xl font-black text-slate-800">{total}</span>
        <span className="block text-[10px] font-bold uppercase text-slate-400 mt-1">Total Videos</span>
      </div>
      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-center shadow-sm">
        <span className="text-2xl font-black text-emerald-700">{ready}</span>
        <span className="block text-[10px] font-bold uppercase text-emerald-600 mt-1">Ready</span>
      </div>
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-center shadow-sm">
        <span className="text-2xl font-black text-amber-700">{processing}</span>
        <span className="block text-[10px] font-bold uppercase text-amber-600 mt-1">Processing</span>
      </div>
    </div>
  );
}