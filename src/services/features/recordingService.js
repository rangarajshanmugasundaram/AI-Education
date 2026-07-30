import { getData } from '../api/getData';
import { postData } from '../api/postData';
import { putData } from '../api/putData';
import { deleteData } from '../api/deleteData';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';

export const recordingService = {
  getRecordings: async (params = {}) => {
    return await getData(API_ENDPOINTS.RECORDINGS.LIST_CREATE, params);
  },

  getRecordingDetail: async (id) => {
    return await getData(API_ENDPOINTS.RECORDINGS.DETAIL(id));
  },

  uploadRecording: async (payload) => {
    return await postData(API_ENDPOINTS.RECORDINGS.LIST_CREATE, payload);
  },

  updateRecording: async (id, payload) => {
    return await putData(API_ENDPOINTS.RECORDINGS.DETAIL(id), payload);
  },

  deleteRecording: async (id, permanent = false) => {
    const url = `${API_ENDPOINTS.RECORDINGS.DETAIL(id)}?permanent=${permanent}`;
    return await deleteData(url);
  },

  getPlaybackToken: async (id) => {
    return await getData(API_ENDPOINTS.RECORDINGS.PLAYBACK_TOKEN(id));
  },

  updateStatus: async (id, status) => {
    return await putData(API_ENDPOINTS.RECORDINGS.UPDATE_STATUS(id), { status });
  },

  getAnalytics: async (id) => {
    return await getData(API_ENDPOINTS.RECORDINGS.ANALYTICS(id));
  },

  getMostViewed: async () => {
    return await getData(API_ENDPOINTS.RECORDINGS.MOST_VIEWED);
  }
};

export default recordingService;