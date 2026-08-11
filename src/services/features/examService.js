import api from '../api/axiosSetup';

// Fetch exams (backend filters by role: trainer/admin see all, student sees published only)
export const fetchExams = async (params = {}) => {
  const response = await api.get('/api/exams/', { params });
  return response.data;
};

// Fetch single exam by ID
export const fetchExamById = async (examId) => {
  const response = await api.get(`/api/exams/${examId}/`);
  return response.data;
};

// Create a new exam
export const createExam = async (examData) => {
  const response = await api.post('/api/exams/', examData);
  return response.data;
};

// Update an existing exam
export const updateExam = async (examId, examData) => {
  const response = await api.put(`/api/exams/${examId}/`, examData);
  return response.data;
};

// Toggle Publish / Unpublish status
export const toggleExamPublishStatus = async (examId, status) => {
  const response = await api.patch(`/api/exams/${examId}/publish/`, { status });
  return response.data;
};

// Delete an exam
export const deleteExam = async (examId) => {
  const response = await api.delete(`/api/exams/${examId}/`);
  return response.data;
};

// Submit student answers
export const submitExam = async (examId, submissionData) => {
  const response = await api.post(`/api/exams/${examId}/submit/`, submissionData);
  return response.data;
};

// Fetch result summary roster
export const fetchExamResults = async (examId) => {
  const response = await api.get(`/api/exams/${examId}/results/`);
  return response.data;
};

// Fetch exam performance analytics
export const fetchExamAnalytics = async (examId) => {
  const response = await api.get(`/api/exams/${examId}/analytics/`);
  return response.data;
};