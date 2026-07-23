import { useState } from 'react';

export const ParticipantItem = ({
  participant,
  onMute,
  onRequestCamera,
  onRemove,
  onUpdatePermissions,
}) => {
  const [showPermissions, setShowPermissions] = useState(false);

  // Permission States (Task 6)
  const permissions = participant.permissions || {
    canSpeak: true,
    canChat: true,
    canScreenShare: false,
  };

  const handleTogglePermission = (key) => {
    const updated = { ...permissions, [key]: !permissions[key] };
    if (onUpdatePermissions) {
      onUpdatePermissions(participant.id, updated);
    }
  };

  return (
    <div className="relative p-2.5 border border-slate-100 hover:border-slate-200 rounded-xl bg-slate-50/50 flex flex-col text-xs transition">
      <div className="flex items-center justify-between gap-2">
        {/* Info & Status */}
        <div className="min-w-0">
          <div className="font-bold text-slate-800 truncate flex items-center gap-1.5">
            {participant.name}
            <span
              className={`w-2 h-2 rounded-full ${
                participant.status === 'Active'
                  ? 'bg-emerald-500'
                  : participant.status === 'Disconnected'
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`}
              title={`Status: ${participant.status || 'Active'}`}
            />
          </div>
          <div className="text-[10px] text-slate-400 truncate">{participant.email}</div>
        </div>

        {/* Quick Trainer Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Mic Control */}
          <button
            onClick={() => onMute(participant.id)}
            title={participant.isMuted ? 'Unmute' : 'Mute'}
            className={`p-1.5 rounded-lg border text-[11px] transition ${
              participant.isMuted
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {participant.isMuted ? '🎙️❌' : '🎙️'}
          </button>

          {/* Request Camera */}
          <button
            onClick={() => onRequestCamera(participant.id)}
            title={participant.isCameraOn ? 'Camera Active' : 'Request Camera'}
            className={`p-1.5 rounded-lg border text-[11px] transition ${
              participant.isCameraOn
                ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            📷
          </button>

          {/* Task 6: Permissions Menu Toggle */}
          <button
            onClick={() => setShowPermissions(!showPermissions)}
            title="Manage Permissions"
            className={`p-1.5 rounded-lg border text-[11px] transition ${
              showPermissions
                ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            ⚙️
          </button>

          {/* Remove Participant */}
          <button
            onClick={() => onRemove(participant.id)}
            title="Remove Participant"
            className="p-1.5 rounded-lg border border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100 text-[11px] transition"
          >
            🚫
          </button>
        </div>
      </div>

      {/* Task 6: Permission Settings Drawer */}
      {showPermissions && (
        <div className="mt-2.5 pt-2 border-t border-slate-200/60 grid grid-cols-3 gap-1 bg-white p-2 rounded-lg border">
          <button
            onClick={() => handleTogglePermission('canSpeak')}
            className={`p-1 text-[10px] font-semibold rounded border ${
              permissions.canSpeak ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200'
            }`}
          >
            🗣️ Speak
          </button>
          <button
            onClick={() => handleTogglePermission('canChat')}
            className={`p-1 text-[10px] font-semibold rounded border ${
              permissions.canChat ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200'
            }`}
          >
            💬 Chat
          </button>
          <button
            onClick={() => handleTogglePermission('canScreenShare')}
            className={`p-1 text-[10px] font-semibold rounded border ${
              permissions.canScreenShare ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200'
            }`}
          >
            🖥️ Share
          </button>
        </div>
      )}
    </div>
  );
};

export default ParticipantItem;