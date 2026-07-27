import { useState, memo, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';

// Core Components
import WhiteboardZone from '../components/WhiteboardZone';
import ClassroomChat from '../components/ClassroomChat';

// 🔗 Connected Real Backend Engine Hook
import { useLiveClassroom } from '../hooks/useLiveClassroom';

// Task Components
import { ParticipantList } from '../components/liveClassroom/ParticipantList';
import { RaiseHandList } from '../components/liveClassroom/RaiseHandList';
import { WaitingRoomModal } from '../components/liveClassroom/WaitingRoomModal';
import { ActivityLogDrawer } from '../components/liveClassroom/ActivityLogDrawer';
import FeedbackModal from '../components/liveClassroom/FeedbackModal';

const MemoizedWhiteboard = memo(WhiteboardZone);
const MemoizedChat = memo(ClassroomChat);

export function LiveClassroomPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 🔒 HARDCODED WORKING SESSION ID
  const { sessionId: rawSessionId } = useParams();
  const sessionId = rawSessionId && rawSessionId !== 'undefined' ? rawSessionId : 'session_101';

  // Mode & Sidebar States
  const [viewMode, setViewMode] = useState('whiteboard');
  const [activeTab, setActiveTab] = useState('chat');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isWaitingRoomOpen, setIsWaitingRoomOpen] = useState(false);
  const [isLogDrawerOpen, setIsLogDrawerOpen] = useState(false);

  // 🌟 Feedback Modal State
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  // Current User
  const currentUser = {
    id: localStorage.getItem('user_id') || searchParams.get('id') || 'user_1',
    email: localStorage.getItem('user_email') || searchParams.get('email') || 'trainer1@gmail.com',
    name: localStorage.getItem('user_name') || searchParams.get('name') || 'Trainer One',
    role: localStorage.getItem('user_role') || searchParams.get('role') || 'Trainer',
  };

  // Consume Live Backend Engine
  const {
    sessionState,
    participants = [],
    raisedHands = [],
    waitingRoom = [],
    activityLogs = [],
    notifications = [],
    setNotifications,
    raiseHand,
    lowerHand,
    dismissHand,
    endSession,
    toggleLock,
    muteAll,
    muteParticipant,
    requestCamera,
    removeParticipant,
    allowRejoin,
    updatePermissions,
    approveWaiting,
    rejectWaiting,
    toggleSelfMute,
    toggleSelfCamera,
  } = useLiveClassroom(sessionId);

  useEffect(() => {
    if (searchParams.get('email')) localStorage.setItem('user_email', searchParams.get('email'));
    if (searchParams.get('role')) localStorage.setItem('user_role', searchParams.get('role'));
    if (searchParams.get('name')) localStorage.setItem('user_name', searchParams.get('name'));
  }, [searchParams]);

  const studentParticipants = participants.filter((p) => p.role !== 'Trainer');
  const trainerParticipant = participants.find((p) => p.role === 'Trainer') || {
    name: currentUser.name,
    isMuted: false,
    isCameraOn: true,
  };

  const currentParticipant = participants.find((p) => p.email === currentUser.email);
  const isSelfMuted = currentParticipant ? (currentParticipant.isMuted || currentParticipant.is_muted) : false;
  const isSelfCameraOn = currentParticipant ? (currentParticipant.isCameraOn ?? currentParticipant.is_camera_on ?? true) : true;

  // 🌟 Handles Leaving or Ending the Class
  const handleEndOrLeaveMeeting = () => {
    if (currentUser.role.toLowerCase() === 'student') {
      // Show feedback modal to Student
      setIsFeedbackModalOpen(true);
    } else {
      // Trainer ends meeting for all
      endSession();
      localStorage.removeItem('active_live_session');
      navigate('/digital-classroom');
    }
  };

  return (
    <div style={{ zIndex: 9999 }} className="fixed inset-0 w-screen h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden select-none">
      
      {/* 🔔 Toast Notifications */}
      <div style={{ zIndex: 10000 }} className="fixed top-4 left-4 flex flex-col gap-2 max-w-xs pointer-events-none">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => setNotifications((prev) => prev.filter((item) => item.id !== n.id))}
            className="pointer-events-auto bg-slate-900/90 backdrop-blur-md text-white text-xs px-3 py-2 rounded-lg shadow-xl border border-indigo-500/40 flex items-center justify-between gap-2 cursor-pointer hover:bg-slate-800 transition"
          >
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-xs">🔔</span>
              <span className="font-medium truncate">{n.message}</span>
            </div>
            <span className="text-[10px] text-slate-400 hover:text-white font-bold ml-2">✕</span>
          </div>
        ))}
      </div>

      {/* 🖥️ Main Viewport Grid */}
      <div className="flex-1 w-full flex p-3 gap-3 overflow-hidden relative">
        
        {/* BIG SCREEN: Whiteboard / Camera */}
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden flex flex-col shadow-2xl min-w-0">
          {viewMode === 'whiteboard' ? (
            <div className="w-full h-full bg-white rounded-2xl overflow-hidden">
              <MemoizedWhiteboard sessionId={sessionId} />
            </div>
          ) : (
            <div style={{ background: 'linear-gradient(to bottom right, #0f172a, #1e293b, #020617)' }} className="w-full h-full flex flex-col items-center justify-center ">
              <div className="w-24 h-24 rounded-full bg-indigo-600/30 border-2 border-indigo-500/50 flex items-center justify-center text-2xl font-black text-indigo-300 shadow-2xl">
                {trainerParticipant.name?.substring(0, 2).toUpperCase()}
              </div>
              <p className="text-xs font-semibold text-slate-300 mt-3">{trainerParticipant.name}</p>
            </div>
          )}
        </div>

        {/* 👥 Student Tile Panel */}
        <div className="w-56 shrink-0 flex flex-col bg-slate-900/80 border border-slate-800 rounded-2xl p-2.5 overflow-hidden shadow-xl">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1 flex items-center justify-between">
            <span>Students ({studentParticipants.length})</span>
            {raisedHands.length > 0 && (
              <span className="text-[9px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded-md font-extrabold">
                ✋ {raisedHands.length} Raised
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {studentParticipants.map((student) => {
              const isMuted = student.isMuted || student.is_muted;
              const isCameraOn = student.isCameraOn ?? student.is_camera_on ?? true;
              const hasRaised = student.hasRaisedHand || student.has_raised_hand;

              return (
                <div
                  key={student.id || student.email}
                  className="w-full h-28 bg-slate-800/90 border border-slate-700/60 rounded-xl relative overflow-hidden flex flex-col items-center justify-center shadow-md transition hover:border-slate-500 group shrink-0"
                >
                  {hasRaised && (
                    <div className="absolute top-1.5 left-1.5 z-20 bg-amber-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-md">
                      <span>✋</span> Raised
                    </div>
                  )}

                  <div className="absolute top-1.5 right-1.5 z-20 flex items-center gap-1 bg-slate-950/70 px-1.5 py-0.5 rounded text-[9px]">
                    <span>{isMuted ? '🎙️❌' : '🎙️✅'}</span>
                    <span>{isCameraOn ? '📹' : '🙈'}</span>
                  </div>

                  <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-slate-200 border border-slate-600 text-xs">
                    {student.name?.substring(0, 2).toUpperCase()}
                  </div>

                  <div className="absolute bottom-1.5 left-1.5 right-1.5 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-slate-200 truncate border border-slate-800 text-center">
                    {student.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 💬 RIGHT SIDEBAR */}
        {isSidebarOpen && (
          <aside className="w-80 shrink-0 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
            <div className="p-2 border-b border-slate-800 bg-slate-950/60 shrink-0 flex gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                  activeTab === 'chat' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                💬 Chat
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('participants')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                  activeTab === 'participants' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                👥 Users ({participants.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('hands')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition relative cursor-pointer ${
                  activeTab === 'hands' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                ✋ Hands
                {raisedHands.length > 0 && (
                  <span className="ml-1 bg-amber-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-black">
                    {raisedHands.length}
                  </span>
                )}
              </button>
            </div>

            <div className="w-full flex-1 flex flex-col overflow-hidden p-2 bg-white text-slate-800">
              {activeTab === 'chat' && <MemoizedChat sessionId={sessionId} currentUser={currentUser} />}

              {activeTab === 'participants' && (
                <ParticipantList
                  participants={participants}
                  onMute={muteParticipant}
                  onRequestCamera={requestCamera}
                  onRemove={removeParticipant}
                  onAllowRejoin={allowRejoin}
                  onUpdatePermissions={updatePermissions}
                  currentUser={currentUser}
                />
              )}

              {activeTab === 'hands' && (
                <RaiseHandList
                  raisedHands={raisedHands}
                  currentUser={currentUser}
                  onRaiseHand={raiseHand}
                  onLowerHand={lowerHand}
                  onDismiss={dismissHand}
                />
              )}
            </div>
          </aside>
        )}
      </div>

      {/* 🎛️ BOTTOM CONTROL TOOLBAR */}
      <footer className="w-full h-14 bg-slate-900 border-t border-slate-800 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold text-slate-400">Room: {sessionId}</span>
          <span className="text-[10px] bg-slate-800 text-slate-300 font-bold px-2 py-0.5 rounded-full border border-slate-700">
            {participants.length} Active
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleSelfMute(currentUser.email)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              isSelfMuted ? 'bg-rose-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            {isSelfMuted ? '🎙️ Off' : '🎙️ On'}
          </button>

          <button
            type="button"
            onClick={() => toggleSelfCamera(currentUser.email)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              !isSelfCameraOn ? 'bg-rose-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            {isSelfCameraOn ? '📹 On' : '📹 Off'}
          </button>

          <button
            type="button"
            onClick={() => setViewMode((prev) => (prev === 'whiteboard' ? 'camera' : 'whiteboard'))}
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
          >
            {viewMode === 'whiteboard' ? '📹 Trainer Cam' : '🎨 Whiteboard'}
          </button>

          <button
            type="button"
            onClick={() => raiseHand(currentUser.email)}
            className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition cursor-pointer"
          >
            ✋ Hand
          </button>

          {currentUser.role === 'Trainer' && (
            <>
              <button
                type="button"
                onClick={muteAll}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5"
              >
                Mute All
              </button>

              <button
                type="button"
                onClick={toggleLock}
                className={`px-3 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                  sessionState.isLocked ? 'bg-amber-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                {sessionState.isLocked ? '🔒 Locked' : '🔓 Lock'}
              </button>
            </>
          )}

          {/* 📞 LEAVE / END MEETING BUTTON */}
          <button
            type="button"
            onClick={handleEndOrLeaveMeeting}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold rounded-xl transition cursor-pointer shadow ml-2"
          >
            📞 {currentUser.role.toLowerCase() === 'student' ? 'Leave Meeting' : 'End Meeting'}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsWaitingRoomOpen(true)}
            className="relative p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition cursor-pointer"
            title="Waiting Room"
          >
            ⏳
            {waitingRoom.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                {waitingRoom.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsLogDrawerOpen(true)}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition cursor-pointer"
            title="Activity Logs"
          >
            📋
          </button>

          <button
            type="button"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition cursor-pointer"
            title="Toggle Sidebar"
          >
            💬
          </button>
        </div>
      </footer>

      {/* Task Overlays */}
      {isWaitingRoomOpen && (
        <WaitingRoomModal
          waitingList={waitingRoom}
          onApprove={approveWaiting}
          onReject={rejectWaiting}
          onClose={() => setIsWaitingRoomOpen(false)}
        />
      )}

      {isLogDrawerOpen && (
        <ActivityLogDrawer
          logs={activityLogs}
          onClose={() => setIsLogDrawerOpen(false)}
        />
      )}

      {/* 🌟 STUDENT FEEDBACK POPUP MODAL */}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        sessionId={sessionId}
        trainerId="trainer_01"
        currentUser={currentUser}
        onClose={() => {
          setIsFeedbackModalOpen(false);
          navigate('/digital-classroom');
        }}
        onSuccess={() => {
          navigate('/digital-classroom');
        }}
      />
    </div>
  );
}

export default LiveClassroomPage;