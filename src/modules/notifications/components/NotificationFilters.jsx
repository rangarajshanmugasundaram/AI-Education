export function NotificationFilters({
  searchTerm,
  setSearchTerm,
  priority,
  setPriority,
  recipientType,
  setRecipientType,
  readStatus,
  setReadStatus,
  onRefresh,
}) {
  return (
    <div className="bg-white border border-blue-100 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-sm">
      <div className="flex flex-1 min-w-[240px] items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2">
        <span className="text-xs text-slate-400">🔍</span>
        <input
          type="text"
          placeholder="Search notifications..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="bg-slate-50 border border-slate-200/80 text-slate-700 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
        >
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <select
          value={recipientType}
          onChange={(e) => setRecipientType(e.target.value)}
          className="bg-slate-50 border border-slate-200/80 text-slate-700 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
        >
          <option value="">All Recipients</option>
          <option value="All">All Users</option>
          <option value="Batch">Batch</option>
          <option value="User">Specific User</option>
        </select>

        <select
          value={readStatus}
          onChange={(e) => setReadStatus(e.target.value)}
          className="bg-slate-50 border border-slate-200/80 text-slate-700 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
        >
          <option value="">All Statuses</option>
          <option value="false">Unread</option>
          <option value="true">Read</option>
        </select>

        <button
          onClick={onRefresh}
          className="p-2 bg-slate-100 hover:bg-slate-200/70 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
          title="Refresh List"
        >
          🔄
        </button>
      </div>
    </div>
  );
}