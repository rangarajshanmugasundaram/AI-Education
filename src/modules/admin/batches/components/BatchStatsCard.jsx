import React from 'react';

export default function BatchStatsCard({ label, value, icon: IconComponent, color = 'text-slate-900', bgColor = 'bg-slate-50' }) {
  return (
    <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-xs flex items-center justify-between gap-3">
      <div className="space-y-1">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">{label}</span>
        <span className={`text-xl font-bold font-mono ${color}`}>{value}</span>
      </div>
      {IconComponent && (
        <div className={`p-2.5 rounded-lg border border-slate-100 ${bgColor} shrink-0`}>
          <IconComponent className={`w-5 h-5 ${color}`} />
        </div>
      )}
    </div>
  );
}