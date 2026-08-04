import { Play, Square, Lock, Unlock, VolumeX } from 'lucide-react';

export const SessionControls = ({ sessionState, onStart, onEnd, onToggleLock, onMuteAll }) => {
  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-xs">
      <div className="flex items-center gap-2">
        {!sessionState.isLive ? (
          <button
            type="button"
            onClick={onStart}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 h-9 rounded-lg transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Start Session</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onEnd}
            className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3.5 h-9 rounded-lg transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
          >
            <Square className="w-3.5 h-3.5 fill-white" />
            <span>End Session</span>
          </button>
        )}

        <button
          type="button"
          onClick={onToggleLock}
          className={`text-xs font-semibold px-3.5 h-9 rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
            sessionState.isLocked 
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
          }`}
        >
          {sessionState.isLocked ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <Unlock className="w-3.5 h-3.5 text-slate-400" />}
          <span>{sessionState.isLocked ? 'Locked' : 'Lock Session'}</span>
        </button>
      </div>

      <button
        type="button"
        onClick={onMuteAll}
        className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3.5 h-9 rounded-lg border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
      >
        <VolumeX className="w-3.5 h-3.5 text-slate-400" />
        <span>Mute All Participants</span>
      </button>
    </div>
  );
};

export default SessionControls;