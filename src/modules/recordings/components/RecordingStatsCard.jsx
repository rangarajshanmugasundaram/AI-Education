import { Video, CheckCircle2, Clock } from 'lucide-react';

export default function RecordingStatsCard({ total, ready, processing }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Videos</p>
          <p className="text-2xl font-bold font-mono text-slate-900">{total}</p>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-600">
          <Video className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Ready</p>
          <p className="text-2xl font-bold font-mono text-emerald-700">{ready}</p>
        </div>
        <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100 text-emerald-600">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Processing</p>
          <p className="text-2xl font-bold font-mono text-amber-700">{processing}</p>
        </div>
        <div className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-100 text-amber-600">
          <Clock className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}