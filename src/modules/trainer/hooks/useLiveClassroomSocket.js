import { useEffect, useState, useCallback } from 'react';
import websocketService from '../../../services/features/websocketService';

export const useLiveClassroomSocket = (classroomId) => {
  const [isConnected, setIsConnected] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [raisedHands, setRaisedHands] = useState([]);
  const [waitingRoom, setWaitingRoom] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [sessionState, setSessionState] = useState({ isLocked: false, isLive: true });

  const logActivity = useCallback((action) => {
    const newLog = { id: Date.now(), timestamp: new Date().toLocaleTimeString(), action };
    setActivityLogs((prev) => [newLog, ...prev]);
  }, []);

  const addNotification = useCallback((message) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  }, []);

  useEffect(() => {
    if (!classroomId) return;

    websocketService.connect(classroomId);

    const handleStatus = ({ connected }) => setIsConnected(connected);

    const handleParticipantUpdate = (payload) => {
      const updatedList = payload.participants || [];
      setParticipants(updatedList);
      
      // Sync hands directly from participant status
      const raised = updatedList.filter((p) => p.has_raised_hand || p.hasRaisedHand);
      setRaisedHands(raised);

      if (payload.message) {
        logActivity(payload.message);
      }
    };

    const handleRaiseHand = (payload) => {
      if (payload?.student) {
        addNotification(`${payload.student.name} updated hand state.`);
        logActivity(`${payload.student.name} hand toggled`);
      }
    };

    const handleWaitingRoomUpdate = (payload) => {
      setWaitingRoom(payload.waitingList || []);
      if (payload?.user?.name) {
        addNotification(`${payload.user.name} joined waiting room.`);
      }
    };

    const handleSessionControl = (payload) => {
      setSessionState((prev) => ({ ...prev, ...payload }));
      if (payload.action) {
        addNotification(`Session: ${payload.action}`);
        logActivity(`Session ${payload.action}`);
      }
    };

    websocketService.on('connection_status', handleStatus);
    websocketService.on('PARTICIPANTS_UPDATE', handleParticipantUpdate);
    websocketService.on('RAISE_HAND', handleRaiseHand);
    websocketService.on('WAITING_ROOM_UPDATE', handleWaitingRoomUpdate);
    websocketService.on('SESSION_CONTROL', handleSessionControl);

    return () => {
      websocketService.off('connection_status', handleStatus);
      websocketService.off('PARTICIPANTS_UPDATE', handleParticipantUpdate);
      websocketService.off('RAISE_HAND', handleRaiseHand);
      websocketService.off('WAITING_ROOM_UPDATE', handleWaitingRoomUpdate);
      websocketService.off('SESSION_CONTROL', handleSessionControl);
      websocketService.disconnect();
    };
  }, [classroomId, addNotification, logActivity]);

  return {
    isConnected,
    participants,
    raisedHands,
    waitingRoom,
    activityLogs,
    notifications,
    sessionState,
    sendSocketAction: (type, payload) => websocketService.send(type, payload),
  };
};

export default useLiveClassroomSocket;