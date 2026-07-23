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
      
      <div className="p-2 border-b border-slate-100 bg-slate-50 shrink-0 mb-2">
        <button
          onClick={() => onToggleRaiseHand(!isSelfHandRaised)}
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95 ${
            isSelfHandRaised
              ? 'bg-amber-500 hover:bg-amber-600 text-white border border-amber-600'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          <span className="text-sm">✋</span>
          <span>{isSelfHandRaised ? 'Lower My Hand' : 'Raise Hand to Ask Question'}</span>
        </button>
      </div>

      <div className="w-full flex-1 overflow-y-auto space-y-2 pr-1">
        {raisedHands.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-xs text-center p-6 h-full">
            <span className="text-3xl mb-2 opacity-50">✋</span>
            <p className="font-medium">No one has raised their hand yet.</p>
          </div>
        ) : (
          raisedHands.map((student) => {
            const isMe = student.id === currentUser?.id || student.email === currentUser?.email;

            return (
              <div
                key={student.id || student.email}
                className={`p-3 rounded-xl border flex items-center justify-between text-xs transition shadow-sm ${
                  isMe 
                    ? 'bg-amber-100/80 border-amber-300 text-amber-900' 
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <div className="min-w-0 pr-2 flex items-center gap-2">
                  <span className="text-base">✋</span>
                  <div className="truncate">
                    <div className="font-bold truncate flex items-center gap-1.5">
                      {student.name} {isMe && <span className="text-[10px] text-amber-700 font-normal">(You)</span>}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      Raised hand to speak
                    </div>
                  </div>
                </div>

                {currentUser?.role === 'Trainer' && (
                  <button
                    onClick={() => onDismiss(student.id || student.email)}
                    className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold px-2.5 py-1 rounded-lg text-[10px] transition cursor-pointer shrink-0"
                    title="Lower this participant's hand"
                  >
                    Lower Hand
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