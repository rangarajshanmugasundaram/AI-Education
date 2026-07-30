import axiosInstance from '../api/axiosSetup';

const API_BASE = '/api/classroom';

export const classroomService = {
  // Session Details
  getSessionDetails: (id) => axiosInstance.get(`${API_BASE}/${id}/`),

  // Live Session Recovery State Restoration Endpoint
  getRecoveryState: (id) => axiosInstance.get(`${API_BASE}/${id}/recovery-state/`),

  // Session Controls
  startSession: (id) => axiosInstance.post(`${API_BASE}/${id}/start/`),
  endSession: (id) => axiosInstance.post(`${API_BASE}/${id}/end/`),
  toggleSessionLock: (id) => axiosInstance.post(`${API_BASE}/${id}/lock/`),

  // Hand Raises
  raiseHand: (id, email) => axiosInstance.post(`${API_BASE}/${id}/raise-hand/`, { email }),
  lowerHand: (id, email) => axiosInstance.post(`${API_BASE}/${id}/lower-hand/`, { email }),
  dismissHandRequest: (id, studentId) => axiosInstance.post(`${API_BASE}/${id}/hand-requests/${studentId}/dismiss/`),

  // Participants & Controls
  getParticipants: (id) => axiosInstance.get(`${API_BASE}/${id}/participants/`),
  removeParticipant: (id, participantId) => axiosInstance.delete(`${API_BASE}/${id}/participants/${participantId}/`),
  allowRejoin: (id, participantId) => axiosInstance.post(`${API_BASE}/${id}/participants/${participantId}/allow-rejoin/`),
  toggleSelfMute: (id, email) => axiosInstance.post(`${API_BASE}/${id}/media/mute/`, { email }),
  toggleSelfCamera: (id, email) => axiosInstance.post(`${API_BASE}/${id}/media/camera/`, { email }),
  muteParticipant: (id, participantId) => axiosInstance.post(`${API_BASE}/${id}/participants/${participantId}/mute/`),
  muteAllParticipants: (id) => axiosInstance.post(`${API_BASE}/${id}/mute-all/`),
  requestParticipantCamera: (id, participantId) => axiosInstance.post(`${API_BASE}/${id}/participants/${participantId}/request-camera/`),
  updateParticipantPermissions: (id, participantId, perms) => axiosInstance.put(`${API_BASE}/${id}/participants/${participantId}/permissions/`, { permissions: perms }),

  // Waiting Room & Audit Logs
  getWaitingRoom: (id) => axiosInstance.get(`${API_BASE}/${id}/waiting-room/`),
  approveJoinRequest: (id, userId) => axiosInstance.post(`${API_BASE}/${id}/waiting-room/${userId}/approve/`),
  rejectJoinRequest: (id, userId) => axiosInstance.post(`${API_BASE}/${id}/waiting-room/${userId}/reject/`),
  getActivityLogs: (id) => axiosInstance.get(`${API_BASE}/${id}/activity-logs/`),
};

export default classroomService;