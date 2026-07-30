import { useState } from 'react';
import { useRecordings } from '../hooks/useRecordings';
import RecordingCard from '../components/RecordingCard';
import VideoPlayerModal from '../components/VideoPlayerModal';
import UploadRecordingModal from '../components/UploadRecordingModal';
import RecordingFilters from '../components/RecordingFilters';

export default function TrainerRecordings() {
  const { recordings, loading, error, removeRecording, uploadRecording } = useRecordings();
  const [activePlayback, setActivePlayback] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const filtered = recordings.filter((r) => {
    const matchesSearch = r.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || r.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full flex flex-col gap-6 max-w-[1600px] mx-auto p-4 sm:p-6 bg-slate-50/30 min-h-screen">
      <header className="w-full bg-white border border-slate-200/80 rounded-2xl p-6 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Trainer Recordings Management</h1>
          <p className="text-xs text-slate-500">Upload, manage, and inspect session recordings.</p>
        </div>
        <button
          onClick={() => setIsUploadOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm"
        >
          + Upload Recording
        </button>
      </header>

      <RecordingFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      {loading ? (
        <div className="text-center py-20 text-slate-500 text-sm">Loading recordings...</div>
      ) : error ? (
        <div className="text-center py-10 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((r) => (
            <RecordingCard
              key={r.id}
              recording={r}
              onPlay={setActivePlayback}
              onDownload={(rec) => rec.video_url && window.open(rec.video_url, '_blank')}
              onDelete={removeRecording}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-dashed rounded-xl text-slate-500 text-sm">
          No recordings found.
        </div>
      )}

      <UploadRecordingModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={() => setIsUploadOpen(false)}
      />

      {activePlayback && (
        <VideoPlayerModal
          recording={activePlayback}
          onClose={() => setActivePlayback(null)}
        />
      )}
    </div>
  );
}