import { useState } from 'react';

export const ParticipantList = ({ participants, onMute, onRequestCamera, onRemove}) => {
  const [search, setSearch] = useState('');

  const filtered = participants.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col h-full overflow-hidden">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search participant..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
      />

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {filtered.map((p) => (
          <div key={p.id} className="p-2.5 border border-slate-100 hover:border-slate-200 rounded-xl bg-slate-50/50 flex items-center justify-between text-xs gap-2">
            <div className="min-w-0">
              <div className="font-bold text-slate-800 truncate flex items-center gap-1.5">
                {p.name}
                <span className={`w-2 h-2 rounded-full ${p.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              </div>
              <div className="text-[10px] text-slate-400 truncate">{p.email}</div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => onMute(p.id)}
                title={p.isMuted ? 'Muted' : 'Unmuted'}
                className={`p-1.5 rounded-lg border text-[11px] ${p.isMuted ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-white border-slate-200 text-slate-600'}`}
              >
                {p.isMuted ? '🎙️❌' : '🎙️'}
              </button>

              <button
                onClick={() => onRequestCamera(p.id)}
                title="Request Camera"
                className="p-1.5 rounded-lg border bg-white border-slate-200 text-slate-600 text-[11px]"
              >
                📷
              </button>

              <button
                onClick={() => onRemove(p.id)}
                title="Remove Participant"
                className="p-1.5 rounded-lg border border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100 text-[11px]"
              >
                🚫
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};