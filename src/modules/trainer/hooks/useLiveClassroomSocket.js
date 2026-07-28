import { useEffect, useState, useCallback } from 'react';
import websocketService from '../../../services/features/websocketService';

// 🕒 Robust parser that forces UTC-to-IST conversion explicitly
const formatLocalTime = (timeInput) => {
  if (!timeInput) {
    return new Date().toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  }

  let dateStr = String(timeInput);

  // If Django sends an ISO string without 'Z' or offset, append 'Z' so JS parses it as UTC
  if (dateStr.includes('T') && !dateStr.endsWith('Z') && !dateStr.includes('+')) {
    dateStr += 'Z';
  }

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return timeInput; // Fallback if it's already a plain text string
  }

  return date.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
};

export const useLiveClassroomSocket = (classroomId) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [raisedHands, setRaisedHands] = useState([]);
  const [waitingRoom, setWaitingRoom] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [sessionState, setSessionState] = useState({ isLocked: false, isLive: true });

  const currentUserRole = localStorage.getItem('user_role') || 'Trainer';

  // 🌟 Client-side activity logger with forced IST conversion
  const logActivity = useCallback((action) => {
    const newLog = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: formatLocalTime(),
      action,
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  }, []);

  // 🌟 Unique ID generator prevents key collisions in React toast lists
  const addNotification = useCallback((message) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setNotifications((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  }, []);

  useEffect(() => {
    if (!classroomId) return;

    websocketService.connect(classroomId, currentUserRole);

    const handleStatus = ({ connected }) => {
      setIsConnected(connected);
      if (connected) {
        setIsReconnecting(false);
      }
    };

    // 🌟 PARTICIPANTS & HANDS & ACTIVITY LOGS UPDATE
    const handleParticipantUpdate = (payload) => {
      const updatedList = payload.participants || [];
      setParticipants(updatedList);

      const raised = updatedList.filter((p) => p.has_raised_hand || p.hasRaisedHand);
      setRaisedHands(raised);

      // Format activity log timestamps to IST when received from Django
      if (payload.activityLogs && Array.isArray(payload.activityLogs)) {
        const formattedLogs = payload.activityLogs.map((log) => ({
          ...log,
          timestamp: formatLocalTime(log.timestamp || log.created_at),
        }));
        setActivityLogs(formattedLogs);
      }
    };

    // 🌟 HAND RAISE TOAST
    const handleRaiseHand = (payload) => {
      if (payload?.student) {
        addNotification(`${payload.student.name} updated hand state.`);
      }
    };

    // 🌟 WAITING ROOM UPDATE
    const handleWaitingRoomUpdate = (payload) => {
      setWaitingRoom(payload.waitingList || []);
      if (payload?.user?.name) {
        addNotification(`${payload.user.name} joined waiting room.`);
      }
    };

    // 🌟 SESSION CONTROL UPDATE
    const handleSessionControl = (payload) => {
      setSessionState((prev) => ({ ...prev, ...payload }));
      if (payload.action) {
        addNotification(`Session: ${payload.action}`);
      }
    };

    // 🌟 RECOVERY SOCKET EVENTS
    const handleTrainerDisconnected = (payload) => {
      setIsReconnecting(true);
      addNotification(payload.message || 'Trainer disconnected. Attempting reconnection...');
      logActivity('Trainer connection lost (Attempting auto-reconnect)');
    };

    const handleTrainerReconnected = (payload) => {
      setIsReconnecting(false);
      addNotification(payload.message || 'Trainer reconnected. Session restored!');
      logActivity('Trainer reconnected successfully');
    };

    const handleSessionTimeoutEnded = (payload) => {
      setIsReconnecting(false);
      setSessionState((prev) => ({ ...prev, isLive: false }));
      addNotification('Session auto-ended: Reconnect timeout expired.');
      logActivity('Session auto-ended (Reconnect timeout expired)');
    };

    websocketService.on('connection_status', handleStatus);
    websocketService.on('PARTICIPANTS_UPDATE', handleParticipantUpdate);
    websocketService.on('RAISE_HAND', handleRaiseHand);
    websocketService.on('WAITING_ROOM_UPDATE', handleWaitingRoomUpdate);
    websocketService.on('SESSION_CONTROL', handleSessionControl);
    websocketService.on('TRAINER_DISCONNECTED', handleTrainerDisconnected);
    websocketService.on('TRAINER_RECONNECTED', handleTrainerReconnected);
    websocketService.on('SESSION_TIMEOUT_ENDED', handleSessionTimeoutEnded);

    return () => {
      websocketService.off('connection_status', handleStatus);
      websocketService.off('PARTICIPANTS_UPDATE', handleParticipantUpdate);
      websocketService.off('RAISE_HAND', handleRaiseHand);
      websocketService.off('WAITING_ROOM_UPDATE', handleWaitingRoomUpdate);
      websocketService.off('SESSION_CONTROL', handleSessionControl);
      websocketService.off('TRAINER_DISCONNECTED', handleTrainerDisconnected);
      websocketService.off('TRAINER_RECONNECTED', handleTrainerReconnected);
      websocketService.off('SESSION_TIMEOUT_ENDED', handleSessionTimeoutEnded);
      websocketService.disconnect();
    };
  }, [classroomId, currentUserRole, addNotification, logActivity]);

  return {
    isConnected,
    isReconnecting,
    setIsReconnecting,
    participants,
    raisedHands,
    waitingRoom,
    activityLogs,
    notifications,
    sessionState,
    setSessionState,
    setParticipants,
    setRaisedHands,
    setWaitingRoom,
    setActivityLogs,
    sendSocketAction: (type, payload) => websocketService.send(type, payload),
  };
};

export default useLiveClassroomSocket;