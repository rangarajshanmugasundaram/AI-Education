export function NotificationStatsCard({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Notifications Card */}
      <div className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Notifications</p>
          <p className="text-2xl font-black text-blue-950 mt-1">{stats.total}</p>
        </div>
        <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 text-lg font-bold">
          📊
        </div>
      </div>

      {/* Unread Messages Card */}
      <div className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Unread Messages</p>
          <p className="text-2xl font-black text-amber-600 mt-1">{stats.unread}</p>
        </div>
        <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 text-lg font-bold">
          ✉️
        </div>
      </div>

      {/* High Priority Card */}
      <div className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">High Priority</p>
          <p className="text-2xl font-black text-rose-600 mt-1">{stats.highPriority}</p>
        </div>
        <div className="w-11 h-11 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 text-lg font-bold">
          🔥
        </div>
      </div>
    </div>
  );
}