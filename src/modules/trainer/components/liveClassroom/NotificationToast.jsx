export const NotificationToast = ({ notifications = [], onDismiss }) => {
  if (!notifications || notifications.length === 0) return null;

  return (
    <div style={{ zIndex: 10000 }} className="fixed top-4 left-4 flex flex-col gap-2 max-w-xs w-full pointer-events-none">
      {notifications.map((n) => (
        <div
          key={n.id}
          className="pointer-events-auto bg-slate-900/90 backdrop-blur-md text-white text-xs px-3 py-2 rounded-lg shadow-xl border border-indigo-500/40 flex items-center justify-between gap-2 transition hover:bg-slate-800"
        >
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-xs">🔔</span>
            <span className="font-medium text-slate-100 truncate">{n.message}</span>
          </div>
          {onDismiss && (
            <button
              type="button"
              onClick={() => onDismiss(n.id)}
              className="text-slate-400 hover:text-white text-[10px] font-bold shrink-0 ml-2 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default NotificationToast;