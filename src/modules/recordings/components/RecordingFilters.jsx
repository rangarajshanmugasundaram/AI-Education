import { Search } from 'lucide-react';

export default function RecordingFilters({ searchTerm, setSearchTerm, selectedStatus, setSelectedStatus }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white border border-slate-200/80 rounded-xl p-3.5 sm:p-4 shadow-xs">
      <div className="flex flex-1 items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus-within:bg-white focus-within:border-slate-900 transition-all">
        <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search recordings by title..."
          className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 outline-none"
        />
      </div>

      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
        className="w-full sm:w-48 bg-slate-50 border border-slate-200 rounded-lg h-9 px-3 text-xs text-slate-700 outline-none focus:border-slate-900 cursor-pointer font-medium"
      >
        <option value="All">All Statuses</option>
        <option value="Ready">Ready</option>
        <option value="Processing">Processing</option>
      </select>
    </div>
  );
}