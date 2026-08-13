import api from '../api/axiosSetup';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';

export const fetchCertificates = async (params = {}) => {
  const response = await api.get(API_ENDPOINTS.CERTIFICATES.LIST_CREATE, { params });
  return response.data;
};

export const generateCertificate = async (data) => {
  const response = await api.post(API_ENDPOINTS.CERTIFICATES.LIST_CREATE, data);
  return response.data;
};

export const verifyCertificate = async (certificateId) => {
  const response = await api.post(API_ENDPOINTS.CERTIFICATES.VERIFY, { certificate_id: certificateId });
  return response.data;
};

export const downloadCertificatePDF = async (certificateId) => {
  const response = await api.get(API_ENDPOINTS.CERTIFICATES.DOWNLOAD(certificateId), {
    responseType: 'blob',
  });
  
  // Trigger browser binary PDF download
  const blob = new Blob([response.data], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `Certificate_${certificateId}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};