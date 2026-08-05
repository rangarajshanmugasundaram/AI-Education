import React, { useState, useEffect, useCallback } from 'react';
import { UserPlus, Users, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  resetUserPassword
} from '../../../../services/features/userService';

import UserFilters from '../components/UserFilters';
import UserTable from '../components/UserTable';
import UserFormModal from '../components/UserFormModal';
import PasswordResetModal from '../components/PasswordResetModal';

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Load Data with Django REST Pagination
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchUsers({
        page,
        search,
        role: roleFilter,
        isActive: statusFilter,
      });

      // Matches UserPagination structure from backend:
      // { count, total_pages, current_page, next, previous, results }
      if (res && res.results) {
        setUsers(res.results);
        setTotalPages(res.total_pages || 1);
        setTotalCount(res.count || 0);
      } else if (Array.isArray(res)) {
        setUsers(res);
        setTotalPages(1);
        setTotalCount(res.length);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter, statusFilter]);

  // Reset to page 1 whenever filters or search query change
  useEffect(() => {
    setPage(1);
  }, [search, roleFilter, statusFilter]);

  // Fetch data when page or active filters change
  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateOrUpdate = async (formData) => {
    if (selectedUser) {
      await updateUser(selectedUser._id || selectedUser.id, formData);
    } else {
      await createUser(formData);
    }
    loadData();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      await deleteUser(id);
      loadData();
    }
  };

  const handleToggleStatus = async (id) => {
    await toggleUserStatus(id);
    loadData();
  };

  const handleResetPassword = async (id, newPassword) => {
    await resetUserPassword(id, newPassword);
  };

  return (
    <div className="w-full flex flex-col gap-6 max-w-[1600px] mx-auto bg-slate-50/30 min-h-screen p-4 sm:p-6">
      <header className="w-full bg-white border border-slate-200/80 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-slate-700" />
            User Management Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage student & trainer accounts, system roles, active statuses, and credential resets.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => loadData()}
            className="h-9 px-3 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => {
              setSelectedUser(null);
              setFormModalOpen(true);
            }}
            className="h-9 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5 text-white" />
            <span>Add User</span>
          </button>
        </div>
      </header>

      <UserFilters
        search={search}
        setSearch={setSearch}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onReset={() => {
          setSearch('');
          setRoleFilter('all');
          setStatusFilter('all');
          setPage(1);
        }}
      />

      {loading ? (
        <div className="h-64 flex items-center justify-center text-xs text-slate-400 gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-slate-600" />
          <span>Fetching user directory...</span>
        </div>
      ) : (
        <>
          <UserTable
            users={users}
            onEdit={(u) => {
              setSelectedUser(u);
              setFormModalOpen(true);
            }}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
            onOpenResetPassword={(u) => {
              setSelectedUser(u);
              setResetModalOpen(true);
            }}
          />

          {/* 🌟 ENHANCED PAGINATION BAR */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200/80 pt-4 px-1">
            <span className="text-xs text-slate-500 font-medium">
              Showing <strong className="text-slate-800">{users.length}</strong> of{' '}
              <strong className="text-slate-800">{totalCount}</strong> users (Page {page} of {totalPages})
            </span>

            <div className="flex items-center gap-1.5">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="h-8 px-3 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg text-xs font-bold text-slate-700 disabled:opacity-40 disabled:hover:bg-white flex items-center gap-1 cursor-pointer transition-all"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              {/* Direct Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`h-8 w-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    page === pageNum
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                className="h-8 px-3 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg text-xs font-bold text-slate-700 disabled:opacity-40 disabled:hover:bg-white flex items-center gap-1 cursor-pointer transition-all"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </>
      )}

      <UserFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSubmit={handleCreateOrUpdate}
        initialData={selectedUser}
      />

      <PasswordResetModal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        onReset={handleResetPassword}
        user={selectedUser}
      />
    </div>
  );
}