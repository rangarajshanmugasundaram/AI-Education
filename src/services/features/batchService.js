import api from '../api/axiosSetup';

export const fetchBatches = async (params = {}) => {
  const response = await api.get('/api/batches/', { params });
  return response.data;
};

export const fetchBatchById = async (batchId) => {
  const response = await api.get(`/api/batches/${batchId}/`);
  return response.data;
};

export const createBatch = async (batchData) => {
  const response = await api.post('/api/batches/', batchData);
  return response.data;
};

export const updateBatch = async (batchId, batchData) => {
  const response = await api.put(`/api/batches/${batchId}/`, batchData);
  return response.data;
};

export const allocateStudentsToBatch = async (batchId, studentIds) => {
  const response = await api.post(`/api/batches/${batchId}/allocate-students/`, { student_ids: studentIds });
  return response.data;
};

export const allocateTrainerToBatch = async (batchId, trainerId) => {
  const response = await api.patch(`/api/batches/${batchId}/allocate-trainer/`, { trainer_id: trainerId });
  return response.data;
};

export const fetchBatchStats = async (batchId = null) => {
  const url = batchId ? `/api/batches/${batchId}/stats/` : '/api/batches/stats/';
  const response = await api.get(url);
  return response.data;
};