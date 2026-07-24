export function NotificationCard({ notification, onView, onMarkAsRead }) {
  return (
    <div
      className={`bg-white border rounded-2xl p-5 transition shadow-sm hover:shadow-md flex flex-col justify-between gap-4 ${
        !notification.read_status ? 'border-blue-300 bg-blue-50/20' : 'border-blue-100'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            {!notification.read_status && (
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0" />
            )}
            <h3 className="text-sm font-bold text-blue-950">{notification.title}</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
            {notification.message}
          </p>
        </div>

        <span
          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold shrink-0 border ${
            notification.priority === 'High'
              ? 'bg-rose-50 text-rose-600 border-rose-200'
              : notification.priority === 'Medium'
              ? 'bg-amber-50 text-amber-600 border-amber-200'
              : 'bg-emerald-50 text-emerald-600 border-emerald-200'
          }`}
        >
          {notification.priority}
        </span>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 pt-3">
        <span>📅 {new Date(notification.created_at).toLocaleDateString()}</span>
        <div className="flex items-center gap-3">
          {!notification.read_status && (
            <button
              onClick={() => onMarkAsRead(notification.id)}
              className="text-emerald-600 hover:text-emerald-700 font-bold cursor-pointer"
            >
              Mark Read
            </button>
          )}
          <button
            onClick={() => onView(notification)}
            className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold rounded-lg transition cursor-pointer"
          >
            View →
          </button>
        </div>
      </div>
    </div>
  );
}