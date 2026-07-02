import axiosInstance from '../auth/axiosSetup';

export const getData = async (endpoint) => {
  const response = await axiosInstance.get(endpoint);
  return response.data;
};