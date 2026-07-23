import { useState } from 'react';

export const MediaControls = ({ onToggleMute, onToggleCamera, onMuteAll }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);

  const handleMuteClick = () => {
    const newState = !isMuted;
    setIsMuted(newState);
    if (onToggleMute) onToggleMute(newState);
  };

  const handleCameraClick = () => {
    const newState = !isCameraOn;
    setIsCameraOn(newState);
    if (onToggleCamera) onToggleCamera(newState);
  };

  return (
    <div className="flex items-center gap-2 bg-slate-900/90 text-white p-2 px-4 rounded-2xl shadow-xl backdrop-blur-md">
      {/* Mic Control */}
      <button
        onClick={handleMuteClick}
        className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition ${
          isMuted
            ? 'bg-rose-500 hover:bg-rose-600 text-white'
            : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
        }`}
      >
        <span>{isMuted ? '🎙️❌' : '🎙️'}</span>
        <span>{isMuted ? 'Unmute' : 'Mute'}</span>
      </button>

      {/* Camera Control */}
      <button
        onClick={handleCameraClick}
        className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition ${
          !isCameraOn
            ? 'bg-rose-500 hover:bg-rose-600 text-white'
            : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
        }`}
      >
        <span>{isCameraOn ? '📷' : '📷❌'}</span>
        <span>{isCameraOn ? 'Cam On' : 'Cam Off'}</span>
      </button>

      {/* Mute All Action (Trainer Only) */}
      {onMuteAll && (
        <button
          onClick={onMuteAll}
          className="text-xs font-semibold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 px-3 py-2 rounded-xl transition ml-2"
        >
          Mute All
        </button>
      )}
    </div>
  );
};

export default MediaControls;