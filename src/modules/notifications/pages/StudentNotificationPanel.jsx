import { useState } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationCard } from '../components/NotificationCard';
import { NotificationDetailsModal } from '../components/NotificationDetailsModal';

export function StudentNotificationPanel() {
  const { notifications, loading, stats, markAsRead, fetchNotifications } = useNotifications(true);
  const [filterRead, setFilterRead] = useState('all');
  const [viewingNotification, setViewingNotification] = useState(null);

  const filteredList = notifications.filter((n) => {
    if (filterRead === 'unread') return !n.read_status;
    if (filterRead === 'read') return n.read_status;
    return true;
  });

  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen">
      {/* Header Banner */}
      <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-blue-950 flex items-center gap-2">
            🔔 Your Notifications
            {stats.unread > 0 && (
              <span className="bg-amber-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                {stats.unread} New
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-500 mt-1">Review live class updates, announcements, and alerts.</p>
        </div>

        <button
          onClick={fetchNotifications}
          className="px-3 py-2 bg-slate-100 hover:bg-slate-200/70 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Pastel Filter Tabs */}
      <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-blue-100 w-fit shadow-sm">
        <button
          onClick={() => setFilterRead('all')}
          className={`px-4 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
            filterRead === 'all' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          All ({stats.total})
        </button>
        <button
          onClick={() => setFilterRead('unread')}
          className={`px-4 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
            filterRead === 'unread' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Unread ({stats.unread})
        </button>
        <button
          onClick={() => setFilterRead('read')}
          className={`px-4 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
            filterRead === 'read' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Read ({stats.total - stats.unread})
        </button>
      </div>

      {/* Notification Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading your inbox...</div>
      ) : filteredList.length === 0 ? (
        <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-2xl border border-blue-100 shadow-sm">
          📬 No notifications available.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredList.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onView={(item) => setViewingNotification(item)}
              onMarkAsRead={markAsRead}
            />
          ))}
        </div>
      )}

      {/* Details Popup */}
      {viewingNotification && (
        <NotificationDetailsModal
          notification={viewingNotification}
          onClose={() => setViewingNotification(null)}
        />
      )}
    </div>
  );
}

export default StudentNotificationPanel;