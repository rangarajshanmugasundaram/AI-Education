import React from 'react';

const RecordingCard = ({ recording, onPlay, onDownload, onDelete }) => {
  const {
    id,
    title,
    duration,
    recording_date,
    created_at,
    status,
    playback_count,
    download_enabled
  } = recording || {};

  const displayDate = recording_date || (created_at ? new Date(created_at).toLocaleDateString() : 'N/A');

  const formatDuration = (secs) => {
    if (typeof secs === 'string') return secs;
    if (!secs) return '00:00';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="group bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/20 to-purple-100/20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-blue-600 to-purple-600 text-white px-2.5 py-1 rounded-lg shadow-sm truncate max-w-[120px]">
              #{id ? id.toString().substring(0, 8) : 'REC'}
            </span>
            {status && (
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                status === 'Ready' ? 'bg-emerald-100 text-emerald-800' :
                status === 'Processing' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
              }`}>
                {status}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {displayDate}
          </span>
        </div>

        <h3 className="text-lg font-bold text-gray-800 line-clamp-2 mb-3 group-hover:text-blue-700 transition-colors duration-200">
          {title || 'Untitled Session'}
        </h3>

        <div className="flex items-center justify-between text-xs text-gray-600 mb-6 bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-100">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{formatDuration(duration)}</span>
          </div>
          {playback_count !== undefined && (
            <span className="text-slate-400 font-mono text-[11px]">{playback_count} views</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-4 border-t-2 border-gray-100">
        <button
          onClick={() => onPlay && onPlay(recording)}
          className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 text-emerald-700 hover:from-emerald-100 hover:to-emerald-200 transition-all duration-200 group/btn shadow-sm cursor-pointer"
          title="Play Recording"
        >
          <svg className="w-5 h-5 mb-1 group-hover/btn:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
          <span className="text-[11px] font-semibold">Play</span>
        </button>

        <button
          onClick={() => onDownload && onDownload(recording)}
          disabled={download_enabled === false}
          className={`flex flex-col items-center justify-center p-2.5 rounded-xl transition-all duration-200 group/btn shadow-sm ${
            download_enabled === false 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-br from-blue-50 to-blue-100/50 text-blue-700 hover:from-blue-100 hover:to-blue-200 cursor-pointer'
          }`}
          title={download_enabled === false ? "Downloads Disabled" : "Download Recording"}
        >
          <svg className="w-5 h-5 mb-1 group-hover/btn:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span className="text-[11px] font-semibold">Download</span>
        </button>

        <button
          onClick={() => onDelete && onDelete(id)}
          className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-gradient-to-br from-rose-50 to-rose-100/50 text-rose-700 hover:from-rose-100 hover:to-rose-200 transition-all duration-200 group/btn shadow-sm cursor-pointer"
          title="Delete Recording"
        >
          <svg className="w-5 h-5 mb-1 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span className="text-[11px] font-semibold">Delete</span>
        </button>
      </div>
    </div>
  );
};

export default RecordingCard;