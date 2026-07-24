/**
 * Formats ISO timestamps into human-readable time strings (e.g., "12:30 PM")
 */
export const formatTime = (isoString) => {
  if (!isoString) return '--';
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return isoString;
  }
};

/**
 * Formats ISO timestamps into readable date strings (e.g., "Jul 24, 2026")
 */
export const formatDate = (isoString) => {
  if (!isoString) return '--';
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return isoString;
  }
};

/**
 * Calculates human-readable duration between two dates
 */
export const calculateDurationMinutes = (startTime, endTime) => {
  if (!startTime || !endTime) return '0 mins';
  try {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = Math.max(0, end - start);
    const minutes = Math.floor(diffMs / 60000);
    return `${minutes} mins`;
  } catch {
    return '0 mins';
  }
};