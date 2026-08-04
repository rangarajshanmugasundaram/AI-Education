import { useState } from 'react';
import { Bell, Plus, RefreshCw, AlertCircle } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationStatsCard } from '../components/NotificationStatsCard';
import { NotificationFilters } from '../components/NotificationFilters';
import { NotificationListTable } from '../components/NotificationListTable';
import { CreateNotificationModal } from '../components/CreateNotificationModal';
import { EditNotificationModal } from '../components/EditNotificationModal';
import { NotificationDetailsModal } from '../components/NotificationDetailsModal';

export function NotificationDashboard() {
  const {
    notifications,
    loading,
    stats,
    searchTerm,
    setSearchTerm,
    priority,
    setPriority,
    recipientType,
    setRecipientType,
    readStatus,
    setReadStatus,
    fetchNotifications,
    createNotification,
    updateNotification,
    markAsRead,
    deleteNotification,
  } = useNotifications(false);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState(null);
  const [viewingNotification, setViewingNotification] = useState(null);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      await deleteNotification(id);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 max-w-[1600px] mx-auto bg-slate-50/30 min-h-screen">
      {/* Enterprise Header Banner */}
      <div className="w-full bg-white border border-slate-200/80 rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="w-5 h-5 text-slate-700" />
            Notification Management
          </h1>
          <p className="text-xs text-slate-500">
            Create, manage, and send broadcast alerts to users and batches.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="h-9 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5 text-white" />
          <span>Create Notification</span>
        </button>
      </div>

      {/* Stats Cards */}
      <NotificationStatsCard stats={stats} />

      {/* Filters Toolbar */}
      <NotificationFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        priority={priority}
        setPriority={setPriority}
        recipientType={recipientType}
        setRecipientType={setRecipientType}
        readStatus={readStatus}
        setReadStatus={setReadStatus}
        onRefresh={fetchNotifications}
      />

      {/* Notifications Table */}
      <NotificationListTable
        notifications={notifications}
        loading={loading}
        onView={setViewingNotification}
        onEdit={setEditingNotification}
        onDelete={handleDelete}
        onMarkAsRead={markAsRead}
        isStudent={false}
      />

      {/* Modals */}
      <CreateNotificationModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={createNotification}
      />

      <EditNotificationModal
        isOpen={!!editingNotification}
        notification={editingNotification}
        onClose={() => setEditingNotification(null)}
        onSubmit={updateNotification}
      />

      <NotificationDetailsModal
        notification={viewingNotification}
        onClose={() => setViewingNotification(null)}
      />
    </div>
  );
}

export default NotificationDashboard;