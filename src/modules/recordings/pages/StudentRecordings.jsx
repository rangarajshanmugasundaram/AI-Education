import { useState } from 'react';
import { useRecordings } from '../hooks/useRecordings';
import RecordingCard from '../components/RecordingCard';
import VideoPlayerModal from '../components/VideoPlayerModal';

export default function StudentRecordings() {
  const { recordings, loading, error } = useRecordings();
  const [activePlayback, setActivePlayback] = useState(null);

  return (
    <div className="w-full flex flex-col gap-6 max-w-[1600px] mx-auto p-4 sm:p-6 bg-slate-50/30 min-h-screen">
      <header className="w-full bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900">Classroom Recordings</h1>
        <p className="text-xs text-slate-500">Access and watch previously recorded lectures for your active batch.</p>
      </header>

      {loading ? (
        <div className="text-center py-20 text-slate-500 text-sm">Loading available recordings...</div>
      ) : error ? (
        <div className="text-center py-10 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>
      ) : recordings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recordings.map((r) => (
            <RecordingCard
              key={r.id}
              recording={r}
              onPlay={setActivePlayback}
              onDownload={(rec) => rec.video_url && window.open(rec.video_url, '_blank')}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-dashed rounded-xl text-slate-500 text-sm">
          No recordings available at this time.
        </div>
      )}

      {activePlayback && (
        <VideoPlayerModal
          recording={activePlayback}
          onClose={() => setActivePlayback(null)}
        />
      )}
    </div>
  );
}