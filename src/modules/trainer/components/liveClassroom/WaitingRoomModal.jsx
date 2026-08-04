import { Clock, X, Check, UserX } from 'lucide-react';

export const WaitingRoomModal = ({ waitingList = [], onApprove, onReject, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl max-w-md w-full p-5 sm:p-6 shadow-xl border border-slate-200/80 space-y-4">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-900 text-xs sm:text-sm tracking-tight flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-700" />
            Live Waiting Room ({waitingList.length})
          </h3>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-lg transition cursor-pointer"
            aria-label="Close Modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List Body */}
        <div className="max-h-60 overflow-y-auto space-y-2 custom-scrollbar">
          {waitingList.length === 0 ? (
            <div className="text-xs text-slate-400 text-center py-8">
              Waiting room is currently empty.
            </div>
          ) : (
            waitingList.map((user) => (
              <div 
                key={user.id} 
                className="flex justify-between items-center p-3 border border-slate-200/80 rounded-lg bg-slate-50/50 text-xs"
              >
                <div className="min-w-0 pr-2">
                  <div className="font-bold text-slate-900 truncate">{user.name}</div>
                  <div className="text-[10px] text-slate-400 truncate">{user.email}</div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button 
                    onClick={() => onApprove(user.id)} 
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-7 px-3 rounded-md text-[10px] transition cursor-pointer flex items-center gap-1 active:scale-95"
                  >
                    <Check className="w-3 h-3 text-white" />
                    Allow
                  </button>
                  <button 
                    onClick={() => onReject(user.id)} 
                    className="bg-white hover:bg-rose-50 text-rose-600 border border-slate-200 hover:border-rose-200 font-bold h-7 px-2.5 rounded-md text-[10px] transition cursor-pointer flex items-center gap-1 active:scale-95"
                  >
                    <UserX className="w-3 h-3 text-rose-600" />
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default WaitingRoomModal;