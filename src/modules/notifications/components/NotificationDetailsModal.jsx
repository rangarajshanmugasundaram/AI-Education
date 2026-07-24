export function NotificationDetailsModal({ notification, onClose }) {
  if (!notification) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white border border-blue-100 rounded-2xl p-6 w-full max-w-lg shadow-2xl text-slate-800">
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-5 border-b border-blue-50 pb-3">
          <h2 className="text-base font-extrabold text-blue-950 flex items-center gap-2">
            📄 Notification Details
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold text-base cursor-pointer p-1"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="space-y-4">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
              Title
            </span>
            <p className="text-sm font-bold text-blue-900 mt-0.5">{notification.title}</p>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
              Message
            </span>
            <div className="bg-[#F8FAFC] border border-blue-100/80 rounded-xl p-3.5 text-xs text-slate-700 mt-1 leading-relaxed whitespace-pre-wrap">
              {notification.message}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs border-t border-blue-50 pt-4">
            <div>
              <span className="text-slate-400 font-bold block text-[10px] uppercase">Sender</span>
              <span className="text-slate-700 font-semibold mt-0.5 block">
                {notification.sender_id} ({notification.sender_role})
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-bold block text-[10px] uppercase">Recipient</span>
              <span className="text-slate-700 font-semibold mt-0.5 block">
                {notification.recipient_type}{' '}
                {notification.recipient_id && `(${notification.recipient_id})`}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-bold block text-[10px] uppercase">Priority</span>
              <span
                className={`inline-block mt-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${
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
            <div>
              <span className="text-slate-400 font-bold block text-[10px] uppercase">Date & Time</span>
              <span className="text-slate-700 font-semibold mt-0.5 block">
                {new Date(notification.created_at).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end pt-4 mt-5 border-t border-blue-50">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/10 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotificationDetailsModal;