import api from '../api/axiosSetup';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';

export const fetchAssignments = async (params = {}) => {
  const response = await api.get(API_ENDPOINTS.ASSIGNMENTS.LIST_CREATE, { params });
  return response.data;
};

export const fetchAssignmentById = async (assignmentId) => {
  const response = await api.get(API_ENDPOINTS.ASSIGNMENTS.DETAIL(assignmentId));
  return response.data;
};

export const createAssignment = async (data) => {
  const response = await api.post(API_ENDPOINTS.ASSIGNMENTS.LIST_CREATE, data);
  return response.data;
};

export const updateAssignment = async (assignmentId, data) => {
  const response = await api.put(API_ENDPOINTS.ASSIGNMENTS.DETAIL(assignmentId), data);
  return response.data;
};

export const toggleAssignmentStatus = async (assignmentId, status) => {
  const response = await api.patch(API_ENDPOINTS.ASSIGNMENTS.STATUS_TOGGLE(assignmentId), { status });
  return response.data;
};

export const deleteAssignment = async (assignmentId) => {
  const response = await api.delete(API_ENDPOINTS.ASSIGNMENTS.DETAIL(assignmentId));
  return response.data;
};

export const submitAssignment = async (assignmentId, payload) => {
  const response = await api.post(API_ENDPOINTS.ASSIGNMENTS.SUBMIT(assignmentId), payload);
  return response.data;
};

export const fetchSubmissionsRoster = async (assignmentId) => {
  const response = await api.get(API_ENDPOINTS.ASSIGNMENTS.SUBMISSIONS_ROSTER(assignmentId));
  return response.data;
};

export const gradeSubmission = async (submissionId, gradeData) => {
  const response = await api.post(API_ENDPOINTS.ASSIGNMENTS.GRADE_SUBMISSION(submissionId), gradeData);
  return response.data;
};

export const fetchAssignmentAnalytics = async (assignmentId) => {
  const response = await api.get(API_ENDPOINTS.ASSIGNMENTS.ANALYTICS(assignmentId));
  return response.data;
};