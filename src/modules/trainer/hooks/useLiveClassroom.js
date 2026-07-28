import { useState, useEffect, useCallback } from 'react';
import classroomService from '../../../services/features/classroomService';
import { useLiveClassroomSocket } from './useLiveClassroomSocket';

export const useLiveClassroom = (sessionId) => {
  const {
    isConnected,
    isReconnecting,
    participants: socketParticipants,
    raisedHands: socketRaisedHands,
    waitingRoom: socketWaitingRoom,
    activityLogs: socketActivityLogs,
    notifications: socketNotifications,
    sessionState: socketSessionState,
  } = useLiveClassroomSocket(sessionId);

  const [sessionState, setSessionState] = useState({
    isLive: true,
    isLocked: false,
    allowUnmute: true,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [participants, setParticipants] = useState([]);
  const [waitingRoom, setWaitingRoom] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const notify = (msg) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message: msg }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 2500);
  };

  // 🌟 RESTORE FULL SESSION STATE ON TRAINER RECONNECT
  const restoreFullState = useCallback(async () => {
    if (!sessionId) return;
    try {
      const res = await classroomService.getRecoveryState(sessionId);
      const data = res.data || res;
      if (data) {
        if (data.session) {
          setSessionState({
            isLive: data.session.is_live ?? true,
            isLocked: data.session.is_locked ?? false,
            allowUnmute: data.session.allow_unmute ?? true,
          });
        }
        if (data.participants) setParticipants(data.participants);
        if (data.waiting_room) setWaitingRoom(data.waiting_room);
        if (data.activity_logs) setActivityLogs(data.activity_logs);
      }
    } catch (err) {
      console.error('Error restoring recovery state:', err);
    }
  }, [sessionId]);

  const fetchClassroomData = useCallback(async () => {
    if (!sessionId) return;
    try {
      const { data } = await classroomService.getSessionDetails(sessionId);
      setSessionState({
        isLive: data.is_live ?? true,
        isLocked: data.is_locked ?? false,
        allowUnmute: data.allow_unmute ?? true,
      });
      setParticipants(data.participants || []);
      setWaitingRoom(data.waitingRoom || []);
      setActivityLogs(data.activityLogs || []);
    } catch (err) {
      console.error('Error fetching classroom data:', err);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchClassroomData();
  }, [fetchClassroomData]);

  useEffect(() => {
    if (socketParticipants && socketParticipants.length > 0) setParticipants(socketParticipants);
    if (socketWaitingRoom && socketWaitingRoom.length > 0) setWaitingRoom(socketWaitingRoom);
    if (socketActivityLogs && socketActivityLogs.length > 0) setActivityLogs(socketActivityLogs);
    if (socketNotifications && socketNotifications.length > 0) setNotifications(socketNotifications);
    if (socketSessionState) setSessionState((prev) => ({ ...prev, ...socketSessionState }));
  }, [socketParticipants, socketWaitingRoom, socketActivityLogs, socketNotifications, socketSessionState]);

  // REST API Actions
  const raiseHand = async (email) => {
    try {
      await classroomService.raiseHand(sessionId, email);
      fetchClassroomData();
    } catch (err) {
      console.error('Failed to raise hand:', err);
    }
  };

  const lowerHand = async (email) => {
    try {
      await classroomService.lowerHand(sessionId, email);
      fetchClassroomData();
    } catch (err) {
      console.error('Failed to lower hand:', err);
    }
  };

  const dismissHand = async (studentId) => {
    try {
      await classroomService.dismissHandRequest(sessionId, studentId);
      notify('Hand request dismissed');
      fetchClassroomData();
    } catch (err) {
      console.error('Failed to dismiss hand request:', err);
    }
  };

  const startSession = async () => {
    try {
      await classroomService.startSession(sessionId);
      notify('Live Session Started');
      fetchClassroomData();
    } catch (err) {
      console.error('Failed to start session:', err);
    }
  };

  const endSession = async () => {
    try {
      await classroomService.endSession(sessionId);
      notify('Live Session Ended');
      fetchClassroomData();
    } catch (err) {
      console.error('Failed to end session:', err);
    }
  };

  const toggleLock = async () => {
    try {
      const res = await classroomService.toggleSessionLock(sessionId);
      notify(res.data.isLocked ? 'Session Locked' : 'Session Unlocked');
      fetchClassroomData();
    } catch (err) {
      console.error('Failed to toggle lock:', err);
    }
  };

  const toggleSelfMute = async (email) => {
    try {
      await classroomService.toggleSelfMute(sessionId, email);
      fetchClassroomData();
    } catch (err) {
      console.error('Failed to toggle mute:', err);
    }
  };

  const toggleSelfCamera = async (email) => {
    try {
      await classroomService.toggleSelfCamera(sessionId, email);
      fetchClassroomData();
    } catch (err) {
      console.error('Failed to toggle camera:', err);
    }
  };

  const muteAll = async () => {
    try {
      setParticipants((prev) =>
        prev.map((p) =>
          p.role === 'Student'
            ? { ...p, isMuted: true, is_muted: true }
            : p
        )
      );
      await classroomService.muteAllParticipants(sessionId);
      notify('All participants muted');
    } catch (err) {
      console.error('Failed to mute all participants:', err);
      fetchClassroomData();
    }
  };

  const muteParticipant = async (id) => {
    try {
      await classroomService.muteParticipant(sessionId, id);
      notify('Muted participant');
      fetchClassroomData();
    } catch (err) {
      console.error('Failed to mute participant:', err);
    }
  };

  const requestCamera = async (id) => {
    try {
      await classroomService.requestParticipantCamera(sessionId, id);
      notify('Camera request sent');
    } catch (err) {
      console.error('Failed to request camera:', err);
    }
  };

  const removeParticipant = async (id) => {
    try {
      await classroomService.removeParticipant(sessionId, id);
      notify('Participant removed');
      fetchClassroomData();
    } catch (err) {
      console.error('Failed to remove participant:', err);
    }
  };

  const allowRejoin = async (id) => {
    try {
      await classroomService.allowRejoin(sessionId, id);
      notify('Allowed participant to rejoin');
      fetchClassroomData();
    } catch (err) {
      console.error('Failed to allow rejoin:', err);
    }
  };

  const updatePermissions = async (id, newPerms) => {
    try {
      await classroomService.updateParticipantPermissions(sessionId, id, newPerms);
      notify('Updated permissions');
      fetchClassroomData();
    } catch (err) {
      console.error('Failed to update permissions:', err);
    }
  };

  const approveWaiting = async (userId) => {
    try {
      await classroomService.approveJoinRequest(sessionId, userId);
      notify('Approved waiting user');
      fetchClassroomData();
    } catch (err) {
      console.error('Failed to approve waiting user:', err);
    }
  };

  const rejectWaiting = async (userId) => {
    try {
      await classroomService.rejectJoinRequest(sessionId, userId);
      notify('Rejected waiting user');
      fetchClassroomData();
    } catch (err) {
      console.error('Failed to reject waiting user:', err);
    }
  };

  const filteredParticipants = participants.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const raisedHandsList = (socketRaisedHands && socketRaisedHands.length > 0)
    ? socketRaisedHands 
    : participants.filter((p) => p.hasRaisedHand || p.has_raised_hand);

  return {
    isConnected,
    isReconnecting,
    sessionState,
    searchTerm,
    setSearchTerm,
    participants: filteredParticipants,
    raisedHands: raisedHandsList,
    waitingRoom,
    activityLogs,
    notifications,
    setNotifications,
    raiseHand,
    lowerHand,
    dismissHand,
    startSession,
    endSession,
    toggleLock,
    toggleSelfMute,
    toggleSelfCamera,
    muteAll,
    muteParticipant,
    requestCamera,
    removeParticipant,
    allowRejoin,
    updatePermissions,
    approveWaiting,
    rejectWaiting,
    restoreFullState,
  };
};

export default useLiveClassroom;