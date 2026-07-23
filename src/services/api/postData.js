import axiosInstance from './axiosSetup';

export const postData = async (endpoint, data) => {
  try {
    const response = await axiosInstance.post(endpoint, data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};