import { X, FileText, User, Users, Calendar, Shield } from 'lucide-react';

export function NotificationDetailsModal({ notification, onClose }) {
  if (!notification) return null;

  const getPriorityStyle = (priority) => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 sm:p-6 w-full max-w-lg shadow-xl text-slate-800">
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 tracking-tight">
            <FileText className="w-4 h-4 text-slate-700" />
            Notification Details
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-lg transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="space-y-4">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Title</span>
            <p className="text-sm font-bold text-slate-900 mt-0.5">{notification.title}</p>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Message</span>
            <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 text-xs text-slate-700 mt-1 leading-relaxed whitespace-pre-wrap">
              {notification.message}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs border-t border-slate-100 pt-4">
            <div>
              <span className="text-slate-400 font-bold block text-[10px] uppercase flex items-center gap-1">
                <User className="w-3 h-3" /> Sender
              </span>
              <span className="text-slate-800 font-medium mt-0.5 block truncate">
                {notification.sender_id} ({notification.sender_role})
              </span>
            </div>

            <div>
              <span className="text-slate-400 font-bold block text-[10px] uppercase flex items-center gap-1">
                <Users className="w-3 h-3" /> Recipient
              </span>
              <span className="text-slate-800 font-medium mt-0.5 block truncate">
                {notification.recipient_type} {notification.recipient_id && `(${notification.recipient_id})`}
              </span>
            </div>

            <div>
              <span className="text-slate-400 font-bold block text-[10px] uppercase flex items-center gap-1">
                <Shield className="w-3 h-3" /> Priority
              </span>
              <span className={`inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${getPriorityStyle(notification.priority)}`}>
                {notification.priority}
              </span>
            </div>

            <div>
              <span className="text-slate-400 font-bold block text-[10px] uppercase flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Date & Time
              </span>
              <span className="text-slate-800 font-mono text-[11px] mt-0.5 block">
                {new Date(notification.created_at).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end pt-4 mt-5 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 h-9 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotificationDetailsModal;