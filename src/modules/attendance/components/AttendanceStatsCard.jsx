export default function AttendanceStatsCard({ title, value, icon, color }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between transition-all duration-200 hover:border-slate-300">
      <div className="space-y-1">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{title}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-bold text-slate-900 font-mono tracking-tight">{value}</p>
        </div>
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 border border-slate-100 text-lg">
        {icon}
      </div>
    </div>
  );
}