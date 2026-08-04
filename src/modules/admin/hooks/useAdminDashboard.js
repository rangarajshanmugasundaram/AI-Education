import { useState, useEffect, useCallback } from 'react';
import { fetchAdminDashboardData } from '../../../services/features/adminService';

export const useAdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchAdminDashboardData();
      if (response && response.data) {
        setData(response.data);
      } else {
        throw new Error('Invalid response structure received');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { data, loading, error, refetch: loadData };
};