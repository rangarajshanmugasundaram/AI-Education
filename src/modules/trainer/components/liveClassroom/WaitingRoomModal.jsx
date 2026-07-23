export const WaitingRoomModal = ({ waitingList, onApprove, onReject, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="font-bold text-slate-900 text-sm">⏳ Live Waiting Room ({waitingList.length})</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
        </div>

        <div className="max-h-60 overflow-y-auto space-y-2">
          {waitingList.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">Waiting room is currently empty.</p>
          ) : (
            waitingList.map((user) => (
              <div key={user.id} className="flex justify-between items-center p-3 border rounded-xl bg-slate-50 text-xs">
                <div>
                  <div className="font-bold text-slate-800">{user.name}</div>
                  <div className="text-[10px] text-slate-400">{user.email}</div>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => onApprove(user.id)} className="bg-emerald-600 text-white font-bold px-3 py-1 rounded-lg text-[10px]">Allow</button>
                  <button onClick={() => onReject(user.id)} className="bg-rose-100 text-rose-700 font-bold px-3 py-1 rounded-lg text-[10px]">Reject</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};