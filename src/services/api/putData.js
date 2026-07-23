import axiosInstance from './axiosSetup';

export const putData = async (endpoint, data) => {
  try {
    const response = await axiosInstance.put(endpoint, data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};