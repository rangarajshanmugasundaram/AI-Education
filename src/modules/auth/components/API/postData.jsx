import axiosInstance from '../auth/axiosSetup';

export const postData = async (endpoint, data) => {
  const response = await axiosInstance.post(endpoint, data);
  return response.data;
};