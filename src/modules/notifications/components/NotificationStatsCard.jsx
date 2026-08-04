import { BarChart2, Mail, Flame } from 'lucide-react';

export function NotificationStatsCard({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Total Notifications */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Notifications</p>
          <p className="text-2xl font-bold font-mono text-slate-900">{stats.total}</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700">
          <BarChart2 className="w-5 h-5 text-slate-700" />
        </div>
      </div>

      {/* Unread Messages */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Unread Messages</p>
          <p className="text-2xl font-bold font-mono text-amber-600">{stats.unread}</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-amber-50/60 border border-amber-100 flex items-center justify-center text-amber-600">
          <Mail className="w-5 h-5 text-amber-600" />
        </div>
      </div>

      {/* High Priority */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">High Priority</p>
          <p className="text-2xl font-bold font-mono text-rose-600">{stats.highPriority}</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-rose-50/60 border border-rose-100 flex items-center justify-center text-rose-600">
          <Flame className="w-5 h-5 text-rose-600" />
        </div>
      </div>
    </div>
  );
}