import { Calendar, CheckCircle2, ArrowRight } from 'lucide-react';

export function NotificationCard({ notification, onView, onMarkAsRead }) {
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'Emergency':
      case 'High':
        return 'bg-rose-50 text-rose-700 border-rose-200/80';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border-amber-200/80';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200/80';
    }
  };

  return (
    <div
      className={`bg-white border rounded-xl p-4 sm:p-5 transition shadow-xs hover:border-slate-300 flex flex-col justify-between gap-4 ${
        !notification.read_status ? 'border-slate-300/80 bg-slate-50/40' : 'border-slate-200/80'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {!notification.read_status && (
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
            )}
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
              {notification.title}
            </h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
            {notification.message}
          </p>
        </div>

        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold shrink-0 border ${getPriorityStyle(notification.priority)}`}>
          {notification.priority}
        </span>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 pt-3">
        <span className="flex items-center gap-1 font-mono">
          <Calendar className="w-3 h-3 text-slate-400" />
          {new Date(notification.created_at).toLocaleDateString()}
        </span>
        
        <div className="flex items-center gap-2">
          {!notification.read_status && (
            <button
              onClick={() => onMarkAsRead(notification.id)}
              className="text-emerald-600 hover:text-emerald-700 text-xs font-semibold cursor-pointer flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Mark Read
            </button>
          )}
          <button
            onClick={() => onView(notification)}
            className="h-7 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-md transition cursor-pointer flex items-center gap-1"
          >
            <span>View</span>
            <ArrowRight className="w-3 h-3 text-slate-600" />
          </button>
        </div>
      </div>
    </div>
  );
}