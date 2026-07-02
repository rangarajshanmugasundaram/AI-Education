import axiosInstance from '../auth/axiosSetup';

export const putData = async (endpoint, data) => {
  const response = await axiosInstance.put(endpoint, data);
  return response.data;
};