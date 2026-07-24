import { useState } from 'react';
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
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen">
      {/* Header Banner Card */}
      <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-blue-950 flex items-center gap-2">
            📢 Notification Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create, manage, and send broadcast alerts to users and batches.
          </p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/10 transition cursor-pointer"
        >
          + Create Notification
        </button>
      </div>

      {/* Stats Cards */}
      <NotificationStatsCard stats={stats} />

      {/* Filters */}
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