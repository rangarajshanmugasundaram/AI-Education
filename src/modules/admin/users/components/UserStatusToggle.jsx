import React, { useState } from 'react';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export default function UserStatusToggle({ userId, isActive, onToggle, variant = 'switch' }) {
  const [loading, setLoading] = useState(false);

  const handleToggle = async (e) => {
    e.stopPropagation();
    if (loading) return;

    setLoading(true);
    try {
      await onToggle(userId);
    } catch (error) {
      console.error('Failed to toggle user status:', error);
    } finally {
      setLoading(false);
    }
  };

  // Variant 1: Compact Interactive Toggle Switch
  if (variant === 'switch') {
    return (
      <button
        type="button"
        onClick={handleToggle}
        disabled={loading}
        title={isActive ? 'Click to Deactivate' : 'Click to Activate'}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 ${
          isActive ? 'bg-emerald-500' : 'bg-slate-300'
        }`}
      >
        <span className="sr-only">Toggle User Status</span>
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
            isActive ? 'translate-x-4' : 'translate-x-0'
          }`}
        >
          {loading && <Loader2 className="w-2.5 h-2.5 animate-spin text-slate-600" />}
        </span>
      </button>
    );
  }

  // Variant 2: Badge Button Style (Used inside Data Tables)
  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading}
      className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1.5 cursor-pointer transition-all disabled:opacity-50 ${
        isActive
          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
          : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
      }`}
    >
      {loading ? (
        <Loader2 className="w-3 h-3 animate-spin text-slate-500" />
      ) : isActive ? (
        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
      ) : (
        <XCircle className="w-3 h-3 text-rose-600" />
      )}
      <span>{isActive ? 'Active' : 'Inactive'}</span>
    </button>
  );
}