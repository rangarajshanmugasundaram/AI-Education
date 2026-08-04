import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import CreateSessionModal from './CreateSessionModal';
import notificationService from '../../../services/features/notificationService';
import classroomService from '../../../services/features/classroomService';

export const CreateLiveSessionButton = ({ onSessionCreated }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleCreateSession = useCallback(async (newSessionData) => {
    const targetSessionId = newSessionData.sessionId || 'session_101';
    const batchName = newSessionData.batchName || 'Unspecified Batch';

    const completeSession = {
      id: targetSessionId,
      batchName: batchName,
      dateTime: newSessionData.dateTime || new Date().toLocaleString(),
      isLive: true,
      notified: true
    };

    // 1. Save active session state in local storage
    localStorage.setItem('active_live_session', JSON.stringify(completeSession));

    // 2. Dispatch custom window event to sync open browser tabs instantly
    window.dispatchEvent(new Event('live_session_updated'));

    // 3. Mark session live in Django DB
    try {
      if (classroomService?.startSession) {
        await classroomService.startSession(targetSessionId);
      }
    } catch (err) {
      console.error('Failed to mark backend session live:', err);
    }

    // 4. Broadcast notification to students
    try {
      await notificationService.create({
        title: `🔴 Live Session Started: ${batchName}`,
        message: `Trainer has started the live classroom (${targetSessionId}). Join now!`,
        priority: 'Emergency',
        recipient_type: 'All',
        batch_id: targetSessionId,
      });
    } catch (err) {
      console.error('Failed to broadcast live session notification:', err);
    }

    if (onSessionCreated) {
      onSessionCreated(completeSession);
    }

    setIsModalOpen(false);
    
    // Route trainer directly into the live classroom
    navigate(`/live-session/${targetSessionId}`);
  }, [navigate, onSessionCreated]);

  return (
    <>
      <button
        type="button"
        onClick={handleOpenModal}
        className="w-full sm:w-auto h-9 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 rounded-lg shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
      >
        <Plus className="w-3.5 h-3.5 text-white" />
        <span>Create Live Session</span>
      </button>

      <CreateSessionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCreateSession={handleCreateSession}
      />
    </>
  );
};

export default CreateLiveSessionButton;