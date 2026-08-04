import { ClipboardList, X } from 'lucide-react';

export const ActivityLogDrawer = ({ logs, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-sm h-full p-5 sm:p-6 shadow-2xl flex flex-col space-y-4 border-l border-slate-200/80 animate-in slide-in-from-right duration-200">
        
        {/* Drawer Header */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2 tracking-tight">
            <ClipboardList className="w-4 h-4 text-slate-700" />
            Live Session Activity Logs
          </h3>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-lg transition cursor-pointer"
            aria-label="Close Drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Activity Logs Stream */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs custom-scrollbar">
          {logs && logs.length > 0 ? (
            logs.map((log) => (
              <div 
                key={log.id} 
                className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/70 text-slate-700 font-mono text-[11px] leading-relaxed"
              >
                <span className="text-slate-900 font-bold">[{log.timestamp}]</span> {log.action}
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              No activity logged yet for this session.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityLogDrawer;