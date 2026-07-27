import axiosInstance from '../api/axiosSetup';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';

export const feedbackService = {
  // POST /api/feedback/submit/
  submitFeedback: async (feedbackData) => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.FEEDBACK?.SUBMIT || '/api/feedback/submit/',
      feedbackData
    );
    return response.data;
  },

  // GET /api/feedback/session/<session_id>/
  getSessionFeedback: async (sessionId) => {
    const response = await axiosInstance.get(
      `/api/feedback/session/${sessionId}/`
    );
    return response.data;
  },

  // GET /api/feedback/trainer/<trainer_id>/
  getTrainerFeedback: async (trainerId) => {
    const response = await axiosInstance.get(
      `/api/feedback/trainer/${trainerId}/`
    );
    return response.data;
  }
};

// 🌟 CRITICAL: Default export matches line 5 of TrainerDashboard.jsx
export default feedbackService;