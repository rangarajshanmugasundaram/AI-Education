import { useState, useEffect, useCallback } from 'react';
import { recordingService } from '../../../services/features/recordingService';

export function useRecordings() {
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecordings = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const res = await recordingService.getRecordings(params);
      const data = res?.results || res || [];
      setRecordings(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch recordings:", err);
      setError("Unable to load recordings from backend.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecordings();
  }, [fetchRecordings]);

  const uploadRecording = async (payload) => {
    const newRec = await recordingService.uploadRecording(payload);
    setRecordings((prev) => [newRec, ...prev]);
    return newRec;
  };

  const removeRecording = async (id) => {
    await recordingService.deleteRecording(id);
    setRecordings((prev) => prev.filter((r) => r.id !== id));
  };

  return {
    recordings,
    loading,
    error,
    refetch: fetchRecordings,
    uploadRecording,
    removeRecording
  };
}