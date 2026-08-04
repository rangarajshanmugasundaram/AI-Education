import { Hand, UserCheck } from 'lucide-react';

export const RaiseHandList = ({ 
  raisedHands = [], 
  onDismiss, 
  currentUser, 
  onToggleRaiseHand 
}) => {
  const isSelfHandRaised = raisedHands.some(
    (student) => student.id === currentUser?.id || student.email === currentUser?.email
  );

  return (
    <div className="w-full flex-1 flex flex-col h-full overflow-hidden">
      
      <div className="p-2 border-b border-slate-100 bg-slate-50/50 shrink-0 mb-2">
        <button
          onClick={() => onToggleRaiseHand(!isSelfHandRaised)}
          className={`w-full h-9 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-xs ${
            isSelfHandRaised
              ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold border border-amber-600'
              : 'bg-slate-900 hover:bg-slate-800 text-white'
          }`}
        >
          <Hand className="w-3.5 h-3.5" />
          <span>{isSelfHandRaised ? 'Lower My Hand' : 'Raise Hand to Ask Question'}</span>
        </button>
      </div>

      <div className="w-full flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {raisedHands.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-xs text-center p-6 h-full">
            <Hand className="w-8 h-8 mb-2 text-slate-300 stroke-1" />
            <p className="font-medium">No one has raised their hand yet.</p>
          </div>
        ) : (
          raisedHands.map((student) => {
            const isMe = student.id === currentUser?.id || student.email === currentUser?.email;

            return (
              <div
                key={student.id || student.email}
                className={`p-3 rounded-lg border flex items-center justify-between text-xs transition shadow-xs ${
                  isMe 
                    ? 'bg-amber-50/80 border-amber-200 text-amber-900' 
                    : 'bg-slate-50 border-slate-200/80 text-slate-800'
                }`}
              >
                <div className="min-w-0 pr-2 flex items-center gap-2">
                  <Hand className="w-4 h-4 text-amber-600 shrink-0" />
                  <div className="truncate">
                    <div className="font-bold text-xs truncate flex items-center gap-1.5 text-slate-900">
                      {student.name} {isMe && <span className="text-[10px] text-amber-700 font-normal">(You)</span>}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      Raised hand to speak
                    </div>
                  </div>
                </div>

                {currentUser?.role === 'Trainer' && (
                  <button
                    onClick={() => onDismiss(student.id || student.email)}
                    className="bg-white hover:bg-rose-50 text-rose-600 border border-slate-200 hover:border-rose-200 font-bold px-2.5 h-7 rounded-md text-[10px] transition cursor-pointer shrink-0"
                    title="Lower this participant's hand"
                  >
                    Lower
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RaiseHandList;