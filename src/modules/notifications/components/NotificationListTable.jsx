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
      <div className="bg-white border border-blue-100 rounded-2xl p-8 text-center text-xs text-slate-500 shadow-sm">
        Loading notifications...
      </div>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <div className="bg-white border border-blue-100 rounded-2xl p-12 text-center text-xs text-slate-400 shadow-sm">
        📢 No notifications found.
      </div>
    );
  }

  return (
    <div className="bg-white border border-blue-100 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#F8FAFC] text-slate-400 uppercase text-[10px] font-bold border-b border-slate-100">
            <tr>
              <th className="p-4">Title & Message</th>
              <th className="p-4">Sender</th>
              <th className="p-4">Priority</th>
              <th className="p-4">Recipient</th>
              <th className="p-4">Created Date</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
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
  );
}