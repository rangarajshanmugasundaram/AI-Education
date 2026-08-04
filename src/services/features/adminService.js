import { getData } from '../api/getData';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';

export const fetchAdminDashboardData = async () => {
  return await getData(API_ENDPOINTS.ADMIN.DASHBOARD);
};