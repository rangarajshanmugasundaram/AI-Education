import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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

    // 🌟 3. CALL BACKEND CLASSROOM API TO MARK SESSION LIVE IN DJANGO DB
    try {
      if (classroomService?.startSession) {
        await classroomService.startSession(targetSessionId);
      }
    } catch (err) {
      console.error('Failed to mark backend session live:', err);
    }

    // 🌟 4. BROADCAST REAL-TIME NOTIFICATION TO STUDENTS
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
    
    // Route trainer directly into the live classroom session
    navigate(`/live-session/${targetSessionId}`);
  }, [navigate, onSessionCreated]);

  return (
    <>
      <button
        type="button"
        onClick={handleOpenModal}
        className="w-full sm:w-auto h-11 sm:h-10 text-center justify-center bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-bold px-5 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
      >
        <span className="text-sm font-medium">+</span> Create Live Session
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