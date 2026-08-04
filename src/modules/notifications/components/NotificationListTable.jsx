import { Inbox, Loader2, Eye, Check, Edit3, Trash2 } from 'lucide-react';
import { NotificationRow } from './NotificationRow';

export function NotificationListTable({
  notifications,
  loading,
  onView,
  onEdit,
  onDelete,
  onMarkAsRead,
  isStudent = false,
}) {
  if (loading) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-xl p-12 text-center text-xs text-slate-400 shadow-xs flex flex-col items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
        <span>Loading notifications...</span>
      </div>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <div className="bg-white border border-dashed border-slate-200 rounded-xl p-12 text-center text-xs text-slate-400 shadow-xs flex flex-col items-center justify-center gap-2">
        <Inbox className="w-8 h-8 text-slate-300" />
        <span>No notifications found.</span>
      </div>
    );
  }

  return (
    <>
      {/* 📱 MOBILE VIEW: Stacked Cards */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {notifications.map((n) => (
          <div 
            key={n.id} 
            className={`bg-white border rounded-xl p-4 flex flex-col gap-3 shadow-xs ${
              !n.read_status ? 'border-slate-300 bg-slate-50/40' : 'border-slate-200/80'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                {!n.read_status && <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />}
                <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded border bg-slate-100 border-slate-200 text-slate-700 shrink-0">
                {n.priority}
              </span>
            </div>

            <p className="text-xs text-slate-500 line-clamp-2">{n.message}</p>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
              <span className="font-mono">{new Date(n.created_at).toLocaleDateString()}</span>
              
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onView(n)}
                  className="p-1.5 bg-slate-100 rounded-md text-slate-700 cursor-pointer"
                  title="View"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                {!n.read_status && (
                  <button
                    onClick={() => onMarkAsRead(n.id)}
                    className="p-1.5 bg-emerald-50 text-emerald-600 rounded-md cursor-pointer"
                    title="Mark Read"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                )}
                {!isStudent && (
                  <>
                    <button
                      onClick={() => onEdit(n)}
                      className="p-1.5 bg-slate-100 text-slate-700 rounded-md cursor-pointer"
                      title="Edit"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(n.id)}
                      className="p-1.5 bg-rose-50 text-rose-600 rounded-md cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 💻 DESKTOP VIEW: Full Data Table */}
      <div className="hidden md:block bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/70 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-100">
              <tr>
                <th className="p-3.5 pl-5">Title & Message</th>
                <th className="p-3.5">Sender</th>
                <th className="p-3.5">Priority</th>
                <th className="p-3.5">Recipient</th>
                <th className="p-3.5">Created Date</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 pr-5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {notifications.map((notification) => (
                <NotificationRow
                  key={notification.id}
                  notification={notification}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onMarkAsRead={onMarkAsRead}
                  isStudent={isStudent}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}