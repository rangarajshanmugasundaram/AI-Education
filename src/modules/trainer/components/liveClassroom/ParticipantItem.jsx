import { useState } from 'react';
import { Mic, MicOff, Video, Settings, UserX, Volume2, MessageSquare, Monitor } from 'lucide-react';

export const ParticipantItem = ({
  participant,
  onMute,
  onRequestCamera,
  onRemove,
  onUpdatePermissions,
}) => {
  const [showPermissions, setShowPermissions] = useState(false);

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
    <div className="relative p-2.5 border border-slate-200/80 hover:border-slate-300 rounded-lg bg-slate-50/50 flex flex-col text-xs transition-all">
      <div className="flex items-center justify-between gap-2">
        {/* Info & Status */}
        <div className="min-w-0">
          <div className="font-bold text-slate-900 text-xs truncate flex items-center gap-1.5">
            {participant.name}
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
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
            className={`p-1.5 rounded-md border text-[11px] transition-all cursor-pointer ${
              participant.isMuted
                ? 'bg-rose-50 border-rose-200/80 text-rose-600'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {participant.isMuted ? <MicOff className="w-3.5 h-3.5 text-rose-600" /> : <Mic className="w-3.5 h-3.5 text-slate-600" />}
          </button>

          {/* Request Camera */}
          <button
            onClick={() => onRequestCamera(participant.id)}
            title={participant.isCameraOn ? 'Camera Active' : 'Request Camera'}
            className={`p-1.5 rounded-md border text-[11px] transition-all cursor-pointer ${
              participant.isCameraOn
                ? 'bg-emerald-50 border-emerald-200/80 text-emerald-600'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
          </button>

          {/* Permissions Menu Toggle */}
          <button
            onClick={() => setShowPermissions(!showPermissions)}
            title="Manage Permissions"
            className={`p-1.5 rounded-md border text-[11px] transition-all cursor-pointer ${
              showPermissions
                ? 'bg-slate-900 border-slate-900 text-white'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
          </button>

          {/* Remove Participant */}
          <button
            onClick={() => onRemove(participant.id)}
            title="Remove Participant"
            className="p-1.5 rounded-md border border-slate-200 hover:border-rose-200 text-rose-600 bg-white hover:bg-rose-50 transition-all cursor-pointer"
          >
            <UserX className="w-3.5 h-3.5 text-rose-600" />
          </button>
        </div>
      </div>

      {/* Permission Settings Drawer */}
      {showPermissions && (
        <div className="mt-2 pt-2 border-t border-slate-200/80 grid grid-cols-3 gap-1 bg-white p-1.5 rounded-md border border-slate-100">
          <button
            onClick={() => handleTogglePermission('canSpeak')}
            className={`p-1 text-[10px] font-semibold rounded border flex items-center justify-center gap-1 transition-all cursor-pointer ${
              permissions.canSpeak ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-400 border-slate-200'
            }`}
          >
            <Volume2 className="w-3 h-3" /> Speak
          </button>
          <button
            onClick={() => handleTogglePermission('canChat')}
            className={`p-1 text-[10px] font-semibold rounded border flex items-center justify-center gap-1 transition-all cursor-pointer ${
              permissions.canChat ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-400 border-slate-200'
            }`}
          >
            <MessageSquare className="w-3 h-3" /> Chat
          </button>
          <button
            onClick={() => handleTogglePermission('canScreenShare')}
            className={`p-1 text-[10px] font-semibold rounded border flex items-center justify-center gap-1 transition-all cursor-pointer ${
              permissions.canScreenShare ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-400 border-slate-200'
            }`}
          >
            <Monitor className="w-3 h-3" /> Share
          </button>
        </div>
      )}
    </div>
  );
};

export default ParticipantItem;