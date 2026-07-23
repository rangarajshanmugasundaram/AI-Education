import axiosInstance from './axiosSetup';

export const getData = async (endpoint) => {
  try {
    const response = await axiosInstance.get(endpoint);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};