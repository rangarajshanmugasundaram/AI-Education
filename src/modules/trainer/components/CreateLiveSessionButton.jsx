import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateSessionModal from './CreateSessionModal';

export const CreateLiveSessionButton = ({ onSessionCreated }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleCreateSession = useCallback((newSessionData) => {
    // ✅ FIX: Use session_101 passed from the modal instead of Math.random()
    const targetSessionId = newSessionData.sessionId || 'session_101';

    const completeSession = {
      id: targetSessionId,
      batchName: newSessionData.batchName || 'Unspecified Batch',
      dateTime: newSessionData.dateTime || new Date().toLocaleString(),
      notified: false
    };

    if (onSessionCreated) {
      onSessionCreated(completeSession);
    }

    setIsModalOpen(false);
    
    // ✅ Always routes directly to session_101
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