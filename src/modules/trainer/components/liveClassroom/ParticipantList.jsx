import { useState } from 'react';
import { Search, Mic, MicOff, Video, UserX } from 'lucide-react';

export const ParticipantList = ({ participants = [], onMute, onRequestCamera, onRemove }) => {
  const [search, setSearch] = useState('');

  const filtered = participants.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col h-full overflow-hidden">
      {/* Search Input */}
      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 mb-2 focus-within:bg-white focus-within:border-slate-900 transition-all">
        <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Search participant..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs bg-transparent outline-none text-slate-800 placeholder-slate-400"
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {filtered.map((p) => (
          <div key={p.id} className="p-2.5 border border-slate-200/80 hover:border-slate-300 rounded-lg bg-slate-50/50 flex items-center justify-between text-xs gap-2">
            <div className="min-w-0">
              <div className="font-bold text-slate-900 text-xs truncate flex items-center gap-1.5">
                {p.name}
                <span className={`w-2 h-2 rounded-full shrink-0 ${p.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              </div>
              <div className="text-[10px] text-slate-400 truncate">{p.email}</div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => onMute(p.id)}
                title={p.isMuted ? 'Muted' : 'Unmuted'}
                className={`p-1.5 rounded-md border text-[11px] transition-all cursor-pointer ${
                  p.isMuted ? 'bg-rose-50 border-rose-200/80 text-rose-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {p.isMuted ? <MicOff className="w-3.5 h-3.5 text-rose-600" /> : <Mic className="w-3.5 h-3.5 text-slate-600" />}
              </button>

              <button
                onClick={() => onRequestCamera(p.id)}
                title="Request Camera"
                className="p-1.5 rounded-md border bg-white border-slate-200 text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              >
                <Video className="w-3.5 h-3.5 text-slate-600" />
              </button>

              <button
                onClick={() => onRemove(p.id)}
                title="Remove Participant"
                className="p-1.5 rounded-md border border-slate-200 hover:border-rose-200 text-rose-600 bg-white hover:bg-rose-50 transition-all cursor-pointer"
              >
                <UserX className="w-3.5 h-3.5 text-rose-600" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParticipantList;