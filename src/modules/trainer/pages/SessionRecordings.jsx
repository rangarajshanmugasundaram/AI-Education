import { useState } from 'react';
import AppLayout from "../../../layouts/AppLayout";
import RecordingCard from '../components/RecordingCard';
import VideoPlayerModal from '../components/VideoPlayerModal';

const INITIAL_RECORDINGS = [
  { id: 'REC-1024', sessionName: 'Advanced React Architecture & Context API', duration: '01:45:20', uploadedDate: '2026-07-05' },
  { id: 'REC-1025', sessionName: 'Tailwind CSS Custom Configurations', duration: '52:15', uploadedDate: '2026-07-06' },
  { id: 'REC-1026', sessionName: 'Node.js Async Performance Tuning', duration: '02:10:05', uploadedDate: '2026-07-07' },
  { id: 'REC-1027', sessionName: 'State Management Breakdown (Zustand & Redux)', duration: '01:15:30', uploadedDate: '2026-07-08' },
];

const SessionRecordings = () => {
  const [recordings, setRecordings] = useState(INITIAL_RECORDINGS);
  const [activePlayback, setActivePlayback] = useState(null);

  const handlePlay = (recording) => setActivePlayback(recording);

  const handleDownload = (recording) => {
    alert(`⚡ Simulating download for: "${recording.sessionName}"\nFile: ${recording.id}.mp4`);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to permanently remove this recording?");
    if (confirmDelete) {
      setRecordings(prev => prev.filter(rec => rec.id !== id));
    }
  };

  return (
    <>
      {/* 1. Main Application Dashboard UI */}
      <AppLayout>
        <div className="w-full flex flex-col gap-5 sm:gap-6 max-w-[1600px] mx-auto p-3 sm:p-4 lg:p-6 bg-slate-50/30 min-h-screen">
          
          {/* Header section */}
          <header className="w-full bg-white/95 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-4 sm:p-5 lg:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm sticky top-0 z-40 transition-all">
            <div className="space-y-1 text-center sm:text-left">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">Session Recordings</h1>
              <p className="text-xs text-slate-500 max-w-xl">Review, download, or manage previously streamed and uploaded class sessions.</p>
            </div>
            <div className="mt-3 sm:mt-0 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 shadow-sm text-center">
              Total Videos: <span className="text-blue-600 font-bold">{recordings.length}</span>
            </div>
          </header>

          {/* Grid Layout */}
          {recordings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recordings.map((recording) => (
                <RecordingCard
                  key={recording.id}
                  recording={recording}
                  onPlay={handlePlay}
                  onDownload={handleDownload}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16 bg-white border border-dashed border-gray-300 rounded-xl max-w-xl mx-auto mt-12 w-full">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No recordings left</h3>
              <p className="mt-1 text-sm text-gray-500">All sessions have been cleared or deleted.</p>
            </div>
          )}
        </div>
      </AppLayout>

      {/* 2. Isolated Full-Screen Cinema Lightbox Workspace */}
      {/* Rendered outside AppLayout so the dashboard header can never leak on top */}
      {activePlayback && (
        <VideoPlayerModal 
          playbackData={activePlayback} 
          onClose={() => setActivePlayback(null)} 
        />
      )}
    </>
  );
};

export default SessionRecordings;