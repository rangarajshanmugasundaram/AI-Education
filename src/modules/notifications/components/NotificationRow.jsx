export function NotificationRow({
  notification,
  onView,
  onEdit,
  onDelete,
  onMarkAsRead,
  isStudent = false,
}) {
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-rose-50 text-rose-600 border-rose-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-600 border-amber-200';
      default:
        return 'bg-emerald-50 text-emerald-600 border-emerald-200';
    }
  };

  return (
    <tr className="hover:bg-blue-50/40 transition border-b border-slate-100">
      <td className="p-4">
        <div className="flex items-center gap-2.5">
          {!notification.read_status && (
            <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 animate-pulse" />
          )}
          <div>
            <p className="font-bold text-blue-950 text-xs">{notification.title}</p>
            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{notification.message}</p>
          </div>
        </div>
      </td>

      <td className="p-4 text-xs font-medium text-slate-600">{notification.sender_id}</td>

      <td className="p-4">
        <span
          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${getPriorityBadge(
            notification.priority
          )}`}
        >
          {notification.priority}
        </span>
      </td>

      <td className="p-4 text-xs text-slate-600">
        <span className="bg-slate-100 text-slate-700 font-semibold px-2.5 py-1 rounded-lg text-[10px]">
          {notification.recipient_type}
        </span>
      </td>

      <td className="p-4 text-[11px] font-medium text-slate-500">
        {new Date(notification.created_at).toLocaleDateString()}
      </td>

      <td className="p-4">
        {notification.read_status ? (
          <span className="text-[11px] text-slate-400 font-medium">Read</span>
        ) : (
          <span className="text-[11px] text-blue-600 font-bold">Unread</span>
        )}
      </td>

      <td className="p-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView(notification)}
            className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg text-xs transition cursor-pointer"
            title="View Details"
          >
          View
          </button>

          {!notification.read_status && (
            <button
              onClick={() => onMarkAsRead(notification.id)}
              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg text-xs transition cursor-pointer"
              title="Mark as Read"
            >
              ✓
            </button>
          )}

          {!isStudent && (
            <>
              <button
                onClick={() => onEdit(notification)}
                className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-xs transition cursor-pointer"
                title="Edit"
              >
                ✏️
              </button>
              <button
                onClick={() => onDelete(notification.id)}
                className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs transition cursor-pointer"
                title="Delete"
              >
                🗑️
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}