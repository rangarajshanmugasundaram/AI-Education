import { useState } from 'react';
import { Bell, RefreshCw, Inbox, AlertCircle } from 'lucide-react';
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
    <div className="w-full flex flex-col gap-6 max-w-[1600px] mx-auto bg-slate-50/30 min-h-screen">
      {/* Enterprise Student Header Banner */}
      <div className="w-full bg-white border border-slate-200/80 rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="w-5 h-5 text-slate-700" />
            Your Notifications
            {stats.unread > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                {stats.unread} New
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-500">Review live class updates, announcements, and alerts.</p>
        </div>

        <button
          onClick={fetchNotifications}
          className="h-9 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Enterprise Filter Pills */}
      <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-slate-200/80 w-fit shadow-xs">
        <button
          onClick={() => setFilterRead('all')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
            filterRead === 'all' 
              ? 'bg-slate-900 text-white font-bold shadow-xs' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          All ({stats.total})
        </button>
        <button
          onClick={() => setFilterRead('unread')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
            filterRead === 'unread' 
              ? 'bg-slate-900 text-white font-bold shadow-xs' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          Unread ({stats.unread})
        </button>
        <button
          onClick={() => setFilterRead('read')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
            filterRead === 'read' 
              ? 'bg-slate-900 text-white font-bold shadow-xs' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          Read ({stats.total - stats.unread})
        </button>
      </div>

      {/* Notification Cards Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-400 text-xs font-medium flex flex-col items-center justify-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-slate-500" />
          <span>Loading your notification inbox...</span>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs flex flex-col items-center justify-center gap-2 shadow-xs">
          <Inbox className="w-8 h-8 text-slate-300" />
          <span>No notifications available in this view.</span>
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