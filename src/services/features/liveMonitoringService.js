import api from '../api/axiosSetup';

export const fetchLiveSessions = async () => {
  const response = await api.get('/api/classroom/live-monitoring/');
  return response.data;
};

export const fetchLiveStats = async (sessionId = null) => {
  const url = sessionId
    ? `/api/classroom/live-monitoring/${sessionId}/stats/`
    : '/api/classroom/live-monitoring/stats/';
  const response = await api.get(url);
  return response.data;
};

export const fetchAttendanceSummary = async (sessionId) => {
  const response = await api.get(`/api/classroom/live-monitoring/${sessionId}/attendance-summary/`);
  return response.data;
};

export const forceEndLiveSession = async (sessionId) => {
  const response = await api.post(`/api/classroom/live-monitoring/${sessionId}/force-end/`);
  return response.data;
};

const liveMonitoringService = {
  fetchLiveSessions,
  fetchLiveStats,
  fetchAttendanceSummary,
  forceEndLiveSession
};

export default liveMonitoringService;