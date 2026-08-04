import { Bell, X } from 'lucide-react';

export const NotificationToast = ({ notifications = [], onDismiss }) => {
  if (!notifications || notifications.length === 0) return null;

  return (
    <div style={{ zIndex: 10000 }} className="fixed top-4 left-4 flex flex-col gap-2 max-w-xs w-full pointer-events-none">
      {notifications.map((n) => (
        <div
          key={n.id}
          className="pointer-events-auto bg-slate-900/90 backdrop-blur-xs text-white text-xs px-3.5 py-2.5 rounded-xl shadow-xl border border-slate-800 flex items-center justify-between gap-2.5 transition hover:bg-slate-800"
        >
          <div className="flex items-center gap-2 truncate">
            <Bell className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-medium text-slate-100 text-xs truncate">{n.message}</span>
          </div>
          {onDismiss && (
            <button
              type="button"
              onClick={() => onDismiss(n.id)}
              className="text-slate-400 hover:text-white p-1 rounded-md transition shrink-0 cursor-pointer"
              aria-label="Dismiss Notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default NotificationToast;