import { Eye, Check, Edit3, Trash2 } from 'lucide-react';

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
      case 'Emergency':
      case 'High':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <tr className="hover:bg-slate-50/60 transition border-b border-slate-100">
      <td className="p-3.5 pl-5">
        <div className="flex items-center gap-2.5">
          {!notification.read_status && (
            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
          )}
          <div>
            <p className="font-bold text-slate-900 text-xs">{notification.title}</p>
            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{notification.message}</p>
          </div>
        </div>
      </td>

      <td className="p-3.5 font-medium text-slate-600">{notification.sender_id}</td>

      <td className="p-3.5">
        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getPriorityBadge(notification.priority)}`}>
          {notification.priority}
        </span>
      </td>

      <td className="p-3.5">
        <span className="bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-md text-[10px]">
          {notification.recipient_type}
        </span>
      </td>

      <td className="p-3.5 font-mono text-[11px] text-slate-500">
        {new Date(notification.created_at).toLocaleDateString()}
      </td>

      <td className="p-3.5">
        {notification.read_status ? (
          <span className="text-[11px] text-slate-400 font-medium">Read</span>
        ) : (
          <span className="text-[11px] text-rose-600 font-bold">Unread</span>
        )}
      </td>

      <td className="p-3.5 pr-5">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onView(notification)}
            className="p-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-md transition cursor-pointer"
            title="View Details"
          >
            <Eye className="w-3.5 h-3.5 text-slate-600" />
          </button>

          {!notification.read_status && (
            <button
              onClick={() => onMarkAsRead(notification.id)}
              className="p-1.5 bg-white hover:bg-emerald-50 text-emerald-600 border border-slate-200 rounded-md transition cursor-pointer"
              title="Mark as Read"
            >
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            </button>
          )}

          {!isStudent && (
            <>
              <button
                onClick={() => onEdit(notification)}
                className="p-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-md transition cursor-pointer"
                title="Edit"
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-600" />
              </button>
              <button
                onClick={() => onDelete(notification.id)}
                className="p-1.5 bg-white hover:bg-rose-50 text-rose-600 border border-slate-200 rounded-md transition cursor-pointer"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}