import { useState, memo, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Bell, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Hand, 
  Users, 
  MessageSquare, 
  Lock, 
  Unlock, 
  Clock, 
  ClipboardList, 
  PhoneOff, 
  Layout, 
  X,
  ShieldCheck
} from 'lucide-react';

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
import ReconnectOverlay from '../components/liveClassroom/ReconnectOverlay';

const MemoizedWhiteboard = memo(WhiteboardZone);
const MemoizedChat = memo(ClassroomChat);

export function LiveClassroomPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { sessionId: rawSessionId } = useParams();
  const sessionId = rawSessionId && rawSessionId !== 'undefined' ? rawSessionId : 'session_101';

  // Mode & Sidebar States
  const [viewMode, setViewMode] = useState('whiteboard');
  const [activeTab, setActiveTab] = useState('chat');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isWaitingRoomOpen, setIsWaitingRoomOpen] = useState(false);
  const [isLogDrawerOpen, setIsLogDrawerOpen] = useState(false);
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
    isReconnecting,
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

  const handleEndOrLeaveMeeting = () => {
    if (currentUser.role.toLowerCase() === 'student') {
      setIsFeedbackModalOpen(true);
    } else {
      endSession();
      localStorage.removeItem('active_live_session');
      navigate('/digital-classroom');
    }
  };

  return (
    <div style={{ zIndex: 9999 }} className="fixed inset-0 w-screen h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden select-none">
      
      {/* 🌟 RECONNECT OVERLAY BANNER */}
      <ReconnectOverlay
        isReconnecting={isReconnecting}
        role={currentUser.role}
        timeoutSeconds={120}
      />

      {/* 🔔 Toast Notifications */}
      <div style={{ zIndex: 10000 }} className="fixed top-4 left-4 flex flex-col gap-2 max-w-xs pointer-events-none">
        {notifications.map((n, index) => (
          <div
            key={`${n.id || index}-${index}`}
            onClick={() => setNotifications((prev) => prev.filter((item) => item.id !== n.id))}
            className="pointer-events-auto bg-slate-900/90 backdrop-blur-md text-white text-xs px-3.5 py-2.5 rounded-xl shadow-xl border border-slate-800 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-800 transition-all"
          >
            <div className="flex items-center gap-2 truncate">
              <Bell className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-medium text-xs truncate">{n.message}</span>
            </div>
            <X className="w-3.5 h-3.5 text-slate-400 hover:text-white shrink-0" />
          </div>
        ))}
      </div>

      {/* 🖥️ Main Viewport Grid */}
      <div className="flex-1 w-full flex p-3 gap-3 overflow-hidden relative">
        
        {/* Main Workspace Stage */}
        <div className="flex-1 bg-slate-900/80 border border-slate-800/80 rounded-2xl relative overflow-hidden flex flex-col shadow-2xl min-w-0">
          {viewMode === 'whiteboard' ? (
            <div className="w-full h-full bg-white rounded-2xl overflow-hidden">
              <MemoizedWhiteboard sessionId={sessionId} />
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950">
              <div className="w-24 h-24 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl font-bold text-slate-300 shadow-xl">
                {trainerParticipant.name?.substring(0, 2).toUpperCase()}
              </div>
              <p className="text-xs font-semibold text-slate-300 mt-3 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                {trainerParticipant.name}
              </p>
            </div>
          )}
        </div>

        {/* 👥 Student Tiles Strip */}
        <div className="w-56 shrink-0 flex flex-col bg-slate-900/80 border border-slate-800/80 rounded-2xl p-2.5 overflow-hidden shadow-xl">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1 flex items-center justify-between">
            <span>Students ({studentParticipants.length})</span>
            {raisedHands.length > 0 && (
              <span className="text-[9px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                <Hand className="w-2.5 h-2.5 text-amber-400" />
                {raisedHands.length}
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {studentParticipants.map((student) => {
              const isMuted = student.isMuted || student.is_muted;
              const isCameraOn = student.isCameraOn ?? student.is_camera_on ?? true;
              const hasRaised = student.hasRaisedHand || student.has_raised_hand;

              return (
                <div
                  key={student.id || student.email}
                  className="w-full h-28 bg-slate-950 border border-slate-800/90 rounded-xl relative overflow-hidden flex flex-col items-center justify-center shadow-md transition hover:border-slate-700 group shrink-0"
                >
                  {hasRaised && (
                    <div className="absolute top-1.5 left-1.5 z-20 bg-amber-500 text-slate-950 text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-md">
                      <Hand className="w-2.5 h-2.5 fill-slate-950" /> Raised
                    </div>
                  )}

                  <div className="absolute top-1.5 right-1.5 z-20 flex items-center gap-1 bg-slate-900/80 backdrop-blur-xs px-1.5 py-0.5 rounded border border-slate-800 text-[9px]">
                    {isMuted ? <MicOff className="w-2.5 h-2.5 text-rose-400" /> : <Mic className="w-2.5 h-2.5 text-emerald-400" />}
                    {isCameraOn ? <Video className="w-2.5 h-2.5 text-slate-300" /> : <VideoOff className="w-2.5 h-2.5 text-rose-400" />}
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-slate-300 text-xs shadow-xs">
                    {student.name?.substring(0, 2).toUpperCase()}
                  </div>

                  <div className="absolute bottom-1.5 left-1.5 right-1.5 bg-slate-900/90 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-semibold text-slate-200 truncate border border-slate-800 text-center">
                    {student.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 💬 RIGHT SIDEBAR PANEL */}
        {isSidebarOpen && (
          <aside className="w-80 shrink-0 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
            <div className="p-2 border-b border-slate-800 bg-slate-950/60 shrink-0 flex gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'chat' ? 'bg-slate-800 text-white font-bold shadow-xs' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('participants')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'participants' ? 'bg-slate-800 text-white font-bold shadow-xs' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Users ({participants.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('hands')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 relative cursor-pointer ${
                  activeTab === 'hands' ? 'bg-slate-800 text-white font-bold shadow-xs' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Hand className="w-3.5 h-3.5" />
                <span>Hands</span>
                {raisedHands.length > 0 && (
                  <span className="bg-amber-500 text-slate-950 text-[9px] px-1.5 py-0.2 rounded-full font-bold">
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
      <footer className="w-full h-16 bg-slate-950 border-t border-slate-800/80 px-4 md:px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-semibold text-slate-400">Room: {sessionId}</span>
          <span className="text-[10px] bg-slate-900 text-slate-300 font-semibold px-2.5 py-0.5 rounded-md border border-slate-800 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {participants.length} Active
          </span>
        </div>

        {/* Center Audio/Video Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleSelfMute(currentUser.email)}
            className={`h-9 px-3.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
              isSelfMuted 
                ? 'bg-rose-600 text-white shadow-xs' 
                : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800'
            }`}
          >
            {isSelfMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-slate-300" />}
            <span>{isSelfMuted ? 'Muted' : 'Unmuted'}</span>
          </button>

          <button
            type="button"
            onClick={() => toggleSelfCamera(currentUser.email)}
            className={`h-9 px-3.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
              !isSelfCameraOn 
                ? 'bg-rose-600 text-white shadow-xs' 
                : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800'
            }`}
          >
            {!isSelfCameraOn ? <VideoOff className="w-3.5 h-3.5" /> : <Video className="w-3.5 h-3.5 text-slate-300" />}
            <span>{!isSelfCameraOn ? 'Cam Off' : 'Cam On'}</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode((prev) => (prev === 'whiteboard' ? 'camera' : 'whiteboard'))}
            className="h-9 px-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Layout className="w-3.5 h-3.5 text-slate-400" />
            <span>{viewMode === 'whiteboard' ? 'Trainer Cam' : 'Whiteboard'}</span>
          </button>

          <button
            type="button"
            onClick={() => raiseHand(currentUser.email)}
            className="h-9 px-3.5 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-800 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Hand className="w-3.5 h-3.5 text-amber-400" />
            <span>Raise Hand</span>
          </button>

          {currentUser.role === 'Trainer' && (
            <>
              <button
                type="button"
                onClick={muteAll}
                className="h-9 px-3.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold rounded-lg transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
              >
                <MicOff className="w-3.5 h-3.5 text-slate-400" />
                <span>Mute All</span>
              </button>

              <button
                type="button"
                onClick={toggleLock}
                className={`h-9 px-3.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 border ${
                  sessionState.isLocked 
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' 
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                }`}
              >
                {sessionState.isLocked ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <Unlock className="w-3.5 h-3.5 text-slate-400" />}
                <span>{sessionState.isLocked ? 'Locked' : 'Lock Room'}</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={handleEndOrLeaveMeeting}
            className="h-9 px-4 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-all cursor-pointer active:scale-95 flex items-center gap-1.5 ml-2 shadow-xs"
          >
            <PhoneOff className="w-3.5 h-3.5 text-white" />
            <span>{currentUser.role.toLowerCase() === 'student' ? 'Leave Meeting' : 'End Meeting'}</span>
          </button>
        </div>

        {/* Right Drawer Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsWaitingRoomOpen(true)}
            className="relative h-9 w-9 flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg transition-all cursor-pointer active:scale-95"
            title="Waiting Room"
          >
            <Clock className="w-4 h-4 text-slate-400" />
            {waitingRoom.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-slate-950">
                {waitingRoom.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsLogDrawerOpen(true)}
            className="h-9 w-9 flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg transition-all cursor-pointer active:scale-95"
            title="Activity Logs"
          >
            <ClipboardList className="w-4 h-4 text-slate-400" />
          </button>

          <button
            type="button"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className="h-9 w-9 flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg transition-all cursor-pointer active:scale-95"
            title="Toggle Sidebar"
          >
            <MessageSquare className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </footer>

      {/* Overlays */}
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

      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        sessionId={sessionId}
        trainerId="trainer1@gmail.com"
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