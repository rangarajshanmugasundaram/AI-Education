import { Search, RefreshCw } from 'lucide-react';

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
    <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
      {/* Mobile Full-Width Search Input */}
      <div className="flex w-full sm:flex-1 items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 sm:py-1.5 focus-within:bg-white focus-within:border-slate-900 transition-all">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Search notifications..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 outline-none"
        />
      </div>

      {/* Select Filters - Stacked on Mobile, Inline on Desktop */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full sm:w-auto">
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full sm:w-auto bg-slate-50 border border-slate-200 text-slate-700 text-xs px-2.5 sm:px-3 h-9 sm:h-8 rounded-lg focus:outline-none focus:border-slate-900 font-medium cursor-pointer"
        >
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Emergency">Emergency</option>
        </select>

        <select
          value={recipientType}
          onChange={(e) => setRecipientType(e.target.value)}
          className="w-full sm:w-auto bg-slate-50 border border-slate-200 text-slate-700 text-xs px-2.5 sm:px-3 h-9 sm:h-8 rounded-lg focus:outline-none focus:border-slate-900 font-medium cursor-pointer"
        >
          <option value="">All Recipients</option>
          <option value="All">All Users</option>
          <option value="Batch">Batch</option>
          <option value="User">Specific User</option>
        </select>

        <select
          value={readStatus}
          onChange={(e) => setReadStatus(e.target.value)}
          className="col-span-2 sm:col-span-1 w-full sm:w-auto bg-slate-50 border border-slate-200 text-slate-700 text-xs px-2.5 sm:px-3 h-9 sm:h-8 rounded-lg focus:outline-none focus:border-slate-900 font-medium cursor-pointer"
        >
          <option value="">All Statuses</option>
          <option value="false">Unread</option>
          <option value="true">Read</option>
        </select>

        <button
          onClick={onRefresh}
          className="col-span-2 sm:col-span-1 h-9 sm:h-8 w-full sm:w-8 flex items-center justify-center bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-lg transition cursor-pointer active:scale-95"
          title="Refresh List"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="sm:hidden text-xs font-semibold ml-2">Refresh</span>
        </button>
      </div>
    </div>
  );
}