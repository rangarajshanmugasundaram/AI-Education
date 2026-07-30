import axiosInstance from './axiosSetup';

export const getData = async (endpoint) => {
  try {
    // Ensure trailing slash for endpoint strings without parameters
    const formattedEndpoint = endpoint.endsWith('/') || endpoint.includes('?') 
      ? endpoint 
      : `${endpoint}/`;
      
    const response = await axiosInstance.get(formattedEndpoint);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};