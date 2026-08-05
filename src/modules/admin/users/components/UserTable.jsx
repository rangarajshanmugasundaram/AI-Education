import React from 'react';
import { Edit2, Trash2, KeyRound, CheckCircle2, XCircle } from 'lucide-react';
import UserStatusToggle from './UserStatusToggle';

const getInitials = (name) => {
  if (!name) return 'U';
  return name.split(' ').filter(Boolean).slice(0, 2).map((w) => w.charAt(0).toUpperCase()).join('');
};

export default function UserTable({ users, onEdit, onDelete, onToggleStatus, onOpenResetPassword }) {
  if (!users || users.length === 0) {
    return (
      <div className="p-12 text-center text-slate-400 text-xs bg-white border border-slate-200/80 rounded-xl">
        No user records found matching criteria.
      </div>
    );
  }

  return (
    <div className="w-full bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
              <th className="p-3.5">User</th>
              <th className="p-3.5">Role</th>
              <th className="p-3.5">Status Switch</th>
              <th className="p-3.5">Registered</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {users.map((u) => {
              const active = u.isActive !== false;
              return (
                <tr key={u._id || u.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3.5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                      {getInitials(u.name)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{u.name}</p>
                      <p className="text-[10px] text-slate-400">{u.email}</p>
                    </div>
                  </td>

                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-100 text-slate-700 uppercase">
                      {u.role}
                    </span>
                  </td>

                  <td className="p-3.5">
                    <button
                      onClick={() => onToggleStatus(u._id || u.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer transition-all ${
                        active 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100' 
                          : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                      }`}
                    >
                      {active ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      <span>{active ? 'Active' : 'Inactive'}</span>
                    </button>
                  </td>

                  <td className="p-3.5 font-mono text-slate-400 text-[10px]">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : 'N/A'}
                  </td>

                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onOpenResetPassword(u)}
                        className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                        title="Reset Password"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onEdit(u)}
                        className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                        title="Edit User"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(u._id || u.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}