export const SessionControls = ({ sessionState, onStart, onEnd, onToggleLock, onMuteAll }) => {
  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-lg">
      <div className="flex items-center gap-2">
        {!sessionState.isLive ? (
          <button
            type="button"
            onClick={onStart}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            ▶ Start Session
          </button>
        ) : (
          <button
            type="button"
            onClick={onEnd}
            className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            ⏹ End Session
          </button>
        )}

        <button
          type="button"
          onClick={onToggleLock}
          className={`text-xs font-bold px-3 py-2 rounded-xl border transition flex items-center gap-1.5 cursor-pointer ${
            sessionState.isLocked 
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30' 
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
          }`}
        >
          {sessionState.isLocked ? '🔒 Session Locked' : '🔓 Lock Session'}
        </button>
      </div>

      <button
        type="button"
        onClick={onMuteAll}
        className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold px-3 py-2 rounded-xl border border-rose-500/40 transition flex items-center gap-1.5 cursor-pointer"
      >
        🤫 Mute All Participants
      </button>
    </div>
  );
};

export default SessionControls;