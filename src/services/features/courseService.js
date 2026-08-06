import api from '../api/axiosSetup';

export const fetchCourses = async (params = {}) => {
  const response = await api.get('/api/courses/', { params });
  return response.data;
};

export const fetchCourseById = async (courseId) => {
  const response = await api.get(`/api/courses/${courseId}/`);
  return response.data;
};

export const createCourse = async (courseData) => {
  const response = await api.post('/api/courses/', courseData);
  return response.data;
};

export const updateCourse = async (courseId, courseData) => {
  const response = await api.put(`/api/courses/${courseId}/`, courseData);
  return response.data;
};

export const deleteCourse = async (courseId) => {
  const response = await api.delete(`/api/courses/${courseId}/`);
  return response.data;
};

export const assignTrainerToCourse = async (courseId, trainerId) => {
  const response = await api.patch(`/api/courses/${courseId}/assign-trainer/`, { trainer_id: trainerId });
  return response.data;
};

export const archiveCourse = async (courseId) => {
  const response = await api.patch(`/api/courses/${courseId}/archive/`);
  return response.data;
};

export const fetchCourseStats = async (courseId = null) => {
  const url = courseId ? `/api/courses/${courseId}/stats/` : '/api/courses/stats/';
  const response = await api.get(url);
  return response.data;
};