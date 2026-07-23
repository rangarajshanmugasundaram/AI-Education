export const ActivityLogDrawer = ({ logs, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-sm flex justify-end">
      <div className="bg-white w-full max-w-sm h-full p-6 shadow-2xl flex flex-col space-y-4 animate-in slide-in-from-right">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="font-bold text-slate-900 text-sm">📋 Live Session Activity Logs</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
          {logs.map((log) => (
            <div key={log.id} className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 text-slate-600 font-mono text-[11px]">
              <span className="text-indigo-600 font-bold">[{log.timestamp}]</span> {log.action}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};